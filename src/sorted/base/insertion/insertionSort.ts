import { CompareFn, SortedArray } from '../../../types/function-type';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Insertion Sort
 *
 * Builds the sorted array one element at a time by inserting each new element
 * into its correct position among the already-sorted elements.
 *
 * Time complexity:  O(n²) average and worst case, O(n) best case
 * Space complexity: O(1)
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function insertionSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && compareFn(arr[j], key) > 0) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}
