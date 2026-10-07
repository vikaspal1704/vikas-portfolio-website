/**
 * The analyst's knowledge base. Every document is derived from `profile.ts`
 * or written here from facts in it, so the AI can only say what the site can back up.
 */
import { profile, projects, roles, skills, yearsExperience } from '../data/profile';

export interface Doc {
  id: string;
  title: string;
  /** Plain text; lines starting with "- " render as bullets. */
  answer: string;
  keywords: string[];
  /** Evidence ids (projects / roles) cited under the answer. */
  refs: string[];
  follow: string[];
}

const bullets = (xs: string[]) => xs.map((x) => `- ${x}`).join('\n');
const period = (start: string, end: string | null) => `${start} – ${end ?? 'present'}`;

function projectDocs(): Doc[] {
  return projects.map((p) => ({
    id: `project:${p.id}`,
    title: p.name,
    answer: `${p.summary}\n${bullets(p.highlights)}\nStack: ${p.stack.join(', ')}.`,
    keywords: [p.name, p.symbol, ...p.tags, ...p.stack],
    refs: [p.id],
    follow: ['What makes Arena hard to build?', 'Show me his AI work', 'Is he a fit for my role?'],
  }));
}

function roleDocs(): Doc[] {
  return roles.map((r) => ({
    id: `role:${r.id}`,
    title: `${r.title} · ${r.company}`,
    answer: `${r.title} at ${r.company} (${period(r.start, r.end)}${r.location ? `, ${r.location}` : ''}). ${r.summary}\n${bullets(
      r.highlights.filter(Boolean),
    )}`,
    keywords: [r.company, r.title, ...r.stack, 'experience', 'job', 'work', 'career'],
    refs: [r.id],
    follow: ['Walk me through his career', 'What is he looking for next?'],
  }));
}

