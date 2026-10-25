import { describe, expect, it } from 'vitest';
import { jsonLd, llmsTxt, meta, pagedProjects, projectPage, sitemapXml, staticRoot } from './render';
import { faqs, profile, roles } from '../data/profile';

describe('static root (what non-JS crawlers read)', () => {
  const html = staticRoot();
  it('has one H1 with the name, and the headline and city', () => {
    expect(html.match(/<h1>/g)).toHaveLength(1);
    expect(html).toContain('<h1>Vikas Pal</h1>');
    expect(html).toContain('Forward Deployed Engineer | Applied AI × Fintech');
    expect(html).toContain('Ahmedabad');
  });
  it('carries the same facts as the app', () => {
    for (const r of roles) expect(html).toContain(r.company);
    for (const p of pagedProjects) expect(html).toContain(`href="projects/${p.id}/"`);
    for (const f of faqs) expect(html).toContain(f.q);
    expect(html).toContain('Software Development Engineer I');
    expect(html).toContain('300+');
  });
  it('escapes HTML', () => {
    expect(html).not.toMatch(/F&O/); // must be F&amp;O
  });
});

describe('meta', () => {
  it('title fits in ~60 chars and the description in ~160', () => {
    expect(meta.title.length).toBeLessThanOrEqual(62);
    expect(meta.description.length).toBeLessThanOrEqual(160);
  });
});

describe('JSON-LD', () => {
  const ld = jsonLd() as { '@graph': { '@type': string; [k: string]: unknown }[] };
  const person = ld['@graph'].find((n) => n['@type'] === 'Person')!;
  it('is a valid graph with Person, ProfilePage, WebSite and projects', () => {
    expect(() => JSON.parse(JSON.stringify(ld))).not.toThrow();
    const types = ld['@graph'].map((n) => n['@type']);
    expect(types).toEqual(expect.arrayContaining(['Person', 'ProfilePage', 'WebSite', 'SoftwareSourceCode']));
    expect(types.filter((t) => t === 'SoftwareSourceCode')).toHaveLength(pagedProjects.length);
  });
  it('identifies the right person', () => {
    expect(person.jobTitle).toBe(profile.headline);
    expect(person.sameAs).toEqual([profile.links.linkedin, profile.links.github]);
    expect(JSON.stringify(person.address)).toContain('Ahmedabad');
    expect(person.image).toBeUndefined(); // until a headshot is added
  });
});

describe('crawl files', () => {
  it('sitemap lists the home page and every project page on the canonical domain', () => {
    const xml = sitemapXml('2026-10-23');
    expect(xml).toContain('<loc>https://vikaspal.is-a.dev/</loc>');
    expect(xml.match(/<url>/g)).toHaveLength(1 + pagedProjects.length);
  });
  it('llms.txt is markdown with a summary line', () => {
    const t = llmsTxt();
    expect(t.startsWith('# Vikas Pal\n\n> Forward Deployed Engineer')).toBe(true);
    expect(t).toContain('https://vikaspal.is-a.dev/projects/arena/');
  });
  it('project pages have their own canonical, H1 and JSON-LD', () => {
    const arena = projectPage(pagedProjects.find((p) => p.id === 'arena')!);
    expect(arena).toContain('<link rel="canonical" href="https://vikaspal.is-a.dev/projects/arena/" />');
    expect(arena.match(/<h1>/g)).toHaveLength(1);
    expect(arena).toContain('"@type":"SoftwareSourceCode"');
  });
  it.each(pagedProjects.map((p) => [p.id, p] as const))('%s page passes the OpenSEO length and thin-content checks', (_, p) => {
    const html = projectPage(p);
    const unescape = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    expect(unescape(html.match(/<title>(.*)<\/title>/)![1]!).length).toBeLessThanOrEqual(60);
    expect(unescape(html.match(/<meta name="description" content="(.*)" \/>/)![1]!).length).toBeLessThanOrEqual(160);
    const text = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ');
    expect(text.split(/\s+/).filter((w) => /\w/.test(w)).length).toBeGreaterThanOrEqual(150);
  });
});
