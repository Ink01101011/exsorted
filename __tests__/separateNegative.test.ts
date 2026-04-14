import { ERROR_MESSAGES } from '../src/constants';
import { buildStableNegativePrefix, separateBySignWithKeys } from '../src/utils/separateNegative';

describe('separateBySignWithKeys', () => {
  it('splits negatives and non-negatives while preserving order', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const keys = [-2, 1, -1, 0];

    const [negatives, negativeKeys, nonNegatives, nonNegativeKeys] = separateBySignWithKeys(arr, keys);

    expect(negatives).toEqual(['a', 'c']);
    expect(negativeKeys).toEqual([-2, -1]);
    expect(nonNegatives).toEqual(['b', 'd']);
    expect(nonNegativeKeys).toEqual([1, 0]);
  });

  it('throws when array and key lengths do not match', () => {
    expect(() => separateBySignWithKeys([1, 2, 3], [1, 2])).toThrow(ERROR_MESSAGES.KEY_CACHE_LENGTH_MISMATCH);
  });
});

describe('buildStableNegativePrefix', () => {
  it('rebuilds negatives in ascending numeric order and keeps ties stable', () => {
    const negatives = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
    const negativeAbsKeys = [2, 1, 1, 0];

    const result = buildStableNegativePrefix(negatives, negativeAbsKeys);

    expect(result.map((item) => item.id)).toEqual(['d', 'b', 'c', 'a']);
  });
});
