/**
 * Job-description fit check. Finds the requirements a JD mentions, then maps
 * each one to public evidence. A requirement with no evidence is reported as
 * a gap (with the closest adjacent evidence, if any) and is never papered over.
 */
import { yearsExperience } from '../data/profile';

export type Strength = 'strong' | 'adjacent' | 'gap';

interface Requirement {
  label: string;
  re: RegExp;
  strength: Strength;
  evidence: string[];
  note: string;
}

const R = (label: string, re: RegExp, strength: Strength, evidence: string[], note: string): Requirement => ({ label, re, strength, evidence, note });

const REQUIREMENTS: Requirement[] = [
  R('Trading systems / exchanges', /\b(trading|exchange|order ?book|matching engine|clob|market microstructure|brokerage|capital markets|order management|oms)\b/i, 'strong', ['arena', 'mini-matching-engine', 'viewtrade'], 'Built a matching engine and exchange simulator; works on a trading platform at ViewTrade'),
  R('Low latency / performance', /\b(low[- ]latency|latency|high[- ]performance|performance[- ]critical|throughput|hft|high[- ]frequency|nanosecond|microsecond)\b/i, 'strong', ['arena'], '~2M orders/s, p50 ≈ 350 ns, p99 ≈ 1.6 µs; found and fixed a page-fault tail'),
  R('Market data / real-time streaming', /\b(market data|real[- ]time|streaming|websockets?|pub\/?sub|fan[- ]?out|tick data)\b/i, 'strong', ['live-orderbook-feed', 'arena', 'viewtrade'], 'Snapshot + delta L2 feed with sequence numbers, gap recovery and backpressure'),
  R('FIX protocol', /\bfix (protocol|engine|session|4\.\d|5\.0)|\bfix\b(?=.{0,40}\b(trading|order|message))|quickfix/i, 'strong', ['fix-lab'], 'FIX codec + session engine from scratch, FIX 4.2–5.0 SP2'),
  R('Fintech domain', /\b(fintech|financial services|payments?|banking|wealth|brokers?|brokerage|derivatives|options|futures|equities|securities|p&l|pnl|risk)\b/i, 'strong', ['viewtrade', 'fo-wrapped', 'arena'], 'SDE at ViewTrade on brokerage / wealth-tech infra; F&O P&L analytics; exchange charges modelling'),
  R('Rust', /\brust\b/i, 'strong', ['arena'], 'Arena’s engine: dependency-free Rust compiled to WASM'),
  R('Python', /\bpython\b/i, 'strong', ['recruiter-backend', 'live-orderbook-feed', 'mini-matching-engine'], 'Python/Django in production at Zeus Learning; FastAPI services; reference matching engine'),
  R('TypeScript / JavaScript', /\b(typescript|javascript|ts|node\.?js|node)\b/i, 'strong', ['fix-lab', 'fo-wrapped', 'viewtrade'], 'FIX engine in Node 22 + TS; Next.js in production'),
  R('React / frontend', /\b(react|frontend|front-end|ui engineering|redux|next\.?js)\b/i, 'strong', ['viewtrade', 'fo-wrapped', 'fix-lab'], 'Next.js production platform at Zeus Learning; React 19 + RTK in FIX Lab'),
  R('APIs / backend services', /\b(backend|back-end|rest(ful)?|apis?|microservices?|fastapi|server-side)\b/i, 'strong', ['recruiter-backend', 'live-orderbook-feed', 'fix-lab'], 'Authenticated FastAPI service, WebSocket server, TCP session server'),
  R('LLMs / generative AI', /\b(llms?|large language models?|gen ?ai|generative ai|gpt|openai|anthropic|claude|prompt(ing| engineering)?|ai engineer)\b/i, 'strong', ['zeus', 'recruiter-backend', 'this-site'], 'Production AI platform (~50k req/day, 99.9% uptime), LLM resume parsing, on-device LLM on this site'),
  R('RAG / vector search / embeddings', /\b(rag|retrieval|vector (db|database|search|store)|embeddings?|pinecone|weaviate|pgvector|semantic search)\b/i, 'strong', ['zeus', 'recruiter-backend', 'this-site'], 'Semantic caching in production; Pinecone semantic search; BM25-grounded analyst on this site'),
  R('AI agents / tooling', /\b(agents?|agentic|tool use|function calling|copilot|ai[- ]assisted)\b/i, 'adjacent', ['viewtrade', 'mini-matching-engine'], 'Drives Claude-ecosystem tooling adoption at ViewTrade; writes agent-ready specs (AGENT_BRIEF.md); no standalone agent framework published yet'),
  R('Machine learning (applied)', /\b(machine learning|ml\b|ml engineer|nlp|inference)\b/i, 'adjacent', ['zeus', 'this-site'], 'Production LLM platform at Zeus Learning; on-device inference via WebLLM'),
  R('Testing / quality', /\b(testing|tests|tdd|unit tests?|e2e|end-to-end|playwright|pytest|quality)\b/i, 'strong', ['arena', 'fix-lab', 'recruiter-backend'], 'Differential tests, golden vectors, Playwright e2e, live smoke tests'),
  R('CI/CD & Docker', /\b(ci\/?cd|continuous integration|github actions|docker|containers?)\b/i, 'strong', ['recruiter-backend', 'fix-lab', 'zeus'], 'CI/CD that made deploys ~50% faster at Zeus Learning; GitHub Actions on every flagship repo'),
  R('Distributed systems', /\b(distributed systems?|scalab(le|ility)|concurrency|fault[- ]tolerant|microservices?)\b/i, 'strong', ['viewtrade', 'live-orderbook-feed', 'fix-lab'], 'Distributed, latency-sensitive trading infra at ViewTrade; sequencing, gap recovery and backpressure in his feeds'),
  R('Reliability / production ops', /\b(reliability|uptime|sla|slo|on[- ]call|observability|production systems?|incident)\b/i, 'strong', ['zeus', 'viewtrade'], '99.9% uptime under peak at ~50k requests/day; trading paths where uptime beats demo velocity'),
  R('LLM cost / performance', /\b((llm|token|inference|model|ai) (cost|spend|budget)s?|cost[- ](efficient|optimi[sz]ation)|caching|llm ?ops|semantic cach)/i, 'strong', ['zeus'], 'Semantic caching cut LLM costs ~40% without changing the model family'),
  R('Leadership / mentoring', /\b(lead(ing)? (a |the )?(team|engineers|developers)|leadership|mentor(ing|ship)?|tech lead|team lead)\b/i, 'strong', ['zeus'], 'Led 4 developers to ship a reporting SDK under hard deadlines'),
  R('Django / Next.js', /\b(django|next\.?js)\b/i, 'strong', ['zeus'], 'Production AI platform on Next.js + Python/Django'),
  R('SQL / databases', /\b(sql|postgres(ql)?|databases?|supabase|mysql|mongodb)\b/i, 'strong', ['recruiter-backend', 'zeus'], 'Supabase/Postgres in Recruiter Backend; PostgreSQL at Zeus Learning'),
  R('AWS / cloud', /\b(aws|amazon web services|gcp|azure|ec2|lambda|s3)\b/i, 'adjacent', ['recruiter-backend'], 'No named cloud provider on his record; deploys with Docker, GitHub Actions, Render and Pages'),
  R('WebAssembly / browser performance', /\b(wasm|webassembly|web workers?|webgpu)\b/i, 'strong', ['arena', 'this-site'], 'Rust→WASM engine with no JS glue; WebGPU LLM on this site'),
  R('Data visualisation', /\b(d3|charting|data visuali[sz]ation|dashboards?)\b/i, 'adjacent', ['fo-wrapped', 'this-site'], 'Story-card analytics in F&O Wrapped; live order-book heatmap on this site'),
  R('Startup / ownership', /\b(founding|early[- ]stage|startup|0 ?(→|to) ?1|ownership|end[- ]to[- ]end|full[- ]stack|generalist)\b/i, 'strong', ['arena', 'fo-wrapped', 'zeus'], 'Ships whole products alone (spec → engine → UI → CI → deploy); led a team of 4'),
  // Honest gaps: shown with the nearest adjacent evidence.
  R('C++', /\bc\+\+|\bcpp\b/i, 'gap', ['arena'], 'No public C++. Closest: systems-level, allocation-aware Rust in Arena'),
  R('Java / JVM', /\bjava\b(?!script)|\bkotlin\b|\bjvm\b/i, 'gap', [], 'No public Java. Works in TypeScript, Python and Rust'),
  R('Go', /\bgolang\b|\bgo\b(?= ?(lang|developer|engineer|services|backend|,|\/))/i, 'gap', [], 'No public Go. Comparable backend work in Python and TypeScript'),
  R('Kafka / message queues', /\b(kafka|rabbitmq|kinesis|nats|message (queue|bus)|event[- ]driven)\b/i, 'gap', ['live-orderbook-feed'], 'No Kafka in public repos. Closest: sequenced fan-out with backpressure'),
  R('Kubernetes', /\b(kubernetes|k8s|helm)\b/i, 'gap', ['recruiter-backend'], 'No public Kubernetes. Closest: Docker images with CI smoke tests'),
  R('Model training / deep learning research', /\b(pytorch|tensorflow|jax|fine[- ]tun(e|ing)|training models?|deep learning|research scientist)\b/i, 'gap', ['this-site'], 'Applied LLM engineering, not model training'),
  R('Blockchain / web3', /\b(blockchain|web3|solidity|ethereum|smart contracts?|defi|crypto)\b/i, 'gap', [], 'Not a focus of his public work'),
];

