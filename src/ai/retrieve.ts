/**
 * BM25 retrieval over the knowledge base, with a small synonym map so that
 * recruiter phrasing ("GenAI", "HFT", "k8s") reaches the right documents.
 */
import { docs, type Doc } from './kb';

const STOP = new Set(
  'a an and are as at be by can do does for from has have he him his how i in is it me my of on or show tell that the their them this to was what when where which who why will with you your about any vikas pal please give'.split(
    ' ',
  ),
);

const SYNONYMS: Record<string, string[]> = {
  genai: ['ai', 'llm'],
  gpt: ['llm', 'ai'],
  chatgpt: ['llm', 'ai'],
  ml: ['ai'],
  hft: ['latency', 'trading'],
  quant: ['trading'],
  k8s: ['kubernetes'],
  cpp: ['c++'],
  golang: ['go'],
  realtime: ['real-time', 'websockets'],
  websocket: ['websockets'],
  orderbook: ['order', 'book'],
  fintech: ['trading', 'finance'],
  frontend: ['react'],
  ui: ['react', 'frontend'],
  cv: ['resume'],
  reach: ['contact'],
  email: ['contact'],
  hire: ['why'],
  fit: ['looking'],
  best: ['arena', 'why'],
  project: ['arena'],
  projects: ['arena', 'stack'],
  rag: ['retrieval', 'vector', 'ai'],
  agents: ['agent', 'ai'],
};

export function stem(t: string): string {
  if (t.length > 5 && t.endsWith('ing')) return t.slice(0, -3);
  if (t.length > 4 && t.endsWith('ed')) return t.slice(0, -2);
  if (t.length > 3 && t.endsWith('s') && !t.endsWith('ss')) return t.slice(0, -1);
  return t;
}

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9+#]+(?:[.-][a-z0-9]+)*/g) ?? [])
    .filter((t) => !STOP.has(t))
    .map(stem);
}

function expand(tokens: string[]): string[] {
  const out = [...tokens];
  for (const t of tokens) for (const s of SYNONYMS[t] ?? []) out.push(...tokenize(s));
  return out;
}

interface Indexed {
  doc: Doc;
  tf: Map<string, number>;
  len: number;
}

// Keywords are weighted 3x and titles 2x: they are curated, the body is prose.
const index: Indexed[] = docs.map((doc) => {
  const tokens = [
    ...tokenize(doc.title),
    ...tokenize(doc.title),
    ...doc.keywords.flatMap((k) => {
      const t = tokenize(k);
      return [...t, ...t, ...t];
    }),
    ...tokenize(doc.answer),
  ];
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return { doc, tf, len: tokens.length };
});

const avgLen = index.reduce((s, d) => s + d.len, 0) / index.length;
const df = new Map<string, number>();
for (const d of index) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);

const K1 = 1.4;
const B = 0.6;

export interface Hit {
  doc: Doc;
  score: number;
}

export function search(query: string, k = 4): Hit[] {
  const q = expand(tokenize(query));
  if (q.length === 0) return [];
  const N = index.length;
  const hits = index.map(({ doc, tf, len }) => {
    let score = 0;
    for (const t of new Set(q)) {
      const f = tf.get(t);
      if (!f) continue;
      const n = df.get(t) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += (idf * (f * (K1 + 1))) / (f + K1 * (1 - B + (B * len) / avgLen));
    }
    return { doc, score };
  });
  return hits
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

/** Below this the top hit is treated as "not covered" rather than a weak guess. */
export const MIN_SCORE = 1.2;

/** A job description is long, or reads like one. */
export function looksLikeJobDescription(text: string): boolean {
  const t = text.toLowerCase();
  const cues = ['responsibilit', 'requirement', 'qualification', 'you will', "you'll", 'we are looking', 'must have', 'nice to have', 'years of experience', 'about the role', 'what you'];
  const hits = cues.filter((c) => t.includes(c)).length;
  return text.length > 400 || (text.length > 160 && hits >= 1) || hits >= 2;
}
