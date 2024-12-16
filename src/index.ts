// @ts-ignore
import LinkedArray from './LinkedArray.ts';

export type DeferCallback = (error: Error | undefined) => void;
export type DeferFunction = (calback: DeferCallback) => void;
export type AwaitCallback = (error: Error | undefined) => void;

type CallAwaitFunction = () => void;
type CallDeferFunction = (error: Error | null) => void;

export default class Queue {
  private parallelism: number;
  private awaitCallback: AwaitCallback | null;
  private tasks: LinkedArray;
  private runningCount: number;
  private error: Error | null;
  private callAwait: CallAwaitFunction;
  private callDefer: CallDeferFunction;

  constructor(parallelism: number = Infinity) {
    this.parallelism = parallelism;
    this.awaitCallback = null;
    this.tasks = new LinkedArray();
    this.runningCount = 0;
    this.error = null;

    let awaitCalled = false;
    this.callAwait = function callAwait() {
      if (awaitCalled || !this.awaitCallback) return;
      awaitCalled = true;
      return this.awaitCallback(this.error);
    }.bind(this);
    this.callDefer = function callDefer(err) {
      this.runningCount--;
      if (err && !this.error) this.error = err;
      if (this.error || !(this.tasks.length + this.runningCount)) return this.callAwait();
      if (!this.tasks.length) return;
      this.runningCount++;
      this.tasks.shift()(this.callDefer);
    }.bind(this);
  }

  defer(defer: DeferFunction) {
    if (this.error) return;
    if (this.runningCount < this.parallelism) {
      this.runningCount++;
      defer(this.callDefer);
    } else this.tasks.push(defer);
  }

  await(callback: AwaitCallback) {
    if (this.awaitCallback) throw new Error(`Awaiting callback was added twice: ${callback}`);
    this.awaitCallback = callback;
    if (this.error || !(this.tasks.length + this.runningCount)) return this.callAwait();
  }
}
