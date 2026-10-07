/** Messages between the page and the exchange worker. Prices are in paise. */
export interface Tick {
  type: 'tick';
  bids: [price: number, qty: number][];
  asks: [price: number, qty: number][];
  trades: { price: number; qty: number; buy: boolean }[];
  seq: number;
  fingerprint: string;
}

export interface Bench {
  type: 'bench';
  /** Commands in this burst and the time it took, measured in the worker. */
  commands: number;
  ms: number;
  totalCommands: number;
  totalTrades: number;
  totalMs: number;
  done: boolean;
}

export type FromWorker = Tick | Bench | { type: 'history'; ticks: Tick[] } | { type: 'error'; message: string };
export type ToWorker = { type: 'visible'; visible: boolean } | { type: 'bench' };
