export type DeferCallback = (error: Error | null, result: unknown | undefined) => void;
export type DeferFunction = (calback: DeferCallback) => void;
export type AwaitCallback = (error: Error | null) => void;
export default function Queue(parallelism?: number): {
    defer(defer: DeferFunction): void;
    await(callback: AwaitCallback): void;
};
