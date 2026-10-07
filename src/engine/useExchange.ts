import { useEffect, useRef, useState } from 'react';
import type { Bench, FromWorker, Tick, ToWorker } from './protocol';

export interface ExchangeStats {
  seq: number;
  trades: number;
  mid: number | null;
  spread: number | null;
  fingerprint: string;
  bench: Bench | null;
  error: string | null;
}

/**
 * Owns the exchange worker. Ticks are queued in a ref that the canvas drains each
 * frame (no React renders); summary stats are pushed to React a few times a second.
 */
export function useExchange(active: boolean) {
  const worker = useRef<Worker | null>(null);
  const queue = useRef<Tick[]>([]);
  const [stats, setStats] = useState<ExchangeStats>({ seq: 0, trades: 0, mid: null, spread: null, fingerprint: '', bench: null, error: null });

  useEffect(() => {
    const w = new Worker(new URL('./exchange.worker.ts', import.meta.url), { type: 'module' });
    worker.current = w;
    let trades = 0;
    let lastPush = 0;
    w.onmessage = (e: MessageEvent<FromWorker>) => {
      const m = e.data;
      if (m.type === 'history') {
        queue.current.push(...m.ticks);
      } else if (m.type === 'tick') {
        queue.current.push(m);
        if (queue.current.length > 2000) queue.current.splice(0, queue.current.length - 2000);
        trades += m.trades.length;
        const now = performance.now();
        if (now - lastPush > 250) {
          lastPush = now;
          const bb = m.bids[0]?.[0];
          const ba = m.asks[0]?.[0];
          setStats((s) => ({
            ...s,
            seq: m.seq,
            trades,
            mid: bb != null && ba != null ? (bb + ba) / 2 : s.mid,
            spread: bb != null && ba != null ? ba - bb : s.spread,
            fingerprint: m.fingerprint,
          }));
        }
      } else if (m.type === 'bench') {
        setStats((s) => ({ ...s, bench: m }));
      } else {
        setStats((s) => ({ ...s, error: m.message }));
      }
    };
    return () => w.terminate();
  }, []);

  useEffect(() => {
    const send = () => worker.current?.postMessage({ type: 'visible', visible: active && document.visibilityState === 'visible' } satisfies ToWorker);
    send();
    document.addEventListener('visibilitychange', send);
    return () => document.removeEventListener('visibilitychange', send);
  }, [active]);

  const rerunBench = () => worker.current?.postMessage({ type: 'bench' } satisfies ToWorker);

  return { stats, queue, rerunBench };
}
