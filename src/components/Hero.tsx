import { useEffect, useRef, useState } from 'react';
import { BookCanvas } from './BookCanvas';
import { useExchange } from '../engine/useExchange';
import { starterQuestions } from '../ai/kb';
import { profile } from '../data/profile';

const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US');
const rupees = (paise: number) => (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Counts up towards `target` smoothly so each benchmark burst reads as a surge. */
function useCountUp(target: number) {
  const [v, setV] = useState(0);
  const cur = useRef(0);
  useEffect(() => {
    let raf = 0;
    const step = () => {
      cur.current += (target - cur.current) * 0.12;
      if (Math.abs(target - cur.current) < 1) cur.current = target;
      setV(cur.current);
      if (cur.current !== target) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

export function Hero({ onAsk }: { onAsk: (q: string) => void }) {
  const section = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const { stats, queue, rerunBench } = useExchange(inView);
  const [q, setQ] = useState('');

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0.05 });
    io.observe(section.current!);
    return () => io.disconnect();
  }, []);

  const b = stats.bench;
  const shown = useCountUp(b?.totalCommands ?? 0);
  const rate = b && b.totalMs > 0 ? b.totalCommands / b.totalMs / 1000 : null; // M commands / s

  return (
    <header className="hero" ref={section} id="top">
      <BookCanvas queue={queue} running={inView} />
      <div className="hud" aria-hidden="true">
        SIM · NIFTY-FUT
        <br />
        MID <span>{stats.mid != null ? rupees(stats.mid) : '—'}</span>
        <br />
        SPREAD <span>{stats.spread != null ? rupees(stats.spread) : '—'}</span>
        <br />
        SEQ <span>{fmtInt(stats.seq)}</span>
        <br />
        TRADES <span>{fmtInt(stats.trades)}</span>
        <br />
        FP <span>{stats.fingerprint.slice(0, 12) || '—'}</span>
      </div>

      <div className="wrap">
        <div className="session">
          <span><b>● Session open</b></span>
          <span>{profile.location}</span>
          <span>Open to remote</span>
        </div>
        <h1 className="name">
          Vikas <em>Pal</em>
        </h1>
        <p className="role-line">
          Fintech<span className="x">×</span>AI engineer
        </p>
        <p className="pitch">{profile.pitch}</p>

        <div className="counter" aria-live="off">
          <div className="big">{stats.error ? '—' : fmtInt(shown)}</div>
          <div className="lbl">
            <b>orders matched in your browser</b>
            <br />
            since you arrived, by my Rust exchange engine
          </div>
          <div className="sub">
            {stats.error ? (
              <span>Engine couldn’t start in this browser.</span>
            ) : rate ? (
              <>
                <span className="up">{rate.toFixed(2)}M orders/s on your device</span>
                <span>Rust → WebAssembly · 80 KB · Web Worker</span>
                {b?.done && <button onClick={rerunBench}>run again</button>}
              </>
            ) : (
              <span>warming up the matching engine…</span>
            )}
          </div>
        </div>

        <div className="cmd">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAsk(q);
              setQ('');
            }}
          >
            <span className="spark" aria-hidden="true">✦</span>
            <label htmlFor="hero-ask" className="sr-only">Ask about Vikas, or paste a job description</label>
            <input id="hero-ask" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask anything about me, or paste a job description…" autoComplete="off" />
            <span className="kbd hide-sm" aria-hidden="true">⌘K</span>
            <button className="btn primary" type="submit">Ask</button>
          </form>
          <div className="chips">
            {starterQuestions.map((s) => (
              <button key={s} className="chip" onClick={() => onAsk(s)}>{s}</button>
            ))}
            <button className="chip jd" onClick={() => onAsk('')}>✦ Check fit with your JD</button>
          </div>
        </div>
      </div>
    </header>
  );
}
