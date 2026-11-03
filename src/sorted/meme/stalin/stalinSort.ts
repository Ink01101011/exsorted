import { CompareFn, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { createSortCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Stalin Sort 🃏
 *
 * Walks the array once and keeps only the elements that are not smaller
 * than the last kept element. Everything out of order is "sent to the
 * gulag" (dropped). The result is sorted, but it is **lossy**: it usually
 * contains fewer elements than the input.
 *
 * This implementation is stable and returns a new array; the input is not mutated.
 *
 * Time complexity:  O(n)
 * Space complexity: O(n)
 *
 * @param arr - The array to "sort" (not mutated)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns A new sorted array holding the surviving elements
 */
export function stalinSort<T>(arr: T[], compareFn: CompareFn<T> = createSortCompareFn<T>()): SortedArray<T> {
  assertArrayInput(arr);

  if (arr.length === 0) return [];

  const result: SortedArray<T> = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (compareFn(arr[i], result[result.length - 1]) >= 0) {
      result.push(arr[i]);
    }
  }

  return result;
}
