import { COUNTING_SORT_THRESHOLD_RANGE } from '../../../constants';
import { KeySelector, SortedArray } from '../../../types/function-type';
import { assertArrayInput, guardRange } from '../../../utils/assertion';
import { getMinMaxCachedKeys } from '../../../utils/keyCache';
import { keyGetter } from '../../../utils/keySelector';

/**
 * Counting Sort
 *
 * Sorts items by counting how many times each integer key appears, then using
 * cumulative counts to place items in sorted order.
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
export function countingSort<T extends number>(arr: T[]): SortedArray<T>;
export function countingSort<T>(arr: T[], keySelector: KeySelector<T>): SortedArray<T>;
export function countingSort<T>(arr: T[], keySelector?: KeySelector<T>): SortedArray<T> {
  assertArrayInput(arr);

  if (arr.length < 2) return arr.slice(); // Return a shallow copy for consistency

  const getKey = keySelector ? keyGetter(keySelector) : (keyGetter() as KeySelector<T>);
  const [min, max, cachedKeys] = getMinMaxCachedKeys(arr, getKey);
  const range = max - min + 1;
  guardRange(range, COUNTING_SORT_THRESHOLD_RANGE);

  const count = new Array<number>(range).fill(0);
  const output = new Array<T>(arr.length);

  for (const key of cachedKeys) {
    count[key - min]++;
  }

  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    const k = cachedKeys[i] - min;
    output[--count[k]] = arr[i];
  }

  return output;
}
