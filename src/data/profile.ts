/**
 * Single source of truth for everything the site and its AI say about Vikas.
 *
 * Rule: only facts that can be backed by a repo, a live demo or Vikas himself.
 * Unknown values are `null`; the UI hides them and the AI says they aren't listed
 * rather than guessing. Fields marked TODO(vikas) are waiting on his input.
 */

export interface Link {
  label: string;
  href: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  /** Ticker-style symbol shown on the instrument tile. */
  symbol: string;
  name: string;
  tagline: string;
  /** Search-result title for the project page, under ~48 chars so " · Vikas Pal" still fits in 60. */
  seoTitle?: string;
  summary: string;
  /** Why a hiring manager should care, in one line. */
  signal: string;
  stats: Stat[];
  stack: string[];
  tags: string[];
  live: string | null;
  code: string;
  /** Can the live demo be shown inline in an iframe? */
  embeddable: boolean;
  featured?: boolean;
  highlights: string[];
}

export interface Role {
  id: string;
  company: string;
  companyUrl: string | null;
  title: string;
  /** Display labels, e.g. "Aug 2025"; `end` null means present. */
  start: string;
  end: string | null;
  location: string | null;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface Skill {
  name: string;
  /** Evidence: project ids or role ids where this skill is demonstrated. */
  evidence: string[];
  group: 'Trading systems' | 'Backend' | 'Frontend' | 'AI / LLM' | 'Infra & quality';
}

export const profile = {
  name: 'Vikas Pal',
  handle: 'vikaspal1704',
  headline: 'Software Engineer, Applied AI × Fintech',
  /** The role he is looking for; printed next to the headline. Never his job title. */
  openTo: 'Open to Forward Deployed and Applied AI roles, remote/global',
  pitch:
    'I took a white-label trading platform from idea to product at ViewTrade (it merged 7 frontends into one and serves 300+ advisory and retail clients), I build it with AI agents (Claude Code) from clear specs and tests, and I ship AI platforms that stay up when traffic and token bills spike. Off the clock, I build matching engines, market-data feeds and FIX sessions.',
  location: 'Ahmedabad, Gujarat, India (IST, UTC+5:30)',
  city: 'Ahmedabad',
  region: 'Gujarat',
  country: 'India',
  /** Canonical public URL of this site. */
  siteUrl: 'https://vikaspal.is-a.dev/',
  // TODO(vikas): square headshot, ≥800×800, saved as public/vikas-pal.jpg; then set this to 'vikas-pal.jpg'.
  photo: null as string | null,
  // Search Console / Bing verification codes (the content="…" value only). Emitted as meta tags when set.
  googleSiteVerification: null as string | null,
  bingSiteVerification: null as string | null,
  remote: 'Open to remote, hybrid or on-site roles anywhere in the world, including relocation',
  email: 'palv499@gmail.com',
  links: {
    github: 'https://github.com/vikaspal1704',
    linkedin: 'https://www.linkedin.com/in/vikaspal1704/',
  },
  /** Built from resume/resume.html; see README. */
  resumeUrl: 'vikas-pal-resume.pdf' as string | null,
  calendarUrl: 'https://cal.com/vikas-pal-2mz8du' as string | null,
  education: 'B.E. in Computer Engineering, LDRP Institute of Technology & Research (Gujarat Technological University), 2019–2023' as string | null,
  /** First full-time role (Zeus Learning, June 2023); internships from Jul 2022 listed separately. */
  careerStart: { year: 2023, month: 6 },
  /** Outcomes already delivered; shown opposite the skills in the order book. */
  outcomes: [
    { metric: '7 → 1', label: 'Frontend codebases merged into ViewTrade’s white-label trading platform' },
    { metric: '300+', label: 'Advisory and retail clients served by that platform' },
    { metric: '99.9%', label: 'Uptime under peak at ~50,000 requests/day (Zeus Learning)' },
    { metric: '−40%', label: 'LLM costs, via semantic caching, with no model change' },
    { metric: '~50%', label: 'Faster deploys after setting up CI/CD with DevOps' },
    { metric: '4 devs', label: 'Led to ship a reporting SDK under hard client deadlines' },
    { metric: '~2M/s', label: 'Commands handled in the browser by his Rust engine (Arena, WebAssembly)' },
  ],
  workingStyle: [
    'Production first: services that stay up under peak, with uptime, cost and deploy speed treated as features (99.9% uptime, ~40% LLM cost cut, ~50% faster deploys at Zeus Learning).',
    'Docs first: every flagship repo starts with a PRD, TRD, API contract, acceptance criteria and an AGENT_BRIEF so humans and AI coding agents can build without guessing.',
    'Correctness is proven, not claimed: differential tests against a reference engine, golden vectors, Playwright end-to-end tests and live smoke tests in CI.',
    'Measure before optimising: in Arena, profiling showed page faults, not matching logic, caused the latency tail, and preallocating fixed it.',
    'Owns things end to end: took ViewTrade’s white-label trading platform from idea to product and built it full-stack, and now guides the global team building on it; earlier, led 4 developers to deliver an SDK under hard deadlines.',
  ],
};

/**
 * Short, quotable answers. Rendered in the Brief section, in the static HTML that
 * crawlers and AI answer engines read, and used by the analyst.
 */
export const faqs: { q: string; a: string }[] = [
  {
    q: 'Who is Vikas Pal?',
    a: 'Vikas Pal is a software engineer working across applied AI and fintech, based in Ahmedabad, India. He is a Software Development Engineer (SDE) at ViewTrade, where he took a white-label trading platform from idea to product and built it full-stack; it merged 7 frontend codebases into one and serves 300+ advisory and retail clients. He also built the developer portal that makes onboarding smooth for broker firms. He is open to Forward Deployed Engineer and Applied AI roles.',
  },
  {
    q: 'What AI work has Vikas Pal shipped?',
    a: 'At Zeus Learning he ran an AI-powered test platform at ~50,000 requests a day with 99.9% uptime, and built semantic caching that cut LLM costs about 40%. He also built an LLM résumé-parsing and semantic-search service, and this site runs an open-source LLM in the visitor’s browser.',
  },
  {
    q: 'What is Arena?',
    a: 'Arena is Vikas Pal’s open-source stock exchange in the browser: a dependency-free Rust matching engine compiled to WebAssembly that handles about 2 million commands a second in the browser, with deterministic replay and an L2 market-data feed with gap recovery.',
  },
  {
    q: 'Where is Vikas Pal based, and is he open to relocation?',
    a: 'He is based in Ahmedabad, India (IST), and is open to remote, hybrid or on-site roles anywhere in the world, including relocation.',
  },
  {
    q: 'How do I contact Vikas Pal?',
    a: 'Book a call at cal.com/vikas-pal-2mz8du, or email palv499@gmail.com.',
  },
];

export const roles: Role[] = [
  {
    id: 'viewtrade',
    company: 'ViewTrade Holding Corp.',
    companyUrl: 'https://viewtrade.com',
    title: 'Software Development Engineer (SDE)',
    start: 'Aug 2025',
    end: null,
    location: 'GIFT City, Gandhinagar',
    summary:
      'Building a white-label trading platform that lets broker firms launch their own branded apps, using Claude Code and agentic workflows throughout.',
    highlights: [
      'Took a white-label trading platform from idea to product: broker firms design their own web and mobile trading apps from widgets, branding and feature flags; it merged 7 frontends into one and serves 300+ advisory and retail clients',
      'Own it end to end: shaped the product and built it full-stack, and now guide the global team building on it',
      'Brought AI-first development to the team: Claude Code and other agents build from clear specs and repo guardrails, and new features start from written scenarios and failing tests to protect money logic',
      'Created the developer portal (API and Web SDK docs and onboarding guides) that makes onboarding smooth for broker firms integrating with the platform',
      'Built core trading features: a multi-leg options strategy builder with payoff charts and Greeks, order tickets, stock, ETF and funds screens, and live prices that recover after a reconnect',
      'Sole developer modernizing the .NET/C# buying-power and cash-settlement system, with AI agents helping read, refactor and test a large legacy codebase safely',
    ],
    stack: ['.NET / C#', 'TypeScript', 'React', 'WebSockets', 'AWS', 'Claude Code', 'AI agents'],
  },
  {
    id: 'zeus',
    company: 'Zeus Learning',
    companyUrl: 'https://zeuslearning.com',
    title: 'Software Developer',
    start: 'Jun 2023',
    end: 'Jul 2025',
    location: 'Mumbai',
    summary: 'Built an AI-powered test platform on Next.js and Python/Django, and ran it in production at scale.',
    highlights: [
      '~50,000 requests a day at 99.9% uptime under peak',
      'Semantic caching that cut LLM costs ~40% without changing the model family',
      'Led 4 developers to deliver a reporting SDK under hard client deadlines',
      'Set up CI/CD with DevOps that made deploys ~50% faster; modular patterns cut debugging time ~20%',
    ],
    stack: ['Next.js', 'Python', 'Django', '.NET', 'AWS', 'LLMs', 'Semantic caching', 'CI/CD'],
  },
  {
    id: 'zeus-intern',
    company: 'Zeus Learning',
    companyUrl: 'https://zeuslearning.com',
    title: 'Software Developer Intern',
    start: 'Jan 2023',
    end: 'May 2023',
    location: 'Mumbai',
    summary: 'Joined the AI-powered test platform team as an intern and converted to a full-time Software Developer in June 2023.',
    highlights: [],
    stack: ['Python', 'Django', 'Next.js'],
  },
  {
    id: 'culturex',
    company: 'CultureX Entertainment',
    companyUrl: null,
    title: 'Full Stack Developer Intern',
    start: 'Jul 2022',
    end: 'Dec 2022',
    location: null,
    summary: 'Designed and built web pages and features for CreatorX’s own product in a team of 4 developers.',
    highlights: ['Shipped product features on a team of 4', 'Code reviews: finding and fixing bugs before release'],
    stack: ['JavaScript', 'AWS'],
  },
];

export const projects: Project[] = [
  {
    id: 'arena',
    symbol: 'ARENA',
    name: 'Arena',
    tagline: 'A stock exchange you can play, replay and audit in your browser.',
    seoTitle: 'Arena: Rust Matching Engine in WebAssembly',
    summary:
      'A matching engine written in Rust with no dependencies and compiled to a WebAssembly module under 90 KB with no JS glue. It runs a market of seeded bots, a lossy L2 feed with gap recovery, and a journal you can rewind and verify. This page is running that same engine right now.',
    signal: 'Exchange-grade matching with real latency numbers and proven determinism.',
    stats: [
      { label: 'in browser', value: '~2M cmds/s' },
      { label: 'native p50', value: '220–320 ns' },
      { label: 'native p99', value: '0.9–1.3 µs' },
      { label: 'diff-tested', value: '1.5M cmds' },
    ],
    stack: ['Rust', 'WebAssembly', 'TypeScript', 'React', 'Web Workers', 'Vitest', 'Playwright'],
    tags: ['matching engine', 'low latency', 'rust', 'wasm', 'determinism', 'market data', 'trading', 'performance'],
    live: 'https://vikaspal1704.github.io/arena/',
    code: 'https://github.com/vikaspal1704/arena',
    embeddable: true,
    featured: true,
    highlights: [
      'Price-time priority matching; orders stored in a dense Vec so id lookup is O(1) without hashing',
      'Differential-tested in CI against an independent Python engine on 1.5 million random commands',
      'Journal + FNV-1a fingerprint chain: rewind to any point and verify the replay matches what happened live',
      'Chaos switch drops market-data packets; the client detects gaps and heals from snapshots',
      'Measure before optimising: in Arena, profiling showed page faults, not matching logic, caused the latency tail, and preallocating fixed it.',
      'Real-market mode streams live NIFTY futures through a local Kite Connect bridge',
    ],
  },
  {
    id: 'fo-wrapped',
    symbol: 'FOWRAP',
    name: 'F&O Wrapped',
    tagline: 'Your F&O trading year, Wrapped, with honest numbers.',
    seoTitle: 'F&O Wrapped: Your F&O Trading Year, Wrapped',
    summary:
      'Indian F&O traders drop in a broker trade file and get shareable story cards about their year. Parsing, FIFO round-trip matching and analytics run in a Web Worker, and no data leaves the device.',
    signal: 'Consumer fintech product thinking: privacy by architecture and numbers you can audit.',
    stats: [
      { label: 'brokers', value: '4' },
      { label: 'insight cards', value: '14' },
      { label: 'languages', value: 'EN · हिंदी' },
      { label: 'server', value: 'none' },
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Web Worker', 'Zod', 'PWA'],
    tags: ['fintech', 'analytics', 'privacy', 'product', 'pnl', 'india', 'retail trading', 'frontend'],
    live: 'https://vikaspal1704.github.io/fo-wrapped/',
    code: 'https://github.com/vikaspal1704/fo-wrapped',
    embeddable: true,
    highlights: [
      'Zerodha, Angel One, Upstox and Dhan parsers, each written only against a real export layout',
      'FIFO round trips with integer-paise arithmetic and IST timestamps',
      'Charges come from the broker’s file when available, otherwise from a versioned rate table and labelled “estimated”',
      'Works offline as an installable PWA, in English and Hindi',
    ],
  },
  {
    id: 'fix-lab',
    symbol: 'FIXLAB',
    name: 'FIX Protocol Lab',
    tagline: 'See FIX working live, one message at a time.',
    seoTitle: 'FIX Protocol Lab: Live FIX Session Visualiser',
    summary:
      'A FIX tag=value codec and a TCP session engine built from scratch, with a visual front end. Watch two counterparties log on, trade, lose a message and recover it, across FIX 4.2, 4.3, 4.4 and 5.0 SP2.',
    signal: 'Knows the wire protocols institutional trading actually runs on.',
    stats: [
      { label: 'FIX versions', value: '4' },
      { label: 'session msgs', value: '7 types' },
      { label: 'transport', value: 'raw TCP' },
      { label: 'e2e', value: 'Playwright' },
    ],
    stack: ['Node.js 22', 'TypeScript', 'React 19', 'Redux Toolkit', 'Tailwind v4', 'WebSockets'],
    tags: ['fix protocol', 'tcp', 'session layer', 'networking', 'trading', 'oms', 'protocols'],
    live: 'https://fix-protocol-lab.onrender.com/?scenario=gap-recovery',
    code: 'https://github.com/vikaspal1704/fix-protocol-lab',
    embeddable: false,
    highlights: [
      'Logon, Heartbeat, TestRequest, ResendRequest, SequenceReset/GapFill, Reject and Logout with gap recovery',
      'Streaming framer with BodyLength and CheckSum validation',
      'Every FIX version is a plug-in profile with golden test vectors',
      'Live smoke test checks the deployed instance in CI',
    ],
  },
  {
    id: 'recruiter-backend',
    symbol: 'RCRT',
    name: 'Recruiter Backend',
    tagline: 'Semantic talent search: resume in, ranked candidates out.',
    seoTitle: 'Recruiter Backend: Semantic Talent Search API',
    summary:
      'A FastAPI service that ingests PDF resumes, extracts structured profiles with an LLM in JSON mode, embeds them in Pinecone for semantic search, and sends outreach. Every route is authenticated, and the tests are fully mocked in CI.',
    signal: 'Production-shaped LLM backend: RAG retrieval, auth, tests, Docker.',
    stats: [
      { label: 'pipeline', value: 'PDF→LLM→vec' },
      { label: 'auth', value: 'API key / JWT' },
      { label: 'tests', value: 'offline, mocked' },
      { label: 'deploy', value: 'Docker' },
    ],
    stack: ['Python', 'FastAPI', 'OpenAI', 'Pinecone', 'Supabase', 'SendGrid', 'pytest', 'Docker'],
    tags: ['ai', 'llm', 'rag', 'embeddings', 'vector search', 'backend', 'python', 'api'],
    live: null,
    code: 'https://github.com/vikaspal1704/recruiter-backend',
    embeddable: false,
    highlights: [
      'LLM resume parsing into a typed candidate profile, upserted to Pinecone',
      'Semantic search endpoint over embeddings',
      'Auth modes: API key or Supabase Bearer; “off” is refused in production',
      'CI runs the suite, a secret-hygiene check, and a Docker build with a health smoke test',
    ],
  },
  {
    id: 'live-orderbook-feed',
    symbol: 'LOBF',
    name: 'Live Orderbook Feed',
    tagline: 'Real-time L2 book over WebSockets: snapshot plus deltas.',
    seoTitle: 'Live Orderbook Feed: L2 Book over WebSockets',
    summary:
      'A WebSocket fan-out service for an L2 order book: sequence numbers, snapshot plus incremental protocol, heartbeats, reconnect recovery and slow-consumer backpressure.',
    signal: 'The market-data side of an exchange, done properly.',
    stats: [
      { label: 'protocol', value: 'snap + Δ' },
      { label: 'ordering', value: 'seq numbers' },
      { label: 'safety', value: 'backpressure' },
      { label: 'tests', value: 'pytest-asyncio' },
    ],
    stack: ['Python', 'FastAPI', 'WebSockets', 'asyncio', 'pytest'],
    tags: ['market data', 'websockets', 'fan-out', 'backpressure', 'real-time', 'python', 'distributed systems'],
    live: null,
    code: 'https://github.com/vikaspal1704/live-orderbook-feed',
    embeddable: false,
    highlights: [
      'Snapshot + incremental deltas with sequence numbers so clients can detect gaps',
      'Heartbeats and reconnect recovery',
      'Slow-consumer handling so one bad client can’t stall the fan-out',
    ],
  },
  {
    id: 'mini-matching-engine',
    symbol: 'MME',
    name: 'Mini Matching Engine',
    tagline: 'The reference CLOB: price-time priority, in Python.',
    seoTitle: 'Mini Matching Engine: Python CLOB Reference',
    summary:
      'An in-memory central limit order book that serves as the reference implementation Arena is differential-tested against. Its playground runs the real Python package in the browser through Pyodide.',
    signal: 'Spec-driven engineering: a written contract that both humans and AI agents build against.',
    stats: [
      { label: 'priority', value: 'price-time' },
      { label: 'runtime', value: 'Pyodide' },
      { label: 'spec', value: '7 docs' },
      { label: 'role', value: 'reference' },
    ],
    stack: ['Python 3.11', 'pytest', 'Pyodide', 'GitHub Actions'],
    tags: ['matching engine', 'clob', 'python', 'spec', 'agents', 'trading'],
    live: 'https://vikaspal1704.github.io/mini-matching-engine/',
    code: 'https://github.com/vikaspal1704/mini-matching-engine',
    embeddable: true,
    highlights: [
      'PRD, TRD, API contract, architecture, acceptance criteria, test plan and an AGENT_BRIEF for AI coding agents',
      'Trades execute at the resting order’s price; the book is never left crossed',
    ],
  },
  {
    id: 'smpa',
    symbol: 'SMPA',
    name: 'Social Media Performance Analysis',
    tagline: 'An LLM analytics pipeline over engagement data.',
    seoTitle: 'Social Media Analysis: LLM Analytics Pipeline',
    summary: 'Langflow orchestration with GPT over a DataStax Astra DB vector store, analysing social-media engagement data.',
    signal: 'Early, hands-on LLM pipeline work.',
    stats: [
      { label: 'orchestration', value: 'Langflow' },
      { label: 'store', value: 'Astra DB' },
    ],
    stack: ['Langflow', 'GPT', 'Astra DB'],
    tags: ['ai', 'llm', 'langflow', 'vector db', 'analytics'],
    live: null,
    code: 'https://github.com/vikaspal1704/Social-Media-performance-analysis',
    embeddable: false,
    highlights: ['Langflow pipeline with GPT over Astra DB'],
  },
  {
    id: 'this-site',
    symbol: 'LIVE',
    name: 'This site',
    tagline: 'A portfolio that runs an exchange and an LLM on your device.',
    summary:
      'Arena’s Rust engine runs in a Web Worker to drive the hero. The analyst answers from a retrieval index over this page’s own data, and it can optionally boot an open-source LLM on your GPU with WebLLM. There is no server, no API key and no tracking.',
    signal: 'AI-native by construction: on-device inference, grounded answers, zero cost to run.',
    stats: [
      { label: 'LLM', value: 'on your GPU' },
      { label: 'server', value: 'none' },
      { label: 'engine', value: 'Rust→WASM' },
      { label: 'cost', value: '$0' },
    ],
    stack: ['React', 'TypeScript', 'WebLLM', 'WebGPU', 'WebAssembly', 'BM25 retrieval'],
    tags: ['ai', 'llm', 'webgpu', 'on-device', 'rag', 'retrieval', 'wasm', 'frontend'],
    live: null,
    code: 'https://github.com/vikaspal1704/vikas-portfolio-website',
    embeddable: false,
    highlights: [
      'Grounded answers: every reply cites the project or role it came from',
      'Job-description fit check maps each requirement to evidence, and says so when there isn’t any',
      'The local LLM is loaded only when you ask for it, and nothing leaves the browser',
    ],
  },
];

export const skills: Skill[] = [
  { name: 'Matching engines / CLOB', group: 'Trading systems', evidence: ['arena', 'mini-matching-engine'] },
  { name: 'Market data (L2, snapshot + Δ)', group: 'Trading systems', evidence: ['live-orderbook-feed', 'arena', 'viewtrade'] },
  { name: 'FIX protocol', group: 'Trading systems', evidence: ['fix-lab'] },
  { name: 'P&L, charges, FIFO', group: 'Trading systems', evidence: ['fo-wrapped', 'arena'] },
  { name: 'Low-latency / perf', group: 'Trading systems', evidence: ['arena'] },
  { name: 'Rust', group: 'Backend', evidence: ['arena'] },
  { name: 'Python', group: 'Backend', evidence: ['recruiter-backend', 'live-orderbook-feed', 'mini-matching-engine', 'zeus'] },
  { name: 'TypeScript / Node.js', group: 'Backend', evidence: ['fix-lab', 'arena', 'fo-wrapped', 'viewtrade'] },
  { name: '.NET (C#)', group: 'Backend', evidence: ['viewtrade', 'zeus'] },
  { name: 'Django / FastAPI', group: 'Backend', evidence: ['zeus', 'recruiter-backend', 'live-orderbook-feed'] },
  { name: 'Distributed systems', group: 'Backend', evidence: ['viewtrade', 'zeus', 'live-orderbook-feed', 'fix-lab'] },
  { name: 'Queues & streams (SQS, SNS, Kinesis)', group: 'Backend', evidence: ['viewtrade', 'zeus', 'culturex'] },
  { name: 'WebSockets / TCP', group: 'Backend', evidence: ['live-orderbook-feed', 'fix-lab', 'viewtrade'] },
  { name: 'PostgreSQL / Supabase', group: 'Backend', evidence: ['recruiter-backend'] },
  { name: 'React', group: 'Frontend', evidence: ['zeus', 'fix-lab', 'arena', 'fo-wrapped'] },
  { name: 'Redux Toolkit', group: 'Frontend', evidence: ['fix-lab'] },
  { name: 'Next.js', group: 'Frontend', evidence: ['zeus'] },
  { name: 'Front-end platform architecture', group: 'Frontend', evidence: ['viewtrade'] },
  { name: 'WebAssembly / Workers', group: 'Frontend', evidence: ['arena', 'fo-wrapped', 'this-site'] },
  { name: 'Production LLM platforms', group: 'AI / LLM', evidence: ['zeus', 'recruiter-backend', 'smpa'] },
  { name: 'LLM cost (semantic caching)', group: 'AI / LLM', evidence: ['zeus'] },
  { name: 'RAG / vector search', group: 'AI / LLM', evidence: ['recruiter-backend', 'smpa', 'this-site'] },
  { name: 'On-device LLM (WebLLM)', group: 'AI / LLM', evidence: ['this-site'] },
  { name: 'Agent-ready specs', group: 'AI / LLM', evidence: ['mini-matching-engine', 'live-orderbook-feed', 'arena'] },
  { name: 'Testing (diff, e2e, golden)', group: 'Infra & quality', evidence: ['arena', 'fix-lab', 'recruiter-backend'] },
  { name: 'Docker / CI/CD', group: 'Infra & quality', evidence: ['recruiter-backend', 'zeus', 'fix-lab'] },
  { name: 'Reliability (99.9% uptime)', group: 'Infra & quality', evidence: ['zeus', 'viewtrade'] },
  { name: 'AWS (EC2, ECS/EKS, Lambda, S3, RDS, DynamoDB)', group: 'Infra & quality', evidence: ['viewtrade', 'zeus', 'culturex'] },
];

/** Whole years of full-time engineering experience. */
export const yearsExperience = (now = new Date()) =>
  Math.floor((now.getFullYear() * 12 + now.getMonth() + 1 - (profile.careerStart.year * 12 + profile.careerStart.month)) / 12);

/** Lookup for evidence ids → display name + link. */
export function evidenceRef(id: string): { name: string; href: string } | null {
  const p = projects.find((x) => x.id === id);
  if (p) return { name: p.name, href: p.live ?? p.code };
  const r = roles.find((x) => x.id === id);
  if (r) return { name: `${r.title}, ${r.company}`, href: r.companyUrl ?? profile.links.linkedin };
  return null;
}
