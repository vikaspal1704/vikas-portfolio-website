import { useEffect, useRef, type MutableRefObject } from 'react';
import type { Tick } from '../engine/protocol';

const TICK_MS = 100;
const TICK_SIZE = 5; // paise; Arena's NIFTY-futures grid

interface Column {
  levels: [price: number, qty: number, bid: boolean][];
  mid: number;
  trades: { price: number; qty: number; buy: boolean }[];
}

/**
 * A liquidity heatmap of the live book, in the style of a trader's Bookmap:
 * time runs right to left, each resting price level glows with its size,
 * the mid price is traced in amber, and every trade prints as a bubble.
 * The right edge shows the current book as horizontal depth bars.
 */
export function BookCanvas({ queue, running }: { queue: MutableRefObject<Tick[]>; running: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0;
    let H = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const cols: Column[] = [];
    let lastAt = performance.now();
    let midS = 0;
    let qMax = 300;
    let raf = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      for (const t of queue.current.splice(0)) {
        if (!t.bids.length || !t.asks.length) continue;
        lastAt = now;
        const mid = (t.bids[0]![0] + t.asks[0]![0]) / 2;
        cols.push({
          levels: [...t.bids.map(([p, q]) => [p, q, true] as Column['levels'][number]), ...t.asks.map(([p, q]) => [p, q, false] as Column['levels'][number])],
          mid,
          trades: t.trades,
        });
        let peak = 1;
        for (const [, q] of cols[cols.length - 1]!.levels) peak = Math.max(peak, q);
        qMax += (peak - qMax) * 0.05;
        if (midS === 0) midS = mid;
      }
      const last = cols[cols.length - 1];
      if (last) midS += (last.mid - midS) * (reduced ? 0.02 : 0.06);

      const colW = W < 700 ? 3 : 4;
      const edge = Math.round(W * (W < 700 ? 0.8 : 0.84));
      const maxCols = Math.ceil(edge / colW) + 2;
      if (cols.length > maxCols) cols.splice(0, cols.length - maxCols);
      const rowH = Math.max(7, Math.min(16, H / 46));
      const cy = H * 0.56;
      const y = (p: number) => cy - ((p - midS) / TICK_SIZE) * rowH;
      // Columns glide left between ticks instead of jumping.
      const shift = reduced ? 0 : Math.min(1, (now - lastAt) / TICK_MS) * colW;

      ctx.clearRect(0, 0, W, H);

      // Heatmap
      for (let i = 0; i < cols.length; i++) {
        const c = cols[i]!;
        const x = edge - (cols.length - i) * colW - shift;
        if (x < -colW) continue;
        const age = 1 - (cols.length - i) / maxCols; // older columns fade into the background
        for (const [p, q, bid] of c.levels) {
          const yy = y(p);
          if (yy < -rowH || yy > H + rowH) continue;
          const a = (0.06 + Math.min(1, q / qMax) * 0.6) * (0.35 + 0.65 * age);
          ctx.fillStyle = bid ? `rgba(46,230,166,${a})` : `rgba(255,93,115,${a})`;
          ctx.fillRect(x, yy - rowH / 2 + 0.5, colW, rowH - 1);
        }
      }

      // Mid price trace
      ctx.beginPath();
      for (let i = 0; i < cols.length; i++) {
        const x = edge - (cols.length - i) * colW - shift + colW / 2;
        const yy = y(cols[i]!.mid);
        if (i === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.strokeStyle = 'rgba(255,200,87,0.9)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(255,200,87,0.7)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Trades
      for (let i = 0; i < cols.length; i++) {
        const c = cols[i]!;
        if (!c.trades.length) continue;
        const x = edge - (cols.length - i) * colW - shift + colW / 2;
        const ageCols = cols.length - i;
        for (const tr of c.trades) {
          const r = Math.min(14, 2 + Math.sqrt(tr.qty / 75) * 2.4);
          ctx.beginPath();
          ctx.arc(x, y(tr.price), r, 0, Math.PI * 2);
          ctx.fillStyle = tr.buy ? 'rgba(46,230,166,0.22)' : 'rgba(255,93,115,0.22)';
          ctx.fill();
          ctx.strokeStyle = tr.buy ? 'rgba(46,230,166,0.95)' : 'rgba(255,93,115,0.95)';
          ctx.lineWidth = 1;
          ctx.stroke();
          // Fresh prints ripple outwards.
          if (!reduced && ageCols < 8) {
            ctx.beginPath();
            ctx.arc(x, y(tr.price), r + ageCols * 3, 0, Math.PI * 2);
            ctx.strokeStyle = tr.buy ? `rgba(46,230,166,${0.5 - ageCols * 0.06})` : `rgba(255,93,115,${0.5 - ageCols * 0.06})`;
            ctx.stroke();
          }
        }
      }

      // Current book as depth bars at the right edge
      if (last) {
        const room = W - edge - 12;
        ctx.fillStyle = 'rgba(148,163,184,0.12)';
        ctx.fillRect(edge + 2, 0, 1, H);
        for (const [p, q, bid] of last.levels) {
          const yy = y(p);
          const len = Math.max(2, Math.min(1, q / (qMax * 1.4)) * room);
          ctx.fillStyle = bid ? 'rgba(46,230,166,0.55)' : 'rgba(255,93,115,0.55)';
          ctx.fillRect(edge + 8, yy - rowH / 2 + 1, len, rowH - 2);
        }
        ctx.fillStyle = '#ffc857';
        ctx.beginPath();
        ctx.arc(edge - shift + colW / 2 - colW, y(last.mid), 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (running) raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [queue, running]);

  return <canvas ref={ref} aria-hidden="true" />;
}
