var assert = require('assert');
var nextTick = require('next-tick');

var Queue = require('../..');

describe('Queue', function () {
  it('infinite parallelism', function (done) {
    const queue = new Queue();

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      nextTick(function () {
        results.push('1.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('2.0');
      nextTick(function () {
        results.push('2.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('3.0');
      nextTick(function () {
        results.push('3.1');
        callback();
      });
    });
    return queue.await(function (err) {
      assert.ok(!err, 'No errors');
      assert.deepEqual(results, ['1.0', '2.0', '3.0', '1.1', '2.1', '3.1']);
      done();
    });
  });

  it('infinite parallelism (errors 1)', function (done) {
    const queue = new Queue();

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      nextTick(function () {
        results.push('1.1');
        return callback(new Error('error'));
      });
    });
    queue.defer(function (callback) {
      results.push('2.0');
      nextTick(function () {
        results.push('2.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('3.0');
      nextTick(function () {
        results.push('3.1');
        callback();
      });
    });
    return queue.await(function (err) {
      assert.ok(err, 'Has error: ' + err.message);
      assert.deepEqual(results, ['1.0', '2.0', '3.0', '1.1']);
      done();
    });
  });

  it('infinite parallelism (errors 2)', function (done) {
    const queue = new Queue();

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      nextTick(function () {
        results.push('1.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('2.0');
      nextTick(function () {
        results.push('2.1');
        return callback(new Error('error'));
      });
    });
    queue.defer(function (callback) {
      results.push('3.0');
      nextTick(function () {
        results.push('3.1');
        callback();
      });
    });
    return queue.await(function (err) {
      assert.ok(err, 'Has error: ' + err.message);
      assert.deepEqual(results, ['1.0', '2.0', '3.0', '1.1', '2.1']);
      done();
    });
  });

  it('parallelism 1', function (done) {
    const queue = new Queue(1);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      nextTick(function () {
        results.push('1.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('2.0');
      nextTick(function () {
        results.push('2.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('3.0');
      nextTick(function () {
        results.push('3.1');
        callback();
      });
    });
    return queue.await(function (err) {
      assert.ok(!err, 'No errors');
      assert.deepEqual(results, ['1.0', '1.1', '2.0', '2.1', '3.0', '3.1']);
      done();
    });
  });

  it('parallelism 1 (errors 1)', function (done) {
    const queue = new Queue(1);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      nextTick(function () {
        results.push('1.1');
        return callback(new Error('error'));
      });
    });
    queue.defer(function (callback) {
      results.push('2.0');
      nextTick(function () {
        results.push('2.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('3.0');
      nextTick(function () {
        results.push('3.1');
        callback();
      });
    });
    return queue.await(function (err) {
      assert.ok(err, 'Has error: ' + err.message);
      assert.deepEqual(results, ['1.0', '1.1']);
      done();
    });
  });

  it('parallelism 1 (errors 2)', function (done) {
    const queue = new Queue(1);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      nextTick(function () {
        results.push('1.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('2.0');
      nextTick(function () {
        results.push('2.1');
        return callback(new Error('error'));
      });
    });
    queue.defer(function (callback) {
      results.push('3.0');
      nextTick(function () {
        results.push('3.1');
        callback();
      });
    });
    return queue.await(function (err) {
      assert.ok(err, 'Has error: ' + err.message);
      assert.deepEqual(results, ['1.0', '1.1', '2.0', '2.1']);
      done();
    });
  });

  it('parallelism 2', function (done) {
    const queue = new Queue(2);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      nextTick(function () {
        results.push('1.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('2.0');
      nextTick(function () {
        results.push('2.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('3.0');
      nextTick(function () {
        results.push('3.1');
        callback();
      });
    });
    return queue.await(function (err) {
      assert.ok(!err, 'No errors');
      assert.deepEqual(results, ['1.0', '2.0', '1.1', '3.0', '2.1', '3.1']);
      done();
    });
  });

  it('parallelism 2 (errors 1)', function (done) {
    const queue = new Queue(2);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      nextTick(function () {
        results.push('1.1');
        return callback(new Error('error'));
      });
    });
    queue.defer(function (callback) {
      results.push('2.0');
      nextTick(function () {
        results.push('2.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('3.0');
      nextTick(function () {
        results.push('3.1');
        callback();
      });
    });
    return queue.await(function (err) {
      assert.ok(err, 'Has error: ' + err.message);
      assert.deepEqual(results, ['1.0', '2.0', '1.1']);
      done();
    });
  });

  it('parallelism 2 (errors 2)', function (done) {
    const queue = new Queue(2);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      nextTick(function () {
        results.push('1.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('2.0');
      nextTick(function () {
        results.push('2.1');
        return callback(new Error('error'));
      });
    });
    queue.defer(function (callback) {
      results.push('3.0');
      nextTick(function () {
        results.push('3.1');
        callback();
      });
    });
    return queue.await(function (err) {
      assert.ok(err, 'Has error: ' + err.message);
      assert.deepEqual(results, ['1.0', '2.0', '1.1', '3.0', '2.1']);
      done();
    });
  });

  it('catches await added twice', function (done) {
    const queue = new Queue(1);

    const results = [];
    queue.defer(function (callback) {
      results.push('1.0');
      nextTick(function () {
        results.push('1.1');
        callback();
      });
    });
    queue.defer(function (callback) {
      results.push('2.0');
      nextTick(function () {
        results.push('2.1');
        return callback(new Error('error'));
      });
    });
    queue.defer(function (callback) {
      results.push('3.0');
      nextTick(function () {
        results.push('3.1');
        callback();
      });
    });
    queue.await(function (err) {
      assert.ok(err, 'Has error: ' + err.message);
      assert.deepEqual(results, ['1.0', '1.1', '2.0', '2.1']);
      done();
    });
    try {
      return queue.await(function () {});
    } catch (error) {
      const err = error;
      assert.ok(err, 'Has error: ' + err.message);
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
      assert.ok(err, 'Has error: ' + err.message);
      assert.deepEqual(results, ['1.0']);
      done();
    });
  });
});
