import { bitonicSort } from '../src/sorted/parallel/bitonic/bitonicSort';
import { compareBy } from '../src/utils/compareBy';
import * as parallelExports from '../src/sorted/parallel';
import * as sortedExports from '../src/sorted';

describe('bitonicSort', () => {
  describe('numbers (ascending, default)', () => {
    it('sorts an unsorted array', () => {
      expect(bitonicSort([5, 3, 8, 1, 2])).toEqual([1, 2, 3, 5, 8]);
    });

    it('returns an already-sorted array unchanged', () => {
      expect(bitonicSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('sorts a reverse-sorted array', () => {
      expect(bitonicSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
    });

    it('handles an empty array', () => {
      expect(bitonicSort([])).toEqual([]);
    });

    it('handles a single-element array', () => {
      expect(bitonicSort([42])).toEqual([42]);
    });

    it('handles an array with duplicate values', () => {
      expect(bitonicSort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 6, 9]);
    });

    it('handles an array where all elements are equal', () => {
      expect(bitonicSort([7, 7, 7, 7])).toEqual([7, 7, 7, 7]);
    });

    it('handles negative numbers', () => {
      expect(bitonicSort([-3, -1, -4, -2])).toEqual([-4, -3, -2, -1]);
    });

    it('handles mixed negative and positive numbers', () => {
      expect(bitonicSort([3, -2, 0, -1, 2])).toEqual([-2, -1, 0, 2, 3]);
    });

    it('handles a power-of-2 length array', () => {
      expect(bitonicSort([8, 6, 4, 2, 7, 5, 3, 1])).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('handles a non-power-of-2 length array', () => {
      expect(bitonicSort([6, 3, 5, 1, 4, 2])).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('numbers (descending, custom comparator)', () => {
    it('sorts in descending order', () => {
      expect(bitonicSort([5, 3, 8, 1, 2], (a, b) => b - a)).toEqual([8, 5, 3, 2, 1]);
    });
  });

  describe('strings (alphabetical, default)', () => {
    it('sorts strings alphabetically', () => {
      expect(bitonicSort(['banana', 'apple', 'cherry'])).toEqual(['apple', 'banana', 'cherry']);
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
      const result = bitonicSort(input, byAge);
      expect(result.map((p) => p.name)).toEqual(['Bob', 'Alice', 'Charlie']);
    });

    it('works with compareBy helper', () => {
      const input = people.map((p) => ({ ...p }));
      const result = bitonicSort(
        input,
        compareBy((p) => p.age),
      );
      expect(result.map((p) => p.name)).toEqual(['Bob', 'Alice', 'Charlie']);
    });
  });

  describe('objects (without custom comparator)', () => {
    it('sorts deterministically with the default comparator', () => {
      const input = [{ id: 2 }, { id: 1 }];
      expect(bitonicSort(input)).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });

  describe('mutation', () => {
    it('mutates and returns the same array reference', () => {
      const arr = [3, 1, 2];
      const result = bitonicSort(arr);
      expect(result).toBe(arr);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('parallel exports', () => {
    it('re-exports bitonicSort from the parallel index', () => {
      expect(parallelExports.bitonicSort).toBe(bitonicSort);
    });
  });

  describe('sorted index exports', () => {
    it('re-exports bitonicSort from the sorted index', () => {
      expect(sortedExports.bitonicSort).toBe(bitonicSort);
    });
  });
});
