import assert from 'assert';
import Queue from 'queue-cb';

const defer = typeof setImmediate === 'function' ? setImmediate : (fn: () => void) => setTimeout(fn, 0);

describe('Queue', () => {
  it('infinite parallelism (not new)', (done) => {
    const queue = new Queue();

    const results = [];
    queue.defer((callback) => {
      results.push('1.0');
      defer(() => {
        results.push('1.1');
        callback();
      });
    });
    queue.defer((callback) => {
      results.push('2.0');
      defer(() => {
        results.push('2.1');
        callback();
      });
    });
    queue.defer((callback) => {
      results.push('3.0');
      defer(() => {
        results.push('3.1');
        callback();
      });
    });
    queue.await((err) => {
      assert.ok(!err, 'No errors');
      assert.deepEqual(results, ['1.0', '2.0', '3.0', '1.1', '2.1', '3.1']);
      done();
    });
  });

  it('infinite parallelism', (done) => {
    const queue = new Queue();

    const results = [];
    queue.defer((callback) => {
      results.push('1.0');
      defer(() => {
        results.push('1.1');
        callback();
      });
    });
    queue.defer((callback) => {
      results.push('2.0');
      defer(() => {
        results.push('2.1');
        callback();
      });
    });
    queue.defer((callback) => {
      results.push('3.0');
      defer(() => {
        results.push('3.1');
        callback();
      });
    });
    queue.await((err) => {
      assert.ok(!err, 'No errors');
      assert.deepEqual(results, ['1.0', '2.0', '3.0', '1.1', '2.1', '3.1']);
      done();
    });
  });

  it('infinite parallelism (errors 1)', (done) => {
    const queue = new Queue();

    const results = [];
    queue.defer((callback) => {
      results.push('1.0');
      defer(() => {
        results.push('1.1');
        return callback(new Error('error'));
      });
    });
    queue.defer((callback) => {
      results.push('2.0');
      defer(() => {
        results.push('2.1');
        callback();
      });
    });
    queue.defer((callback) => {
      results.push('3.0');
      defer(() => {
        results.push('3.1');
        callback();
      });
    });
    queue.await((err) => {
      assert.ok(err, `Has error: ${err.message}`);
      assert.deepEqual(results, ['1.0', '2.0', '3.0', '1.1']);
      done();
    });
  });

  it('infinite parallelism (errors 2)', (done) => {
    const queue = new Queue();

    const results = [];
    queue.defer((callback) => {
      results.push('1.0');
      defer(() => {
        results.push('1.1');
        callback();
      });
    });
    queue.defer((callback) => {
      results.push('2.0');
      defer(() => {
        results.push('2.1');
        return callback(new Error('error'));
      });
    });
    queue.defer((callback) => {
      results.push('3.0');
      defer(() => {
        results.push('3.1');
        callback();
      });
    });
    queue.await((err) => {
      assert.ok(err, `Has error: ${err.message}`);
      assert.deepEqual(results, ['1.0', '2.0', '3.0', '1.1', '2.1']);
      done();
    });
  });

  it('parallelism 1', (done) => {
    const queue = new Queue(1);

    const results = [];
    queue.defer((callback) => {
      results.push('1.0');
      defer(() => {
        results.push('1.1');
        callback();
      });
    });
    queue.defer((callback) => {
      results.push('2.0');
      defer(() => {
        results.push('2.1');
        callback();
      });
    });
    queue.defer((callback) => {
      results.push('3.0');
      defer(() => {
        results.push('3.1');
        callback();
      });
    });
    queue.await((err) => {
      assert.ok(!err, 'No errors');
      assert.deepEqual(results, ['1.0', '1.1', '2.0', '2.1', '3.0', '3.1']);
      done();
    });
  });

  it('parallelism 1 (errors 1)', (done) => {
    const queue = new Queue(1);

    const results = [];
    queue.defer((callback) => {
      results.push('1.0');
      defer(() => {
        results.push('1.1');
        return callback(new Error('error'));
      });
    });
    queue.defer((callback) => {
      results.push('2.0');
      defer(() => {
        results.push('2.1');
        callback();
      });
    });
    queue.defer((callback) => {
      results.push('3.0');
      defer(() => {
        results.push('3.1');
        callback();
      });
    });
    queue.await((err) => {
      assert.ok(err, `Has error: ${err.message}`);
      assert.deepEqual(results, ['1.0', '1.1']);
      done();
    });
  });

  it('parallelism 1 (errors 2)', (done) => {
    const queue = new Queue(1);

    const results = [];
    queue.defer((callback) => {
      results.push('1.0');
      defer(() => {
        results.push('1.1');
        callback();
      });
    });
    queue.defer((callback) => {
      results.push('2.0');
      defer(() => {
        results.push('2.1');
        return callback(new Error('error'));
      });
    });
    queue.defer((callback) => {
      results.push('3.0');
      defer(() => {
        results.push('3.1');
        callback();
      });
    });
    queue.await((err) => {
      assert.ok(err, `Has error: ${err.message}`);
      assert.deepEqual(results, ['1.0', '1.1', '2.0', '2.1']);
      done();
    });
  });

  it('catches await added twice', (done) => {
    const queue = new Queue(1);

    const results = [];
    queue.defer((callback) => {
      results.push('1.0');
      defer(() => {
        results.push('1.1');
        callback();
      });
    });
    queue.defer((callback) => {
      results.push('2.0');
      defer(() => {
        results.push('2.1');
        return callback(new Error('error'));
      });
    });
    queue.defer((callback) => {
      results.push('3.0');
      defer(() => {
        results.push('3.1');
        callback();
      });
    });
    queue.await((err) => {
      assert.ok(err, `Has error: ${err.message}`);
      assert.deepEqual(results, ['1.0', '1.1', '2.0', '2.1']);
      done();
    });
    try {
      queue.await(() => {});
    } catch (error) {
      const err = error;
      assert.ok(err, `Has error: ${err.message}`);
      assert.ok(err.toString().indexOf('Error: Awaiting callback was added twice') === 0, 'Expected message');
    }
  });

  it('calls await if an error occurs before it is added', (done) => {
    const queue = new Queue(1);

    const results = [];
    queue.defer((callback) => {
      results.push('1.0');
      return callback(new Error('error'));
    });
    queue.defer((callback) => {
      results.push('2.0');
      callback();
    });
    queue.defer((callback) => {
      results.push('3.0');
      callback();
    });
    queue.await((err) => {
      assert.ok(err, `Has error: ${err.message}`);
      assert.deepEqual(results, ['1.0']);
      done();
    });
  });
});
