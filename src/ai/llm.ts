/**
 * Optional on-device LLM. WebLLM (Apache-2.0) runs an open-source Qwen 2.5
 * model on the visitor's GPU via WebGPU. It is loaded only on request, and it
 * answers only from documents the retriever hands it.
 */
import type { MLCEngineInterface } from '@mlc-ai/web-llm';
import type { Hit } from './retrieve';
import { profile } from '../data/profile';

export const MODEL_LABEL = 'Qwen2.5 1.5B Instruct';
export const MODEL_SIZE = '≈1 GB, downloaded once and cached';

export async function webgpuStatus(): Promise<{ ok: boolean; f16: boolean; reason?: string }> {
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<{ features: Set<string> } | null> } }).gpu;
  if (!gpu) return { ok: false, f16: false, reason: 'This browser has no WebGPU. Try a recent Chrome or Edge on desktop.' };
  try {
    const adapter = await gpu.requestAdapter();
    if (!adapter) return { ok: false, f16: false, reason: 'No compatible GPU adapter was found.' };
    return { ok: true, f16: adapter.features.has('shader-f16') };
  } catch {
    return { ok: false, f16: false, reason: 'WebGPU is unavailable here.' };
  }
}

let engine: Promise<MLCEngineInterface> | null = null;

export function loadLLM(f16: boolean, onProgress: (progress: number, text: string) => void): Promise<MLCEngineInterface> {
  engine ??= (async () => {
    const { CreateWebWorkerMLCEngine } = await import('@mlc-ai/web-llm');
    const model = f16 ? 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC' : 'Qwen2.5-1.5B-Instruct-q4f32_1-MLC';
    const worker = new Worker(new URL('./llm.worker.ts', import.meta.url), { type: 'module' });
    return CreateWebWorkerMLCEngine(worker, model, {
      initProgressCallback: (r) => onProgress(r.progress, r.text),
    });
  })();
  engine.catch(() => (engine = null));
  return engine;
}

function systemPrompt(hits: Hit[]): string {
  const context = hits.map((h, i) => `[${i + 1}] ${h.doc.title}\n${h.doc.answer}`).join('\n\n');
  return [
    `You are the analyst on ${profile.name}'s portfolio site, answering hiring managers and recruiters.`,
    `Answer ONLY from the CONTEXT below. Refer to him as "Vikas" in the third person.`,
    `If the context does not contain the answer, say it isn't listed on the site and suggest emailing ${profile.email}. Never invent employers, numbers, degrees or dates.`,
    `Be concise: at most 5 short sentences or bullets. Plain text, no markdown headings.`,
    ``,
    `CONTEXT:`,
    context || '(no relevant documents)',
  ].join('\n');
}

export async function* askLLM(llm: MLCEngineInterface, question: string, hits: Hit[]): AsyncGenerator<string> {
  const stream = await llm.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt(hits) },
      { role: 'user', content: question },
    ],
    stream: true,
    temperature: 0.2,
    max_tokens: 320,
  });
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}
