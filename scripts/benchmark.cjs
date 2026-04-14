const { performance } = require('node:perf_hooks');
const {
  bubbleSort,
  insertionSort,
  selectionSort,
  mergeSort,
  quickSort,
  heapSort,
  timSort,
  gnomeSort,
  shellSort,
  introSort,
  blockSort,
  countingSort,
  radixSort,
  bucketSort,
  pigeonholeSort,
} = require('../dist/index.cjs');

const ALGORITHMS = [
  ['bubbleSort', bubbleSort],
  ['insertionSort', insertionSort],
  ['selectionSort', selectionSort],
  ['mergeSort', mergeSort],
  ['quickSort', quickSort],
  ['heapSort', heapSort],
  ['gnomeSort', gnomeSort],
  ['shellSort', shellSort],
  ['timSort', timSort],
  ['introSort', introSort],
  ['blockSort', blockSort],
  ['countingSort', countingSort],
  ['radixSort', radixSort],
  ['bucketSort', bucketSort],
  ['pigeonholeSort', pigeonholeSort],
];

const DEFAULT_SIZES = [200, 500, 1000];
const DEFAULT_REPEATS = 3;
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

function formatMarkdownSummary(rows) {
  const grouped = new Map();

  for (const row of rows) {
    const current = grouped.get(row.algorithm) || {
      totalMs: 0,
      passed: 0,
      total: 0,
    };

    current.total += 1;

    if (row.status === 'ok') {
      current.totalMs += row.avgMs;
      current.passed += 1;
    }

    grouped.set(row.algorithm, current);
  }

  const summary = Array.from(grouped.entries())
    .map(([algorithm, stats]) => ({
      algorithm,
      passed: stats.passed,
      total: stats.total,
      avgMs: stats.passed > 0 ? Number((stats.totalMs / stats.passed).toFixed(3)) : null,
    }))
    .sort((a, b) => {
      if (a.avgMs === null && b.avgMs === null) {
        return a.algorithm.localeCompare(b.algorithm);
      }
      if (a.avgMs === null) {
        return 1;
      }
      if (b.avgMs === null) {
        return -1;
      }
      return a.avgMs - b.avgMs;
    });

  const fastest = summary.find((item) => item.avgMs !== null)?.avgMs || 1;
  const lines = ['| Algorithm | Passed | Avg ms (passed cases) | Relative |', '| --- | ---: | ---: | ---: |'];

  for (const item of summary) {
    const avgMs = item.avgMs === null ? '—' : item.avgMs.toFixed(3);
    const relative = item.avgMs === null ? '—' : `${(item.avgMs / fastest).toFixed(2)}x`;
    lines.push(`| ${item.algorithm} | ${item.passed}/${item.total} | ${avgMs} | ${relative} |`);
  }

  return lines.join('\n');
}

function formatMarkdownFailures(rows) {
  const failedRows = rows.filter((row) => row.status !== 'ok');
  if (failedRows.length === 0) {
    return 'All algorithms passed verification in all cases.';
  }

  const lines = ['| Algorithm | Dataset | Size | Status |', '| --- | --- | ---: | --- |'];

  for (const row of failedRows) {
    lines.push(`| ${row.algorithm} | ${row.dataset} | ${row.size} | ${row.status} |`);
  }

  return lines.join('\n');
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
          rows.push({
            algorithm: name,
            dataset: datasetName,
            size,
            avgMs: Number.NaN,
            status: 'failed-verification',
          });
          continue;
        }

        const avgMs = measureMs(sortFn, input, repeats, warmup);
        rows.push({
          algorithm: name,
          dataset: datasetName,
          size,
          avgMs: Number(avgMs.toFixed(3)),
          status: 'ok',
        });
      }
    }
  }

  console.log('Benchmark settings:');
  console.log(`  sizes=${sizes.join(', ')}`);
  console.log(`  repeats=${repeats}, warmup=${warmup}`);
  console.log('');
  console.log('Summary (average across all datasets and sizes):');
  console.log(formatMarkdownSummary(rows));
  console.log('');
  console.log('Verification:');
  console.log(formatMarkdownFailures(rows));
  console.log('');
  console.log('Detailed results:');
  console.table(rows);
}

runBenchmarks();
