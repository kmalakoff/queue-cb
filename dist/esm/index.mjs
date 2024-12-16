// @ts-ignore
import LinkedArray from './LinkedArray.mjs';
export default function Queue(parallelism = Infinity) {
    let awaitCalled = false;
    let awaitCallback = null;
    function callAwait() {
        if (awaitCalled || !awaitCallback) return;
        awaitCalled = true;
        return awaitCallback(error);
    }
    const tasks = new LinkedArray();
    let runningCount = 0;
    let error = null;
    function queueCallback(err) {
        runningCount--;
        if (err && !error) error = err;
        if (error || !(tasks.length + runningCount)) return callAwait();
        if (!tasks.length) return;
        runningCount++;
        tasks.shift()(queueCallback);
    }
    return {
        defer (defer) {
            if (error) return;
            if (runningCount < parallelism) {
                runningCount++;
                defer(queueCallback);
            } else tasks.push(defer);
        },
        await (callback) {
            if (awaitCallback) throw new Error(`Awaiting callback was added twice: ${callback}`);
            awaitCallback = callback;
            if (error || !(tasks.length + runningCount)) return callAwait();
        }
    };
}
