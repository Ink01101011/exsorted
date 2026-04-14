import { ERROR_MESSAGES } from '../src/constants';
import { pigeonholeSort } from '../src/sorted/non-compare/pigeonhole';

describe('pigeonholeSort', () => {
  it('sorts numbers in ascending order', () => {
    expect(pigeonholeSort([5, 3, 8, 1, 2])).toEqual([1, 2, 3, 5, 8]);
  });

  it('handles duplicates and negative numbers', () => {
    expect(pigeonholeSort([3, -1, 3, 0, -1, 2])).toEqual([-1, -1, 0, 2, 3, 3]);
  });

  it('returns a new array for length >= 2', () => {
    const input = [3, 1, 2];
    const result = pigeonholeSort(input);

    expect(result).toEqual([1, 2, 3]);
    expect(result).not.toBe(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it('supports objects with a key selector', () => {
    const input = [
      { id: 'c', score: 3 },
      { id: 'a', score: 1 },
      { id: 'b', score: 2 },
    ];

    const result = pigeonholeSort(input, (item) => item.score);
    expect(result.map((item) => item.id)).toEqual(['a', 'b', 'c']);
  });

  it('is stable when keys are equal', () => {
    const input = [
      { id: 'first', score: 2 },
      { id: 'second', score: 1 },
      { id: 'third', score: 2 },
      { id: 'fourth', score: 1 },
    ];

    const result = pigeonholeSort(input, (item) => item.score);
    expect(result.map((item) => item.id)).toEqual(['second', 'fourth', 'first', 'third']);
  });

  it('calls keySelector exactly once per element', () => {
    const input = [{ score: 3 }, { score: 1 }, { score: 2 }, { score: 2 }];
    const keySelector = jest.fn((item: { score: number }) => item.score);

    pigeonholeSort(input, keySelector);

    expect(keySelector).toHaveBeenCalledTimes(input.length);
  });

  it('throws when sorting objects without keySelector', () => {
    const input = [{ score: 2 }, { score: 1 }] as unknown as number[];

    expect(() => pigeonholeSort(input)).toThrow(ERROR_MESSAGES.KEY_SELECTOR_REQUIRED);
  });

  it('throws when key is not an integer', () => {
    expect(() => pigeonholeSort([1.1, 2, 3])).toThrow(ERROR_MESSAGES.KEY_NOT_INTEGER);
    expect(() => pigeonholeSort([{ score: 1 }, { score: 2.5 }], (item) => item.score)).toThrow(
      ERROR_MESSAGES.KEY_NOT_INTEGER,
    );
  });

  it('throws a pigeonhole-specific range error when the key range is too large', () => {
    expect(() => pigeonholeSort([0, 1_000_000])).toThrow(ERROR_MESSAGES.PIGEONHOLE_SORT_RANGE_TOO_LARGE(1_000_000));
  });
});
