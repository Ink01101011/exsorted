import { PIGEONHOLE_SORT_THRESHOLD_RANGE } from '../../../constants';
import { KeySelector, SortedArray } from '../../../types/function-type';
import { assertArrayInput, guardRange } from '../../../utils/assertion';
import { getMinMaxCachedKeys } from '../../../utils/keyCache';
import { keyGetter } from '../../../utils/keySelector';

export function pigeonholeSort<T extends number>(arr: T[]): SortedArray<T>;
export function pigeonholeSort<T>(arr: T[], keySelector: KeySelector<T>): SortedArray<T>;
export function pigeonholeSort<T>(arr: T[], keySelector?: KeySelector<T>): SortedArray<T> {
  assertArrayInput(arr);

  const input = arr.slice();
  if (input.length < 2) return input;

  const getKey = keyGetter(keySelector);
  const [min, max, cachedKeys] = getMinMaxCachedKeys(input, getKey);
  const range = max - min + 1;
  guardRange(range, PIGEONHOLE_SORT_THRESHOLD_RANGE); // Ensure the range is not too large to handle

  const holes: T[][] = Array.from({ length: range }, () => [] as T[]);

  for (let i = 0; i < input.length; i++) {
    const key = cachedKeys[i];
    holes[key - min].push(input[i]);
  }

  const result: SortedArray<T> = [];
  for (const hole of holes) {
    result.push(...hole);
  }

  return result;
}
