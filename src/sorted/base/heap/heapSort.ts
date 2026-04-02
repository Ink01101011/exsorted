import { CompareFn, SortedArray } from '../../../types/function-type';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Heap Sort
 *
 * Builds a max-heap from the array and then repeatedly extracts the maximum
 * element, placing it at the end of the array.
 *
 * Time complexity:  O(n log n) in all cases
 * Space complexity: O(1)
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function heapSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  const n = arr.length;

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, compareFn);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0, compareFn);
  }

  return arr;
}

function heapify<T>(arr: T[], n: number, rootIdx: number, compareFn: CompareFn<T>): void {
  let largest = rootIdx;
  const left = 2 * rootIdx + 1;
  const right = 2 * rootIdx + 2;

  if (left < n && compareFn(arr[left], arr[largest]) > 0) {
    largest = left;
  }

  if (right < n && compareFn(arr[right], arr[largest]) > 0) {
    largest = right;
  }

  if (largest !== rootIdx) {
    [arr[rootIdx], arr[largest]] = [arr[largest], arr[rootIdx]];
    heapify(arr, n, largest, compareFn);
  }
}
