import { CompareFn, SortedArray } from '../../../types/function-type';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Selection Sort
 *
 * Divides the array into a sorted and an unsorted region, repeatedly selecting
 * the minimum element from the unsorted region and moving it to the end of the
 * sorted region.
 *
 * Time complexity:  O(n²) in all cases
 * Space complexity: O(1)
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function selectionSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (compareFn(arr[j], arr[minIdx]) < 0) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}
