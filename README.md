# VIKAS/LIVE: Vikas Pal's portfolio

**Live:** https://vikaspal.is-a.dev/

A portfolio that runs an exchange. When the page opens, the Rust matching engine from
[Arena](https://github.com/vikaspal1704/arena), compiled to WebAssembly, starts in a Web Worker. It draws a live
liquidity heatmap of its order book and benchmarks itself on the visitor's device ("orders matched in your browser").

## AI analyst: free, open source, no server

- **Instant:** BM25 retrieval over a knowledge base generated from `src/data/profile.ts`. Answers cite their sources,
  and anything not covered is reported as not covered.
- **Local LLM (optional):** [WebLLM](https://github.com/mlc-ai/web-llm) runs Qwen2.5-1.5B-Instruct on the visitor's GPU
  via WebGPU. It is grounded on the retrieved documents only. It needs no API key, costs nothing and sends no data anywhere.
- **JD fit check:** paste a job description and each requirement is mapped to evidence. Gaps are shown as gaps.

## SEO and AI answer engines

The build bakes crawlable content into the HTML from `src/data/profile.ts` (see `src/seo/render.ts` and the `seo`
plugin in `vite.config.ts`): a static profile inside `#root` (React replaces it on boot), JSON-LD (`Person`,
`ProfilePage`, `WebSite`, one `SoftwareSourceCode` per project), a page per project at `/projects/<id>/`,
`sitemap.xml`, `llms.txt` and `404.html`. `public/` holds `robots.txt` (AI crawlers allowed), favicons, the web
manifest and the self-hosted fonts. To verify Search Console / Bing, set `googleSiteVerification` /
`bingSiteVerification` in `profile.ts`.

### Bing and IndexNow

Bing Webmaster Tools caps how many `*.is-a.dev` sites it accepts, so Bing is fed through
[IndexNow](https://www.indexnow.org/) instead, which needs no account. The key file
`public/0297fe6466bc8dcf0ab9811b05cddfba.txt` proves ownership, and the `indexnow` job in
`.github/workflows/deploy.yml` runs `scripts/indexnow.mjs` after every deploy to submit each URL
in the live sitemap. It never fails the run; problems appear as warnings. Keep the key file.
Dry run: `node scripts/indexnow.mjs --dry-run`.

### SEO audit (OpenSEO)

The `seo-audit` CI job crawls the built site with the site-audit engine from
[OpenSEO](https://github.com/every-app/open-seo), an open-source Semrush/Ahrefs alternative. It checks titles, meta
descriptions, headings, thin content, canonicals, broken links, redirects and orphan pages, and fails on any critical or
warning issue. The audit is free; OpenSEO's keyword, rank and backlink features need a paid DataForSEO key and aren't
used here. Run it locally after a build with `npm run build && npm run audit:seo`. `seo-audit/audit.sh` pins the
OpenSEO commit; bump it on purpose, because new versions can add checks.

## Editing content

Everything the site and the AI say comes from **`src/data/profile.ts`**. Fields marked `TODO(vikas)`
(currently the headshot) are hidden until they are filled in.
## Résumé

`public/vikas-pal-resume.pdf` is rendered from `resume/resume.html` (one US Letter page, real TrueType text so
ATS parsers can read it). After editing the HTML, re-render it with any Chromium "Print to PDF" or with Playwright:
`page.goto('file://…/resume/resume.html'); page.pdf({ path: 'public/vikas-pal-resume.pdf', preferCSSPageSize: true })`.
Keep its facts in sync with `src/data/profile.ts`.

## Develop

```bash
npm ci
npm run dev     # http://localhost:5173
npm test        # retrieval + fit-check tests
npm run build   # static site in dist/
```

`src/engine/arena.wasm` is built from Arena with
`cargo build --release -p arena-wasm --target wasm32-unknown-unknown`.

Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

Stack: React 19 · TypeScript · Vite · Rust→WASM · Web Workers · Canvas · WebLLM/WebGPU.
