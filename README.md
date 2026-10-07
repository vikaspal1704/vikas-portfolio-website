# VIKAS/LIVE: Vikas Pal's portfolio

**Live:** https://vikaspal1704.github.io/vikas-portfolio-website/

A portfolio that runs an exchange. When the page opens, the Rust matching engine from
[Arena](https://github.com/vikaspal1704/arena), compiled to WebAssembly, starts in a Web Worker. It draws a live
liquidity heatmap of its order book and benchmarks itself on the visitor's device ("orders matched in your browser").

## AI analyst: free, open source, no server

- **Instant:** BM25 retrieval over a knowledge base generated from `src/data/profile.ts`. Answers cite their sources,
  and anything not covered is reported as not covered.
- **Local LLM (optional):** [WebLLM](https://github.com/mlc-ai/web-llm) runs Qwen2.5-1.5B-Instruct on the visitor's GPU
  via WebGPU. It is grounded on the retrieved documents only. It needs no API key, costs nothing and sends no data anywhere.
- **JD fit check:** paste a job description and each requirement is mapped to evidence. Gaps are shown as gaps.

## Editing content

Everything the site and the AI say comes from **`src/data/profile.ts`**. Fields marked `TODO(vikas)`
(education, résumé PDF, calendar link, quantified ViewTrade impact) are hidden until they are filled in.
Put a résumé at `public/vikas-pal-resume.pdf` and set `resumeUrl: 'vikas-pal-resume.pdf'`.

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