export interface FitLine {
  label: string;
  strength: Strength;
  evidence: string[];
  note: string;
}

export interface FitResult {
  lines: FitLine[];
  coverage: number;
  verdict: string;
  yearsAsked: number | null;
  yearsHave: number;
}

export function fitCheck(jd: string): FitResult {
  const lines: FitLine[] = REQUIREMENTS.filter((r) => r.re.test(jd)).map(({ label, strength, evidence, note }) => ({ label, strength, evidence, note }));
  const order: Record<Strength, number> = { strong: 0, adjacent: 1, gap: 2 };
  lines.sort((a, b) => order[a.strength] - order[b.strength]);

  const weight: Record<Strength, number> = { strong: 1, adjacent: 0.5, gap: 0 };
  const coverage = lines.length ? Math.round((100 * lines.reduce((s, l) => s + weight[l.strength], 0)) / lines.length) : 0;

  const yearsMatch = [...jd.matchAll(/(\d{1,2})\s*\+?\s*(?:-\s*\d{1,2}\s*)?(?:years?|yrs?)/gi)].map((m) => Number(m[1]));
  const yearsAsked = yearsMatch.length ? Math.min(...yearsMatch) : null;
  const yearsHave = yearsExperience();

  let verdict: string;
  if (lines.length === 0) verdict = 'No recognisable requirements found. Try pasting the full job description.';
  else if (coverage >= 75) verdict = 'Strong evidence for most of what this role asks for.';
  else if (coverage >= 50) verdict = 'Solid overlap, with a few gaps worth discussing.';
  else verdict = 'Partial overlap. The gaps below are real, so worth a conversation before deciding.';

  return { lines, coverage, verdict, yearsAsked, yearsHave };
}
