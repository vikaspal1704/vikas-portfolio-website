/// <reference lib="webworker" />
// Hosts the WebLLM engine off the main thread so the page stays responsive during inference.
import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (msg: MessageEvent) => handler.onmessage(msg);
