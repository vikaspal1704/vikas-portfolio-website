import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { MLCEngineInterface } from '@mlc-ai/web-llm';
import { search, looksLikeJobDescription, MIN_SCORE, type Hit } from '../ai/retrieve';
import { fitCheck, type FitResult } from '../ai/fit';
import { starterQuestions } from '../ai/kb';
import { askLLM, loadLLM, webgpuStatus, MODEL_LABEL, MODEL_SIZE } from '../ai/llm';
import { evidenceRef, profile } from '../data/profile';

type Mode = 'instant' | 'llm';

interface Message {
  id: number;
  q: string;
  kind: 'answer' | 'fit' | 'none';
  hits: Hit[];
  text: string;
  fit?: FitResult;
  via: Mode;
  done: boolean;
}

/** Turns plain text with "- " bullets, URLs and emails into elements. */
function RichText({ text }: { text: string }) {
  const linkify = (s: string): ReactNode[] =>
    s.split(/(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g).map((part, i) => {
      if (/^https?:\/\//.test(part)) return <a key={i} href={part} target="_blank" rel="noreferrer">{part.replace(/^https?:\/\/(www\.)?/, '')}</a>;
      if (/@/.test(part) && /\.\w+$/.test(part)) return <a key={i} href={`mailto:${part}`}>{part}</a>;
      return part;
    });
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) blocks.push(<ul key={blocks.length}>{list.map((l, i) => <li key={i}>{linkify(l)}</li>)}</ul>);
    list = [];
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (/^[-*•]\s+/.test(line)) list.push(line.replace(/^[-*•]\s+/, ''));
    else {
      flush();
      if (line) blocks.push(<p key={blocks.length}>{linkify(line)}</p>);
    }
  }
  flush();
  return <>{blocks}</>;
}

function Cites({ ids }: { ids: string[] }) {
  const refs = [...new Set(ids)].map((id) => ({ id, ref: evidenceRef(id) })).filter((x) => x.ref);
  if (!refs.length) return null;
  return (
    <div className="cites" aria-label="Sources">
      {refs.map(({ id, ref }) => (
        <a key={id} href={ref!.href} target="_blank" rel="noreferrer">↗ {ref!.name}</a>
      ))}
    </div>
  );
}

