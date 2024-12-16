import assert from 'assert';
// @ts-ignore
import Queue from 'queue-cb';

describe('exports .ts', () => {
  it('Queue', () => {
    assert.equal(typeof Queue, 'function');
  });
});
