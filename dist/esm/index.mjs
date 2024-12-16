// @ts-ignore
import LinkedArray from './LinkedArray.mjs';
let Queue = class Queue {
    defer(defer) {
        if (this.error) return;
        if (this.runningCount < this.parallelism) {
            this.runningCount++;
            defer(this.callDefer);
        } else this.tasks.push(defer);
    }
    await(callback) {
        if (this.awaitCallback) throw new Error(`Awaiting callback was added twice: ${callback}`);
        this.awaitCallback = callback;
        if (this.error || !(this.tasks.length + this.runningCount)) return this.callAwait();
    }
    constructor(parallelism = Infinity){
        this.parallelism = parallelism;
        this.awaitCallback = null;
        this.tasks = new LinkedArray();
        this.runningCount = 0;
        this.error = null;
        let awaitCalled = false;
        this.callAwait = (function callAwait() {
            if (awaitCalled || !this.awaitCallback) return;
            awaitCalled = true;
            return this.awaitCallback(this.error);
        }).bind(this);
        this.callDefer = (function callDefer(err) {
            this.runningCount--;
            if (err && !this.error) this.error = err;
            if (this.error || !(this.tasks.length + this.runningCount)) return this.callAwait();
            if (!this.tasks.length) return;
            this.runningCount++;
            this.tasks.shift()(this.callDefer);
        }).bind(this);
    }
};
export { Queue as default };
