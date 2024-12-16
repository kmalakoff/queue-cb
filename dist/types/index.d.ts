export type DeferCallback = (error: Error | null) => void;
export type DeferFunction = (calback: DeferCallback) => void;
export type AwaitCallback = (error: Error | null) => void;
export default class Queue {
    private parallelism;
    private awaitCallback;
    private tasks;
    private runningCount;
    private error;
    private callAwait;
    private callDefer;
    constructor(parallelism?: number);
    defer(defer: DeferFunction): void;
    await(callback: AwaitCallback): void;
}
