import { introSort } from '../src/sorted/standard/intro';

describe('introSort', () => {
  it('sorts numbers in ascending order', () => {
    expect(introSort([5, 3, 8, 1, 2])).toEqual([1, 2, 3, 5, 8]);
  });

  it('sorts numbers with a custom comparator', () => {
    const result = introSort([5, 3, 8, 1, 2], (a, b) => b - a);
    expect(result).toEqual([8, 5, 3, 2, 1]);
  });

  it('accepts a custom threshold', () => {
    const result = introSort([9, 1, 7, 3, 5, 2, 8, 6, 4], undefined, 8);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('interprets threshold as partition length cutoff (no off-by-one)', () => {
    let compareCount = 0;
    const compare = (a: number, b: number) => {
      compareCount += 1;
      return a - b;
    };

    introSort([3, 2, 1], compare, 2);

    // If threshold=2 is treated as length cutoff, a length-3 partition
    // still goes through partitioning before the final insertion pass.
    expect(compareCount).toBeGreaterThan(2);
  });

  it('returns the same array reference (in-place)', () => {
    const arr = [3, 1, 2];
    const result = introSort(arr);
    expect(result).toBe(arr);
    expect(arr).toEqual([1, 2, 3]);
  });

  it('handles empty and single-element arrays', () => {
    expect(introSort([])).toEqual([]);
    expect(introSort([42])).toEqual([42]);
  });

  it('sorts objects using a custom comparator', () => {
    const people = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 },
    ];

    const result = introSort(people, (a, b) => a.age - b.age);
    expect(result.map((p) => p.name)).toEqual(['Bob', 'Alice', 'Charlie']);
  });

  it('throws for invalid thresholds', () => {
    expect(() => introSort([3, 2, 1], undefined, 1)).toThrow(TypeError);
    expect(() => introSort([3, 2, 1], undefined, 2.5)).toThrow(TypeError);
    expect(() => introSort([3, 2, 1], undefined, Number.NaN)).toThrow(TypeError);
  });
});
