var nextTick = require('next-tick');

var Queue = require('../..');

var MAX_STACK = 10000;

describe('performance', function () {
  it('stack overflow', function (done) {
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
});
