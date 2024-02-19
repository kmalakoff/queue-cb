const assert = require('assert');
const Queue = require('queue-cb');

describe('exports .ts', () => {
  it('Queue', () => {
    assert.equal(typeof Queue, 'function');
  });
});
