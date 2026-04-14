import { ERROR_MESSAGES, PIGEONHOLE_SORT_THRESHOLD_RANGE } from '../../../constants';
import { KeySelector, SortedArray } from '../../../types/function-type';
import { assertArrayInput, guardRange } from '../../../utils/assertion';
import { getMinMaxCachedKeys } from '../../../utils/keyCache';
import { keyGetter } from '../../../utils/keySelector';

/**
 * Pigeonhole Sort
 *
 * Sorts items by placing each item into a "hole" indexed by its integer key
 * offset from the minimum key, then concatenating holes in ascending key order.
 *
 * This implementation is stable and returns a new sorted array.
 *
 * Time complexity:  O(n + k)
 * Space complexity: O(n + k)
 * where n is the number of items and k is the key range (max - min + 1).
 *
 * @param arr - The array to sort (a new sorted array is returned)
 * @param keySelector - Required for non-number items; optional when sorting numbers. The selected key must be a safe integer.
 * @returns A new sorted array
 */
export function pigeonholeSort<T extends number>(arr: T[]): SortedArray<T>;
export function pigeonholeSort<T>(arr: T[], keySelector: KeySelector<T>): SortedArray<T>;
export function pigeonholeSort<T>(arr: T[], keySelector?: KeySelector<T>): SortedArray<T> {
  assertArrayInput(arr);

  const input = arr.slice();
  if (input.length < 2) return input;

  const getKey = keySelector ? keyGetter(keySelector) : (keyGetter() as KeySelector<T>);
  const [min, max, cachedKeys] = getMinMaxCachedKeys(input, getKey);
  const range = max - min + 1;
  guardRange(range, PIGEONHOLE_SORT_THRESHOLD_RANGE, ERROR_MESSAGES.PIGEONHOLE_SORT_RANGE_TOO_LARGE);

  const holes: T[][] = Array.from({ length: range }, () => [] as T[]);

  for (let i = 0; i < input.length; i++) {
    const key = cachedKeys[i];
    holes[key - min].push(input[i]);
  }

  const result: SortedArray<T> = [];
  for (const hole of holes) {
    result.push(...hole);
  }

  return result;
}
