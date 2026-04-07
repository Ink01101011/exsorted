import { CompareFn, SortedArray } from '../../../types/function-type';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Sorts an array using the Shell Sort algorithm.
 *
 * Shell Sort is an in-place comparison sort that generalizes insertion sort
 * to allow the exchange of items that are far apart. It starts with large gaps
 * between elements and progressively reduces the gap to perform more refined insertions.
 *
 * @template T - The type of elements in the array
 * @param arr - The array to be sorted
 * @param compareFn - The comparison function to determine sort order
 * @returns The sorted array
 *
 * @complexity
 * - Time: O(n log² n) average case, O(n²) worst case for the halving gap sequence used here
 * - Space: O(1) auxiliary space
 *
 * @example
 * ```typescript
 * const numbers = [5, 2, 8, 1, 9];
 * shellSort(numbers); // [1, 2, 5, 8, 9]
 * ```
 *
 * @example
 * ```typescript
 * const words = ['apple', 'zebra', 'banana'];
 * shellSort(words, (a, b) => a.localeCompare(b)); // ['apple', 'banana', 'zebra']
 * ```
 */
export function shellSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  if (!Array.isArray(arr)) {
    throw new TypeError('Input must be an array');
  }

  const n = arr.length;
  if (n < 2) return arr;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      while (j >= gap && compareFn(arr[j - gap], temp) > 0) {
        arr[j] = arr[j - gap];
        j -= gap;
      }

      arr[j] = temp;
    }
  }

  return arr;
}
