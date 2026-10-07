import { useCallback, useEffect, useState } from 'react';
import { Hero } from './components/Hero';
import { Analyst } from './components/Analyst';
import { Brief, Instruments, Ledger, Settle, SkillBook, useReveal } from './components/Sections';
import { profile } from './data/profile';

export default function App() {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState<{ q: string; n: number } | null>(null);

  /** Opens the analyst; a non-empty question is asked straight away, an empty one just focuses the composer. */
  const ask = useCallback((q: string) => {
    setSeed((s) => ({ q: q.trim(), n: (s?.n ?? 0) + 1 }));
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useReveal();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        ask('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ask]);

  return (
    <>
      <a href="#brief" className="sr-only">Skip to content</a>
      <nav className="topbar" aria-label="Primary">
        <a className="logo" href="#top" aria-label="Vikas Pal, home">
          <span className="dot" aria-hidden="true" />
          VIKAS/LIVE
        </a>
        <div className="nav">
          <a href="#brief">Brief</a>
          <a href="#work">Work</a>
          <a href="#book">Skills</a>
          <a href="#ledger">Experience</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="actions">
          <button className="btn ai-btn" onClick={() => ask('')}>
            ✦ Ask <span className="kbd hide-sm">⌘K</span>
          </button>
          <a className="btn primary hide-sm" href={`mailto:${profile.email}`}>Hire me</a>
        </div>
      </nav>
      <main>
        <Hero onAsk={ask} />
        <Brief onAsk={ask} />
        <Instruments onAsk={ask} />
        <SkillBook onAsk={ask} />
        <Ledger />
        <Settle onAsk={ask} />
      </main>
      <Analyst open={open} onClose={close} seed={seed} />
    </>
  );
}
