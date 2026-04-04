import { gnomeSort } from '../src/sorted/standard/gnome';

describe('gnomeSort', () => {
  it('sorts numbers in ascending order', () => {
    expect(gnomeSort([5, 3, 8, 1, 2])).toEqual([1, 2, 3, 5, 8]);
  });

  it('sorts numbers with a custom comparator', () => {
    const result = gnomeSort([5, 3, 8, 1, 2], (a, b) => b - a);
    expect(result).toEqual([8, 5, 3, 2, 1]);
  });

  it('returns the same array reference (in-place)', () => {
    const arr = [3, 1, 2];
    const result = gnomeSort(arr);
    expect(result).toBe(arr);
    expect(arr).toEqual([1, 2, 3]);
  });

  it('is stable for equal keys', () => {
    const items = [
      { id: 1, group: 'A' },
      { id: 2, group: 'B' },
      { id: 3, group: 'A' },
      { id: 4, group: 'B' },
      { id: 5, group: 'A' },
    ];

    const result = gnomeSort(items, (a, b) => a.group.localeCompare(b.group));
    expect(result.map((item) => item.id)).toEqual([1, 3, 5, 2, 4]);
  });
});
