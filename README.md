# exsorted

[![npm version](https://img.shields.io/npm/v/exsorted.svg)](https://www.npmjs.com/package/exsorted)
[![npm downloads](https://img.shields.io/npm/dm/exsorted.svg)](https://www.npmjs.com/package/exsorted)
[![CI](https://github.com/Ink01101011/exsorted/actions/workflows/ci.yml/badge.svg)](https://github.com/Ink01101011/exsorted/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/exsorted)](https://bundlephobia.com/package/exsorted)
[![Node.js](https://img.shields.io/node/v/exsorted)](https://www.npmjs.com/package/exsorted)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight, fully-typed TypeScript library of sorting algorithms — ready to use in any TypeScript or JavaScript project.

## Algorithms

| Algorithm      | Average Time | Worst Time | Space    | Stable | In-place |
| -------------- | ------------ | ---------- | -------- | ------ | -------- |
| Bubble Sort    | O(n²)        | O(n²)      | O(1)     | ✅     | ✅       |
| Insertion Sort | O(n²)        | O(n²)      | O(1)     | ✅     | ✅       |
| Selection Sort | O(n²)        | O(n²)      | O(1)     | ❌     | ✅       |
| Merge Sort     | O(n log n)   | O(n log n) | O(n)     | ✅     | ❌       |
| Quick Sort     | O(n log n)   | O(n²)      | O(log n) | ❌     | ✅       |
| Heap Sort      | O(n log n)   | O(n log n) | O(1)     | ❌     | ✅       |
| Tim Sort       | O(n log n)   | O(n log n) | O(n)     | ✅     | ✅       |

## Installation

```bash
npm install exsorted
```

## Quick Start

```typescript
import { bubbleSort, insertionSort, selectionSort, mergeSort, quickSort, heapSort, timSort, compareBy } from 'exsorted';

// Sort numbers ascending (default)
bubbleSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
mergeSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
timSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]

// Sort numbers descending (custom comparator)
quickSort([5, 3, 8, 1, 2], (a, b) => b - a); // [8, 5, 3, 2, 1]

// Sort strings
insertionSort(['banana', 'apple', 'cherry']); // ['apple', 'banana', 'cherry']

// Sort objects
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

// Or use compareBy helper for cleaner typed comparators
quickSort(
  people,
  compareBy((p) => p.age),
);
```

## Import Paths

The package supports both root import and grouped subpath imports.

```typescript
// Root import (recommended for most users)
import { quickSort, timSort, compareBy } from 'exsorted';

// Grouped subpath imports
import { bubbleSort, mergeSort } from 'exsorted/base';
import { timSort as timSortStandard } from 'exsorted/standard';
import { compareBy, defaultCompareFn } from 'exsorted/helper';
import type { CompareFn, SortedArray } from 'exsorted/types';
```

Available subpaths:

- `exsorted/base` -> bubbleSort, insertionSort, selectionSort, mergeSort, quickSort, heapSort
- `exsorted/standard` -> timSort
- `exsorted/helper` -> compareBy, defaultCompareFn
- `exsorted/types` -> CompareFn, SortedArray, SelectorFn
- `exsorted/meme` -> meme namespace exports

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

- In-place (returns same array reference): bubbleSort, insertionSort, selectionSort, quickSort, heapSort, timSort
- Non-mutating (returns new array): mergeSort

### Exported Algorithms

```typescript
bubbleSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
insertionSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
selectionSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
mergeSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
quickSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
heapSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
timSort<T>(arr: T[], compareFn?: CompareFn<T>): T[]
```

### Helper APIs

- `compareBy(selector, compareFn?)` builds a typed comparator for object sorting.
- `defaultCompareFn(a, b)` is the built-in fallback comparator.

### Consumer Notes

- For objects, passing an explicit comparator is recommended for domain-specific ordering.
- For stable ordering of equal keys, use a stable algorithm (bubbleSort, insertionSort, mergeSort, timSort).
- If you must preserve the original array, use mergeSort or sort a copied array (`algorithm([...arr])`).

## Compatibility

- Runtime: Node.js versions supported by this package (see Node badge above)
- Language: TypeScript and JavaScript
- Module formats: ESM and CommonJS (via package exports)

## License

[MIT](LICENSE)
