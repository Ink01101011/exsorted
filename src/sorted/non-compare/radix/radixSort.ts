import { RADIX_SORT_THRESHOLD_DIGITS } from '../../../constants';
import { KeySelector, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { getCachedKeys, getMax } from '../../../utils/keyCache';
import { keyGetter } from '../../../utils/keySelector';
import { absValues, buildStableNegativePrefix, separateBySignWithKeys } from '../../../utils/separateNegative';

export function radixSort<T extends number>(arr: T[]): SortedArray<T>;
export function radixSort<T>(arr: T[], keySelector: KeySelector<T>): SortedArray<T>;
export function radixSort<T>(arr: T[], keySelector?: KeySelector<T>): SortedArray<T> {
  assertArrayInput(arr);

  const input = arr.slice();
  if (arr.length < 2) return input;

  const getKey = keySelector ? keyGetter(keySelector) : (keyGetter() as KeySelector<T>);
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

  for (let exponent = 1; Math.floor(max / exponent) > 0; exponent *= RADIX_SORT_THRESHOLD_DIGITS) {
    countingSortByDigit(arr, cachedKeys, exponent);
  }
}

function countingSortByDigit<T>(arr: T[], cachedKeys: number[], exponent: number): void {
  const count = new Array<number>(RADIX_SORT_THRESHOLD_DIGITS).fill(0);
  const output = new Array<T>(arr.length);
  const outputKeys = new Array<number>(arr.length);

  for (const key of cachedKeys) {
    const digit = getDigit(key, exponent);
    count[digit]++;
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    const digit = getDigit(cachedKeys[i], exponent);
    const outIndex = --count[digit];
    output[outIndex] = arr[i];
    outputKeys[outIndex] = cachedKeys[i];
  }

  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
    cachedKeys[i] = outputKeys[i];
  }
}

function getDigit(num: number, exponent: number): number {
  return Math.floor(Math.abs(num) / exponent) % RADIX_SORT_THRESHOLD_DIGITS;
}
