import { CompareFn, SortedArray } from '../../../types/function-type';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Merge Sort
 *
 * Divides the array into halves, recursively sorts each half, then merges the
 * sorted halves back together.
 *
 * Time complexity:  O(n log n) in all cases
 * Space complexity: O(n)
 *
 * @param arr - The array to sort (a new sorted array is returned)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns A new sorted array
 */
export function mergeSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  if (arr.length <= 1) return arr.slice();

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compareFn);
  const right = mergeSort(arr.slice(mid), compareFn);

  return merge(left, right, compareFn);
}

function merge<T>(left: T[], right: T[], compareFn: CompareFn<T>): T[] {
  const result: T[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (compareFn(left[i], right[j]) <= 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}
