var nextTick = require('../../lib/nextTick');
var Queue = require('../..');

var MAX_STACK = 100000;

describe('performance', function () {
  it('stack overflow (parallism 1)', function (done) {
    var queue = Queue(1);

    queue.defer(function (callback) {
      nextTick(callback);
    });
    for (var index = 0; index < MAX_STACK; index++) {
      queue.defer(function (callback) {
        callback();
      });
    }
    queue.await(done);
  });

  it('stack overflow (parallism 2)', function (done) {
    var queue = Queue(2);

    queue.defer(function (callback) {
      nextTick(callback);
    });
    for (var index = 0; index < MAX_STACK; index++) {
      queue.defer(function (callback) {
        callback();
      });
    }
    queue.await(done);
  });

  it('stack overflow (parallism Infinity)', function (done) {
    var queue = Queue();

    queue.defer(function (callback) {
      nextTick(callback);
    });
    for (var index = 0; index < MAX_STACK; index++) {
      queue.defer(function (callback) {
        callback();
      });
    }
    queue.await(done);
  });
});
