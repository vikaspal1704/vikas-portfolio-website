/// <reference lib="webworker" />
/**
 * Runs Arena's Rust matching engine (compiled to WebAssembly) off the main thread:
 *  - a seeded market of bots, stepped every 100 ms, streamed as depth + trades;
 *  - bursts of Arena's benchmark workload, timed here so the page can show
 *    real throughput on the visitor's own device.
 * Source of the engine: https://github.com/vikaspal1704/arena (crates/engine, crates/wasm).
 */
import wasmUrl from './arena.wasm?url';
import type { Bench, FromWorker, Tick, ToWorker } from './protocol';

interface Exports {
  memory: WebAssembly.Memory;
  arena_new(seed: number): number;
  arena_out_ptr(): number;
  arena_step(dtMs: number): number;
  arena_depth(levels: number, replay: number): number;
  arena_seq(): number;
  arena_fingerprint(seq: number): number;
  arena_bench_prepare(n: number): number;
  arena_bench_run(): number;
}

const EVENT_WORDS = 11;
const TICK_MS = 100;
const DEPTH_LEVELS = 24;
const BURST = 250_000;
const BURSTS = 12;
/** Ticks pre-rolled at start so the heatmap opens full rather than empty (~32 s of market). */
const PREROLL = 320;

const post = (m: FromWorker) => (self as unknown as DedicatedWorkerGlobalScope).postMessage(m);

let ex: Exports;
let visible = true;
let bursts = 0;
const totals = { commands: 0, trades: 0, ms: 0 };

const out = (n: number) => new Float64Array(ex.memory.buffer, ex.arena_out_ptr(), n);
const hex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');

/** Steps the market once and returns the tick for the page. */
function step(): Tick {
  const n = ex.arena_step(TICK_MS);
  const ev = out(n * EVENT_WORDS);
  const trades: { price: number; qty: number; buy: boolean }[] = [];
  for (let i = 0; i < n; i++) {
    const r = i * EVENT_WORDS;
    // kind 3 = trade: [seq, ts, 3, tradeId, price, qty, maker, taker, makerOwner, takerOwner, aggressor]
    if (ev[r + 2] === 3) trades.push({ price: ev[r + 4]!, qty: ev[r + 5]!, buy: ev[r + 10] === 1 });
  }
  const levels = ex.arena_depth(DEPTH_LEVELS, 0);
  const d = out(levels * 4);
  const bids: [number, number][] = [];
  const asks: [number, number][] = [];
  for (let i = 0; i < levels; i++) {
    const r = i * 4;
    (d[r] === 1 ? bids : asks).push([d[r + 1]!, d[r + 2]!]);
  }
  const seq = ex.arena_seq();
  ex.arena_fingerprint(seq);
  const fp = out(2);
  return { type: 'tick', bids, asks, trades, seq, fingerprint: hex(fp[0]!) + hex(fp[1]!) };
}

function tick() {
  if (visible) post(step());
}

function burst() {
  if (bursts >= BURSTS) return;
  if (!visible) {
    setTimeout(burst, 500);
    return;
  }
  ex.arena_bench_prepare(BURST); // workload generated outside the timed region, as in the native benchmark
  const t = performance.now();
  const trades = ex.arena_bench_run();
  const ms = performance.now() - t;
  bursts++;
  totals.commands += BURST;
  totals.trades += trades;
  totals.ms += ms;
  const m: Bench = { type: 'bench', commands: BURST, ms, totalCommands: totals.commands, totalTrades: totals.trades, totalMs: totals.ms, done: bursts >= BURSTS };
  post(m);
  setTimeout(burst, 650);
}

self.onmessage = (e: MessageEvent<ToWorker>) => {
  if (e.data.type === 'visible') visible = e.data.visible;
  if (e.data.type === 'bench' && bursts >= BURSTS) {
    bursts = 0;
    burst();
  }
};

(async () => {
  try {
    // arrayBuffer rather than instantiateStreaming: works even where .wasm is served with a generic MIME type.
    const bytes = await (await fetch(wasmUrl)).arrayBuffer();
    const { instance } = await WebAssembly.instantiate(bytes, {});
    ex = instance.exports as unknown as Exports;
    ex.arena_new((Math.random() * 2 ** 31) >>> 0);
    post({ type: 'history', ticks: Array.from({ length: PREROLL }, step) });
    setInterval(tick, TICK_MS);
    setTimeout(burst, 900);
  } catch (err) {
    post({ type: 'error', message: String(err) });
  }
})();
