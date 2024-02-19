export default function Queue(parallelism: any): {
    defer: (deferFn: any) => void;
    await: (callback: any) => any;
};
