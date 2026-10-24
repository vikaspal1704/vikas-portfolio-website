#!/usr/bin/env node
/**
 * Tells IndexNow (Bing, Yandex, Seznam, Naver, …) about every URL in the live
 * sitemap. Runs after each deploy (see .github/workflows/deploy.yml); no Bing
 * Webmaster Tools account is needed. Ownership is proven by the key file at
 * https://<host>/<KEY>.txt, which lives in public/.
 *
 * Never fails the deploy: problems are reported as warnings.
 *   node scripts/indexnow.mjs [--dry-run]
 */

export const KEY = '0297fe6466bc8dcf0ab9811b05cddfba';
export const SITE = 'https://vikaspal.is-a.dev/';
export const ENDPOINT = process.env.INDEXNOW_ENDPOINT ?? 'https://api.indexnow.org/indexnow';
/** Where to read the sitemap and key file from. Defaults to SITE; overridden only to test against a local build. */
const ORIGIN = process.env.INDEXNOW_ORIGIN ?? SITE;

/** <loc> entries of a sitemap, limited to the site's own host. */
export function sitemapUrls(xml, site = SITE) {
  const host = new URL(site).host;
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]).filter((u) => new URL(u).host === host);
}

export function payload(urls, site = SITE, key = KEY) {
  return { host: new URL(site).host, key, keyLocation: new URL(`${key}.txt`, site).href, urlList: urls };
}

/** What IndexNow's status codes mean (https://www.indexnow.org/documentation). */
export function describe(status) {
  return (
    {
      200: 'OK: URLs submitted',
      202: 'Accepted: key validation pending, URLs will be processed',
      400: 'Bad request',
      403: 'Forbidden: key file not found or does not match',
      422: 'Unprocessable: URLs do not belong to the host or key mismatch',
      429: 'Too many requests',
    }[status] ?? `Unexpected status ${status}`
  );
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Waits for the freshly deployed key file to be served (Pages can lag a minute). */
async function waitForKeyFile(url, key, tries = 12, delayMs = 10_000) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok && (await res.text()).trim() === key) return true;
    } catch {
      // not reachable yet
    }
    if (i < tries) await sleep(delayMs);
  }
  return false;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const warn = (msg) => console.log(`::warning title=IndexNow::${msg}`);

  const xml = await (await fetch(new URL('sitemap.xml', ORIGIN), { cache: 'no-store' })).text();
  const urls = sitemapUrls(xml);
  if (!urls.length) return warn('No URLs found in the live sitemap; nothing submitted.');
  const body = payload(urls);
  console.log(`IndexNow: ${urls.length} URLs for ${body.host}`);
  if (dryRun) return console.log(JSON.stringify(body, null, 2));

  const keyUrl = new URL(`${KEY}.txt`, ORIGIN).href;
  if (!(await waitForKeyFile(keyUrl, KEY))) return warn(`Key file not live at ${keyUrl}; skipped submission.`);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  const line = `${res.status} ${describe(res.status)}`;
  if (res.status === 200 || res.status === 202) console.log(`IndexNow: ${line}`);
  else warn(`${line}. ${(await res.text()).slice(0, 300)}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => console.log(`::warning title=IndexNow::${e.message}`));
}
