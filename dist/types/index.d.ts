export type DeferCallback = (error?: Error) => void;
export type DeferFunction = (calback: DeferCallback) => void;
export type AwaitCallback = (error?: Error) => void;
export default class Queue {
    private _state;
    constructor(parallelism?: number);
    private _callAwait;
    private _callDefer;
    defer(defer: DeferFunction): void;
    await(callback: AwaitCallback): void;
}
