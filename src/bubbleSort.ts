/**
 * Bubble Sort
 *
 * Repeatedly steps through the list, compares adjacent elements, and swaps
 * them if they are in the wrong order.
 *
 * Time complexity:  O(n²) average and worst case, O(n) best case
 * Space complexity: O(1)
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function bubbleSort<T>(
  arr: T[],
  compareFn: (a: T, b: T) => number = defaultCompareFn,
): T[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (compareFn(arr[j], arr[j + 1]) > 0) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}

function defaultCompareFn<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
