import { SortedArray, KeySelector } from '../../../types';
import { assertArrayInput } from '../../../utils';
import { THRESHOLD_RANGE, ERROR_MESSAGES } from '../../../constants/counting';

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
 * @param keySelector - Optional key selector for non-number items; key must be a finite integer
 * @returns A new sorted array
 */
export function countingSort<T extends number>(arr: T[]): SortedArray<T>;
export function countingSort<T>(arr: T[], keySelector: KeySelector<T>): SortedArray<T>;
export function countingSort<T>(arr: T[], keySelector?: KeySelector<T>): SortedArray<T> {
  assertArrayInput(arr);

  if (arr.length < 2) return arr;

  const firstItem = arr[0];
  if (!keySelector && typeof firstItem === 'object' && firstItem !== null) {
    throw new TypeError(ERROR_MESSAGES.KEY_SELECTOR_REQUIRED);
  }

  const [max, min, cachedKeys] = getMaxMinCacheKeys(arr, keyGetter(keySelector));
  const range = max - min + 1;
  guardRange(range);

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

function getMaxMinCacheKeys<T>(arr: T[], getKey: (item: T) => number): [number, number, Array<number>] {
  const cachedKeys = new Array<number>(arr.length);
  let max = -Infinity;
  let min = Infinity;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = getKey(item);

    // Cache the key for later use in counting sort
    cachedKeys[i] = key;

    // Update max and min
    if (key > max) {
      max = key;
    }
    if (key < min) {
      min = key;
    }
  }

  return [max, min, cachedKeys];
}

function keyGetter<T>(keySelector?: KeySelector<T>): KeySelector<T> {
  return (item: T) => convertor(item, keySelector);
}

function convertor<T>(item: T, keySelector?: KeySelector<T>): number {
  if (typeof item === 'number') {
    keyValidator(item);
    return item;
  }

  if (!keySelector) {
    throw new TypeError(ERROR_MESSAGES.CONVERTER_KEY_SELECTOR_REQUIRED);
  }

  const key = keySelector(item);
  keyValidator(key);

  return key;
}

function guardRange(size: number): void {
  if (size > THRESHOLD_RANGE) {
    throw new RangeError(ERROR_MESSAGES.RANGE_TOO_LARGE);
  }
}

function keyValidator<T extends number>(key: T): void {
  if (!Number.isInteger(key)) {
    throw new TypeError(ERROR_MESSAGES.KEY_NOT_INTEGER);
  }
}
