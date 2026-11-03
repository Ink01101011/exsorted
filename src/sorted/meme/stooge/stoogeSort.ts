import { CompareFn, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { createSortCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Stooge Sort 🃏
 *
 * Recursively sorts the first two thirds, then the last two thirds, then the
 * first two thirds again. Correct, but slower than bubble sort.
 *
 * Time complexity:  O(n^(log 3 / log 1.5)) ≈ O(n^2.71)
 * Space complexity: O(log n) recursion depth
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function stoogeSort<T>(arr: T[], compareFn: CompareFn<T> = createSortCompareFn<T>()): SortedArray<T> {
  assertArrayInput(arr);

  if (arr.length > 1) {
    stooge(arr, 0, arr.length - 1, compareFn);
  }

  return arr;
}

function stooge<T>(arr: T[], lo: number, hi: number, compareFn: CompareFn<T>): void {
  if (compareFn(arr[lo], arr[hi]) > 0) {
    [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
  }

  const size = hi - lo + 1;
  if (size > 2) {
    const t = Math.floor(size / 3);
    stooge(arr, lo, hi - t, compareFn);
    stooge(arr, lo + t, hi, compareFn);
    stooge(arr, lo, hi - t, compareFn);
  }
}
