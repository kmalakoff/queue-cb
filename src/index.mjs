import LinkedArray from './LinkedArray';

export default function Queue(parallelism) {
  if (typeof parallelism === 'undefined') parallelism = Infinity;

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
    defer: function defer(deferFn) {
      if (error) return;
      if (runningCount < parallelism) {
        runningCount++;
        deferFn(queueCallback);
      } else tasks.push(deferFn);
    },
    await: function awaitFn(callback) {
      if (awaitCallback) throw new Error(`Awaiting callback was added twice: ${callback}`);
      awaitCallback = callback;
      if (error || !(tasks.length + runningCount)) return callAwait();
    },
  };
}
