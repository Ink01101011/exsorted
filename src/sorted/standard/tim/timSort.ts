import { CompareFn, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Sorts an array using a TimSort-style hybrid algorithm.
 *
 * The implementation detects natural runs, extends short runs with binary
 * insertion sort, and merges runs using TimSort-like run-stack invariants.
 *
 * This function mutates the input array in place and returns the same
 * array reference.
 *
 * Stability: elements considered equal by compareFn preserve relative order.
 *
 * Time complexity:
 * - Best case: O(n) for already or mostly sorted input
 * - Average case: O(n log n)
 * - Worst case: O(n log n)
 *
 * Space complexity: O(n)
 *
 * @typeParam T - Element type in the input array.
 * @param arr - The array to sort (mutated in place).
 * @param compareFn - Optional comparator using Array.prototype.sort semantics.
 * @returns The same input array reference, now sorted.
 */
export function timSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  assertArrayInput(arr);

  const n = arr.length;
  if (n < 2) return arr;

  const minRun = calculateMinRun(n);

  const runBase: number[] = [];
  const runLength: number[] = [];
  let lo = 0;

  while (lo < n) {
    let currentRunLength = countRunAndMakeAscending(arr, lo, n, compareFn);

    if (currentRunLength < minRun) {
      const forcedRunLength = Math.min(minRun, n - lo);
      binaryInsertionSort(arr, lo, lo + forcedRunLength, lo + currentRunLength, compareFn);
      currentRunLength = forcedRunLength;
    }

    pushRun(runBase, runLength, lo, currentRunLength);
    mergeCollapse(arr, runBase, runLength, compareFn);
    lo += currentRunLength;
  }

  mergeForceCollapse(arr, runBase, runLength, compareFn);

  return arr;
}

function calculateMinRun(n: number): number {
  let r = 0;
  while (n >= 64) {
    if (n % 2 !== 0) {
      r = 1;
    }
    n = Math.floor(n / 2);
  }
  return n + r;
}

function binaryInsertionSort<T>(arr: T[], left: number, right: number, start: number, compareFn: CompareFn<T>): void {
  if (start <= left) start = left + 1;

  for (; start < right; start += 1) {
    const pivot = arr[start];
    let lo = left;
    let hi = start;

    while (lo < hi) {
      const mid = lo + ((hi - lo) >> 1);
      if (compareFn(pivot, arr[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }

    for (let i = start; i > lo; i -= 1) {
      arr[i] = arr[i - 1];
    }
    arr[lo] = pivot;
  }
}

function countRunAndMakeAscending<T>(arr: T[], lo: number, hi: number, compareFn: CompareFn<T>): number {
  let runHi = lo + 1;
  if (runHi === hi) return 1;

  if (compareFn(arr[runHi], arr[lo]) < 0) {
    runHi += 1;
    while (runHi < hi && compareFn(arr[runHi], arr[runHi - 1]) < 0) {
      runHi += 1;
    }
    reverseRange(arr, lo, runHi);
  } else {
    runHi += 1;
    while (runHi < hi && compareFn(arr[runHi], arr[runHi - 1]) >= 0) {
      runHi += 1;
    }
  }

  return runHi - lo;
}

function reverseRange<T>(arr: T[], start: number, endExclusive: number): void {
  let lo = start;
  let hi = endExclusive - 1;

  while (lo < hi) {
    const tmp = arr[lo];
    arr[lo] = arr[hi];
    arr[hi] = tmp;
    lo += 1;
    hi -= 1;
  }
}

function pushRun(runBase: number[], runLength: number[], base: number, length: number): void {
  runBase.push(base);
  runLength.push(length);
}

function mergeCollapse<T>(arr: T[], runBase: number[], runLength: number[], compareFn: CompareFn<T>): void {
  while (runLength.length > 1) {
    let n = runLength.length - 2;

    if (
      (n > 0 && runLength[n - 1] <= runLength[n] + runLength[n + 1]) ||
      (n > 1 && runLength[n - 2] <= runLength[n - 1] + runLength[n])
    ) {
      if (runLength[n - 1] < runLength[n + 1]) {
        n -= 1;
      }
      mergeAt(arr, runBase, runLength, n, compareFn);
    } else if (runLength[n] <= runLength[n + 1]) {
      mergeAt(arr, runBase, runLength, n, compareFn);
    } else {
      break;
    }
  }
}

function mergeForceCollapse<T>(arr: T[], runBase: number[], runLength: number[], compareFn: CompareFn<T>): void {
  while (runLength.length > 1) {
    let n = runLength.length - 2;
    if (n > 0 && runLength[n - 1] < runLength[n + 1]) {
      n -= 1;
    }
    mergeAt(arr, runBase, runLength, n, compareFn);
  }
}

function mergeAt<T>(arr: T[], runBase: number[], runLength: number[], i: number, compareFn: CompareFn<T>): void {
  const base1 = runBase[i];
  const len1 = runLength[i];
  const base2 = runBase[i + 1];
  const len2 = runLength[i + 1];

  runLength[i] = len1 + len2;
  runBase.splice(i + 1, 1);
  runLength.splice(i + 1, 1);

  if (len1 <= len2) {
    mergeLow(arr, base1, len1, base2, len2, compareFn);
    return;
  }
  mergeHigh(arr, base1, len1, base2, len2, compareFn);
}

function mergeLow<T>(
  arr: T[],
  base1: number,
  len1: number,
  base2: number,
  len2: number,
  compareFn: CompareFn<T>,
): void {
  const left = arr.slice(base1, base1 + len1);
  let leftIndex = 0;
  let rightIndex = base2;
  let dest = base1;
  const rightEnd = base2 + len2;

  while (leftIndex < len1 && rightIndex < rightEnd) {
    if (compareFn(left[leftIndex], arr[rightIndex]) <= 0) {
      arr[dest++] = left[leftIndex++];
    } else {
      arr[dest++] = arr[rightIndex++];
    }
  }

  while (leftIndex < len1) {
    arr[dest++] = left[leftIndex++];
  }
}

function mergeHigh<T>(
  arr: T[],
  base1: number,
  len1: number,
  base2: number,
  len2: number,
  compareFn: CompareFn<T>,
): void {
  const right = arr.slice(base2, base2 + len2);
  let leftIndex = base1 + len1 - 1;
  let rightIndex = len2 - 1;
  let dest = base2 + len2 - 1;

  while (leftIndex >= base1 && rightIndex >= 0) {
    if (compareFn(arr[leftIndex], right[rightIndex]) > 0) {
      arr[dest--] = arr[leftIndex--];
    } else {
      arr[dest--] = right[rightIndex--];
    }
  }

  while (rightIndex >= 0) {
    arr[dest--] = right[rightIndex--];
  }
}
