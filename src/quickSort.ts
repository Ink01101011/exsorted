/**
 * Quick Sort
 *
 * Selects a pivot element and partitions the array around it so that elements
 * less than the pivot come before it and elements greater come after, then
 * recursively sorts the sub-arrays.
 *
 * Time complexity:  O(n log n) average, O(n²) worst case
 * Space complexity: O(log n) average (call stack)
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function quickSort<T>(
  arr: T[],
  compareFn: (a: T, b: T) => number = defaultCompareFn,
): T[] {
  _quickSort(arr, 0, arr.length - 1, compareFn);
  return arr;
}

function _quickSort<T>(
  arr: T[],
  low: number,
  high: number,
  compareFn: (a: T, b: T) => number,
): void {
  if (low < high) {
    const pivotIdx = partition(arr, low, high, compareFn);
    _quickSort(arr, low, pivotIdx - 1, compareFn);
    _quickSort(arr, pivotIdx + 1, high, compareFn);
  }
}

function partition<T>(
  arr: T[],
  low: number,
  high: number,
  compareFn: (a: T, b: T) => number,
): number {
  // Median-of-three pivot selection for better average performance
  const mid = Math.floor((low + high) / 2);
  if (compareFn(arr[mid], arr[low]) < 0) [arr[low], arr[mid]] = [arr[mid], arr[low]];
  if (compareFn(arr[high], arr[low]) < 0) [arr[low], arr[high]] = [arr[high], arr[low]];
  if (compareFn(arr[mid], arr[high]) < 0) [arr[mid], arr[high]] = [arr[high], arr[mid]];

  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (compareFn(arr[j], pivot) <= 0) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

function defaultCompareFn<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
