import { CompareFn, SortedArray } from '../../../types';
import { defaultCompareFn } from '../../../utils';

/**
 * Performs a gnome sort on an array.
 *
 * Gnome sort is a simple sorting algorithm that works by comparing adjacent elements
 * and swapping them if they are in the wrong order. It's similar to bubble sort but
 * moves backward when a swap is made, similar to how a garden gnome sorts flower pots.
 *
 * @template T - The type of elements in the array
 * @param {T[]} arr - The array to be sorted
 * @param {CompareFn<T>} [compareFn=defaultCompareFn] - The comparison function to determine sort order
 * @returns {SortedArray<T>} The sorted array
 *
 * @example
 * ```typescript
 * const numbers = [64, 34, 25, 12, 22, 11, 90];
 * gnomeSort(numbers);
 * // Returns: [11, 12, 22, 25, 34, 64, 90]
 * ```
 */
export function gnomeSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  let index = 0;
  const n = arr.length;

  while (index < n) {
    if (index === 0) {
      index++;
    }

    if (compareFn(arr[index], arr[index - 1]) >= 0) {
      index++;
    } else {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
      index--;
    }
  }
  return arr;
}
