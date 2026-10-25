#!/usr/bin/env node
/**
 * Serves a static build the way GitHub Pages does, so the audit sees the same responses:
 * a directory without a trailing slash 301s to the slash form, a directory serves its
 * index.html, and anything missing gets 404.html with a 404 status.
 *   node seo-audit/pages-server.mjs <dir> <port>
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve(process.argv[2]);
const port = Number(process.argv[3]);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
  '.pdf': 'application/pdf',
};

http
  .createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost');
    let file = path.join(root, decodeURIComponent(pathname));
    if (!file.startsWith(root)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!pathname.endsWith('/')) return res.writeHead(301, { Location: `${pathname}/` }).end();
      file = path.join(file, 'index.html');
    }
    if (!fs.existsSync(file)) {
      return res.writeHead(404, { 'Content-Type': types['.html'] }).end(fs.readFileSync(path.join(root, '404.html')));
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' }).end(fs.readFileSync(file));
  })
  .listen(port, () => console.log(`Serving ${root} on http://localhost:${port}`));
