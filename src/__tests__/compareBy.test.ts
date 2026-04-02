import { quickSort } from '../sorted/base/quick/quickSort';
import { heapSort } from '../sorted/base/heap/heapSort';
import { compareBy } from '../utils/compareBy';

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
