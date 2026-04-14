import { KeySelector, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { getCachedKeys, getMax } from '../../../utils/keyCache';
import { keyGetter } from '../../../utils/keySelector';
import { absValues, buildStableNegativePrefix, separateBySignWithKeys } from '../../../utils/separateNegative';

export function radixSort<T extends number>(arr: T[]): SortedArray<T>;
export function radixSort<T>(arr: T[], keySelector: KeySelector<T>): SortedArray<T>;
export function radixSort<T>(arr: T[], keySelector?: KeySelector<T>): SortedArray<T>;
export function radixSort<T extends number>(arr: T[], keySelector?: KeySelector<T>): SortedArray<T> {
  assertArrayInput(arr);

  const input = arr.slice(); // Create a copy to avoid mutating the original array
  if (arr.length < 2) return input; // Return a shallow copy for consistency

  const getKey = keyGetter(keySelector);
  const cachedKeys = getCachedKeys(input, getKey);
  const [negatives, negativeKeys, nonNegatives, nonNegativeKeys] = separateBySignWithKeys(input, cachedKeys);

  if (negatives.length > 0) {
    const negativeAbsKeys = absValues(negativeKeys);
    radixSortBase(negatives, negativeAbsKeys);

    const sortedNegatives = buildStableNegativePrefix(negatives, negativeAbsKeys);
    radixSortBase(nonNegatives, nonNegativeKeys);

    return [...sortedNegatives, ...nonNegatives];
  }

  radixSortBase(nonNegatives, nonNegativeKeys);
  return nonNegatives;
}

function radixSortBase<T>(arr: T[], cachedKeys: number[]): void {
  const max = getMax(cachedKeys);

  for (let exponent = 1; Math.floor(max / exponent) > 0; exponent *= 10) {
    countingSortByDigit(arr, cachedKeys, exponent);
  }
}

function countingSortByDigit<T>(arr: T[], cachedKeys: number[], exponent: number): void {
  const count = new Array<number>(10).fill(0);
  const output = new Array<T>(arr.length);
  const outputKeys = new Array<number>(arr.length);

  // Count occurrences of each digit in the specified place value
  for (const key of cachedKeys) {
    const digit = getDigit(key, exponent);
    count[digit]++;
  }

  // Update count[i] to contain the cumulative count of digits up to i
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Build the output array by placing elements in the correct position based on the current digit
  for (let i = arr.length - 1; i >= 0; i--) {
    const digit = getDigit(cachedKeys[i], exponent);
    const outIndex = --count[digit];
    output[outIndex] = arr[i];
    outputKeys[outIndex] = cachedKeys[i];
  }

  // Copy the output back to arr and keep keys aligned with elements for the next pass
  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
    cachedKeys[i] = outputKeys[i];
  }
}

function getDigit(num: number, exponent: number): number {
  return Math.floor(Math.abs(num) / exponent) % 10;
}
