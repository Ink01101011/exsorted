import { CompareFn, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Cycle Sort
 *
 * An in-place algorithm that minimises writes by decomposing the permutation
 * into cycles and rotating each cycle into its correct position.
 *
 * Time complexity:  O(n²) average and worst case
 * Space complexity: O(1)
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function cycleSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  assertArrayInput(arr);

  const n = arr.length;

  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item = arr[cycleStart];
    let pos = cycleStart;

    // Find the correct position for item
    for (let i = cycleStart + 1; i < n; i++) {
      if (compareFn(arr[i], item) < 0) pos++;
    }

    // Item is already in the correct position
    if (pos === cycleStart) continue;

    // Advance past duplicates so we don't overwrite an equal element
    while (compareFn(item, arr[pos]) === 0) pos++;

    [arr[pos], item] = [item, arr[pos]];

    // Rotate the rest of the cycle back to cycleStart
    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        if (compareFn(arr[i], item) < 0) pos++;
      }

      while (compareFn(item, arr[pos]) === 0) pos++;

      [arr[pos], item] = [item, arr[pos]];
    }
  }

  return arr;
}
