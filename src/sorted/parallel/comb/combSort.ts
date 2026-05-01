import { CompareFn, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Comb Sort
 *
 * An in-place comparison sort that improves bubble sort by comparing items
 * at a shrinking gap before finishing with adjacent comparisons.
 *
 * Time complexity:  O(n²) average and worst case
 * Space complexity: O(1)
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function combSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  assertArrayInput(arr);

  const n = arr.length;
  const shrink = 1.3;
  let gap = n;
  let swapped = true;

  while (gap > 1 || swapped) {
    gap = Math.floor(gap / shrink);
    if (gap < 1) gap = 1;

    swapped = false;

    for (let i = 0; i + gap < n; i++) {
      if (compareFn(arr[i], arr[i + gap]) > 0) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        swapped = true;
      }
    }
  }

  return arr;
}
