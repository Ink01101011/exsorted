const { performance } = require('node:perf_hooks');
const { blockSort, mergeSort } = require('../dist/index.cjs');

const DEFAULT_SIZES = [200, 500, 1000, 2000];
const DEFAULT_REPEATS = 5;
const DEFAULT_WARMUP = 1;
const DEFAULT_SEED = 1337;

function parseSizes(value) {
  if (!value) return DEFAULT_SIZES;
  const sizes = value
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((num) => Number.isFinite(num) && num > 0);
  return sizes.length > 0 ? sizes : DEFAULT_SIZES;
}

function mulberry32(seed) {
  let t = seed >>> 0;

  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(rng, max) {
  return Math.floor(rng() * max);
}

function makeRandom(size, rng) {
  return Array.from({ length: size }, () => randomInt(rng, size * 10));
}

function makeFewUnique(size, rng) {
  return Array.from({ length: size }, () => randomInt(rng, 10));
}

function makeSorted(size) {
  return Array.from({ length: size }, (_, i) => i);
}

function makeReversed(size) {
  return Array.from({ length: size }, (_, i) => size - i);
}

function makeNearlySorted(size, rng) {
  const arr = makeSorted(size);
  const swaps = Math.max(1, Math.floor(size * 0.03));

  for (let i = 0; i < swaps; i += 1) {
    const a = randomInt(rng, size);
    const b = randomInt(rng, size);
    [arr[a], arr[b]] = [arr[b], arr[a]];
  }

  return arr;
}

const DATASETS = [
  ['random', makeRandom],
  ['fewUnique', makeFewUnique],
  ['sorted', makeSorted],
  ['reversed', makeReversed],
  ['nearlySorted', makeNearlySorted],
];

function isSortedAscending(arr) {
  for (let i = 1; i < arr.length; i += 1) {
    if (arr[i - 1] > arr[i]) return false;
  }
  return true;
}

function measureMs(fn, input, repeats, warmup) {
  for (let i = 0; i < warmup; i += 1) {
    fn(input.slice());
  }

  const start = performance.now();
  for (let i = 0; i < repeats; i += 1) {
    fn(input.slice());
  }
  const end = performance.now();

  return (end - start) / repeats;
}

function runProfile() {
  const sizes = parseSizes(process.env.BENCH_SIZES);
  const repeats = Number(process.env.BENCH_REPEATS || DEFAULT_REPEATS);
  const warmup = Number(process.env.BENCH_WARMUP || DEFAULT_WARMUP);
  const seed = Number(process.env.BENCH_SEED || DEFAULT_SEED);

  const rows = [];

  for (const size of sizes) {
    for (let datasetIndex = 0; datasetIndex < DATASETS.length; datasetIndex += 1) {
      const [datasetName, makeDataset] = DATASETS[datasetIndex];
      const rng = mulberry32(seed + size * 997 + datasetIndex * 7919);
      const input = makeDataset(size, rng);

      const blockOutput = blockSort(input.slice());
      if (!isSortedAscending(blockOutput)) {
        console.error('BlockSort verification failed');
        console.error(`dataset=${datasetName}, size=${size}, seed=${seed}`);
        console.error(`input=${JSON.stringify(input)}`);
        process.exit(1);
      }

      const blockMs = measureMs(blockSort, input, repeats, warmup);
      const mergeMs = measureMs(mergeSort, input, repeats, warmup);

      rows.push({
        dataset: datasetName,
        size,
        blockMs: Number(blockMs.toFixed(3)),
        mergeMs: Number(mergeMs.toFixed(3)),
        ratioToMerge: Number((blockMs / Math.max(mergeMs, Number.EPSILON)).toFixed(2)),
        seed,
      });
    }
  }

  const avgBlock = rows.reduce((sum, row) => sum + row.blockMs, 0) / rows.length;
  const avgMerge = rows.reduce((sum, row) => sum + row.mergeMs, 0) / rows.length;

  console.log('BlockSort deterministic benchmark profile');
  console.log(`seed=${seed}, sizes=${sizes.join(', ')}, repeats=${repeats}, warmup=${warmup}`);
  console.log(
    `avgBlockMs=${avgBlock.toFixed(3)}, avgMergeMs=${avgMerge.toFixed(3)}, ratio=${(avgBlock / Math.max(avgMerge, Number.EPSILON)).toFixed(2)}x`,
  );
  console.table(rows);
  console.log('Verification: all deterministic cases passed');
}

runProfile();
