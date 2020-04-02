var assert = require('chai').assert;
var Queue = require('../..');

describe('Queue @quick', function () {
  it('infinite parallelism', function (done) {
    const queue = new Queue();

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      setTimeout(function () {
        results.push('1.1');
        callback();
      }, 1 * 20);
    });
    queue.defer(function (callback) {
      results.push('2.0');
      setTimeout(function () {
        results.push('2.1');
        callback();
      }, 2 * 20);
    });
    queue.defer(function (callback) {
      results.push('3.0');
      setTimeout(function () {
        results.push('3.1');
        callback();
      }, 3 * 20);
    });
    return queue.await(function (err) {
      assert.ok(!err, `No errors: ${err}`);
      assert.deepEqual(results, ['1.0', '2.0', '3.0', '1.1', '2.1', '3.1']);
      done();
    });
  });

  it('infinite parallelism (errors 1)', function (done) {
    const queue = new Queue();

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      setTimeout(function () {
        results.push('1.1');
        return callback(new Error('error'));
      }, 1 * 20);
    });
    queue.defer(function (callback) {
      results.push('2.0');
      setTimeout(function () {
        results.push('2.1');
        callback();
      }, 2 * 20);
    });
    queue.defer(function (callback) {
      results.push('3.0');
      setTimeout(function () {
        results.push('3.1');
        callback();
      }, 3 * 20);
    });
    return queue.await(function (err) {
      assert.ok(err, `Has error: ${err}`);
      assert.deepEqual(results, ['1.0', '2.0', '3.0', '1.1']);
      done();
    });
  });

  it('infinite parallelism (errors 2)', function (done) {
    const queue = new Queue();

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      setTimeout(function () {
        results.push('1.1');
        callback();
      }, 1 * 20);
    });
    queue.defer(function (callback) {
      results.push('2.0');
      setTimeout(function () {
        results.push('2.1');
        return callback(new Error('error'));
      }, 2 * 20);
    });
    queue.defer(function (callback) {
      results.push('3.0');
      setTimeout(function () {
        results.push('3.1');
        callback();
      }, 3 * 20);
    });
    return queue.await(function (err) {
      assert.ok(err, `Has error: ${err}`);
      assert.deepEqual(results, ['1.0', '2.0', '3.0', '1.1', '2.1']);
      done();
    });
  });

  it('parallelism 1', function (done) {
    const queue = new Queue(1);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      setTimeout(function () {
        results.push('1.1');
        callback();
      }, 1 * 20);
    });
    queue.defer(function (callback) {
      results.push('2.0');
      setTimeout(function () {
        results.push('2.1');
        callback();
      }, 2 * 20);
    });
    queue.defer(function (callback) {
      results.push('3.0');
      setTimeout(function () {
        results.push('3.1');
        callback();
      }, 3 * 20);
    });
    return queue.await(function (err) {
      assert.ok(!err, `No errors: ${err}`);
      assert.deepEqual(results, ['1.0', '1.1', '2.0', '2.1', '3.0', '3.1']);
      done();
    });
  });

  it('parallelism 1 (errors 1)', function (done) {
    const queue = new Queue(1);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      setTimeout(function () {
        results.push('1.1');
        return callback(new Error('error'));
      }, 1 * 20);
    });
    queue.defer(function (callback) {
      results.push('2.0');
      setTimeout(function () {
        results.push('2.1');
        callback();
      }, 2 * 20);
    });
    queue.defer(function (callback) {
      results.push('3.0');
      setTimeout(function () {
        results.push('3.1');
        callback();
      }, 3 * 20);
    });
    return queue.await(function (err) {
      assert.ok(err, `Has error: ${err}`);
      assert.deepEqual(results, ['1.0', '1.1']);
      done();
    });
  });

  it('parallelism 1 (errors 2)', function (done) {
    const queue = new Queue(1);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      setTimeout(function () {
        results.push('1.1');
        callback();
      }, 1 * 20);
    });
    queue.defer(function (callback) {
      results.push('2.0');
      setTimeout(function () {
        results.push('2.1');
        return callback(new Error('error'));
      }, 2 * 20);
    });
    queue.defer(function (callback) {
      results.push('3.0');
      setTimeout(function () {
        results.push('3.1');
        callback();
      }, 3 * 20);
    });
    return queue.await(function (err) {
      assert.ok(err, `Has error: ${err}`);
      assert.deepEqual(results, ['1.0', '1.1', '2.0', '2.1']);
      done();
    });
  });

  it('parallelism 2', function (done) {
    const queue = new Queue(2);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      setTimeout(function () {
        results.push('1.1');
        callback();
      }, 1 * 20);
    });
    queue.defer(function (callback) {
      results.push('2.0');
      setTimeout(function () {
        results.push('2.1');
        callback();
      }, 2 * 20);
    });
    queue.defer(function (callback) {
      results.push('3.0');
      setTimeout(function () {
        results.push('3.1');
        callback();
      }, 3 * 20);
    });
    return queue.await(function (err) {
      assert.ok(!err, `No errors: ${err}`);
      assert.deepEqual(results, ['1.0', '2.0', '1.1', '3.0', '2.1', '3.1']);
      done();
    });
  });

  it('parallelism 2 (errors 1)', function (done) {
    const queue = new Queue(2);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      setTimeout(function () {
        results.push('1.1');
        return callback(new Error('error'));
      }, 1 * 20);
    });
    queue.defer(function (callback) {
      results.push('2.0');
      setTimeout(function () {
        results.push('2.1');
        callback();
      }, 2 * 20);
    });
    queue.defer(function (callback) {
      results.push('3.0');
      setTimeout(function () {
        results.push('3.1');
        callback();
      }, 3 * 20);
    });
    return queue.await(function (err) {
      assert.ok(err, `Has error: ${err}`);
      assert.deepEqual(results, ['1.0', '2.0', '1.1']);
      done();
    });
  });

  it('parallelism 2 (errors 2)', function (done) {
    const queue = new Queue(2);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      setTimeout(function () {
        results.push('1.1');
        callback();
      }, 1 * 20);
    });
    queue.defer(function (callback) {
      results.push('2.0');
      setTimeout(function () {
        results.push('2.1');
        return callback(new Error('error'));
      }, 2 * 20);
    });
    queue.defer(function (callback) {
      results.push('3.0');
      setTimeout(function () {
        results.push('3.1');
        callback();
      }, 3 * 20);
    });
    return queue.await(function (err) {
      assert.ok(err, `Has error: ${err}`);
      assert.deepEqual(results, ['1.0', '2.0', '1.1', '3.0', '2.1']);
      done();
    });
  });

  it('catches await added twice', function (done) {
    const queue = new Queue(1);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      setTimeout(function () {
        results.push('1.1');
        callback();
      }, 1 * 20);
    });
    queue.defer(function (callback) {
      results.push('2.0');
      setTimeout(function () {
        results.push('2.1');
        return callback(new Error('error'));
      }, 2 * 20);
    });
    queue.defer(function (callback) {
      results.push('3.0');
      setTimeout(function () {
        results.push('3.1');
        callback();
      }, 3 * 20);
    });
    queue.await(function (err) {
      assert.ok(err, `Has error: ${err}`);
      assert.deepEqual(results, ['1.0', '1.1', '2.0', '2.1']);
      done();
    });
    try {
      return queue.await(function () {});
    } catch (error) {
      const err = error;
      assert.ok(err, `Has error: ${err}`);
      assert.ok(err.toString().indexOf('Error: Awaiting callback was added twice') === 0, 'Expected message');
    }
  });

  it('calls await if an error occurs before it is added', function (done) {
    const queue = new Queue(1);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      return callback(new Error('error'));
    });
    queue.defer(function (callback) {
      results.push('2.0');
      callback();
    });
    queue.defer(function (callback) {
      results.push('3.0');
      callback();
    });
    return queue.await(function (err) {
      assert.ok(err, `Has error: ${err}`);
      assert.deepEqual(results, ['1.0']);
      done();
    });
  });
});
