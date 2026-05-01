const assert = require('node:assert/strict');

const ROOT_EXPORTS = [
  'bubbleSort',
  'insertionSort',
  'selectionSort',
  'mergeSort',
  'quickSort',
  'heapSort',
  'timSort',
  'gnomeSort',
  'shellSort',
  'introSort',
  'blockSort',
  'countingSort',
  'radixSort',
  'bucketSort',
  'pigeonholeSort',
  'cycleSort',
  'bitonicSort',
  'cocktailShakerSort',
  'circleSort',
  'compareBy',
  'defaultCompareFn',
];

const BASE_EXPORTS = ['bubbleSort', 'insertionSort', 'selectionSort', 'mergeSort', 'quickSort', 'heapSort'];
const STANDARD_EXPORTS = ['timSort', 'gnomeSort', 'shellSort', 'introSort', 'blockSort'];
const NON_COMPARE_EXPORTS = ['countingSort', 'radixSort', 'bucketSort', 'pigeonholeSort'];
const PARALLEL_EXPORTS = ['cycleSort', 'bitonicSort', 'cocktailShakerSort', 'circleSort'];
const HELPER_EXPORTS = ['assertArrayInput', 'compareBy', 'defaultCompareFn'];

const SUBPATH_CASES = [
  ['exsorted/bubble', 'bubbleSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/insertion', 'insertionSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/selection', 'selectionSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/merge', 'mergeSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/quick', 'quickSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/heap', 'heapSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/tim', 'timSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/gnome', 'gnomeSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/shell', 'shellSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/intro', 'introSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/block', 'blockSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/counting', 'countingSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/radix', 'radixSort', [3, -1, 2, -1], [-1, -1, 2, 3]],
  ['exsorted/bucket', 'bucketSort', [3, -1, 2, -1], [-1, -1, 2, 3]],
  ['exsorted/pigeonhole', 'pigeonholeSort', [3, -1, 2, -1], [-1, -1, 2, 3]],
  ['exsorted/cycle', 'cycleSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/bitonic', 'bitonicSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/cocktail', 'cocktailShakerSort', [3, 2, 1], [1, 2, 3]],
  ['exsorted/circle', 'circleSort', [3, 2, 1], [1, 2, 3]],
];

function assertFunctionExports(mod, exportNames) {
  for (const name of exportNames) {
    assert.equal(typeof mod[name], 'function');
  }
}

function assertSubpathCases(modules) {
  for (const [path, exportName, input, expected] of SUBPATH_CASES) {
    assert.equal(typeof modules[path][exportName], 'function');
    assert.deepEqual(modules[path][exportName](input.slice()), expected);
  }
}

