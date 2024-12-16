const assert = require('assert');
const Queue = require('queue-cb');

describe('exports .cjs', () => {
  it('Queue', () => {
    assert.equal(typeof Queue, 'function');
  });
});
