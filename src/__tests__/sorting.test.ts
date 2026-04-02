import { bubbleSort } from '../sorted/base/bubble/bubbleSort';
import { insertionSort } from '../sorted/base/insertion/insertionSort';
import { selectionSort } from '../sorted/base/selection';
import { mergeSort } from '../sorted/base/merge';
import { quickSort } from '../sorted/base/quick/quickSort';
import { heapSort } from '../sorted/base/heap/heapSort';
import { CompareFn } from '../types/function-type';
import * as sortedExports from '../sorted';
import { compareBy } from '../utils/compareBy';
import { defaultCompareFn } from '../utils/defaultCompareFn';
import { selectionSort as selectionNamed } from '../base/selection';
import { bubbleSort as bubbleNamed } from '../base/bubble';

type SortFn<T> = (arr: T[], compareFn?: CompareFn<T>) => T[];

const ALGORITHMS: Array<[string, SortFn<unknown>]> = [
  ['bubbleSort', bubbleSort as SortFn<unknown>],
  ['insertionSort', insertionSort as SortFn<unknown>],
  ['selectionSort', selectionSort as SortFn<unknown>],
  ['mergeSort', mergeSort as SortFn<unknown>],
  ['quickSort', quickSort as SortFn<unknown>],
  ['heapSort', heapSort as SortFn<unknown>],
];

describe.each(ALGORITHMS)('%s', (name, sortFn) => {
  describe('numbers (ascending, default)', () => {
    it('sorts an unsorted array', () => {
      expect(sortFn([5, 3, 8, 1, 2])).toEqual([1, 2, 3, 5, 8]);
    });

    it('returns an already-sorted array unchanged', () => {
      expect(sortFn([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('sorts a reverse-sorted array', () => {
      expect(sortFn([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
    });

    it('handles an empty array', () => {
      expect(sortFn([])).toEqual([]);
    });

    it('handles a single-element array', () => {
      expect(sortFn([42])).toEqual([42]);
    });

    it('handles an array with duplicate values', () => {
      expect(sortFn([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 6, 9]);
    });

    it('handles an array where all elements are equal', () => {
      expect(sortFn([7, 7, 7, 7])).toEqual([7, 7, 7, 7]);
    });

    it('handles negative numbers', () => {
      expect(sortFn([-3, -1, -4, -2])).toEqual([-4, -3, -2, -1]);
    });

    it('handles mixed negative and positive numbers', () => {
      expect(sortFn([3, -2, 0, -1, 2])).toEqual([-2, -1, 0, 2, 3]);
    });
  });

  describe('numbers (descending, custom comparator)', () => {
    const descending = (a: number, b: number) => b - a;

    it('sorts in descending order', () => {
      expect((sortFn as SortFn<number>)([5, 3, 8, 1, 2], descending)).toEqual([8, 5, 3, 2, 1]);
    });
  });

  describe('strings (alphabetical, default)', () => {
    it('sorts strings alphabetically', () => {
      expect(sortFn(['banana', 'apple', 'cherry'])).toEqual(['apple', 'banana', 'cherry']);
    });
  });

  describe('objects (custom comparator)', () => {
    interface Person {
      name: string;
      age: number;
    }

    const byAge = (a: Person, b: Person) => a.age - b.age;
    const people: Person[] = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 },
    ];

    it('sorts objects by a numeric property', () => {
      const input = people.map((p) => ({ ...p }));
      const result = (sortFn as SortFn<Person>)(input, byAge);
      expect(result.map((p) => p.name)).toEqual(['Bob', 'Alice', 'Charlie']);
    });
  });

  describe('objects (without custom comparator)', () => {
    it('sorts deterministically with the default comparator', () => {
      const input = [{ id: 2 }, { id: 1 }];
      expect((sortFn as SortFn<{ id: number }>)(input)).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('handles cyclic object graphs without stack overflow', () => {
      const a: { id: number; self?: unknown } = { id: 2 };
      const b: { id: number; self?: unknown } = { id: 1 };
      a.self = a;
      b.self = b;

      const result = (sortFn as SortFn<typeof a>)([a, b]);
      expect(result.map((item) => item.id)).toEqual([1, 2]);
    });
  });
});

// Verify that in-place algorithms mutate the original array
describe.each([
  ['bubbleSort', bubbleSort],
  ['insertionSort', insertionSort],
  ['selectionSort', selectionSort],
  ['quickSort', quickSort],
  ['heapSort', heapSort],
] as Array<[string, SortFn<number>]>)('%s mutates the original array', (_, sortFn) => {
  it('returns the same array reference', () => {
    const arr = [3, 1, 2];
    const result = sortFn(arr);
    expect(result).toBe(arr);
  });
});

// mergeSort returns a new array (non-mutating)
describe('mergeSort returns a new array', () => {
  it('does not mutate the original array', () => {
    const arr = [3, 1, 2];
    const result = mergeSort(arr);
    expect(result).not.toBe(arr);
    expect(arr).toEqual([3, 1, 2]);
    expect(result).toEqual([1, 2, 3]);
  });
});

describe('sorted index exports', () => {
  it('re-exports all sorting functions', () => {
    expect(sortedExports.bubbleSort).toBe(bubbleSort);
    expect(sortedExports.insertionSort).toBe(insertionSort);
    expect(sortedExports.selectionSort).toBe(selectionSort);
    expect(sortedExports.mergeSort).toBe(mergeSort);
    expect(sortedExports.quickSort).toBe(quickSort);
    expect(sortedExports.heapSort).toBe(heapSort);
    expect(sortedExports.compareBy).toBe(compareBy);
  });
});

describe('compareBy helper', () => {
  it('builds a typed comparator from a selector', () => {
    const people = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 },
    ];

    const result = quickSort(
      people,
      compareBy((p) => p.age),
    );
    expect(result.map((p) => p.name)).toEqual(['Bob', 'Alice', 'Charlie']);
  });

  it('supports a custom key comparator', () => {
    const people = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 },
    ];

    const byAgeDesc = compareBy(
      (p: { name: string; age: number }) => p.age,
      (a, b) => b - a,
    );
    const result = heapSort(people, byAgeDesc);
    expect(result.map((p) => p.name)).toEqual(['Charlie', 'Alice', 'Bob']);
  });
});

describe('subpath entrypoints', () => {
  it('supports named imports for selection', () => {
    expect(selectionNamed).toBe(selectionSort);
    expect(selectionNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('supports named imports for bubble', () => {
    expect(bubbleNamed).toBe(bubbleSort);
    expect(bubbleNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });
});

describe('defaultCompareFn graph handling (TDD for path-stack + WeakMap)', () => {
  it('treats shared references as non-cyclic structural data', () => {
    const shared = { value: 1 };

    const withSharedRefs = {
      a: shared,
      b: shared,
    };

    const withDuplicatedStructure = {
      a: { value: 1 },
      b: { value: 1 },
    };

    // Shared references should not be classified as circular.
    // After path-stack + WeakMap implementation, these should compare equal.
    expect(defaultCompareFn(withSharedRefs, withDuplicatedStructure)).toBe(0);
    expect(defaultCompareFn(withDuplicatedStructure, withSharedRefs)).toBe(0);
  });

  it('still handles genuine cycles deterministically', () => {
    const left: { id: number; self?: unknown } = { id: 1 };
    left.self = left;

    const right: { id: number; self?: unknown } = { id: 1 };
    right.self = right;

    expect(() => defaultCompareFn(left, right)).not.toThrow();
    expect(defaultCompareFn(left, right)).toBe(0);
  });
});
