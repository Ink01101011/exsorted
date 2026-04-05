import { blockSort } from '../src/sorted/standard/block';

describe('blockSort', () => {
  it('sorts numbers in ascending order', () => {
    expect(blockSort([5, 3, 8, 1, 2])).toEqual([1, 2, 3, 5, 8]);
  });

  it('sorts numbers with a custom comparator', () => {
    const result = blockSort([5, 3, 8, 1, 2], (a, b) => b - a);
    expect(result).toEqual([8, 5, 3, 2, 1]);
  });

  it('returns the same array reference (in-place)', () => {
    const arr = [3, 1, 2];
    const result = blockSort(arr);
    expect(result).toBe(arr);
    expect(arr).toEqual([1, 2, 3]);
  });

  it('handles empty and single-element arrays', () => {
    expect(blockSort([])).toEqual([]);
    expect(blockSort([42])).toEqual([42]);
  });

  it('sorts objects using a custom comparator', () => {
    const people = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 },
    ];

    const result = blockSort(people, (a, b) => a.age - b.age);
    expect(result.map((p) => p.name)).toEqual(['Bob', 'Alice', 'Charlie']);
  });

  it('preserves relative order for equal keys (stability)', () => {
    const items = [
      { key: 2, id: 'a' },
      { key: 1, id: 'b' },
      { key: 2, id: 'c' },
      { key: 1, id: 'd' },
      { key: 2, id: 'e' },
      { key: 1, id: 'f' },
    ];

    const result = blockSort(items, (a, b) => a.key - b.key);

    expect(result.map((item) => item.id)).toEqual(['b', 'd', 'f', 'a', 'c', 'e']);
  });

  it('keeps original index order within each duplicate-key group on larger input', () => {
    const items = Array.from({ length: 96 }, (_, index) => ({
      key: index % 4,
      originalIndex: index,
    }));

    const result = blockSort(items, (a, b) => a.key - b.key);

    for (let i = 1; i < result.length; i += 1) {
      const prev = result[i - 1];
      const curr = result[i];
      if (prev.key === curr.key) {
        expect(prev.originalIndex).toBeLessThan(curr.originalIndex);
      }
    }
  });

  it('remains stable on large low-cardinality input (small internal buffer scenario)', () => {
    const size = 400;
    const items = Array.from({ length: size }, (_, index) => ({
      key: index % 2,
      originalIndex: index,
    }));

    const result = blockSort(items, (a, b) => a.key - b.key);

    const keys = result.map((item) => item.key);
    const splitIndex = keys.findIndex((key) => key === 1);

    expect(splitIndex).toBeGreaterThan(0);
    expect(keys.slice(0, splitIndex).every((key) => key === 0)).toBe(true);
    expect(keys.slice(splitIndex).every((key) => key === 1)).toBe(true);

    for (let i = 1; i < result.length; i += 1) {
      const prev = result[i - 1];
      const curr = result[i];
      if (prev.key === curr.key) {
        expect(prev.originalIndex).toBeLessThan(curr.originalIndex);
      }
    }
  });
});
