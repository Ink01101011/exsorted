import { bubbleSort } from '../sorted/base/bubble/bubbleSort';
import { insertionSort } from '../sorted/base/insertion/insertionSort';
import { selectionSort } from '../sorted/base/selection';
import { mergeSort } from '../sorted/base/merge';
import { quickSort } from '../sorted/base/quick/quickSort';
import { heapSort } from '../sorted/base/heap/heapSort';
import * as sortedExports from '../sorted';
import { compareBy } from '../utils/compareBy';
import { selectionSort as selectionNamed } from '../base/selection';
import { bubbleSort as bubbleNamed } from '../base/bubble';

describe('sorted index exports', () => {
  it('re-exports all sorting functions', () => {
    expect(sortedExports.bubbleSort).toBe(bubbleSort);
    expect(sortedExports.insertionSort).toBe(insertionSort);
    expect(sortedExports.selectionSort).toBe(selectionSort);
    expect(sortedExports.mergeSort).toBe(mergeSort);
    expect(sortedExports.quickSort).toBe(quickSort);
    expect(sortedExports.heapSort).toBe(heapSort);
    expect(sortedExports.compareBy).toBe(compareBy);
  });
});

describe('subpath entrypoints', () => {
  it('supports named imports for selection', () => {
    expect(selectionNamed).toBe(selectionSort);
    expect(selectionNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('supports named imports for bubble', () => {
    expect(bubbleNamed).toBe(bubbleSort);
    expect(bubbleNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });
});
