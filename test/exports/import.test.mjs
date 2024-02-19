import assert from 'assert';
import Queue from 'queue-cb';

describe('exports .mjs', () => {
  it('Queue', () => {
    assert.equal(typeof Queue, 'function');
  });
});