function FitTicket({ fit }: { fit: FitResult }) {
  return (
    <div className="ticket" role="group" aria-label="Fit check">
      <div className="ticket-h">
        <div className="cov mono">
          {fit.coverage}% <small>evidence coverage</small>
        </div>
        <p>{fit.verdict}</p>
      </div>
      {fit.lines.map((l) => (
        <div className="fline" key={l.label}>
          <span className={`badge ${l.strength}`}>{l.strength === 'strong' ? 'proven' : l.strength}</span>
          <div>
            <b>{l.label}</b>
            <p>{l.note}</p>
            {l.evidence.length > 0 && (
              <div style={{ marginTop: 6 }}>
                {l.evidence.map((id) => {
                  const r = evidenceRef(id);
                  return r ? <a key={id} href={r.href} target="_blank" rel="noreferrer">↗ {r.name}</a> : null;
                })}
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="ticket-f">
        {fit.yearsAsked != null && (
          <div>
            Experience: role asks {fit.yearsAsked}+ yrs · Vikas has ~{fit.yearsHave} yrs (since {profile.careerStart.year}){' '}
            {fit.yearsHave >= fit.yearsAsked ? <span className="up">✓</span> : <span className="ai">(below the ask)</span>}
          </div>
        )}
        <div>Matched by rules against public evidence. Gaps are shown as gaps. Computed in your browser.</div>
      </div>
    </div>
  );
}

export function Analyst({ open, onClose, seed }: { open: boolean; onClose: () => void; seed: { q: string; n: number } | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState<Mode>('instant');
  const [llmState, setLlmState] = useState<{ status: 'idle' | 'loading' | 'ready' | 'error'; progress: number; text: string }>({ status: 'idle', progress: 0, text: '' });
  const [busy, setBusy] = useState(false);
  const llm = useRef<MLCEngineInterface | null>(null);
  const thread = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(1);
  const lastSeed = useRef(0);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => input.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    thread.current?.scrollTo({ top: thread.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const patch = (id: number, p: Partial<Message>) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...p } : m)));

  async function ask(q: string) {
    q = q.trim();
    if (!q || busy) return;
    setDraft('');
    if (input.current) input.current.style.height = 'auto';
    const id = nextId.current++;

    if (looksLikeJobDescription(q)) {
      const fit = fitCheck(q);
      setMessages((ms) => [...ms, { id, q, kind: 'fit', hits: [], text: '', fit, via: 'instant', done: true }]);
      return;
    }

    const hits = search(q);
    const confident = hits.length > 0 && hits[0]!.score >= MIN_SCORE;
    if (!confident) {
      setMessages((ms) => [
        ...ms,
        { id, q, kind: 'none', hits: [], via: mode, done: true, text: `That isn’t covered on this site, and I only answer from Vikas’s verified record rather than guess. Try one of the questions below, or email him at ${profile.email}.` },
      ]);
      return;
    }

    if (mode === 'llm' && llm.current) {
      setBusy(true);
      setMessages((ms) => [...ms, { id, q, kind: 'answer', hits, text: '', via: 'llm', done: false }]);
      let text = '';
      try {
        for await (const delta of askLLM(llm.current, q, hits)) {
          text += delta;
          patch(id, { text });
        }
      } catch {
        text = hits[0]!.doc.answer;
      }
      patch(id, { text, done: true });
      setBusy(false);
      return;
    }

    setMessages((ms) => [...ms, { id, q, kind: 'answer', hits, text: hits[0]!.doc.answer, via: 'instant', done: true }]);
  }

  useEffect(() => {
    if (open && seed && seed.n !== lastSeed.current) {
      lastSeed.current = seed.n;
      if (seed.q) void ask(seed.q);
    }
  }, [open, seed]);

  async function enableLLM() {
    if (llmState.status === 'ready') return setMode('llm');
    if (llmState.status === 'loading') return;
    const gpu = await webgpuStatus();
    if (!gpu.ok) {
      setLlmState({ status: 'error', progress: 0, text: gpu.reason ?? 'WebGPU unavailable.' });
      return;
    }
    setLlmState({ status: 'loading', progress: 0, text: 'Fetching model…' });
    try {
      llm.current = await loadLLM(gpu.f16, (progress, text) => setLlmState({ status: 'loading', progress, text }));
      setLlmState({ status: 'ready', progress: 1, text: `${MODEL_LABEL} running on your GPU` });
      setMode('llm');
    } catch (e) {
      setLlmState({ status: 'error', progress: 0, text: `Couldn’t start the local model (${String(e).slice(0, 120)}). Instant mode still works.` });
    }
  }

  if (!open) return null;

  const follow = messages.length ? (messages[messages.length - 1]!.hits[0]?.doc.follow ?? starterQuestions) : starterQuestions;

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Ask the analyst">
        <div className="drawer-h">
          <span className="ai mono" aria-hidden="true">✦</span>
          <div className="title">
            ANALYST
            <small>Answers only from Vikas’s verified record · runs in your browser</small>
          </div>
          <button className="x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="mode">
          <div className="seg" role="group" aria-label="Answer engine">
            <button aria-pressed={mode === 'instant'} onClick={() => setMode('instant')}>⚡ Instant</button>
            <button aria-pressed={mode === 'llm'} onClick={enableLLM} disabled={llmState.status === 'loading'}>
              ◆ Local LLM
            </button>
          </div>
          <span>
            {llmState.status === 'idle' && mode === 'instant' && <>Retrieval, zero latency. Or run an open-source LLM on your GPU ({MODEL_SIZE}).</>}
            {llmState.status !== 'idle' && llmState.text}
          </span>
          {llmState.status === 'loading' && (
            <div className="progress" aria-label="Model download progress">
              <div style={{ width: `${Math.round(llmState.progress * 100)}%` }} />
            </div>
          )}
        </div>

        <div className="thread" ref={thread} aria-live="polite">
          {messages.length === 0 && (
            <div className="msg-a">
              <div className="who">Analyst</div>
              <div className="body">
                <p>Ask me anything about Vikas: projects, experience, how he works, or whether he fits your role.</p>
                <p className="muted">Hiring? Paste your job description and I’ll match every requirement to evidence, and show gaps as gaps.</p>
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} style={{ display: 'contents' }}>
              <div className={`msg-q${m.q.length > 280 ? ' long' : ''}`}>{m.q}</div>
              <div className="msg-a">
                <div className="who">
                  {m.kind === 'fit' ? 'Fit check' : 'Analyst'}
                  <span>{m.kind === 'fit' ? 'rules + evidence' : m.via === 'llm' ? `${MODEL_LABEL} · on-device` : 'retrieval · instant'}</span>
                </div>
                {m.kind === 'fit' && m.fit ? (
                  <FitTicket fit={m.fit} />
                ) : (
                  <div className={`body${m.done ? '' : ' caret'}`}>
                    <RichText text={m.text} />
                  </div>
                )}
                {m.kind === 'answer' && <Cites ids={m.hits.slice(0, 3).flatMap((h) => h.doc.refs)} />}
              </div>
            </div>
          ))}
        </div>

        <div className="follow" style={{ padding: '0 14px 10px' }}>
          {follow.slice(0, 3).map((f) => (
            <button key={f} className="chip" onClick={() => ask(f)}>{f}</button>
          ))}
        </div>
        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault();
            void ask(draft);
          }}
        >
          <label className="sr-only" htmlFor="analyst-input">Ask a question or paste a job description</label>
          <textarea
            id="analyst-input"
            ref={input}
            rows={1}
            value={draft}
            placeholder="Ask, or paste a job description…"
            onChange={(e) => {
              setDraft(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(180, e.target.scrollHeight)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void ask(draft);
              }
            }}
          />
          <button className="btn primary" type="submit" disabled={busy || !draft.trim()} aria-label="Send">↵</button>
        </form>
        <div className="hint">Enter to send · Shift+Enter for a new line · Esc to close</div>
      </aside>
    </>
  );
}
