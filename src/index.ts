import LinkedArray from './LinkedArray';

export type DeferCallback = (error?: Error) => void;
export type DeferFunction = (calback: DeferCallback) => void;
export type AwaitCallback = (error?: Error) => void;

interface QueueState {
  parallelism: number;
  tasks: LinkedArray;
  runningCount: number;
  error: Error | null;
  awaitCalled: boolean;
  awaitCallback: AwaitCallback | null;
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
    };
    this._callAwait = this._callAwait.bind(this);
    this._callDefer = this._callDefer.bind(this);
  }

  private _callAwait() {
    if (this._state.awaitCalled || !this._state.awaitCallback) return;
    this._state.awaitCalled = true;
    return this._state.awaitCallback(this._state.error);
  }

  private _callDefer(err?: Error) {
    this._state.runningCount--;
    if (err && !this._state.error) this._state.error = err;
    if (this._state.error || !(this._state.tasks.length + this._state.runningCount)) return this._callAwait();
    if (!this._state.tasks.length) return;
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
