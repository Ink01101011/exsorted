import { ERROR_MESSAGES } from '../src/constants';
import { radixSort } from '../src/sorted/non-compare/radix';

describe('radixSort', () => {
  it('sorts numbers in ascending order', () => {
    expect(radixSort([170, 45, 75, 90, 802, 24, 2, 66])).toEqual([2, 24, 45, 66, 75, 90, 170, 802]);
  });

  it('handles duplicates and negative numbers', () => {
    expect(radixSort([3, -1, 3, 0, -1, 2])).toEqual([-1, -1, 0, 2, 3, 3]);
  });

  it('returns a new array for length >= 2', () => {
    const input = [3, 1, 2];
    const result = radixSort(input);

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

    const result = radixSort(input, (item) => item.score);
    expect(result.map((item) => item.id)).toEqual(['a', 'b', 'c']);
  });

  it('is stable when keys are equal', () => {
    const input = [
      { id: 'first', score: 2 },
      { id: 'second', score: 1 },
      { id: 'third', score: 2 },
      { id: 'fourth', score: 1 },
    ];

    const result = radixSort(input, (item) => item.score);
    expect(result.map((item) => item.id)).toEqual(['second', 'fourth', 'first', 'third']);
  });

  it('is stable for duplicated negative keys', () => {
    const input = [
      { id: 'a', score: -2 },
      { id: 'b', score: -1 },
      { id: 'c', score: -2 },
      { id: 'd', score: 0 },
      { id: 'e', score: -1 },
    ];

    const result = radixSort(input, (item) => item.score);
    expect(result.map((item) => item.id)).toEqual(['a', 'c', 'b', 'e', 'd']);
  });

  it('calls keySelector exactly once per element', () => {
    const input = [{ score: 3 }, { score: 1 }, { score: 2 }, { score: 2 }];
    const keySelector = jest.fn((item: { score: number }) => item.score);

    radixSort(input, keySelector);

    expect(keySelector).toHaveBeenCalledTimes(input.length);
  });

  it('throws when sorting objects without keySelector', () => {
    const input = [{ score: 2 }, { score: 1 }] as unknown as number[];

    expect(() => radixSort(input)).toThrow(ERROR_MESSAGES.KEY_SELECTOR_REQUIRED);
  });

  it('throws when key is not an integer', () => {
    expect(() => radixSort([1.1, 2, 3])).toThrow(ERROR_MESSAGES.KEY_NOT_INTEGER);
    expect(() => radixSort([{ score: 1 }, { score: 2.5 }], (item) => item.score)).toThrow(
      ERROR_MESSAGES.KEY_NOT_INTEGER,
    );
  });
});
