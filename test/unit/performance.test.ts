import Queue from 'queue-cb';

const defer = typeof setImmediate === 'function' ? setImmediate : (fn: () => void) => setTimeout(fn, 0);

const MAX_CALLSTACK = 6000;
const MAX_STACK = 100000;

describe('performance', () => {
  it('rolled loop (parallism 1)', (done) => {
    const queue = new Queue(1);
    let index = 0;
    function deferFn(callback) {
      if (index++ < MAX_CALLSTACK) queue.defer(deferFn);
      return callback();
    }
    queue.defer(deferFn);
    queue.await(done);
  });
  it('stack overflow (parallism 1)', (done) => {
    const queue = new Queue(1);
    queue.defer((callback) => {
      callback();
    });
    for (let index = 0; index < MAX_STACK; index++) {
      queue.defer((callback) => {
        callback();
      });
    }
    queue.await(done);
  });
  it('stack overflow (parallism 2)', (done) => {
    const queue = new Queue(2);
    queue.defer((callback) => {
      callback();
    });
    for (let index = 0; index < MAX_STACK; index++) {
      queue.defer((callback) => {
        callback();
      });
    }
    queue.await(done);
  });
  it('stack overflow (parallism Infinity)', (done) => {
    const queue = new Queue();
    for (let index = 0; index < MAX_STACK; index++) {
      queue.defer((callback) => {
        callback();
      });
    }
    queue.await(done);
  });
  it('trampoline - delayed first task with sync callbacks (parallelism 1)', (done) => {
    // This test exercises the trampoline mechanism:
    // - First task delays its callback, allowing many tasks to queue
    // - When first task completes, queued tasks all call callback synchronously
    // - Without trampoline, this would cause stack overflow
    const queue = new Queue(1);
    queue.defer((callback) => {
      defer(callback); // Delay completion so tasks queue up
    });
    for (let index = 0; index < MAX_STACK; index++) {
      queue.defer((callback) => {
        callback(); // Sync callback
      });
    }
    queue.await(done);
  });
});
