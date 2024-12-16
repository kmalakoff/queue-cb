import asap from 'asap';
// @ts-ignore
import Queue from 'queue-cb';

const MAX_CALLSTACK = 6000;
const MAX_STACK = 100000;

describe('performance', () => {
  it('rolled loop (parallism 1)', (done) => {
    const queue = new Queue(1);
    let index = 0;
    function deferFn(callback) {
      if (index++ < MAX_CALLSTACK) queue.defer(deferFn);
      return asap(callback);
      // return callback();
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
      asap(callback);
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
});
