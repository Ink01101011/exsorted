import { cycleSort } from '../src/sorted/parallel/cycle/cycleSort';
import { compareBy } from '../src/utils/compareBy';
import * as parallelExports from '../src/sorted/parallel';
import * as sortedExports from '../src/sorted';

describe('cycleSort', () => {
  describe('numbers (ascending, default)', () => {
    it('sorts an unsorted array', () => {
      expect(cycleSort([5, 3, 8, 1, 2])).toEqual([1, 2, 3, 5, 8]);
    });

    it('returns an already-sorted array unchanged', () => {
      expect(cycleSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('sorts a reverse-sorted array', () => {
      expect(cycleSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
    });

    it('handles an empty array', () => {
      expect(cycleSort([])).toEqual([]);
    });

    it('handles a single-element array', () => {
      expect(cycleSort([42])).toEqual([42]);
    });

    it('handles an array with duplicate values', () => {
      expect(cycleSort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 6, 9]);
    });

    it('handles an array where all elements are equal', () => {
      expect(cycleSort([7, 7, 7, 7])).toEqual([7, 7, 7, 7]);
    });

    it('handles negative numbers', () => {
      expect(cycleSort([-3, -1, -4, -2])).toEqual([-4, -3, -2, -1]);
    });

    it('handles mixed negative and positive numbers', () => {
      expect(cycleSort([3, -2, 0, -1, 2])).toEqual([-2, -1, 0, 2, 3]);
    });
  });

  describe('numbers (descending, custom comparator)', () => {
    it('sorts in descending order', () => {
      expect(cycleSort([5, 3, 8, 1, 2], (a, b) => b - a)).toEqual([8, 5, 3, 2, 1]);
    });
  });

  describe('strings (alphabetical, default)', () => {
    it('sorts strings alphabetically', () => {
      expect(cycleSort(['banana', 'apple', 'cherry'])).toEqual(['apple', 'banana', 'cherry']);
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
      const result = cycleSort(input, byAge);
      expect(result.map((p) => p.name)).toEqual(['Bob', 'Alice', 'Charlie']);
    });

    it('works with compareBy helper', () => {
      const input = people.map((p) => ({ ...p }));
      const result = cycleSort(
        input,
        compareBy((p) => p.age),
      );
      expect(result.map((p) => p.name)).toEqual(['Bob', 'Alice', 'Charlie']);
    });
  });

  describe('objects (without custom comparator)', () => {
    it('sorts deterministically with the default comparator', () => {
      const input = [{ id: 2 }, { id: 1 }];
      expect(cycleSort(input)).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });

  describe('mutation', () => {
    it('mutates and returns the same array reference', () => {
      const arr = [3, 1, 2];
      const result = cycleSort(arr);
      expect(result).toBe(arr);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('parallel exports', () => {
    it('re-exports cycleSort from the parallel index', () => {
      expect(parallelExports.cycleSort).toBe(cycleSort);
    });
  });

  describe('sorted index exports', () => {
    it('re-exports cycleSort from the sorted index', () => {
      expect(sortedExports.cycleSort).toBe(cycleSort);
    });
  });
});
