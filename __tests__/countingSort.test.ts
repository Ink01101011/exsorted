import { countingSort } from '../src/sorted/non-compare/counting';
import { ERROR_MESSAGES } from '../src/constants/counting';

describe('countingSort', () => {
  it('sorts numbers in ascending order', () => {
    expect(countingSort([5, 3, 8, 1, 2])).toEqual([1, 2, 3, 5, 8]);
  });

  it('handles duplicates and negative numbers', () => {
    expect(countingSort([3, -1, 3, 0, -1, 2])).toEqual([-1, -1, 0, 2, 3, 3]);
  });

  it('returns a new array for length >= 2', () => {
    const input = [3, 1, 2];
    const result = countingSort(input);

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

    const result = countingSort(input, (item) => item.score);
    expect(result.map((item) => item.id)).toEqual(['a', 'b', 'c']);
  });

  it('is stable when keys are equal', () => {
    const input = [
      { id: 'first', score: 2 },
      { id: 'second', score: 1 },
      { id: 'third', score: 2 },
      { id: 'fourth', score: 1 },
    ];

    const result = countingSort(input, (item) => item.score);
    expect(result.map((item) => item.id)).toEqual(['second', 'fourth', 'first', 'third']);
  });

  it('calls keySelector exactly once per element', () => {
    const input = [{ score: 3 }, { score: 1 }, { score: 2 }, { score: 2 }];
    const keySelector = jest.fn((item: { score: number }) => item.score);

    countingSort(input, keySelector);

    expect(keySelector).toHaveBeenCalledTimes(input.length);
  });

  it('throws when sorting objects without keySelector', () => {
    const input = [{ score: 2 }, { score: 1 }] as unknown as number[];

    expect(() => countingSort(input)).toThrow(ERROR_MESSAGES.KEY_SELECTOR_REQUIRED);
  });

  it('throws when key is not an integer', () => {
    expect(() => countingSort([1.1, 2, 3])).toThrow(ERROR_MESSAGES.KEY_NOT_INTEGER);
    expect(() => countingSort([{ score: 1 }, { score: 2.5 }], (item) => item.score)).toThrow(
      ERROR_MESSAGES.KEY_NOT_INTEGER,
    );
  });

  it('throws when key range is too large', () => {
    expect(() => countingSort([0, 1_000_001])).toThrow(ERROR_MESSAGES.RANGE_TOO_LARGE);
  });

  it('applies keySelector to numeric arrays when provided', () => {
    const input = [1, -2, 3, -1];
    const result = countingSort(input, (x) => Math.abs(x));

    // Stable sort: elements with same key (abs) maintain original order
    // keys: [1, 2, 3, 1] → sorted by key: 1, 1, 2, 3 → [1, -1, -2, 3]
    expect(result).toEqual([1, -1, -2, 3]);
  });

  it('rejects non-integer values like Infinity', () => {
    expect(() => countingSort([1, Infinity])).toThrow(ERROR_MESSAGES.KEY_NOT_INTEGER);
  });

  it('rejects non-integer values like NaN', () => {
    expect(() => countingSort([1, NaN])).toThrow(ERROR_MESSAGES.KEY_NOT_INTEGER);
  });
});
