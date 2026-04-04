import { bubbleSort } from '../src/sorted/base/bubble/bubbleSort';
import { insertionSort } from '../src/sorted/base/insertion/insertionSort';
import { selectionSort } from '../src/sorted/base/selection';
import { mergeSort } from '../src/sorted/base/merge';
import { quickSort } from '../src/sorted/base/quick/quickSort';
import { heapSort } from '../src/sorted/base/heap/heapSort';
import { gnomeSort } from '../src/sorted/standard/gnome';
import { shellSort } from '../src/sorted/standard/shell';
import { CompareFn } from '../src/types/function-type';

type SortFn<T> = (arr: T[], compareFn?: CompareFn<T>) => T[];

describe.each([
  ['bubbleSort', bubbleSort],
  ['insertionSort', insertionSort],
  ['selectionSort', selectionSort],
  ['quickSort', quickSort],
  ['heapSort', heapSort],
  ['gnomeSort', gnomeSort],
  ['shellSort', shellSort],
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
