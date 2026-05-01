# exsorted — TypeScript Sorting Library with 19 Algorithms

[![npm version](https://img.shields.io/npm/v/exsorted.svg)](https://www.npmjs.com/package/exsorted)
[![npm downloads](https://img.shields.io/npm/dm/exsorted.svg)](https://www.npmjs.com/package/exsorted)
[![CI](https://github.com/Ink01101011/exsorted/actions/workflows/ci.yml/badge.svg)](https://github.com/Ink01101011/exsorted/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/exsorted)](https://bundlephobia.com/package/exsorted)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight, fully-typed TypeScript sorting library with **19 algorithms** — ready to drop into any TypeScript or JavaScript project.

```bash
npm install exsorted
```

## Table of Contents

- [Features](#features)
- [Algorithms](#algorithms)
- [Quick Start](#quick-start)
- [Import Paths](#import-paths)
- [API Reference](#api-reference)
- [Compatibility](#compatibility)
- [License](#license)

## Features

- **20 sorting algorithms** — bubble, insertion, selection, merge, quick, heap, tim, gnome, shell, intro, block, counting, radix, bucket, pigeonhole, cycle, bitonic, cocktail shaker, comb sort and circle sort
- **Fully typed** — complete TypeScript generics with `CompareFn`, `KeySelector`, and `SortedArray` types
- **Tree-shakeable** — import only what you need via per-algorithm subpaths
- **Dual module support** — ships as both ESM and CommonJS
- **Zero dependencies** — no runtime dependencies
- **Flexible API** — custom comparators and key selectors for any data shape

## Algorithms

| Algorithm       | Average Time  | Worst Time  | Space    | Stable | In-place |
| --------------- | ------------- | ----------- | -------- | ------ | -------- |
| Bubble Sort     | O(n²)         | O(n²)       | O(1)     | ✅     | ✅       |
| Insertion Sort  | O(n²)         | O(n²)       | O(1)     | ✅     | ✅       |
| Selection Sort  | O(n²)         | O(n²)       | O(1)     | ❌     | ✅       |
| Merge Sort      | O(n log n)    | O(n log n)  | O(n)     | ✅     | ❌       |
| Quick Sort      | O(n log n)    | O(n²)       | O(log n) | ❌     | ✅       |
| Heap Sort       | O(n log n)    | O(n log n)  | O(1)     | ❌     | ✅       |
| Tim Sort        | O(n log n)    | O(n log n)  | O(n)     | ✅     | ✅       |
| Gnome Sort      | O(n²)         | O(n²)       | O(1)     | ✅     | ✅       |
| Shell Sort      | O(n log² n)\* | O(n²)       | O(1)     | ❌     | ✅       |
| Intro Sort      | O(n log n)    | O(n log n)  | O(log n) | ❌     | ✅       |
| Block Sort      | O(n log n)    | O(n log n)  | O(n)     | ✅     | ✅       |
| Counting Sort   | O(n + k)      | O(n + k)    | O(n + k) | ✅     | ❌       |
| Radix Sort      | O(d(n + b))   | O(d(n + b)) | O(n + b) | ✅     | ❌       |
| Bucket Sort     | O(n + k)      | O(n²)       | O(n + k) | ✅     | ❌       |
| Pigeonhole Sort | O(n + k)      | O(n + k)    | O(n + k) | ✅     | ❌       |
| Cycle Sort      | O(n²)         | O(n²)       | O(1)     | ❌     | ✅       |
| Bitonic Sort    | O(n log² n)   | O(n log² n) | O(n)     | ❌     | ✅       |
| Cocktail Sort   | O(n²)         | O(n²)       | O(1)     | ✅     | ✅       |
| Circle Sort     | O(n²)         | O(n²)       | O(log n) | ❌     | ✅       |
| Comb Sort       | O(n²)         | O(n²)       | O(1)     | ❌     | ✅       |

> Counting Sort, Radix Sort, Bucket Sort, and Pigeonhole Sort operate on integer keys. _k_ = key range, _d_ = number of digits, _b_ = radix base.

\* Shell Sort average complexity depends on the chosen gap sequence.

### When to use which algorithm

- **General-purpose**: `timSort` or `introSort` — production-grade performance across most inputs
- **Stable + fast**: `mergeSort`, `timSort`, or `blockSort` — preserves relative order of equal elements
- **In-place + fast**: `quickSort`, `heapSort`, or `introSort` — no extra memory allocation
- **Integer data**: `countingSort`, `radixSort`, `bucketSort`, or `pigeonholeSort` — linear time for bounded integer keys
- **Nearly sorted data**: `insertionSort` or `timSort` — highly efficient on already-ordered arrays
- **Learning/comparison**: `bubbleSort`, `insertionSort`, `selectionSort` — simple to trace and understand
- **Minimum writes**: `cycleSort` — minimises array writes; useful when write cost is expensive
- **Predictable sorting network**: `bitonicSort` — fixed compare/swap structure with support for non-power-of-2 lengths

## Quick Start

### Sort numbers

```typescript
import {
  bubbleSort,
  mergeSort,
  timSort,
  quickSort,
  cycleSort,
  bitonicSort,
  cocktailShakerSort,
  circleSort,
  combSort,
} from 'exsorted';

bubbleSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
mergeSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8] — returns new array
timSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
quickSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
cycleSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
bitonicSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
cocktailShakerSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
circleSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
combSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
```

`mergeSort`, `countingSort`, `radixSort`, `bucketSort`, and `pigeonholeSort` return a **new array** (non-mutating). All other algorithms sort **in place**.

### Sort with a custom comparator

```typescript
import { quickSort, insertionSort } from 'exsorted';

// Descending order
quickSort([5, 3, 8, 1, 2], (a, b) => b - a); // [8, 5, 3, 2, 1]

// Strings
insertionSort(['banana', 'apple', 'cherry']); // ['apple', 'banana', 'cherry']
```

### Sort objects

```typescript
import { heapSort, quickSort, compareBy } from 'exsorted';

interface Person {
  name: string;
  age: number;
}

const people: Person[] = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 },
];

// Manual comparator
heapSort(people, (a, b) => a.age - b.age);

// compareBy helper — less boilerplate for object sorting
quickSort(
  people,
  compareBy((p) => p.age),
);
```

### Non-comparison sorts (integer keys)

```typescript
import { countingSort, radixSort } from 'exsorted';

// Sort integers
countingSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]

// Radix Sort supports negative integers
radixSort([3, -1, 3, 0, -1, 2]); // [-1, -1, 0, 2, 3, 3]

// Sort objects by integer key
const users = [
  { name: 'Alice', score: 23 },
  { name: 'Bob', score: 18 },
  { name: 'Charlie', score: 45 },
];
countingSort(users, (u) => u.score);
// [{ name: 'Bob', score: 18 }, { name: 'Alice', score: 23 }, { name: 'Charlie', score: 45 }]

const items = [
  { id: 'a', score: -2 },
  { id: 'b', score: 4 },
  { id: 'c', score: -1 },
];
radixSort(items, (item) => item.score);
// [{ id: 'a', score: -2 }, { id: 'c', score: -1 }, { id: 'b', score: 4 }]
```

### introSort threshold

```typescript
import { introSort } from 'exsorted';

introSort([5, 3, 8, 1, 2], 24); // threshold only
introSort([5, 3, 8, 1, 2], (a, b) => a - b, 24); // comparator + threshold
```

`threshold` controls when introSort switches to insertion sort. Must be `>= 2`; recommended range: 8–32; default: 16.

## Import Paths

### Root import (recommended)

```typescript
import { quickSort, timSort, compareBy } from 'exsorted';
```

### Grouped subpath imports

```typescript
import { bubbleSort, mergeSort } from 'exsorted/base';
import { timSort, gnomeSort, shellSort, introSort, blockSort } from 'exsorted/standard';
import { countingSort, radixSort, bucketSort, pigeonholeSort } from 'exsorted/non-compare';
import { cycleSort, bitonicSort, cocktailShakerSort, combSort, circleSort } from 'exsorted/parallel';
import { compareBy, defaultCompareFn } from 'exsorted/helper';
import type { CompareFn, SortedArray } from 'exsorted/types';
```

### Per-algorithm imports (smallest bundle)

```typescript
import { bubbleSort } from 'exsorted/bubble';
import { gnomeSort } from 'exsorted/gnome';
import { countingSort } from 'exsorted/counting';
import { radixSort } from 'exsorted/radix';
import { cycleSort } from 'exsorted/cycle';
import { bitonicSort } from 'exsorted/bitonic';
import { cocktailShakerSort } from 'exsorted/cocktail';
import { circleSort } from 'exsorted/circle';
import { combSort } from 'exsorted/comb';
// ...and so on for each algorithm
```

**Available subpaths:**

- `exsorted/base`: bubbleSort, insertionSort, selectionSort, mergeSort, quickSort, heapSort
- `exsorted/standard`: timSort, gnomeSort, shellSort, introSort, blockSort
- `exsorted/non-compare`: countingSort, radixSort, bucketSort, pigeonholeSort
- `exsorted/parallel`: cycleSort, bitonicSort, cocktailShakerSort, circleSort, combSort
- `exsorted/helper`: compareBy, defaultCompareFn
- `exsorted/types`: CompareFn, KeySelector, SortedArray, SelectorFn
- `exsorted/<name>`: Single algorithm subpaths: bubble, insertion, selection, merge, quick, heap, tim, gnome, shell, intro, block, counting, radix, bucket, pigeonhole, cycle, bitonic, cocktail, circle

## API Reference

### Comparator-based algorithms

Every comparison-based function shares the same signature:

```typescript
function algorithmName<T>(arr: T[], compareFn?: (a: T, b: T) => number): T[];
```

- `arr` — the array to sort
- `compareFn` _(optional)_ — same contract as `Array.prototype.sort`:
  - negative → `a` comes before `b`
  - positive → `a` comes after `b`
  - `0` → order does not matter

#### Base algorithms

```typescript
bubbleSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
insertionSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
selectionSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
mergeSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]   // returns new array
quickSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
heapSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
```

#### Standard algorithms

```typescript
timSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
gnomeSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
shellSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
blockSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]

// introSort overloads
introSort<T>(arr: T[]): T[]
introSort<T>(arr: T[], threshold: number): T[]
introSort<T>(arr: T[], compareFn: CompareFn<T>): T[]
introSort<T>(arr: T[], compareFn: CompareFn<T>, threshold: number): T[]
```

#### Parallel algorithms

```typescript
cycleSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
bitonicSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
cocktailShakerSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
circleSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
combSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
```

### Non-comparison algorithms

These operate on integer keys and always return a new array:

```typescript
countingSort<T extends number>(arr: T[]): T[]
countingSort<T>(arr: T[], keySelector: (item: T) => number): T[]

radixSort<T extends number>(arr: T[]): T[]
radixSort<T>(arr: T[], keySelector: (item: T) => number): T[]

bucketSort<T extends number>(arr: T[]): T[]
bucketSort<T>(arr: T[], keySelector: (item: T) => number): T[]

pigeonholeSort<T extends number>(arr: T[]): T[]
pigeonholeSort<T>(arr: T[], keySelector: (item: T) => number): T[]
```

The `keySelector` must return a safe integer. Non-integer keys throw a `TypeError`.

### Helper APIs

```typescript
compareBy<T>(selector: (item: T) => unknown, compareFn?: CompareFn): CompareFn<T>
defaultCompareFn(a: unknown, b: unknown): number
```

`compareBy` builds a typed object comparator with less boilerplate than a manual `(a, b) => a.field - b.field`.

### Mutation Behavior

- In-place: all algorithms except mergeSort, countingSort, radixSort, bucketSort, and pigeonholeSort
- New array: mergeSort, countingSort, radixSort, bucketSort, pigeonholeSort

To preserve the original array with an in-place algorithm: `algorithm([...arr])`.

### Algorithm Notes

- **Block Sort** — block-chunked insertion sorting followed by stable buffered merges.
- **Shell Sort** — not stable; equal elements may change relative order.
- **Bitonic Sort** — pads to the next power of two internally so arbitrary-length arrays still work with the bitonic network.
- **Circle Sort** — recursively compares mirrored pairs in each segment until a no-swap pass.
- **Comb Sort** — uses a shrink factor on comparison gap to remove turtles (small values near the end) before the final gap-1 pass.
- **Counting Sort** — optimal for small, dense integer ranges. Avoid sparse ranges > 1,000,000.
- **Radix Sort** — efficient for integer data with bounded digit length; supports negative integers.
- **Bucket Sort** — range-based integer buckets with per-bucket insertion sort; best for well-distributed data.
- **Pigeonhole Sort** — best for dense integer key ranges; memory usage scales with key range size.

### Tips

- For stable ordering of equal keys, use a stable algorithm: bubbleSort, insertionSort, mergeSort, timSort, gnomeSort, blockSort, countingSort, radixSort, bucketSort, or pigeonholeSort.
- For objects, pass an explicit comparator or use `compareBy` for domain-specific ordering.

## Compatibility

- **Runtime**: Node.js (see CI badge for tested versions)
- **Language**: TypeScript and JavaScript
- **Modules**: ESM and CommonJS via package exports

## License

[MIT](LICENSE)
