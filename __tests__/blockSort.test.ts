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

  it('remains stable on large low-cardinality input', () => {
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

  it('sorts benchmark regression case from random dataset', () => {
    const input = [
      775, 1492, 1861, 1706, 828, 1444, 1842, 785, 330, 1925, 1805, 457, 969, 1724, 489, 740, 1333, 1727, 1943, 1096,
      760, 989, 1349, 1941, 1233, 951, 199, 480, 1269, 449, 1077, 303, 1044, 531, 449, 608, 1978, 96, 1764, 1011, 1743,
      4, 1681, 1737, 715, 1929, 374, 954, 538, 593, 464, 548, 1305, 1762, 1576, 129, 230, 1112, 311, 1077, 1371, 1332,
      827, 457, 1186, 1490, 680, 1922, 1833, 530, 1880, 851, 191, 592, 72, 1330, 168, 405, 527, 882, 1404, 131, 1605,
      1931, 1043, 350, 990, 343, 1883, 1343, 135, 287, 1673, 1759, 1269, 1458, 1625, 1195, 1144, 1877, 431, 988, 1734,
      990, 697, 1687, 1967, 254, 376, 1747, 1026, 1640, 1472, 1187, 913, 1713, 264, 329, 260, 1228, 1505, 523, 1897,
      663, 237, 12, 791, 1189, 1853, 124, 1772, 1375, 136, 1850, 5, 1106, 576, 624, 1423, 217, 269, 183, 783, 1860,
      1427, 1175, 1616, 437, 1435, 756, 247, 85, 98, 1361, 287, 777, 811, 482, 1597, 268, 727, 1151, 1836, 832, 885,
      418, 1150, 496, 1413, 1465, 1768, 625, 1360, 180, 562, 1711, 858, 1147, 593, 1113, 1889, 1711, 32, 1816, 394, 47,
      1490, 86, 1850, 1946, 554, 30, 485, 24, 202, 1542, 691, 947, 544, 1291,
    ];

    const result = blockSort(input.slice());

    for (let i = 1; i < result.length; i += 1) {
      expect(result[i - 1]).toBeLessThanOrEqual(result[i]);
    }
  });
});
