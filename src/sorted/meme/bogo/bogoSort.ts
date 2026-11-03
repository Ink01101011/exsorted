import { BOGO_SORT_DEFAULT_MAX_SHUFFLES, ERROR_MESSAGES } from '../../../constants';
import { CompareFn, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { createSortCompareFn } from '../../../utils/defaultCompareFn';

export interface BogoSortOptions {
  /** Maximum number of shuffles before giving up with a RangeError. Defaults to 1,000,000. */
  maxShuffles?: number;
  /** Random source returning a number in [0, 1). Defaults to `Math.random`. */
  random?: () => number;
}

/**
 * Bogo Sort 🃏 (a.k.a. permutation sort, stupid sort)
 *
 * Shuffles the array at random until it happens to be sorted. A joke
 * algorithm: never use it for real work.
 *
 * To keep it from hanging forever, it throws a RangeError after
 * `options.maxShuffles` shuffles (default 1,000,000, enough for roughly
 * 9 elements on average).
 *
 * Time complexity:  O(n) best, O(n · n!) average, unbounded worst case
 * Space complexity: O(1)
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @param options - Shuffle limit and random source
 * @returns The sorted array
 */
export function bogoSort<T>(
  arr: T[],
  compareFn: CompareFn<T> = createSortCompareFn<T>(),
  options: BogoSortOptions = {},
): SortedArray<T> {
  assertArrayInput(arr);

  const { maxShuffles = BOGO_SORT_DEFAULT_MAX_SHUFFLES, random = Math.random } = options;
  let shuffles = 0;

  while (!isSorted(arr, compareFn)) {
    if (shuffles >= maxShuffles) {
      throw new RangeError(ERROR_MESSAGES.BOGO_SORT_GAVE_UP(maxShuffles));
    }
    shuffle(arr, random);
    shuffles++;
  }

  return arr;
}

function isSorted<T>(arr: T[], compareFn: CompareFn<T>): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (compareFn(arr[i - 1], arr[i]) > 0) return false;
  }
  return true;
}

/** Fisher–Yates shuffle. */
function shuffle<T>(arr: T[], random: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
