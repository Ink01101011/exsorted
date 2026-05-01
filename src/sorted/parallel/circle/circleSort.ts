import { CompareFn, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Circle Sort
 *
 * A divide-and-conquer in-place sort that compares mirrored elements in each
 * segment, then recursively processes both halves until no swaps occur.
 *
 * Time complexity:  O(n^2) average and worst case
 * Space complexity: O(log n) due to recursion
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
function circleSortRecursive<T>(arr: T[], lo: number, hi: number, compareFn: CompareFn<T>): number {
  if (lo >= hi) return 0;

  let swaps = 0;
  let i = lo;
  let j = hi;
  const mid = Math.floor((hi - lo) / 2);

  while (i < j) {
    if (compareFn(arr[i], arr[j]) > 0) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      swaps++;
    }
    i++;
    j--;
  }

  if (i === j && j + 1 <= hi && compareFn(arr[i], arr[j + 1]) > 0) {
    [arr[i], arr[j + 1]] = [arr[j + 1], arr[i]];
    swaps++;
  }

  swaps += circleSortRecursive(arr, lo, lo + mid, compareFn);
  swaps += circleSortRecursive(arr, lo + mid + 1, hi, compareFn);

  return swaps;
}

export function circleSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  assertArrayInput(arr);

  if (arr.length <= 1) return arr;

  while (circleSortRecursive(arr, 0, arr.length - 1, compareFn) !== 0) {
    // Keep sweeping until a full pass performs no swaps.
  }

  return arr;
}
