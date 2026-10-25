/**
 * Runs OpenSEO's site-audit engine (https://github.com/every-app/open-seo) against a local
 * build of this site. seo-audit/audit.sh copies this file into a pinned OpenSEO checkout and
 * runs it with tsx, so the imports below resolve inside that checkout.
 *
 * Adapted from OpenSEO's tests/badseo/scripts/run-audit.ts: the same crawl frontier (it can
 * reach localhost, which the production crawler refuses), with every detection imported from
 * OpenSEO itself. Exits 1 on any critical or warning issue; info issues are only printed.
 *
 * OpenSEO is MIT licensed, Copyright (c) 2026 Ben Senescu.
 *
 *   tsx scripts/vikas-audit.ts http://localhost:4173
 */
import { crawlPage } from "../src/server/workflows/site-audit-workflow-helpers";
import { createCrawlThrottle } from "../src/server/lib/audit/crawl-throttle";
import {
  discoverUrls,
  parseRobotsTxt,
} from "../src/server/lib/audit/discovery";
import {
  normalizeUrl,
  isSameOrigin,
} from "../src/server/lib/audit/url-utils";
import { runPageReporters } from "../src/server/lib/audit/issues/page-reporters";
import {
  findDuplicates,
  findRedirectChainsAndLoops,
  type SlimPage,
} from "../src/server/lib/audit/issues/multipage-checks";
import type { DetectedIssue } from "../src/server/lib/audit/issues/page-reporters";
import type { CrawledPageResult } from "../src/server/lib/audit/types";
import { AUDIT_ISSUE_TYPES } from "../src/shared/audit-issues";

const BASE = (process.argv[2] ?? "http://localhost:8787").replace(/\/$/, "");
const MAX_PAGES = 200;
const CONCURRENCY = 10;

interface CrawlLink {
  sourceId: string;
  sourceUrl: string;
  targetUrl: string;
}

interface CrawlEntry {
  url: string;
  depth: number | null;
}

/** BFS crawl frontier: link-discovered URLs first, sitemap-only URLs last. */
async function crawl(origin: string): Promise<{
  pages: CrawledPageResult[];
  links: CrawlLink[];
  completed: boolean;
}> {
  const { urls: sitemapUrls, robotsText } = await discoverUrls(
    origin,
    MAX_PAGES,
  );
  const robots = parseRobotsTxt(origin, robotsText);
  const sitemapSet = new Set(
    sitemapUrls.map((u) => normalizeUrl(u)).filter((u): u is string => !!u),
  );

  const visited = new Set<string>();
  const queued = new Set<string>();
  const linkQueue: CrawlEntry[] = [];
  const sitemapQueue: CrawlEntry[] = [];

  const start = normalizeUrl(`${origin}/`) ?? `${origin}/`;
  linkQueue.push({ url: start, depth: 0 });
  queued.add(start);
  for (const u of sitemapSet) {
    if (u === start || queued.has(u)) continue;
    sitemapQueue.push({ url: u, depth: null });
    queued.add(u);
  }

  const pages: CrawledPageResult[] = [];
  const links: CrawlLink[] = [];
  // One per crawl, as the production crawl chunk does.
  const throttle = createCrawlThrottle(Date.now() + 90_000);

  const enqueue = (url: string, depth: number | null) => {
    const n = normalizeUrl(url);
    if (!n) return;
    if (!isSameOrigin(n, origin)) return;
    if (visited.has(n) || queued.has(n)) return;
    if (!robots.isAllowed(n)) return;
    linkQueue.push({ url: n, depth });
    queued.add(n);
  };

  while (
    (linkQueue.length > 0 || sitemapQueue.length > 0) &&
    pages.length < MAX_PAGES &&
    !throttle.stopped
  ) {
    const batch: CrawlEntry[] = [];
    while (
      (linkQueue.length > 0 || sitemapQueue.length > 0) &&
      batch.length < CONCURRENCY &&
      pages.length + batch.length < MAX_PAGES
    ) {
      const entry = (linkQueue.length > 0 ? linkQueue : sitemapQueue).shift()!;
      queued.delete(entry.url);
      if (visited.has(entry.url)) continue;
      visited.add(entry.url);
      batch.push(entry);
    }

    const crawled = await Promise.all(
      batch.map((e) =>
        crawlPage(e.url, e.depth, sitemapSet.has(e.url), throttle),
      ),
    );

    for (let i = 0; i < crawled.length; i++) {
      const page = crawled[i];
      if (!page) continue;
      const depth = batch[i].depth;
      pages.push(page);

      for (const link of page.links) {
        if (link.isInternal) {
          links.push({
            sourceId: page.id,
            sourceUrl: page.url,
            targetUrl: link.targetUrl,
          });
          enqueue(link.targetUrl, depth === null ? null : depth + 1);
        }
      }
      if (page.redirectUrl) enqueue(page.redirectUrl, depth);
    }
  }

  const completed =
    !throttle.stopped && linkQueue.length === 0 && sitemapQueue.length === 0;
  return { pages, links, completed };
}

