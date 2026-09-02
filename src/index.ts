import LinkedArray from './LinkedArray.ts';

export type DeferCallback = (error?: Error) => void;
export type DeferFunction = (calback: DeferCallback) => void;
export type AwaitCallback = (error?: Error) => void;

// Threshold for synchronous callbacks before yielding to event loop
// This prevents stack overflow while minimizing async overhead
const SYNC_DEPTH_THRESHOLD = 1000;

// Cross-platform async scheduler (Node 0.8+ compatible)
// setImmediate is preferred (Node 0.10+), falls back to setTimeout for Node 0.8
const scheduleAsync = typeof setImmediate === 'function' ? setImmediate : (fn: () => void) => setTimeout(fn, 0);

interface QueueState {
  parallelism: number;
  tasks: LinkedArray<DeferFunction>;
  runningCount: number;
  error: Error | null;
  awaitCalled: boolean;
  awaitCallback: AwaitCallback | null;
  syncDepth: number;
}

export default class Queue {
  private _state: QueueState;

  constructor(parallelism: number = Infinity) {
    this._state = {
      parallelism,
      tasks: new LinkedArray(),
      runningCount: 0,
      error: null,
      awaitCallback: null,
      awaitCalled: false,
      syncDepth: 0,
    };
    this._callAwait = this._callAwait.bind(this);
    this._callDefer = this._callDefer.bind(this);
    this._drainQueue = this._drainQueue.bind(this);
  }

  private _callAwait() {
    if (this._state.awaitCalled || !this._state.awaitCallback) return;
    this._state.awaitCalled = true;
    return this._state.awaitCallback(this._state.error);
  }

  private _drainQueue() {
    // Reset sync depth when we enter from async context
    this._state.syncDepth = 0;
    // Process all available tasks up to parallelism limit
    while (!this._state.error && this._state.tasks.length && this._state.runningCount < this._state.parallelism) {
      this._state.runningCount++;
      this._state.tasks.shift()(this._callDefer);
    }
  }

  private _callDefer(err?: Error) {
    this._state.runningCount--;
    if (err && !this._state.error) this._state.error = err;
    if (this._state.error || !(this._state.tasks.length + this._state.runningCount)) return this._callAwait();
    if (!this._state.tasks.length) return;

    // Trampoline: yield to event loop periodically to prevent stack overflow
    this._state.syncDepth++;
    if (this._state.syncDepth >= SYNC_DEPTH_THRESHOLD) {
      scheduleAsync(this._drainQueue);
      return;
    }

    this._state.runningCount++;
    this._state.tasks.shift()(this._callDefer);
  }

  defer(defer: DeferFunction) {
    if (this._state.error) return;
    if (this._state.runningCount < this._state.parallelism) {
      this._state.runningCount++;
      defer(this._callDefer);
    } else this._state.tasks.push(defer);
  }

  await(callback: AwaitCallback) {
    if (this._state.awaitCallback) throw new Error(`Awaiting callback was added twice: ${callback}`);
    this._state.awaitCallback = callback;
    if (this._state.error || !(this._state.tasks.length + this._state.runningCount)) return this._callAwait();
  }
}
