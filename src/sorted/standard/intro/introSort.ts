import { CompareFn, SortedArray } from '../../../types/function-type';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

const INSERTION_SORT_THRESHOLD = 16;

/**
 * Intro Sort
 *
 * Hybrid sorting algorithm that starts with quick sort, falls back to heap
 * sort when recursion gets too deep, and finishes with insertion sort for
 * small partitions.
 *
 * Time complexity:  O(n log n) average and worst case
 * Space complexity: O(log n) worst case (recursion stack)
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @param threshold - Partition length cutoff (element count) for switching to insertion sort (default: 16)
 * @returns The sorted array
 */
export function introSort<T>(
  arr: T[],
  compareFn: CompareFn<T> = defaultCompareFn,
  threshold: number = INSERTION_SORT_THRESHOLD,
): SortedArray<T> {
  if (!Array.isArray(arr)) {
    throw new TypeError('Input must be an array');
  }

  if (!Number.isInteger(threshold) || threshold < 2) {
    throw new TypeError('Threshold must be an integer greater than or equal to 2 (recommended range: 8 to 32)');
  }

  const n = arr.length;
  if (n < 2) return arr;

  const maxDepth = Math.floor(Math.log2(n)) * 2;

  introSortRecursive(arr, 0, n - 1, maxDepth, compareFn, threshold);

  insertionSortRange(arr, 0, n - 1, compareFn);

  return arr;
}

function introSortRecursive<T>(
  arr: T[],
  low: number,
  high: number,
  depthLimit: number,
  compareFn: CompareFn<T>,
  threshold: number,
): void {
  while (high - low + 1 > threshold) {
    if (depthLimit === 0) {
      heapSortRange(arr, low, high, compareFn);
      return;
    }

    depthLimit -= 1;
    const pivotIndex = partition(arr, low, high, compareFn);

    // Recurse on the smaller side first to keep stack depth bounded.
    if (pivotIndex - low < high - pivotIndex) {
      introSortRecursive(arr, low, pivotIndex - 1, depthLimit, compareFn, threshold);
      low = pivotIndex + 1;
    } else {
      introSortRecursive(arr, pivotIndex + 1, high, depthLimit, compareFn, threshold);
      high = pivotIndex - 1;
    }
  }
}

function partition<T>(arr: T[], low: number, high: number, compareFn: CompareFn<T>): number {
  const mid = low + ((high - low) >> 1);

  if (compareFn(arr[mid], arr[low]) < 0) [arr[low], arr[mid]] = [arr[mid], arr[low]];
  if (compareFn(arr[high], arr[low]) < 0) [arr[low], arr[high]] = [arr[high], arr[low]];
  if (compareFn(arr[mid], arr[high]) > 0) [arr[mid], arr[high]] = [arr[high], arr[mid]];

  [arr[mid], arr[high]] = [arr[high], arr[mid]];
  const pivot = arr[high];

  let storeIndex = low;
  for (let i = low; i < high; i += 1) {
    if (compareFn(arr[i], pivot) <= 0) {
      [arr[storeIndex], arr[i]] = [arr[i], arr[storeIndex]];
      storeIndex += 1;
    }
  }

  [arr[storeIndex], arr[high]] = [arr[high], arr[storeIndex]];
  return storeIndex;
}

function heapSortRange<T>(arr: T[], low: number, high: number, compareFn: CompareFn<T>): void {
  const heapSize = high - low + 1;

  for (let i = Math.floor(heapSize / 2) - 1; i >= 0; i -= 1) {
    heapifyRange(arr, low, heapSize, i, compareFn);
  }

  for (let end = heapSize - 1; end > 0; end -= 1) {
    [arr[low], arr[low + end]] = [arr[low + end], arr[low]];
    heapifyRange(arr, low, end, 0, compareFn);
  }
}

function heapifyRange<T>(arr: T[], offset: number, heapSize: number, root: number, compareFn: CompareFn<T>): void {
  let largest = root;

  while (true) {
    const left = 2 * largest + 1;
    const right = left + 1;
    let candidate = largest;

    if (left < heapSize && compareFn(arr[offset + left], arr[offset + candidate]) > 0) {
      candidate = left;
    }

    if (right < heapSize && compareFn(arr[offset + right], arr[offset + candidate]) > 0) {
      candidate = right;
    }

    if (candidate === largest) {
      return;
    }

    [arr[offset + largest], arr[offset + candidate]] = [arr[offset + candidate], arr[offset + largest]];
    largest = candidate;
  }
}

function insertionSortRange<T>(arr: T[], low: number, high: number, compareFn: CompareFn<T>): void {
  for (let i = low + 1; i <= high; i += 1) {
    const value = arr[i];
    let j = i - 1;

    while (j >= low && compareFn(arr[j], value) > 0) {
      arr[j + 1] = arr[j];
      j -= 1;
    }
    arr[j + 1] = value;
  }
}
