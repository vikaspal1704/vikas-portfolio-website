/**
 * Build-time HTML for crawlers and AI answer engines, generated from the same
 * data as the app (src/data/profile.ts) so the two can never disagree.
 *
 * - staticRoot(): semantic content placed inside <div id="root">. React's
 *   createRoot() replaces it when JS boots; no-JS readers and crawlers keep it.
 * - jsonLd(): schema.org @graph (WebSite, ProfilePage, Person, projects).
 * - projectPage(): a standalone page per project at /projects/<id>/.
 * - llmsTxt(), sitemapXml(), notFoundPage(): crawl files.
 */
import { evidenceRef, faqs, profile, projects, roles, skills, yearsExperience, type Project } from '../data/profile';

const SITE = profile.siteUrl;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (path: string) => new URL(path, SITE).href;
const period = (start: string, end: string | null) => `${start} – ${end ?? 'Present'}`;

/** Projects that get their own page (this site is the home page itself). */
export const pagedProjects = projects.filter((p) => p.id !== 'this-site');
export const projectPath = (p: Project) => `projects/${p.id}/`;

export const meta = {
  title: `${profile.name} · ${profile.headline}`,
  description: `${profile.name}, ${profile.headline.split(' | ')[0]} in ${profile.city}, ${profile.country}. Applied AI × fintech: real-time trading systems, LLM platforms and a Rust exchange engine.`,
};

const groups = [...new Set(skills.map((s) => s.group))];

export function staticRoot(): string {
  const role = roles[0]!;
  return `
<div class="static-page">
  <header>
    <h1>${esc(profile.name)}</h1>
    <p class="static-role">${esc(profile.headline)} · ${esc(profile.city)}, ${esc(profile.country)}</p>
  </header>
  <section aria-labelledby="s-about">
    <h2 id="s-about">About Vikas Pal</h2>
    <p>${esc(faqs[0]!.a)}</p>
    <p>${esc(profile.pitch)}</p>
    <p>${esc(profile.remote)}. <a href="${esc(profile.calendarUrl ?? `mailto:${profile.email}`)}">Book a call</a> · <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a> · <a href="${esc(profile.links.linkedin)}">LinkedIn</a> · <a href="${esc(profile.links.github)}">GitHub</a>${profile.resumeUrl ? ` · <a href="${esc(profile.resumeUrl)}">Résumé (PDF)</a>` : ''}</p>
  </section>
  <section aria-labelledby="s-exp">
    <h2 id="s-exp">Experience</h2>
    ${roles
      .map(
        (r) => `<article>
      <h3>${esc(r.title)}, ${esc(r.company)}</h3>
      <p>${esc(period(r.start, r.end))}${r.location ? ` · ${esc(r.location)}` : ''}</p>
      <p>${esc(r.summary)}</p>
      <ul>${r.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
    </article>`,
      )
      .join('\n    ')}
  </section>
  <section aria-labelledby="s-proj">
    <h2 id="s-proj">Projects: trading systems and applied AI</h2>
    <ul>
      ${pagedProjects
        .map(
          (p) =>
            `<li><a href="${projectPath(p)}"><strong>${esc(p.name)}</strong></a>: ${esc(p.tagline)} ${p.stats.map((s) => `${esc(s.value)} ${esc(s.label)}`).join(' · ')}.${p.live ? ` <a href="${esc(p.live)}">Live demo</a>.` : ''} <a href="${esc(p.code)}">Source</a>.</li>`,
        )
        .join('\n      ')}
    </ul>
  </section>
  <section aria-labelledby="s-skills">
    <h2 id="s-skills">Skills</h2>
    <ul>${groups.map((g) => `<li><strong>${esc(g)}</strong>: ${skills.filter((s) => s.group === g).map((s) => esc(s.name)).join(', ')}</li>`).join('')}</ul>
  </section>
  <section aria-labelledby="s-faq">
    <h2 id="s-faq">Frequently asked questions</h2>
    ${faqs.map((f) => `<h3>${esc(f.q)}</h3>\n    <p>${esc(f.a)}</p>`).join('\n    ')}
  </section>
  <section aria-labelledby="s-edu">
    <h2 id="s-edu">Education</h2>
    <p>${esc(profile.education ?? '')}</p>
  </section>
  <p class="static-note">Currently ${esc(role.title)} at ${esc(role.company)}. ${yearsExperience()}+ years of professional experience. This page runs a live exchange engine and an AI analyst when JavaScript is on.</p>
</div>`;
}

export function jsonLd(): object {
  const person = `${SITE}#person`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE}#website`, url: SITE, name: profile.name, inLanguage: 'en', publisher: { '@id': person } },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE}#profile`,
        url: SITE,
        name: meta.title,
        description: meta.description,
        isPartOf: { '@id': `${SITE}#website` },
        mainEntity: { '@id': person },
      },
      {
        '@type': 'Person',
        '@id': person,
        name: profile.name,
        url: SITE,
        ...(profile.photo ? { image: abs(profile.photo) } : {}),
        jobTitle: profile.headline,
        description: faqs[0]!.a,
        email: `mailto:${profile.email}`,
        address: { '@type': 'PostalAddress', addressLocality: profile.city, addressRegion: profile.region, addressCountry: 'IN' },
        worksFor: { '@type': 'Organization', name: 'ViewTrade Holding Corp.', url: 'https://viewtrade.com' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'LDRP Institute of Technology & Research, Gujarat Technological University' },
        knowsAbout: ['Applied AI', 'Fintech', 'Forward deployed engineering', 'Trading systems', 'Matching engines', 'Market data', 'FIX protocol', 'Distributed systems', 'LLM platforms', 'Front-end platform architecture', 'Rust', 'Python', '.NET', 'TypeScript', 'AWS'],
        sameAs: [profile.links.linkedin, profile.links.github],
      },
      ...pagedProjects.map((p) => projectLd(p)),
    ],
  };
}

