import { KeySelector } from '../types/function-type';

export function getCachedKeys<T>(arr: T[], getKey: KeySelector<T>): number[] {
  const cachedKeys = new Array<number>(arr.length);

  for (let i = 0; i < arr.length; i++) {
    cachedKeys[i] = getKey(arr[i]);
  }

  return cachedKeys;
}

export function getMax(arr: number[]): number {
  let max = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }

  return max;
}

export function getMinMaxCachedKeys<T>(arr: T[], getKey: KeySelector<T>): [number, number, number[]] {
  const cachedKeys = new Array<number>(arr.length);
  let max = -Infinity;
  let min = Infinity;

  for (let i = 0; i < arr.length; i++) {
    const key = getKey(arr[i]);
    cachedKeys[i] = key;

    if (key > max) max = key;
    if (key < min) min = key;
  }

  return [min, max, cachedKeys];
}
