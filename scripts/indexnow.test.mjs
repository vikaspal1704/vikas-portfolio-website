import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { KEY, SITE, describe as status, payload, sitemapUrls } from './indexnow.mjs';
import { sitemapXml } from '../src/seo/render';

describe('IndexNow', () => {
  it('key file in public/ holds exactly the key (no newline)', () => {
    expect(readFileSync(new URL(`../public/${KEY}.txt`, import.meta.url), 'utf8')).toBe(KEY);
    expect(KEY).toMatch(/^[a-f0-9]{32}$/);
  });

  it('submits every URL of the generated sitemap, on the canonical host only', () => {
    const urls = sitemapUrls(sitemapXml('2026-10-24'));
    expect(urls[0]).toBe(SITE);
    expect(urls).toContain('https://vikaspal.is-a.dev/projects/arena/');
    expect(sitemapUrls('<loc>https://evil.example/x</loc><loc>https://vikaspal.is-a.dev/a</loc>')).toEqual(['https://vikaspal.is-a.dev/a']);
  });

  it('builds the payload IndexNow expects', () => {
    expect(payload(['https://vikaspal.is-a.dev/'])).toEqual({
      host: 'vikaspal.is-a.dev',
      key: KEY,
      keyLocation: `https://vikaspal.is-a.dev/${KEY}.txt`,
      urlList: ['https://vikaspal.is-a.dev/'],
    });
  });

  it('explains status codes', () => {
    expect(status(202)).toMatch(/Accepted/);
    expect(status(403)).toMatch(/key file/);
  });
});