async function run() {
  const root = require('exsorted');
  const base = require('exsorted/base');
  const standard = require('exsorted/standard');
  const nonCompare = require('exsorted/non-compare');
  const parallel = require('exsorted/parallel');
  const helper = require('exsorted/helper');
  const types = require('exsorted/types');
  const meme = require('exsorted/meme');
  const counting = require('exsorted/counting');
  const radix = require('exsorted/radix');
  const bucket = require('exsorted/bucket');
  const pigeonhole = require('exsorted/pigeonhole');
  const cycle = require('exsorted/cycle');
  const bitonic = require('exsorted/bitonic');
  const cocktail = require('exsorted/cocktail');
  const circle = require('exsorted/circle');
  const bubble = require('exsorted/bubble');
  const insertion = require('exsorted/insertion');
  const selection = require('exsorted/selection');
  const merge = require('exsorted/merge');
  const quick = require('exsorted/quick');
  const heap = require('exsorted/heap');
  const tim = require('exsorted/tim');
  const gnome = require('exsorted/gnome');
  const shell = require('exsorted/shell');
  const intro = require('exsorted/intro');
  const block = require('exsorted/block');

  assertFunctionExports(root, ROOT_EXPORTS);
  assertFunctionExports(base, BASE_EXPORTS);
  assertFunctionExports(standard, STANDARD_EXPORTS);
  assertFunctionExports(nonCompare, NON_COMPARE_EXPORTS);
  assertFunctionExports(parallel, PARALLEL_EXPORTS);
  assert.deepEqual(Object.keys(helper).sort(), HELPER_EXPORTS);
  assert.deepEqual(Object.keys(types), []);
  assert.equal(meme.__exsortedMemeEntry, true);

  assert.deepEqual(nonCompare.countingSort([3, 1, 2]), [1, 2, 3]);
  assert.deepEqual(nonCompare.radixSort([3, -1, 2, -1]), [-1, -1, 2, 3]);
  assert.deepEqual(nonCompare.bucketSort([3, -1, 2, -1]), [-1, -1, 2, 3]);
  assert.deepEqual(nonCompare.pigeonholeSort([3, -1, 2, -1]), [-1, -1, 2, 3]);

  assert.deepEqual(counting.countingSort([5, 4, 2]), [2, 4, 5]);
  assert.deepEqual(radix.radixSort([10, -5, 3]), [-5, 3, 10]);
  assert.deepEqual(bucket.bucketSort([4, 1, 3]), [1, 3, 4]);
  assert.deepEqual(pigeonhole.pigeonholeSort([4, 1, 3]), [1, 3, 4]);

  assertSubpathCases({
    'exsorted/bubble': bubble,
    'exsorted/insertion': insertion,
    'exsorted/selection': selection,
    'exsorted/merge': merge,
    'exsorted/quick': quick,
    'exsorted/heap': heap,
    'exsorted/tim': tim,
    'exsorted/gnome': gnome,
    'exsorted/shell': shell,
    'exsorted/intro': intro,
    'exsorted/block': block,
    'exsorted/counting': counting,
    'exsorted/radix': radix,
    'exsorted/bucket': bucket,
    'exsorted/pigeonhole': pigeonhole,
    'exsorted/cycle': cycle,
    'exsorted/bitonic': bitonic,
    'exsorted/cocktail': cocktail,
    'exsorted/circle': circle,
  });

  const [
    rootEsm,
    baseEsm,
    standardEsm,
    nonCompareEsm,
    parallelEsm,
    helperEsm,
    typesEsm,
    memeEsm,
    bubbleEsm,
    insertionEsm,
    selectionEsm,
    mergeEsm,
    quickEsm,
    heapEsm,
    timEsm,
    gnomeEsm,
    shellEsm,
    introEsm,
    blockEsm,
    countingEsm,
    radixEsm,
    bucketEsm,
    pigeonholeEsm,
    cycleEsm,
    bitonicEsm,
    cocktailEsm,
    circleEsm,
  ] = await Promise.all([
    import('exsorted'),
    import('exsorted/base'),
    import('exsorted/standard'),
    import('exsorted/non-compare'),
    import('exsorted/parallel'),
    import('exsorted/helper'),
    import('exsorted/types'),
    import('exsorted/meme'),
    import('exsorted/bubble'),
    import('exsorted/insertion'),
    import('exsorted/selection'),
    import('exsorted/merge'),
    import('exsorted/quick'),
    import('exsorted/heap'),
    import('exsorted/tim'),
    import('exsorted/gnome'),
    import('exsorted/shell'),
    import('exsorted/intro'),
    import('exsorted/block'),
    import('exsorted/counting'),
    import('exsorted/radix'),
    import('exsorted/bucket'),
    import('exsorted/pigeonhole'),
    import('exsorted/cycle'),
    import('exsorted/bitonic'),
    import('exsorted/cocktail'),
    import('exsorted/circle'),
  ]);

  assertFunctionExports(rootEsm, ROOT_EXPORTS);
  assertFunctionExports(baseEsm, BASE_EXPORTS);
  assertFunctionExports(standardEsm, STANDARD_EXPORTS);
  assertFunctionExports(nonCompareEsm, NON_COMPARE_EXPORTS);
  assertFunctionExports(parallelEsm, PARALLEL_EXPORTS);
  assert.deepEqual(Object.keys(helperEsm).sort(), HELPER_EXPORTS);
  assert.deepEqual(Object.keys(typesEsm), []);
  assert.equal(memeEsm.__exsortedMemeEntry, true);

  assertSubpathCases({
    'exsorted/bubble': bubbleEsm,
    'exsorted/insertion': insertionEsm,
    'exsorted/selection': selectionEsm,
    'exsorted/merge': mergeEsm,
    'exsorted/quick': quickEsm,
    'exsorted/heap': heapEsm,
    'exsorted/tim': timEsm,
    'exsorted/gnome': gnomeEsm,
    'exsorted/shell': shellEsm,
    'exsorted/intro': introEsm,
    'exsorted/block': blockEsm,
    'exsorted/counting': countingEsm,
    'exsorted/radix': radixEsm,
    'exsorted/bucket': bucketEsm,
    'exsorted/pigeonhole': pigeonholeEsm,
    'exsorted/cycle': cycleEsm,
    'exsorted/bitonic': bitonicEsm,
    'exsorted/cocktail': cocktailEsm,
    'exsorted/circle': circleEsm,
  });

  console.log('Integration checks passed');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
