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
  if (!Array.isArray(arr)) {
    throw new TypeError('Input must be an array');
  }

  return _mergeSort(arr, compareFn);
}

function _mergeSort<T>(arr: T[], compareFn: CompareFn<T>): T[] {
  if (arr.length <= 1) return arr.slice();

  const middleIndex = Math.floor(arr.length / 2);
  const leftHalf = _mergeSort(arr.slice(0, middleIndex), compareFn);
  const rightHalf = _mergeSort(arr.slice(middleIndex), compareFn);

  return merge(leftHalf, rightHalf, compareFn);
}

function merge<T>(left: T[], right: T[], compareFn: CompareFn<T>): T[] {
  const merged: T[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (compareFn(left[leftIndex], right[rightIndex]) <= 0) {
      merged.push(left[leftIndex++]);
    } else {
      merged.push(right[rightIndex++]);
    }
  }

  appendRemainingItems(merged, left, leftIndex);
  appendRemainingItems(merged, right, rightIndex);

  return merged;
}

function appendRemainingItems<T>(target: T[], source: T[], startIndex: number): void {
  for (let index = startIndex; index < source.length; index += 1) {
    target.push(source[index]);
  }
}
