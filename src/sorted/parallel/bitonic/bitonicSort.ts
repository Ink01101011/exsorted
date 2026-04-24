import { CompareFn, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Bitonic Sort
 *
 * An in-place, comparison-based sorting algorithm built on a bitonic sorting
 * network. Internally pads to the next power of 2 via an index array so that
 * arbitrary-length inputs are supported; sentinels for the padded slots always
 * sort to the tail, leaving the first n positions as the final sorted result.
 *
 * Time complexity:  O(n log² n) average and worst case
 * Space complexity: O(n) — index array + one copy for permutation apply
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */

type OrderFn = (a: number, b: number) => number;

function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

function bitonicMerge(idx: number[], lo: number, cnt: number, dir: boolean, order: OrderFn): void {
  if (cnt > 1) {
    const k = cnt >> 1;
    for (let i = lo; i < lo + k; i++) {
      const cmp = order(idx[i], idx[i + k]);
      if ((cmp > 0 && dir) || (cmp < 0 && !dir)) {
        const tmp = idx[i];
        idx[i] = idx[i + k];
        idx[i + k] = tmp;
      }
    }
    bitonicMerge(idx, lo, k, dir, order);
    bitonicMerge(idx, lo + k, k, dir, order);
  }
}

function bitonicSortHelper(idx: number[], lo: number, cnt: number, dir: boolean, order: OrderFn): void {
  if (cnt > 1) {
    const k = cnt >> 1;
    bitonicSortHelper(idx, lo, k, true, order);
    bitonicSortHelper(idx, lo + k, k, false, order);
    bitonicMerge(idx, lo, cnt, dir, order);
  }
}

export function bitonicSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  assertArrayInput(arr);

  const n = arr.length;
  if (n <= 1) return arr;

  const p = nextPow2(n);
  // idx[i] = real array index, or -1 for a sentinel that always sorts last
  const idx: number[] = Array.from({ length: p }, (_, i) => (i < n ? i : -1));

  const order: OrderFn = (a, b) => {
    if (a === -1 && b === -1) return 0;
    if (a === -1) return 1;
    if (b === -1) return -1;
    return compareFn(arr[a], arr[b]);
  };

  bitonicSortHelper(idx, 0, p, true, order);

  // Apply the sorted permutation back onto arr
  const copy = arr.slice();
  for (let i = 0; i < n; i++) arr[i] = copy[idx[i]];

  return arr;
}