function projectLd(p: Project) {
  return {
    '@type': 'SoftwareSourceCode',
    '@id': `${abs(projectPath(p))}#code`,
    name: p.name,
    description: p.summary,
    url: abs(projectPath(p)),
    codeRepository: p.code,
    ...(p.live ? { sameAs: [p.live] } : {}),
    programmingLanguage: p.stack.filter((s) => /^(Rust|Python|TypeScript|JavaScript)/.test(s)),
    keywords: p.tags.join(', '),
    author: { '@id': `${SITE}#person` },
  };
}

const ld = (o: object) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
export const jsonLdTag = () => ld(jsonLd());

/** Standalone, dependency-free page per project. */
export function projectPage(p: Project): string {
  const url = abs(projectPath(p));
  const title = `${p.seoTitle ?? p.name} · ${profile.name}`;
  const credit = `${p.tagline} ${p.signal} Built by ${profile.name}.`;
  const description = credit.length <= 160 ? credit : `${p.tagline} ${p.signal}`;
  const shows = skills.filter((s) => s.evidence.includes(p.id));
  const others = pagedProjects.filter((o) => o.id !== p.id);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(p.summary)}" />
<meta property="og:image" content="${abs('og.png')}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
<meta name="theme-color" content="#05070a" />
${ld({ '@context': 'https://schema.org', ...projectLd(p) })}
<style>
  :root { color-scheme: dark; }
  body { margin: 0; background: #05070a; color: #e9eef3; font: 16px/1.65 ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; }
  main { max-width: 760px; margin: 0 auto; padding: 48px 20px 80px; }
  a { color: #2ee6a6; }
  .crumb { font: 13px ui-monospace, Menlo, monospace; color: #94a1ae; }
  .crumb a { color: #94a1ae; }
  h1 { font: 400 clamp(40px, 7vw, 64px)/1 Georgia, 'Times New Roman', serif; margin: 18px 0 10px; }
  .tag { color: #94a1ae; font-size: 18px; margin: 0 0 24px; }
  dl { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1px; background: rgba(148,163,184,.14); border: 1px solid rgba(148,163,184,.14); border-radius: 12px; overflow: hidden; }
  dl div { background: #0a0e13; padding: 12px 14px; }
  dt { font: 11px ui-monospace, Menlo, monospace; color: #94a1ae; text-transform: uppercase; letter-spacing: .06em; }
  dd { margin: 4px 0 0; font: 600 18px ui-monospace, Menlo, monospace; }
  h2 { font-size: 15px; letter-spacing: .1em; text-transform: uppercase; color: #2ee6a6; margin: 32px 0 8px; }
  li { margin-bottom: 6px; color: #c9d2db; }
  .btns { display: flex; flex-wrap: wrap; gap: 10px; margin: 28px 0; }
  .btns a { padding: 10px 14px; border: 1px solid rgba(148,163,184,.3); border-radius: 10px; text-decoration: none; color: #e9eef3; }
  .btns a.primary { background: #2ee6a6; color: #00170e; border-color: #2ee6a6; font-weight: 600; }
  footer { margin-top: 48px; color: #94a1ae; font-size: 14px; }
</style>
</head>
<body>
<main>
  <p class="crumb"><a href="../../">${esc(profile.name)}</a> / projects / ${esc(p.id)}</p>
  <h1>${esc(p.name)}</h1>
  <p class="tag">${esc(p.tagline)}</p>
  <dl>${p.stats.map((s) => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('')}</dl>
  <div class="btns">
    ${p.live ? `<a class="primary" href="${esc(p.live)}">Live demo ↗</a>` : ''}
    <a href="${esc(p.code)}">Source code ↗</a>
    <a href="../../">Back to ${esc(profile.name)}’s portfolio</a>
  </div>
  <h2>What it is</h2>
  <p>${esc(p.summary)}</p>
  <h2>Why it matters</h2>
  <p>${esc(p.signal)}</p>
  <h2>Highlights</h2>
  <ul>${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
  <h2>Stack</h2>
  <p>${p.stack.map(esc).join(' · ')}</p>
${shows.length ? `  <h2>Skills it demonstrates</h2>
  <p>${shows.map((s) => esc(s.name)).join(' · ')}</p>
` : ''}  <h2>More projects by ${esc(profile.name)}</h2>
  <ul>${others.map((o) => `<li><a href="../${o.id}/">${esc(o.name)}</a>: ${esc(o.tagline)}</li>`).join('')}</ul>
  <footer>Built by <a href="../../">${esc(profile.name)}</a>, ${esc(profile.headline)}, ${esc(profile.city)}, ${esc(profile.country)}. <a href="${esc(profile.calendarUrl ?? `mailto:${profile.email}`)}">Book a call</a>.</footer>
</main>
</body>
</html>
`;
}

export function llmsTxt(): string {
  return `# ${profile.name}

> ${profile.headline}, based in ${profile.city}, ${profile.country}. ${faqs[0]!.a}

${profile.remote}. Contact: ${profile.email}${profile.calendarUrl ? ` · ${profile.calendarUrl}` : ''}.

## Experience
${roles.map((r) => `- ${r.title}, ${r.company} (${period(r.start, r.end)}): ${r.summary} ${r.highlights.join('; ')}.`).join('\n')}
- Education: ${profile.education}

## Projects
${pagedProjects.map((p) => `- [${p.name}](${abs(projectPath(p))}): ${p.tagline} ${p.stats.map((s) => `${s.value} ${s.label}`).join(', ')}. Source: ${p.code}`).join('\n')}

## Skills
${groups.map((g) => `- ${g}: ${skills.filter((s) => s.group === g).map((s) => `${s.name} (${s.evidence.map((id) => evidenceRef(id)?.name).filter(Boolean).join(', ')})`).join('; ')}`).join('\n')}

## FAQ
${faqs.map((f) => `- **${f.q}** ${f.a}`).join('\n')}

## Links
- [Website](${SITE})
- [Résumé (PDF)](${abs(profile.resumeUrl ?? '')})
- [LinkedIn](${profile.links.linkedin})
- [GitHub](${profile.links.github})
`;
}

export function sitemapXml(lastmod: string): string {
  const urls = [SITE, ...pagedProjects.map((p) => abs(projectPath(p)))];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>
`;
}

export function notFoundPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Page not found · ${esc(profile.name)}</title>
<meta name="robots" content="noindex" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #05070a; color: #e9eef3; font: 16px/1.6 ui-sans-serif, system-ui, sans-serif; text-align: center; padding: 20px; }
  h1 { font: 400 56px/1 Georgia, serif; margin: 0 0 8px; }
  p { color: #94a1ae; }
  a { color: #2ee6a6; }
</style>
</head>
<body>
<main>
  <h1>404</h1>
  <p>This order didn’t match anything.</p>
  <p><a href="/">Go to ${esc(profile.name)}’s portfolio</a></p>
</main>
</body>
</html>
`;
}
