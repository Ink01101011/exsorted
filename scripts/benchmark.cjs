const { performance } = require('node:perf_hooks');
const { gnomeSort, shellSort, timSort } = require('../dist/index.cjs');

const ALGORITHMS = [
  ['gnomeSort', gnomeSort],
  ['shellSort', shellSort],
  ['timSort', timSort],
];

const DEFAULT_SIZES = [1000, 3000, 7000];
const DEFAULT_REPEATS = 5;
const DEFAULT_WARMUP = 1;

function parseSizes(value) {
  if (!value) return DEFAULT_SIZES;
  const sizes = value
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((num) => Number.isFinite(num) && num > 0);
  return sizes.length > 0 ? sizes : DEFAULT_SIZES;
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function makeRandom(size) {
  return Array.from({ length: size }, () => randomInt(size * 10));
}

function makeSorted(size) {
  return Array.from({ length: size }, (_, i) => i);
}

function makeReversed(size) {
  return Array.from({ length: size }, (_, i) => size - i);
}

function makeNearlySorted(size) {
  const arr = makeSorted(size);
  const swaps = Math.max(1, Math.floor(size * 0.03));
  for (let i = 0; i < swaps; i += 1) {
    const a = randomInt(size);
    const b = randomInt(size);
    [arr[a], arr[b]] = [arr[b], arr[a]];
  }
  return arr;
}

function makeFewUnique(size) {
  return Array.from({ length: size }, () => randomInt(10));
}

const DATASETS = [
  ['random', makeRandom],
  ['sorted', makeSorted],
  ['reversed', makeReversed],
  ['nearlySorted', makeNearlySorted],
  ['fewUnique', makeFewUnique],
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

function runBenchmarks() {
  const sizes = parseSizes(process.env.BENCH_SIZES);
  const repeats = Number(process.env.BENCH_REPEATS || DEFAULT_REPEATS);
  const warmup = Number(process.env.BENCH_WARMUP || DEFAULT_WARMUP);

  const rows = [];

  for (const size of sizes) {
    for (const [datasetName, makeDataset] of DATASETS) {
      const input = makeDataset(size);

      for (const [name, sortFn] of ALGORITHMS) {
        const output = sortFn(input.slice());
        if (!isSortedAscending(output)) {
          throw new Error(`${name} failed sort verification for ${datasetName} size=${size}`);
        }

        const avgMs = measureMs(sortFn, input, repeats, warmup);
        rows.push({
          algorithm: name,
          dataset: datasetName,
          size,
          avgMs: Number(avgMs.toFixed(3)),
        });
      }
    }
  }

  console.log('Benchmark settings:');
  console.log(`  sizes=${sizes.join(', ')}`);
  console.log(`  repeats=${repeats}, warmup=${warmup}`);
  console.log('');
  console.table(rows);
}

runBenchmarks();