function curatedDocs(): Doc[] {
  const yrs = yearsExperience();
  const featured = projects.filter((p) => ['arena', 'fo-wrapped', 'fix-lab', 'recruiter-backend'].includes(p.id));
  const aiProjects = projects.filter((p) => p.tags.includes('ai'));
  const byGroup = (g: string) => skills.filter((s) => s.group === g).map((s) => s.name);

  const docs: Doc[] = [
    {
      id: 'why-hire',
      title: 'Why hire Vikas',
      answer: [
        `${profile.name} has ${yrs}+ years building production systems where fintech meets AI. He has already paid the production tax: uptime, token bills, latency and deadlines.`,
        `- Production AI at scale: at Zeus Learning he ran an AI test platform (Next.js + Python/Django) at ~50,000 requests a day with 99.9% uptime, and his semantic caching cut LLM costs ~40%.`,
        `- Trading infrastructure now: SDE at ViewTrade, building real-time WebSocket and distributed-systems infrastructure for API-driven brokerage platforms.`,
        `- Depth beyond the day job: a Rust matching engine at ~2M orders/s (p50 ≈ 350 ns), an L2 feed with gap recovery, and a FIX session engine built from scratch.`,
        `- Leadership and delivery: led 4 developers to ship a reporting SDK under hard client deadlines, and made deploys ~50% faster with CI/CD.`,
      ].join('\n'),
      keywords: ['why', 'hire', 'strength', 'stand', 'out', 'best', 'summary', 'pitch', 'overview', 'should', 'good', 'value', 'unique', 'about', 'who'],
      refs: ['arena', 'viewtrade', 'recruiter-backend', 'this-site'],
      follow: ['Show me his best project', 'Is he a fit for my role?', 'How do I contact him?'],
    },
    {
      id: 'brief',
      title: 'The 60-second brief',
      answer: [
        `${profile.headline}, ${yrs}+ years. ${profile.location}. ${profile.remote}.`,
        `- Now: ${roles[0]!.title} at ViewTrade (since ${roles[0]!.start}), building real-time trading infrastructure for brokerage and wealth-tech APIs.`,
        `- Before: Zeus Learning (Jan 2023 – Jul 2025), on a production AI platform: 99.9% uptime, ~40% LLM cost cut, led a team of 4.`,
        `- Proof you can run: ${featured.map((p) => p.name).join(', ')}, all open source and most of them live.`,
        `- Education: BE Computer Science, Gujarat Technological University (2023).`,
        `- Looking for: Senior / Staff backend, platform, AI-infra or trading-infra roles, remote.`,
      ].join('\n'),
      keywords: ['brief', 'tldr', 'summary', 'quick', 'short', 'overview', 'introduce', 'yourself', 'bio', 'background', 'resume', 'cv'],
      refs: ['viewtrade', 'arena', 'fo-wrapped'],
      follow: ['Why hire Vikas?', 'What is he looking for next?'],
    },
    {
      id: 'ai',
      title: 'AI and LLM experience',
      answer: [
        `He builds production AI platforms, and treats cost and reliability as features.`,
        `- Zeus Learning: AI-powered test platform at ~50,000 requests a day and 99.9% uptime. Semantic caching cut LLM costs ~40% without changing the model family.`,
        `- ViewTrade: drives adoption of AI-native, Claude-ecosystem tooling for developer productivity, without trading away reliability.`,
        ...aiProjects.map((p) => `- ${p.name}: ${p.signal}`),
        `- Workflow: his flagship repos ship an AGENT_BRIEF and a full spec so AI coding agents can implement them without guessing.`,
        `His strength is engineering LLMs into reliable, cost-efficient products, not training models from scratch.`,
      ].join('\n'),
      keywords: ['cost', 'caching', 'semantic', 'token', 'ai', 'ml', 'llm', 'gpt', 'openai', 'rag', 'embedding', 'vector', 'agent', 'agents', 'genai', 'machine', 'learning', 'langchain', 'langflow', 'pinecone', 'model', 'inference', 'webgpu', 'chatbot', 'prompt'],
      refs: aiProjects.map((p) => p.id).concat('zeus'),
      follow: ['How does this site’s AI work?', 'Tell me about Recruiter Backend'],
    },
    {
      id: 'latency',
      title: 'Low-latency and performance work',
      answer: [
        `Arena is the main evidence. A dependency-free Rust engine running a seeded exchange-like mix of 60% limits, 25% cancels and 15% markets:`,
        `- 2.0–2.5M commands/s on one core, p50 ≈ 350 ns, p99 ≈ 1.6 µs, p99.9 ≈ 14–22 µs`,
        `- About 1.9M commands/s compiled to WebAssembly in Chromium. The hero at the top of this page measures it on your machine.`,
        `- Profiling showed the tail came from page faults on freshly grown vectors, not from matching. Preallocating and pre-touching took p99 from 16.8 µs to 1.6 µs.`,
        `- Next on his roadmap: a flat price-indexed level array, intrusive per-level order lists, and core pinning.`,
      ].join('\n'),
      keywords: ['latency', 'performance', 'fast', 'speed', 'nanosecond', 'microsecond', 'throughput', 'benchmark', 'optimise', 'optimize', 'p99', 'hft', 'low', 'perf', 'profiling', 'rust', 'c++'],
      refs: ['arena'],
      follow: ['What makes Arena hard to build?', 'Does he know C++?'],
    },
    {
      id: 'trading',
      title: 'Trading-systems knowledge',
      answer: [
        `He has built most of an exchange stack himself, piece by piece:`,
        `- Matching: price-time priority CLOB (Mini Matching Engine) → Rust engine with markets, ticks, owners and L2 events (Arena)`,
        `- Market data: snapshot + incremental deltas, sequence numbers, gap detection, heartbeats, backpressure (Live Orderbook Feed, Arena)`,
        `- Order entry: FIX 4.2–5.0 SP2 session layer with resend and gap fill (FIX Protocol Lab)`,
        `- Post-trade: FIFO round trips, Indian exchange charges, P&L analytics (F&O Wrapped, Arena)`,
        `- In production: real-time WebSocket trading infrastructure at ViewTrade (stale quotes, fan-out, backpressure)`,
      ].join('\n'),
      keywords: ['trading', 'exchange', 'market', 'order', 'book', 'orderbook', 'fix', 'oms', 'broker', 'stock', 'equities', 'derivatives', 'futures', 'options', 'capital', 'markets', 'fintech', 'finance', 'quant'],
      refs: ['arena', 'live-orderbook-feed', 'fix-lab', 'fo-wrapped', 'viewtrade'],
      follow: ['Show me low-latency work', 'Tell me about FIX Protocol Lab'],
    },
    {
      id: 'arena-hard',
      title: 'What makes Arena hard',
      answer: [
        `Four things a toy order book doesn’t need:`,
        `- Determinism: no floats, no clocks, no hash-map iteration order, so native and WASM runs agree to the bit`,
        `- Auditability: every command is journaled and fingerprinted, so any prefix can be replayed and verified`,
        `- Correctness: 1.5M random commands are diff-tested in CI against an independent Python engine`,
        `- A lossy feed: deltas can be dropped on purpose, and the client must detect the gap and recover from a snapshot`,
      ].join('\n'),
      keywords: ['arena', 'hard', 'difficult', 'challenge', 'complex', 'determinism', 'replay', 'audit', 'fingerprint', 'journal'],
      refs: ['arena'],
      follow: ['Show me low-latency work', 'How does this site’s AI work?'],
    },
    {
      id: 'looking-for',
      title: 'What he is looking for',
      answer: `${profile.remote}. Roles he is targeting:\n${bullets(profile.lookingFor)}`,
      keywords: ['looking', 'next', 'role', 'want', 'goal', 'interest', 'open', 'seeking', 'target', 'ideal', 'job'],
      refs: [],
      follow: ['Is he a fit for my role?', 'How do I contact him?'],
    },
    {
      id: 'contact',
      title: 'Contact',
      answer: [
        `The fastest route is email: ${profile.email}.`,
        `- LinkedIn: ${profile.links.linkedin}`,
        `- GitHub: ${profile.links.github}`,
        profile.calendarUrl ? `- Book a call: ${profile.calendarUrl}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
      keywords: ['contact', 'email', 'reach', 'call', 'interview', 'schedule', 'linkedin', 'talk', 'hire', 'message', 'phone', 'connect'],
      refs: [],
      follow: ['What is he looking for next?', 'Give me the 60-second brief'],
    },
    {
      id: 'location',
      title: 'Location and availability',
      answer: `${profile.location}. ${profile.remote}. He wants US-hours overlap. Notice period, relocation and visa details aren’t published here, so email ${profile.email} for those.`,
      keywords: ['location', 'where', 'based', 'timezone', 'time', 'zone', 'remote', 'relocate', 'relocation', 'visa', 'notice', 'available', 'availability', 'start', 'onsite', 'hybrid', 'country', 'india'],
      refs: [],
      follow: ['How do I contact him?'],
    },
    {
      id: 'education',
      title: 'Education',
      answer: profile.education
        ? profile.education
        : `His education details aren’t on this site yet. Email ${profile.email} and he can share them.`,
      keywords: ['education', 'degree', 'college', 'university', 'graduate', 'btech', 'bachelor', 'master', 'study', 'studied', 'school', 'certification'],
      refs: [],
      follow: ['Give me the 60-second brief'],
    },
    {
      id: 'compensation',
      title: 'Compensation',
      answer: `Compensation is something he’d rather discuss directly once there’s a mutual fit. Email ${profile.email}.`,
      keywords: ['salary', 'compensation', 'pay', 'ctc', 'expected', 'expectation', 'rate', 'money', 'package'],
      refs: [],
      follow: ['What is he looking for next?'],
    },
    {
      id: 'leadership',
      title: 'Leadership and impact',
      answer: [
        `- Led 4 developers to deliver a reporting SDK under hard client deadlines (Zeus Learning)`,
        `- Set up CI/CD with DevOps that made deploys ~50% faster; modular patterns cut debugging time ~20%`,
        `- Owned production reliability: 99.9% uptime under peak at ~50,000 requests a day`,
        `- Cut LLM spend ~40% with semantic caching`,
        `- Earlier, led a community engagement team at Break The Barrier (2021–2022)`,
      ].join('\n'),
      keywords: ['lead', 'leadership', 'team', 'manage', 'mentor', 'impact', 'senior', 'staff', 'ownership', 'deliver', 'deadline', 'metrics', 'results', 'achievements', 'uptime'],
      refs: ['zeus'],
      follow: ['Why hire Vikas?', 'What AI has he shipped?'],
    },
    {
      id: 'stack',
      title: 'Tech stack',
      answer: [
        `- Trading systems: ${byGroup('Trading systems').join(', ')}`,
        `- Backend: ${byGroup('Backend').join(', ')}`,
        `- Frontend: ${byGroup('Frontend').join(', ')}`,
        `- AI / LLM: ${byGroup('AI / LLM').join(', ')}`,
        `- Infra & quality: ${byGroup('Infra & quality').join(', ')}`,
      ].join('\n'),
      keywords: ['stack', 'skills', 'technologies', 'languages', 'tools', 'tech', 'know', 'proficient', 'framework'],
      refs: [],
      follow: ['Does he know Rust?', 'Show me his AI work'],
    },
    {
      id: 'style',
      title: 'How he works',
      answer: bullets(profile.workingStyle),
      keywords: ['work', 'style', 'approach', 'process', 'culture', 'team', 'quality', 'testing', 'docs', 'documentation', 'spec', 'engineering', 'practices', 'principles', 'ownership', 'collaborate'],
      refs: ['arena', 'mini-matching-engine', 'fo-wrapped'],
      follow: ['Why hire Vikas?'],
    },
    {
      id: 'career',
      title: 'Career path',
      answer: roles
        .slice()
        .reverse()
        .map((r) => `- ${period(r.start, r.end)}: ${r.title}, ${r.company}. ${r.summary}`)
        .join('\n'),
      keywords: ['career', 'experience', 'history', 'path', 'journey', 'timeline', 'years', 'previous', 'companies', 'worked'],
      refs: roles.map((r) => r.id),
      follow: ['What does he do at ViewTrade?', 'What is he looking for next?'],
    },
    {
      id: 'site-ai',
      title: 'How this site’s AI works',
      answer: [
        `There is no server and no API key, and it costs nothing to run.`,
        `- Instant mode: BM25 retrieval over a knowledge base generated from this page’s data. Each answer cites its sources, and when something isn’t covered it says so instead of guessing.`,
        `- Local LLM mode: WebLLM runs an open-source Qwen 2.5 model on your GPU through WebGPU. It gets only the retrieved documents as context.`,
        `- Fit check: paste a job description and each requirement is matched to evidence, with gaps shown as gaps.`,
        `- The hero runs Arena’s Rust matching engine as WebAssembly in a Web Worker and benchmarks it on your device.`,
      ].join('\n'),
      keywords: ['site', 'website', 'portfolio', 'built', 'how', 'chatbot', 'this', 'webllm', 'webgpu', 'works', 'analyst', 'retrieval', 'bm25'],
      refs: ['this-site', 'arena'],
      follow: ['Show me his AI work', 'Show me low-latency work'],
    },
    {
      id: 'gaps',
      title: 'Gaps and growth areas',
      answer: [
        `Being straight about what the public evidence doesn’t show:`,
        `- No C++, Java or Go on his record. His production work is Python/Django and TypeScript/Next.js, and his systems-level work is in Rust.`,
        `- No Kafka or Kubernetes on his record. His messaging work is WebSocket and TCP fan-out with sequencing; deployment work is Docker and CI.`,
        `- Applied AI rather than model training: LLM integration, retrieval and on-device inference.`,
        `- Rust and the exchange internals (matching, FIX) are personal projects rather than his day job, though they are tested and benchmarked to a production standard.`,
      ].join('\n'),
      keywords: ['weakness', 'gap', 'gaps', 'missing', 'lack', 'improve', 'growth', 'not', 'cpp', 'c++', 'java', 'go', 'golang', 'kafka', 'kubernetes', 'k8s', 'weak'],
      refs: [],
      follow: ['Show me low-latency work', 'Is he a fit for my role?'],
    },
  ];
  return docs;
}

export const docs: Doc[] = [...curatedDocs(), ...projectDocs(), ...roleDocs()];

export const starterQuestions = [
  'Why hire Vikas?',
  'Show me low-latency work',
  'What AI has he shipped?',
  'Give me the 60-second brief',
];
