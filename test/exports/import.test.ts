import assert from 'assert';
import Queue from 'queue-cb';

describe('exports .ts', () => {
  it('Queue', () => {
    assert.equal(typeof Queue, 'function');
  });
});
