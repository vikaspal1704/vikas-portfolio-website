import { describe, expect, it } from 'vitest';
import { search, looksLikeJobDescription, MIN_SCORE } from './retrieve';
import { fitCheck } from './fit';
import { docs } from './kb';
import { evidenceRef } from '../data/profile';

const top = (q: string) => search(q)[0];

describe('retrieval', () => {
  it.each([
    ['Why should we hire him?', 'why-hire'],
    ['What GenAI / LLM work has he done?', 'ai'],
    ['tell me about low latency and p99', 'latency'],
    ['how can I email him', 'contact'],
    ['where is he based, timezone?', 'location'],
    ['what degree does he have', 'education'],
    ['salary expectations', 'compensation'],
    ['FIX protocol experience', 'project:fix-lab'],
    ['Does he know Kafka or Kubernetes?', 'gaps'],
    ['How does this site’s AI work?', 'site-ai'],
    ['Give me the 60-second brief', 'brief'],
  ])('%s → %s', (q, id) => {
    const hit = top(q);
    expect(hit?.doc.id).toBe(id);
    expect(hit!.score).toBeGreaterThan(MIN_SCORE);
  });

  it('returns nothing confident for unrelated questions', () => {
    const hit = top('recipe for banana bread');
    expect(!hit || hit.score < MIN_SCORE).toBe(true);
  });

  it('every cited ref resolves', () => {
    for (const d of docs) for (const r of d.refs) expect(evidenceRef(r), `${d.id} → ${r}`).not.toBeNull();
  });
});

describe('job description detection', () => {
  it('detects a JD', () => {
    expect(looksLikeJobDescription('About the role: you will build low-latency trading systems. Requirements: 3+ years of Python, experience with market data and WebSockets.')).toBe(true);
  });
  it('does not treat a question as a JD', () => {
    expect(looksLikeJobDescription('Does he know Rust?')).toBe(false);
  });
});

describe('fit check', () => {
  const jd = `We are looking for a Senior Software Engineer, Trading Infrastructure. You will build low-latency
  order management and market data services in Rust and Python. Requirements: 4+ years experience, Kafka,
  Kubernetes, strong testing culture, experience with FIX protocol sessions. Nice to have: C++ and LLM tooling.`;
  const r = fitCheck(jd);
  const by = (l: string) => r.lines.find((x) => x.label === l);

  it('finds strengths with evidence', () => {
    expect(by('Low latency / performance')?.strength).toBe('strong');
    expect(by('FIX protocol')?.strength).toBe('strong');
    expect(by('Rust')?.strength).toBe('strong');
    expect(by('LLMs / generative AI')?.strength).toBe('strong');
  });
  it('reports gaps honestly', () => {
    expect(by('Kafka')?.strength).toBe('adjacent');
    expect(by('Kubernetes')?.strength).toBe('adjacent');
    expect(by('C++')?.strength).toBe('gap');
  });
  it('orders strong → adjacent → gap and computes coverage', () => {
    const order = r.lines.map((l) => l.strength);
    expect(order).toEqual([...order].sort((a, b) => ['strong', 'adjacent', 'gap'].indexOf(a) - ['strong', 'adjacent', 'gap'].indexOf(b)));
    expect(r.coverage).toBeGreaterThan(50);
    expect(r.coverage).toBeLessThan(100);
    expect(r.yearsAsked).toBe(4);
    expect(by('Reliability / production ops')).toBeUndefined();
  });
  it('does not confuse JavaScript with Java', () => {
    expect(fitCheck('Strong JavaScript skills').lines.some((l) => l.label === 'Java / JVM')).toBe(false);
  });
});

describe('production record', () => {
  it('surfaces LLM cost work', () => {
    expect(top('Has he reduced LLM costs?')?.doc.id).toBe('ai');
    expect(fitCheck('Experience optimizing LLM inference cost and semantic caching').lines.find((l) => l.label === 'LLM cost / performance')?.strength).toBe('strong');
  });
  it('answers leadership questions', () => {
    expect(top('Has he led a team?')?.doc.id).toBe('leadership');
  });
  it('a senior title alone is not leadership evidence', () => {
    expect(fitCheck('Senior Software Engineer, Python').lines.some((l) => l.label === 'Leadership / mentoring')).toBe(false);
  });
  it('knows his education', () => {
    expect(top('what degree does he have')?.doc.answer).toContain('Gujarat Technological University');
  });
});

describe('platform lead', () => {
  it('answers ViewTrade questions from the role or the platform entry', () => {
    expect(['role:viewtrade', 'platform']).toContain(search('What does he do at ViewTrade?')[0]?.doc.id);
  });
  it('answers platform questions from the ViewTrade role', () => {
    expect(search('Tell me about the frontend platform he built')[0]?.doc.id).toBe('platform');
    expect(fitCheck('Own our multi-tenant white-label front-end platform').lines.find((l) => l.label === 'Platform / front-end architecture')?.strength).toBe('strong');
  });
});

describe('cloud and .NET', () => {
  it('credits AWS and .NET from roles', () => {
    const r = fitCheck('Backend engineer: C# / .NET services on AWS (Lambda, SQS, DynamoDB), event-driven microservices.');
    const by = (l: string) => r.lines.find((x) => x.label === l)?.strength;
    expect(by('.NET / C#')).toBe('strong');
    expect(by('AWS / cloud')).toBe('strong');
    expect(by('Message queues / event streaming')).toBe('strong');
  });
  it('does not read Next.js as .NET', () => {
    expect(fitCheck('Experience with Next.js').lines.some((l) => l.label === '.NET / C#')).toBe(false);
  });
  it('answers AWS questions', () => {
    expect(search('Does he know AWS?')[0]?.doc.id).toBe('cloud');
  });
  it('no longer advertises a target role', () => {
    expect(docs.some((d) => d.id === 'looking-for')).toBe(false);
    expect(search('Is he open to relocating abroad?')[0]?.doc.id).toBe('location');
  });
});

describe('latest facts', () => {
  it('uses the official title and the platform metrics', () => {
    const role = docs.find((d) => d.id === 'role:viewtrade')!;
    expect(role.title).toContain('Software Development Engineer I');
    expect(role.title).not.toContain('Lead');
    expect(search('Tell me about the frontend platform he built')[0]?.doc.answer).toContain('300+');
  });
  it('offers the calendar link for contact', () => {
    expect(search('how can I schedule a call')[0]?.doc.answer).toContain('calendly.com/palv499/30min');
  });
});
