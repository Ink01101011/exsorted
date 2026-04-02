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

## Installation

```bash
npm install exsorted
```

## Usage

```typescript
import { bubbleSort, insertionSort, selectionSort, mergeSort, quickSort, heapSort, compareBy } from 'exsorted';

// Sort numbers ascending (default)
bubbleSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
mergeSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]

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

### API

Every function shares the same signature:

```typescript
function algorithmName<T>(arr: T[], compareFn?: (a: T, b: T) => number): T[];
```

- **`arr`** — the array to sort.  
  _Most algorithms sort in-place (mutate `arr`). `mergeSort` is the exception — it returns a new array and leaves the original untouched._
- **`compareFn`** _(optional)_ — behaves like the native `Array.prototype.sort` comparator:
  - return **negative** if `a` should come before `b`
  - return **positive** if `a` should come after `b`
  - return **0** if order does not matter  
    Defaults to a dynamic deterministic comparator:
    supports `number`, `string`, `bigint`, `boolean`, `Date`, arrays, and objects.
    For domain-specific object ordering, passing an explicit `compareFn` is still recommended.

  `compareBy(selector, compareFn?)` helper is exported to build typed object comparators.

## License

[MIT](LICENSE)
