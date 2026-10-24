import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { jsonLdTag, llmsTxt, meta, notFoundPage, pagedProjects, projectPage, projectPath, sitemapXml, staticRoot } from './src/seo/render';
import { profile } from './src/data/profile';

/**
 * Bakes crawlable content into the build from src/data/profile.ts: the static
 * profile inside #root, JSON-LD, meta tags, a page per project, sitemap and llms.txt.
 */
function seo(): Plugin {
  const verification = [
    profile.googleSiteVerification && `<meta name="google-site-verification" content="${profile.googleSiteVerification}" />`,
    profile.bingSiteVerification && `<meta name="msvalidate.01" content="${profile.bingSiteVerification}" />`,
  ]
    .filter(Boolean)
    .join('\n    ');
  return {
    name: 'seo',
    transformIndexHtml(html) {
      return html
        .replaceAll('%SEO_TITLE%', meta.title)
        .replaceAll('%SEO_DESCRIPTION%', meta.description)
        .replaceAll('%SITE_URL%', profile.siteUrl)
        .replace('<!--seo:verification-->', verification)
        .replace('<!--seo:jsonld-->', jsonLdTag())
        .replace('<!--seo:static-root-->', staticRoot());
    },
    generateBundle() {
      const emit = (fileName: string, source: string) => this.emitFile({ type: 'asset', fileName, source });
      for (const p of pagedProjects) emit(`${projectPath(p)}index.html`, projectPage(p));
      emit('sitemap.xml', sitemapXml(new Date().toISOString().slice(0, 10)));
      emit('llms.txt', llmsTxt());
      emit('404.html', notFoundPage());
    },
  };
}

// Relative base so the same build works at the custom domain root and under a GitHub Pages project path.
export default defineConfig({
  base: './',
  plugins: [react(), seo()],
  worker: { format: 'es' },
  build: { target: 'es2022' },
});
