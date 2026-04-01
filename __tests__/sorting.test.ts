import { bubbleSort } from '../src/sorted/bubbleSort';
import { insertionSort } from '../src/sorted/insertionSort';
import { selectionSort } from '../src/sorted/selectionSort';
import { mergeSort } from '../src/sorted/mergeSort';
import { quickSort } from '../src/sorted/quickSort';
import { heapSort } from '../src/sorted/heapSort';
import { CompareFn } from '../src/types/function-type';

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
