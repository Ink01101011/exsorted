# exsorted

[![npm version](https://img.shields.io/npm/v/exsorted.svg)](https://www.npmjs.com/package/exsorted)
[![npm downloads](https://img.shields.io/npm/dm/exsorted.svg)](https://www.npmjs.com/package/exsorted)
[![CI](https://github.com/Ink01101011/exsorted/actions/workflows/ci.yml/badge.svg)](https://github.com/Ink01101011/exsorted/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/exsorted)](https://bundlephobia.com/package/exsorted)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight, fully-typed TypeScript library of sorting algorithms — ready to use in any TypeScript or JavaScript project.

Public utilities contract: `compareBy`, `defaultCompareFn`.
Compatibility note: `assertArrayInput` remains exported from `exsorted/helper` as deprecated.

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

**Note:** Counting Sort, Radix Sort, Bucket Sort, and Pigeonhole Sort use integer keys. $k$ is the key range, $d$ is the number of digits, and $b$ is the radix base.

## Installation

```bash
npm install exsorted
```

## Quick Start

### 1) Import from the root package

```typescript
import {
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
  compareBy,
} from 'exsorted';
```

### 2) Sort numbers (default ascending)

```typescript
bubbleSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
mergeSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
timSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
gnomeSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
shellSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
introSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
blockSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
countingSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
radixSort([170, 45, 75, 90, 802, 24, 2, 66]); // [2, 24, 45, 66, 75, 90, 170, 802]
bucketSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
pigeonholeSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
```

Special case: `mergeSort`, `countingSort`, `radixSort`, `bucketSort`, and `pigeonholeSort` return a new array (non-mutating), while most other algorithms sort in place.

### 3) Sort with a custom comparator

```typescript
quickSort([5, 3, 8, 1, 2], (a, b) => b - a); // [8, 5, 3, 2, 1]
insertionSort(['banana', 'apple', 'cherry']); // ['apple', 'banana', 'cherry']
```

### 4) introSort threshold (special case)

```typescript
introSort([5, 3, 8, 1, 2], 24); // custom threshold without placeholder arguments
introSort([5, 3, 8, 1, 2], (a, b) => a - b, 24); // comparator + threshold
```

`threshold` must be an integer >= 2. Recommended range: 8 to 32 (default: 16).

### 5) Counting Sort with key selector (non-comparison sort)

```typescript
// Sort integers directly
countingSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]

// Sort objects using a key selector (key must be a safe integer)
const users = [
  { name: 'Alice', score: 23 },
  { name: 'Bob', score: 18 },
  { name: 'Charlie', score: 45 },
];

countingSort(users, (user) => user.score);
// [{ name: 'Bob', score: 18 }, { name: 'Alice', score: 23 }, { name: 'Charlie', score: 45 }]
```

### 6) Sort objects

```typescript
interface Person {
  name: string;
  age: number;
}

const people: Person[] = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 },
];

heapSort(people, (a, b) => a.age - b.age);
// [{ name: 'Bob', age: 25 }, { name: 'Alice', age: 30 }, { name: 'Charlie', age: 35 }]
quickSort(
  people,
  compareBy((p) => p.age),
);
```

Special case: `compareBy` helps build typed object comparators with less boilerplate.

### 7) Radix Sort with negative and object keys

```typescript
radixSort([3, -1, 3, 0, -1, 2]); // [-1, -1, 0, 2, 3, 3]

const items = [
  { id: 'a', score: -2 },
  { id: 'b', score: 4 },
  { id: 'c', score: -1 },
];

radixSort(items, (item) => item.score);
// [{ id: 'a', score: -2 }, { id: 'c', score: -1 }, { id: 'b', score: 4 }]
```

## Import Paths

The package supports root imports, grouped subpath imports, and per-algorithm imports.

### 1) Root import (recommended)

```typescript
import { quickSort, timSort, compareBy } from 'exsorted';
```

Use this when you want simple, central imports.

### 2) Grouped subpath imports

```typescript
import { bubbleSort, mergeSort } from 'exsorted/base';
import { timSort, gnomeSort, shellSort, introSort, blockSort } from 'exsorted/standard';
import { countingSort, radixSort, bucketSort, pigeonholeSort } from 'exsorted/non-compare';
import { compareBy, defaultCompareFn } from 'exsorted/helper';
import type { CompareFn, SortedArray } from 'exsorted/types';
```

Use grouped imports when you want clearer boundaries by algorithm family.

### 3) Per-algorithm subpath imports

```typescript
import { bubbleSort as bubbleSortOnly } from 'exsorted/bubble';
import { gnomeSort as gnomeSortOnly } from 'exsorted/gnome';
import { shellSort as shellSortOnly } from 'exsorted/shell';
import { introSort as introSortOnly } from 'exsorted/intro';
import { blockSort as blockSortOnly } from 'exsorted/block';
import { countingSort as countingSortOnly } from 'exsorted/counting';
import { radixSort as radixSortOnly } from 'exsorted/radix';
import { bucketSort as bucketSortOnly } from 'exsorted/bucket';
import { pigeonholeSort as pigeonholeSortOnly } from 'exsorted/pigeonhole';
```

Special case: per-algorithm paths are useful for targeted imports in small bundles.

Available subpaths:

- `exsorted/base` -> bubbleSort, insertionSort, selectionSort, mergeSort, quickSort, heapSort
- `exsorted/standard` -> timSort, gnomeSort, shellSort, introSort, blockSort
- `exsorted/non-compare` -> countingSort, radixSort, bucketSort, pigeonholeSort
- `exsorted/helper` -> compareBy, defaultCompareFn
- `exsorted/types` -> CompareFn, KeySelector, SortedArray, SelectorFn
- `exsorted/meme` -> meme namespace exports
- Per-algorithm paths are also available: `exsorted/bubble`, `exsorted/insertion`, `exsorted/selection`, `exsorted/merge`, `exsorted/quick`, `exsorted/heap`, `exsorted/tim`, `exsorted/gnome`, `exsorted/shell`, `exsorted/intro`, `exsorted/block`, `exsorted/counting`, `exsorted/radix`, `exsorted/bucket`, `exsorted/pigeonhole`

## API Reference

Every function shares the same signature:

```typescript
function algorithmName<T>(arr: T[], compareFn?: (a: T, b: T) => number): T[];
```

- `arr` — the array to sort.
- `compareFn` (optional) — comparator with the same contract as `Array.prototype.sort`:
  - return **negative** if `a` should come before `b`
  - return **positive** if `a` should come after `b`
  - return **0** if order does not matter

### Mutation Behavior

- In-place (returns same array reference): bubbleSort, insertionSort, selectionSort, quickSort, heapSort, timSort, gnomeSort, shellSort, introSort, blockSort
- Non-mutating (returns new array): mergeSort, countingSort, radixSort, bucketSort, pigeonholeSort

### Exported Algorithms

#### Base algorithms

```typescript
bubbleSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
insertionSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
selectionSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
mergeSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
quickSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
heapSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
```

#### Standard algorithms

```typescript
timSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
gnomeSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
shellSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
introSort<T>(arr: T[]): T[]
introSort<T>(arr: T[], threshold: number): T[]
introSort<T>(arr: T[], compareFn: CompareFn<T>): T[]
introSort<T>(arr: T[], compareFn: CompareFn<T>, threshold: number): T[]
blockSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
```

#### Non-comparison algorithms

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

Special case: `countingSort`, `radixSort`, `bucketSort`, and `pigeonholeSort` accept an optional key selector for non-numeric items. The selected key must be a safe integer. Non-integer keys will throw a `TypeError`.

#### introSort usage notes (special case)

```typescript
introSort<T>(arr: T[]): T[]
introSort<T>(arr: T[], threshold: number): T[]
introSort<T>(arr: T[], compareFn: CompareFn<T>): T[]
introSort<T>(arr: T[], compareFn: CompareFn<T>, threshold: number): T[]
```

Special case: no placeholder call is needed. Prefer `introSort(arr, threshold)` when you only want to set threshold.

- `threshold` must be an integer `>= 2`.
- `threshold` is evaluated as partition length (number of elements).
- Recommended range: `8` to `32` (default is `16`).
- Lower values favor quick/heap partitioning longer; higher values switch to insertion sort earlier.

### Helper APIs

- `compareBy(selector, compareFn?)` builds a typed comparator for object sorting.
- `defaultCompareFn(a, b)` is the built-in fallback comparator.

### Consumer Notes

- For objects, passing an explicit comparator is recommended for domain-specific ordering.
- For stable ordering of equal keys, use a stable algorithm (bubbleSort, insertionSort, mergeSort, timSort, gnomeSort, blockSort, countingSort, radixSort, bucketSort, pigeonholeSort).
- If you must preserve the original array, use mergeSort, countingSort, radixSort, bucketSort, pigeonholeSort, or sort a copied array (`algorithm([...arr])`).

### Algorithm-Specific Notes

- **Block Sort**: Implemented as block-chunked insertion sorting followed by stable buffered merges for predictable correctness.
- **Shell Sort Stability**: `shellSort` is not stable by design. Equal elements may change relative order after sorting.
- **Counting Sort**: Optimal for small, dense integer key ranges. Performance degrades for sparse ranges. Maximum recommended key range: 1,000,000.
- **Radix Sort**: Works with safe integer keys and is typically efficient for integer data with bounded digit length.
- **Bucket Sort**: Uses range-based integer buckets and insertion sort per bucket. Typically efficient when values are reasonably well-distributed.
- **Pigeonhole Sort**: Best for dense integer key ranges. Memory usage scales with key range size.

\* Shell Sort average complexity depends on the chosen gap sequence.

## Compatibility

- Runtime: Node.js versions supported by this package (see Node badge above)
- Language: TypeScript and JavaScript
- Module formats: ESM and CommonJS (via package exports)

## License

[MIT](LICENSE)
