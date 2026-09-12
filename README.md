## queue-cb

A scalable queue for parallel callbacks.

The API is similar to https://github.com/d3/d3-queue, but without accumulating results in memory.

```bash
npm install queue-cb
```

```js
var Queue = require('queue-cb');

function delayedHello(callback) {
  setTimeout(function() {
    console.log("Hello!");
    callback(null);
  }, 250);
}

var q = new Queue(2); // at most two tasks run at once
q.defer(delayedHello);
q.defer(delayedHello);
q.await(function(error) {
  if (error) throw error;
  console.log("Goodbye!");
});
```

`new Queue()` allows unlimited concurrent tasks. Pass a positive limit to bound concurrency. Call `await` once after adding tasks. The completion callback receives the first task error; queued tasks stop starting, but tasks already running are not cancelled.

The package supports Node >=0.8 and both CommonJS and ES module imports. See the [API docs](https://kmalakoff.github.io/queue-cb/) for the full method signatures. The package is MIT licensed; report issues in the [GitHub repository](https://github.com/kmalakoff/queue-cb/issues).

### Documentation

[API Docs](https://kmalakoff.github.io/queue-cb/)
