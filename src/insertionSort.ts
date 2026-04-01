/**
 * Insertion Sort
 *
 * Builds the sorted array one element at a time by inserting each new element
 * into its correct position among the already-sorted elements.
 *
 * Time complexity:  O(n²) average and worst case, O(n) best case
 * Space complexity: O(1)
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function insertionSort<T>(
  arr: T[],
  compareFn: (a: T, b: T) => number = defaultCompareFn,
): T[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && compareFn(arr[j], key) > 0) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

function defaultCompareFn<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
