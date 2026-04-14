import { KeySelector, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
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
  const bucketWidth = Math.max(1, Math.ceil(range / bucketCount));
  const buckets = Array(bucketCount)
    .fill(null)
    .map<Array<{ item: T; key: number }>>(() => []);

  for (let i = 0; i < len; i++) {
    const key = cachedKeys[i];
    const bucketIndex = Math.min(Math.floor((key - min) / bucketWidth), bucketCount - 1);
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
