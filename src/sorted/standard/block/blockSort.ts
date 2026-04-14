import { CompareFn, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Block Sort
 *
 * Block-oriented hybrid sort that:
 * 1) partitions data into fixed-size blocks,
 * 2) locally sorts each block,
 * 3) merges blocks iteratively with a stable buffered merge.
 *
 * Practical complexity: typically O(n log n) for mixed input distributions.
 *
 * Space complexity: O(n) worst case overall due to merge buffering during
 * iterative merge passes.
 *
 * Stability: designed to keep equal elements in their original relative order.
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function blockSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  assertArrayInput(arr);

  const n = arr.length;
  if (n < 2) return arr;

  const blockSize = Math.max(16, Math.floor(Math.sqrt(n)));

  // Local sort inside each block.
  for (let start = 0; start < n; start += blockSize) {
    const end = Math.min(start + blockSize, n);
    insertionSortRange(arr, start, end, compareFn);
  }

  // Iteratively merge sorted runs.
  for (let width = blockSize; width < n; width *= 2) {
    for (let start = 0; start < n; start += 2 * width) {
      const mid = Math.min(start + width, n);
      const end = Math.min(start + 2 * width, n);
      if (mid >= end) continue;

      mergeWithBuffer(arr, start, mid, end, compareFn);
    }
  }

  return arr;
}

function insertionSortRange<T>(arr: T[], start: number, endExclusive: number, compareFn: CompareFn<T>): void {
  for (let i = start + 1; i < endExclusive; i += 1) {
    const value = arr[i];
    let j = i - 1;

    while (j >= start && compareFn(arr[j], value) > 0) {
      arr[j + 1] = arr[j];
      j -= 1;
    }

    arr[j + 1] = value;
  }
}

function mergeWithBuffer<T>(arr: T[], start: number, mid: number, end: number, compareFn: CompareFn<T>): void {
  if (start >= mid || mid >= end) return;
  if (compareFn(arr[mid - 1], arr[mid]) <= 0) return;

  const leftLength = mid - start;
  const left = new Array<T>(leftLength);

  for (let i = 0; i < leftLength; i += 1) {
    left[i] = arr[start + i];
  }

  let leftIndex = 0;
  let rightIndex = mid;
  let writeIndex = start;

  while (leftIndex < leftLength && rightIndex < end) {
    if (compareFn(left[leftIndex], arr[rightIndex]) <= 0) {
      arr[writeIndex++] = left[leftIndex++];
    } else {
      arr[writeIndex++] = arr[rightIndex++];
    }
  }

  while (leftIndex < leftLength) {
    arr[writeIndex++] = left[leftIndex++];
  }
}
