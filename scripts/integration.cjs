const assert = require('node:assert/strict');

function run() {
  const root = require('exsorted');
  const nonCompare = require('exsorted/non-compare');
  const counting = require('exsorted/counting');
  const radix = require('exsorted/radix');

  assert.equal(typeof root.quickSort, 'function');
  assert.equal(typeof root.countingSort, 'function');
  assert.equal(typeof root.radixSort, 'function');

  assert.deepEqual(nonCompare.countingSort([3, 1, 2]), [1, 2, 3]);
  assert.deepEqual(nonCompare.radixSort([3, -1, 2, -1]), [-1, -1, 2, 3]);

  assert.deepEqual(counting.countingSort([5, 4, 2]), [2, 4, 5]);
  assert.deepEqual(radix.radixSort([10, -5, 3]), [-5, 3, 10]);

  console.log('Integration checks passed');
}

run();
