import { useEffect, useMemo, useState } from 'react';
import { evidenceRef, profile, projects, roles, skills, yearsExperience, type Project } from '../data/profile';

/** Adds `.in` to `.reveal` elements as they scroll into view. */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function Brief({ onAsk }: { onAsk: (q: string) => void }) {
  return (
    <section className="block" id="brief" aria-labelledby="brief-h">
      <div className="wrap">
        <div className="eyebrow reveal">01 · The 60-second brief</div>
        <h2 className="h2 reveal" id="brief-h">
          Production AI and markets infra, <em>proven.</em>
        </h2>
        <p className="lede reveal">If you only have a minute, read this.</p>
        <div className="brief reveal">
          <div>
            <h3>Now</h3>
            <p className="kpi mono">{yearsExperience()}+ yrs</p>
            <ul>
              <li>
                <strong style={{ color: 'var(--text)', fontWeight: 500 }}>SDE at ViewTrade</strong>: created and leads its unified front-end platform: 7 frontends merged into one, serving 300+ advisory and retail clients
              </li>
              <li>Zeus Learning: a production AI platform with 99.9% uptime and ~40% lower LLM costs, and led a team of 4</li>
              <li>BE Computer Science, GTU (2023)</li>
            </ul>
          </div>
          <div>
            <h3>Proof</h3>
            <p className="kpi mono up">2M/s</p>
            <ul>
              <li>Rust matching engine, p50 ≈ 350 ns, diff-tested on 1.5M commands</li>
              <li>FIX 4.2–5.0 SP2 session engine, L2 feed with gap recovery</li>
              <li>Distributed systems on .NET and AWS (EC2, ECS/EKS, Lambda, SQS, Kinesis)</li>
              <li>An on-device LLM on this page, at zero cost to run</li>
            </ul>
          </div>
          <div>
            <h3>Impact</h3>
            <p className="kpi mono ai">−40%</p>
            <ul>
              <li>LLM costs cut by semantic caching, in production</li>
              <li>99.9% uptime at ~50,000 requests a day</li>
              <li>~50% faster deploys after setting up CI/CD</li>
              <li>Open to remote, hybrid or on-site roles anywhere in the world</li>
            </ul>
          </div>
        </div>
        <div className="chips reveal" style={{ marginTop: 20 }}>
          <button className="chip jd" onClick={() => onAsk('')}>✦ Paste a job description: check the fit</button>
          <button className="chip" onClick={() => onAsk('Why hire Vikas?')}>Why hire Vikas?</button>
          <a className="chip" href={`mailto:${profile.email}`} style={{ textDecoration: 'none' }}>✉ {profile.email}</a>
          {profile.calendarUrl && (
            <a className="chip" href={profile.calendarUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>📅 Book a 30-min call</a>
          )}
        </div>
      </div>
    </section>
  );
}

function Instrument({ p, onAsk }: { p: Project; onAsk: (q: string) => void }) {
  const [embed, setEmbed] = useState(false);
  return (
    <article className={`inst reveal${p.featured ? ' featured' : ''}`} aria-labelledby={`p-${p.id}`}>
      <div className="inst-head">
        <span className="sym"><span className="tri up">▲</span>{p.symbol}</span>
        {p.live && <span className="mono up" style={{ fontSize: 11 }}>● LIVE</span>}
      </div>
      <h3 id={`p-${p.id}`}>{p.name}</h3>
      <p className="tag">{p.tagline}</p>
      <dl className="stats">
        {p.stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
      <p className="signal">{p.signal}</p>
      {p.featured && (
        <>
          <p className="muted" style={{ margin: 0, fontSize: 15 }}>{p.summary}</p>
          <ul className="hl">
            {p.highlights.slice(0, 4).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          {embed && p.live && (
            <div className="embed">
              <iframe src={p.live} title={`${p.name} live demo`} loading="lazy" />
            </div>
          )}
        </>
      )}
      <div className="stack">
        {p.stack.slice(0, p.featured ? 8 : 5).map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <div className="inst-actions">
        {p.featured && p.embeddable && p.live && (
          <button className="btn primary" onClick={() => setEmbed((v) => !v)}>{embed ? 'Hide demo' : '▶ Play it here'}</button>
        )}
        {p.live && (
          <a className={`btn${p.featured ? '' : ' primary'}`} href={p.live} target="_blank" rel="noreferrer">Live demo ↗</a>
        )}
        <a className="btn" href={p.code} target="_blank" rel="noreferrer">Code</a>
        <button className="btn ai-btn" onClick={() => onAsk(`Tell me about ${p.name}`)}>✦ Ask</button>
      </div>
    </article>
  );
}

export function Instruments({ onAsk }: { onAsk: (q: string) => void }) {
  return (
    <section className="block" id="work" aria-labelledby="work-h">
      <div className="wrap">
        <div className="eyebrow reveal">02 · Listed instruments</div>
        <h2 className="h2 reveal" id="work-h">
          Work you can <em>run</em>, not just read.
        </h2>
        <p className="lede reveal">Each project is open source and specified before it’s built, and most of them run live in the browser.</p>
        <div className="grid">
          {projects.map((p) => (
            <Instrument key={p.id} p={p} onAsk={onAsk} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkillBook({ onAsk }: { onAsk: (q: string) => void }) {
  const [openSkill, setOpenSkill] = useState<string | null>(null);
  const groups = useMemo(() => [...new Set(skills.map((s) => s.group))], []);
  const max = Math.max(...skills.map((s) => s.evidence.length));
  return (
    <section className="block" id="book" aria-labelledby="book-h">
      <div className="wrap">
        <div className="eyebrow reveal">03 · Order book</div>
        <h2 className="h2 reveal" id="book-h">
          What I bring, <em>what it delivered.</em>
        </h2>
        <p className="lede reveal">
          Bids are skills, sized by how many shipped projects or roles prove them. Click one to see the evidence. Asks are the outcomes those skills have already delivered.
        </p>
        <div className="book reveal">
          <div className="book-col">
            <div className="book-h"><span className="up">Bid · skill</span><span>evidence</span></div>
            {groups.map((g) => (
              <div key={g}>
                <div className="group-h">{g}</div>
                {skills
                  .filter((s) => s.group === g)
                  .map((s) => (
                    <div key={s.name}>
                      <button className="book-row" aria-expanded={openSkill === s.name} onClick={() => setOpenSkill(openSkill === s.name ? null : s.name)}>
                        <span className="bar" style={{ width: `${(s.evidence.length / max) * 100}%` }} />
                        <span>{s.name}</span>
                        <span className="q">{s.evidence.length}</span>
                      </button>
                      {openSkill === s.name && (
                        <div className="evidence">
                          {s.evidence.map((id) => {
                            const r = evidenceRef(id);
                            return r ? <a key={id} href={r.href} target="_blank" rel="noreferrer">↗ {r.name}</a> : null;
                          })}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <div className="book-col">
            <div className="book-h"><span>metric</span><span className="down">Ask · delivered</span></div>
            {profile.outcomes.map((o) => (
              <div className="book-row ask ask-row" key={o.label}>
                <span className="q" style={{ color: 'var(--text)', fontWeight: 600 }}>{o.metric}</span>
                <span style={{ textAlign: 'right' }}>{o.label}</span>
                <span className="bar" style={{ width: '100%' }} />
              </div>
            ))}
            <div className="group-h" style={{ color: 'var(--ask)' }}>Terms</div>
            <div className="book-row ask ask-row"><span className="q">where</span><span style={{ textAlign: 'right' }}>{profile.remote}</span></div>
            <div className="book-row ask ask-row"><span className="q">tz</span><span style={{ textAlign: 'right' }}>{profile.location}</span></div>
            <div className="book-row ask ask-row"><span className="q">style</span><span style={{ textAlign: 'right' }}>Docs-first, measured, tested, shipped</span></div>
          </div>
          <div className="spread">
            <span>SPREAD → 0</span>
            <button className="btn ai-btn" onClick={() => onAsk('')}>✦ Paste your JD to see if we cross</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 32-bit FNV-1a over a string, chained, the same idea as Arena's journal fingerprint. */
function fnv(prev: number, s: string): number {
  let h = (prev ^ 0x811c9dc5) >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

export function Ledger() {
  const entries = [...roles].reverse();
  let chain = 0;
  const rows = entries.map((r, i) => {
    chain = fnv(chain, `${i + 1}|${r.start}|${r.company}|${r.title}`);
    return { r, seq: i + 1, fp: chain.toString(16).padStart(8, '0') };
  });
  return (
    <section className="block" id="ledger" aria-labelledby="ledger-h">
      <div className="wrap">
        <div className="eyebrow reveal">04 · Journal</div>
        <h2 className="h2 reveal" id="ledger-h">
          The career, <em>as a journal.</em>
        </h2>
        <p className="lede reveal">Every entry is sequenced and fingerprinted, in the same way Arena journals every order.</p>
        <div className="ledger reveal">
          {rows
            .slice()
            .reverse()
            .map(({ r, seq, fp }) => (
              <div className="lrow" key={r.id}>
                <div className="seq">#{String(seq).padStart(4, '0')}<br />{fp}</div>
                <div className="when">{r.start} –<br />{r.end ?? 'now'}</div>
                <div>
                  <h3>
                    {r.title} ·{' '}
                    {r.companyUrl ? (
                      <a href={r.companyUrl} target="_blank" rel="noreferrer">{r.company} ↗</a>
                    ) : (
                      <span className="muted" style={{ fontWeight: 400 }}>{r.company}</span>
                    )}
                  </h3>
                  <p>{r.summary}</p>
                  <ul>
                    {r.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <div className="stack">
                    {r.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          <div className="lfoot">
            <span>{rows.length} entries · FNV-1a chain head {rows[rows.length - 1]?.fp}</span>
            <span className="ok">same scheme as Arena’s journal</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Settle({ onAsk }: { onAsk: (q: string) => void }) {
  return (
    <section className="block settle" id="contact" aria-labelledby="contact-h">
      <div className="wrap">
        <div className="eyebrow reveal">05 · Settlement</div>
        <h2 className="h2 reveal" id="contact-h">
          Let’s match <em>orders.</em>
        </h2>
        <p className="lede reveal">
          Building trading infrastructure, AI products, or something that needs both? I reply fast.
        </p>
        <div className="settle-actions reveal">
          <a className="btn primary" href={`mailto:${profile.email}?subject=Hi%20Vikas%20%E2%80%94%20role%20at%20`}>✉ {profile.email}</a>
          <a className="btn" href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a className="btn" href={profile.links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          {profile.resumeUrl && <a className="btn" href={profile.resumeUrl} target="_blank" rel="noreferrer">Résumé (PDF)</a>}
          {profile.calendarUrl && <a className="btn" href={profile.calendarUrl} target="_blank" rel="noreferrer">Book a call ↗</a>}
          <button className="btn ai-btn" onClick={() => onAsk('')}>✦ Check fit with your JD</button>
        </div>
      </div>
      <div className="wrap">
        <div className="colophon" style={{ marginTop: 96 }}>
          Built by {profile.name}. The hero runs <a href="https://github.com/vikaspal1704/arena">Arena</a>’s Rust engine as WebAssembly in a Web Worker. The analyst is BM25
          retrieval over this page’s data, with an optional <a href="https://github.com/mlc-ai/web-llm">WebLLM</a> model on your GPU. No server, no cookies, no tracking.{' '}
          <a href="https://github.com/vikaspal1704/vikas-portfolio-website">Source ↗</a>
        </div>
      </div>
    </section>
  );
}