/** In-memory equivalents of the two D1-backed multipage checks. */
function findBrokenInternalLinks(
  pages: CrawledPageResult[],
  links: CrawlLink[],
): DetectedIssue[] {
  const byUrl = new Map(pages.map((p) => [p.url, p]));
  const issues: DetectedIssue[] = [];
  const seen = new Set<string>();
  for (const link of links) {
    const target = byUrl.get(link.targetUrl);
    if (!target) continue;
    if (target.fetchClass !== "ok" || target.statusCode < 400) continue;
    const key = `${link.sourceUrl}::${link.targetUrl}`;
    if (seen.has(key)) continue;
    seen.add(key);
    issues.push({
      issueType: "broken-internal-link",
      pageId: link.sourceId,
      pageUrl: link.sourceUrl,
      dedupeKey: link.targetUrl,
      details: { targetUrl: link.targetUrl, targetStatus: target.statusCode },
    });
  }
  return issues;
}

function findOrphanPages(
  pages: CrawledPageResult[],
  links: CrawlLink[],
  startUrl: string,
): DetectedIssue[] {
  const hasInlink = new Set<string>();
  for (const link of links) {
    const source = pages.find((p) => p.id === link.sourceId);
    // Self-links don't make a page reachable.
    if (source && source.url === link.targetUrl) continue;
    hasInlink.add(link.targetUrl);
  }
  const redirectTargets = new Set(
    pages.map((p) => p.redirectUrl).filter((u): u is string => !!u),
  );
  const issues: DetectedIssue[] = [];
  for (const page of pages) {
    if (page.fetchClass !== "ok") continue;
    if (page.statusCode < 200 || page.statusCode >= 300) continue;
    if (page.url === startUrl) continue;
    if (hasInlink.has(page.url) || redirectTargets.has(page.url)) continue;
    issues.push({
      issueType: "orphan-page",
      pageId: page.id,
      pageUrl: page.url,
    });
  }
  return issues;
}

function toSlim(page: CrawledPageResult): SlimPage {
  return {
    id: page.id,
    url: page.url,
    statusCode: page.statusCode,
    fetchClass: page.fetchClass,
    title: page.title || null,
    metaDescription: page.metaDescription || null,
    contentHash: page.contentHash,
    redirectUrl: page.redirectUrl,
    wordCount: page.wordCount,
    isIndexable: page.isIndexable,
    canonicalUrl: page.canonicalUrl,
    headerCanonicalUrl: page.headerCanonicalUrl,
  };
}


async function main() {
  const origin = new URL(BASE).origin;
  const startUrl = normalizeUrl(`${origin}/`) ?? `${origin}/`;
  const { pages, links, completed } = await crawl(origin);

  const detected: DetectedIssue[] = [];
  for (const page of pages) detected.push(...runPageReporters(page));
  const slim = pages.map(toSlim);
  detected.push(...findDuplicates(slim));
  detected.push(...findRedirectChainsAndLoops(slim));
  detected.push(...findBrokenInternalLinks(pages, links));
  if (completed) detected.push(...findOrphanPages(pages, links, startUrl));

  console.log(`Crawled ${pages.length} pages and ${links.length} internal links; crawl ${completed ? "completed" : "TRUNCATED"}.`);
  for (const p of pages) console.log(`  ${p.statusCode} ${p.url}  (${p.wordCount} words)`);

  const order = { critical: 0, warning: 1, info: 2 } as const;
  detected.sort((a, b) => order[AUDIT_ISSUE_TYPES[a.issueType].severity] - order[AUDIT_ISSUE_TYPES[b.issueType].severity]);
  let failing = 0;
  for (const issue of detected) {
    const type = AUDIT_ISSUE_TYPES[issue.issueType];
    if (type.severity !== "info") failing++;
    const details = issue.details ? ` ${JSON.stringify(issue.details)}` : "";
    const line = `${type.title} (${issue.issueType}): ${issue.pageUrl}${details}`;
    // GitHub Actions annotations; plain lines elsewhere.
    console.log(type.severity === "info" ? `::notice title=OpenSEO::${line}` : `::error title=OpenSEO ${type.severity}::${line}`);
  }
  console.log(`\n${detected.length} issues, ${failing} critical or warning.`);
  if (!completed || failing > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
