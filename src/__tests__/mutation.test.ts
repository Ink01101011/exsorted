import { bubbleSort } from '../sorted/base/bubble/bubbleSort';
import { insertionSort } from '../sorted/base/insertion/insertionSort';
import { selectionSort } from '../sorted/base/selection';
import { mergeSort } from '../sorted/base/merge';
import { quickSort } from '../sorted/base/quick/quickSort';
import { heapSort } from '../sorted/base/heap/heapSort';
import { CompareFn } from '../types/function-type';

type SortFn<T> = (arr: T[], compareFn?: CompareFn<T>) => T[];

describe.each([
  ['bubbleSort', bubbleSort],
  ['insertionSort', insertionSort],
  ['selectionSort', selectionSort],
  ['quickSort', quickSort],
  ['heapSort', heapSort],
] as Array<[string, SortFn<number>]>)('%s mutates the original array', (_, sortFn) => {
  it('returns the same array reference', () => {
    const arr = [3, 1, 2];
    const result = sortFn(arr);
    expect(result).toBe(arr);
  });
});

describe('mergeSort returns a new array', () => {
  it('does not mutate the original array', () => {
    const arr = [3, 1, 2];
    const result = mergeSort(arr);
    expect(result).not.toBe(arr);
    expect(arr).toEqual([3, 1, 2]);
    expect(result).toEqual([1, 2, 3]);
  });
});
