import { bubbleSort } from '../src/sorted/base/bubble/bubbleSort';
import { insertionSort } from '../src/sorted/base/insertion/insertionSort';
import { selectionSort } from '../src/sorted/base/selection';
import { mergeSort } from '../src/sorted/base/merge';
import { quickSort } from '../src/sorted/base/quick/quickSort';
import { heapSort } from '../src/sorted/base/heap/heapSort';
import { timSort } from '../src/sorted/standard/tim';
import * as sortedExports from '../src/sorted';
import { compareBy } from '../src/utils/compareBy';
import { selectionSort as selectionNamed } from '../src/sorted/base/selection';
import { bubbleSort as bubbleNamed } from '../src/sorted/base/bubble';
import { timSort as timNamed } from '../src/sorted/standard/tim';

describe('sorted index exports', () => {
  it('re-exports all sorting functions', () => {
    expect(sortedExports.bubbleSort).toBe(bubbleSort);
    expect(sortedExports.insertionSort).toBe(insertionSort);
    expect(sortedExports.selectionSort).toBe(selectionSort);
    expect(sortedExports.mergeSort).toBe(mergeSort);
    expect(sortedExports.quickSort).toBe(quickSort);
    expect(sortedExports.heapSort).toBe(heapSort);
    expect(sortedExports.timSort).toBe(timSort);
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

  it('supports named imports for tim', () => {
    expect(timNamed).toBe(timSort);
    expect(timNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });
});
