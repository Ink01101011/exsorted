import { ERROR_MESSAGES, SLEEP_SORT_MAX_DELAY_MS } from '../../../constants';
import { SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';

// The library compiles without DOM/Node lib types; every supported runtime provides setTimeout.
declare const setTimeout: (callback: () => void, ms: number) => unknown;

export interface SleepSortOptions {
  /** Milliseconds to sleep per unit of key. Defaults to 1. */
  msPerUnit?: number;
}

/**
 * Sleep Sort 🃏
 *
 * Starts one timer per element that waits for a time proportional to its key,
 * then collects elements in the order the timers fire. It uses the event
 * loop as the sorting engine, so it is **asynchronous** and returns a Promise.
 *
 * Keys must be finite, non-negative numbers. Elements with equal keys keep
 * their input order. Keys that are very close together can come out in the
 * wrong order because of timer resolution; raise `msPerUnit` to spread them out.
 *
 * Time complexity:  O(n + max(key) · msPerUnit) wall-clock time
 * Space complexity: O(n)
 *
 * @param arr - The array to sort (not mutated)
 * @param keySelector - Required for non-number items; optional when sorting numbers
 * @param options - Timer scaling
 * @returns A Promise of a new sorted array
 */
export function sleepSort<T extends number>(
  arr: T[],
  keySelector?: undefined,
  options?: SleepSortOptions,
): Promise<SortedArray<T>>;
export function sleepSort<T>(
  arr: T[],
  keySelector: (item: T) => number,
  options?: SleepSortOptions,
): Promise<SortedArray<T>>;
export function sleepSort<T>(
  arr: T[],
  keySelector?: (item: T) => number,
  options: SleepSortOptions = {},
): Promise<SortedArray<T>> {
  try {
    assertArrayInput(arr);

    const { msPerUnit = 1 } = options;
    if (!Number.isFinite(msPerUnit) || msPerUnit < 0) {
      throw new RangeError(ERROR_MESSAGES.SLEEP_SORT_INVALID_KEY);
    }

    // Validate every key before starting any timer, so a bad key never leaves timers running.
    const delays = arr.map((item) => {
      const key = keySelector ? keySelector(item) : item;
      if (typeof key !== 'number') {
        throw new TypeError(ERROR_MESSAGES.KEY_SELECTOR_REQUIRED);
      }
      if (!Number.isFinite(key) || key < 0) {
        throw new RangeError(ERROR_MESSAGES.SLEEP_SORT_INVALID_KEY);
      }
      const delay = key * msPerUnit;
      if (delay > SLEEP_SORT_MAX_DELAY_MS) {
        throw new RangeError(ERROR_MESSAGES.SLEEP_SORT_DELAY_TOO_LARGE(SLEEP_SORT_MAX_DELAY_MS));
      }
      return delay;
    });

    const result: SortedArray<T> = [];
    return Promise.all(
      arr.map(
        (item, i) =>
          new Promise<void>((resolve) => {
            setTimeout(() => {
              result.push(item);
              resolve();
            }, delays[i]);
          }),
      ),
    ).then(() => result);
  } catch (error) {
    return Promise.reject(error);
  }
}
