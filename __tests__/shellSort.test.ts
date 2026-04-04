import { shellSort } from '../src/sorted/standard/shell';

describe('shellSort', () => {
  it('sorts numbers in ascending order', () => {
    expect(shellSort([5, 3, 8, 1, 2])).toEqual([1, 2, 3, 5, 8]);
  });

  it('sorts numbers with a custom comparator', () => {
    const result = shellSort([5, 3, 8, 1, 2], (a, b) => b - a);
    expect(result).toEqual([8, 5, 3, 2, 1]);
  });

  it('returns the same array reference (in-place)', () => {
    const arr = [3, 1, 2];
    const result = shellSort(arr);
    expect(result).toBe(arr);
    expect(arr).toEqual([1, 2, 3]);
  });

  it('handles empty and single-element arrays', () => {
    expect(shellSort([])).toEqual([]);
    expect(shellSort([42])).toEqual([42]);
  });

  it('sorts objects using a custom comparator', () => {
    const people = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 },
    ];

    const result = shellSort(people, (a, b) => a.age - b.age);
    expect(result.map((p) => p.name)).toEqual(['Bob', 'Alice', 'Charlie']);
  });
});
