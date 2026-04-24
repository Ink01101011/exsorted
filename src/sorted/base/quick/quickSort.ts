import { CompareFn, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Quick Sort
 *
 * Selects a pivot element and partitions the array around it so that elements
 * less than the pivot come before it and elements greater come after, then
 * recursively sorts the sub-arrays.
 *
 * Uses 3-way partitioning (Dutch National Flag) to handle duplicate elements
 * efficiently — equal elements are grouped in the middle and excluded from
 * further recursion, avoiding O(n²) on duplicate-heavy inputs.
 *
 * Falls back to heap sort when recursion depth exceeds 2 * log2(n) to
 * guarantee O(n log n) worst-case and prevent stack overflow.
 *
 * Time complexity:  O(n log n) average and worst case
 * Space complexity: O(log n) average (call stack)
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function quickSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  assertArrayInput(arr);
  if (arr.length < 2) return arr;
  const maxDepth = Math.floor(Math.log2(arr.length)) * 2;
  _quickSort(arr, 0, arr.length - 1, maxDepth, compareFn);
  return arr;
}

function _quickSort<T>(arr: T[], low: number, high: number, depthLimit: number, compareFn: CompareFn<T>): void {
  if (low >= high) return;

  if (depthLimit === 0) {
    heapSortRange(arr, low, high, compareFn);
    return;
  }

  const [lt, gt] = partition3Way(arr, low, high, compareFn);
  _quickSort(arr, low, lt - 1, depthLimit - 1, compareFn);
  _quickSort(arr, gt + 1, high, depthLimit - 1, compareFn);
}

/**
 * 3-way partition (Dutch National Flag).
 * Returns [lt, gt] such that:
 *   arr[low..lt-1] < pivot
 *   arr[lt..gt]   == pivot
 *   arr[gt+1..high] > pivot
 */
function partition3Way<T>(arr: T[], low: number, high: number, compareFn: CompareFn<T>): [number, number] {
  // Median-of-three pivot selection
  const mid = low + ((high - low) >> 1);
  if (compareFn(arr[mid], arr[low]) < 0) [arr[low], arr[mid]] = [arr[mid], arr[low]];
  if (compareFn(arr[high], arr[low]) < 0) [arr[low], arr[high]] = [arr[high], arr[low]];
  if (compareFn(arr[mid], arr[high]) > 0) [arr[mid], arr[high]] = [arr[high], arr[mid]];

  // Place pivot at low to anchor the partition
  [arr[low], arr[mid]] = [arr[mid], arr[low]];
  const pivot = arr[low];

  let lt = low;
  let gt = high;
  let i = low + 1;

  while (i <= gt) {
    const cmp = compareFn(arr[i], pivot);
    if (cmp < 0) {
      [arr[lt], arr[i]] = [arr[i], arr[lt]];
      lt++;
      i++;
    } else if (cmp > 0) {
      [arr[i], arr[gt]] = [arr[gt], arr[i]];
      gt--;
    } else {
      i++;
    }
  }

  return [lt, gt];
}

function heapSortRange<T>(arr: T[], low: number, high: number, compareFn: CompareFn<T>): void {
  const size = high - low + 1;

  for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
    heapify(arr, low, size, i, compareFn);
  }

  for (let end = size - 1; end > 0; end--) {
    [arr[low], arr[low + end]] = [arr[low + end], arr[low]];
    heapify(arr, low, end, 0, compareFn);
  }
}

function heapify<T>(arr: T[], offset: number, size: number, root: number, compareFn: CompareFn<T>): void {
  let largest = root;

  while (true) {
    const left = 2 * largest + 1;
    const right = left + 1;
    let candidate = largest;

    if (left < size && compareFn(arr[offset + left], arr[offset + candidate]) > 0) candidate = left;
    if (right < size && compareFn(arr[offset + right], arr[offset + candidate]) > 0) candidate = right;

    if (candidate === largest) return;

    [arr[offset + largest], arr[offset + candidate]] = [arr[offset + candidate], arr[offset + largest]];
    largest = candidate;
  }
}
