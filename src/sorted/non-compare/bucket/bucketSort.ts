import { BUCKET_SORT_THRESHOLD_RANGE, ERROR_MESSAGES } from '../../../constants';
import { KeySelector, SortedArray } from '../../../types/function-type';
import { assertArrayInput, guardRange } from '../../../utils/assertion';
import { getMinMaxCachedKeys } from '../../../utils/keyCache';
import { keyGetter } from '../../../utils/keySelector';
import { insertionSort } from '../../base';

export function bucketSort<T extends number>(arr: T[]): SortedArray<T>;
export function bucketSort<T>(arr: T[], keySelector: KeySelector<T>): SortedArray<T>;
export function bucketSort<T>(arr: T[], keySelector?: KeySelector<T>): SortedArray<T> {
  assertArrayInput(arr);

  const input = arr.slice();
  if (input.length < 2) return input;

  const getKey = keySelector ? keyGetter(keySelector) : (keyGetter() as KeySelector<T>);
  const [min, max, cachedKeys] = getMinMaxCachedKeys(input, getKey);
  const len = input.length;
  const bucketCount = Math.max(1, Math.floor(Math.sqrt(len)));
  const range = max - min + 1;

  if (!Number.isSafeInteger(range)) {
    throw new RangeError(ERROR_MESSAGES.BUCKET_SORT_RANGE_UNSAFE_INTEGER);
  }

  guardRange(range, BUCKET_SORT_THRESHOLD_RANGE, ERROR_MESSAGES.BUCKET_SORT_RANGE_TOO_LARGE);

  const bucketWidth = Math.max(1, Math.ceil(range / bucketCount));
  const buckets = Array(bucketCount)
    .fill(null)
    .map<Array<{ item: T; key: number }>>(() => []);

  for (let i = 0; i < len; i++) {
    const key = cachedKeys[i];
    const offset = key - min;

    if (!Number.isSafeInteger(offset)) {
      throw new RangeError(ERROR_MESSAGES.BUCKET_SORT_OFFSET_UNSAFE_INTEGER);
    }

    const bucketIndex = Math.min(Math.floor(offset / bucketWidth), bucketCount - 1);
    buckets[bucketIndex].push({ item: input[i], key });
  }

  const result: SortedArray<T> = [];
  for (let i = 0; i < bucketCount; i++) {
    const bucket = buckets[i];
    if (!bucket || bucket.length === 0) continue;

    insertionSort(bucket, (a, b) => a.key - b.key);
    for (let j = 0; j < bucket.length; j++) {
      result.push(bucket[j].item);
    }
  }

  return result;
}
