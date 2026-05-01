import { bubbleSort } from '../src/sorted/base/bubble/bubbleSort';
import { insertionSort } from '../src/sorted/base/insertion/insertionSort';
import { selectionSort } from '../src/sorted/base/selection';
import { mergeSort } from '../src/sorted/base/merge';
import { quickSort } from '../src/sorted/base/quick/quickSort';
import { heapSort } from '../src/sorted/base/heap/heapSort';
import { timSort } from '../src/sorted/standard/tim';
import { gnomeSort } from '../src/sorted/standard/gnome';
import { shellSort } from '../src/sorted/standard/shell';
import { introSort } from '../src/sorted/standard/intro';
import { blockSort } from '../src/sorted/standard/block';
import { countingSort } from '../src/sorted/non-compare/counting';
import { radixSort } from '../src/sorted/non-compare/radix';
import { bucketSort } from '../src/sorted/non-compare/bucket';
import { pigeonholeSort } from '../src/sorted/non-compare/pigeonhole';
import * as sortedExports from '../src/sorted';
import * as utilsExports from '../src/utils';
import { compareBy } from '../src/utils/compareBy';
import { selectionSort as selectionNamed } from '../src/sorted/base/selection';
import { bubbleSort as bubbleNamed } from '../src/sorted/base/bubble';
import { timSort as timNamed } from '../src/sorted/standard/tim';
import { gnomeSort as gnomeNamed } from '../src/sorted/standard/gnome';
import { shellSort as shellNamed } from '../src/sorted/standard/shell';
import { introSort as introNamed } from '../src/sorted/standard/intro';
import { blockSort as blockNamed } from '../src/sorted/standard/block';
import { countingSort as countingNamed } from '../src/sorted/non-compare/counting';
import { radixSort as radixNamed } from '../src/sorted/non-compare/radix';
import { bucketSort as bucketNamed } from '../src/sorted/non-compare/bucket';
import { pigeonholeSort as pigeonholeNamed } from '../src/sorted/non-compare/pigeonhole';
import { bitonicSort as bitonicNamed } from '../src/sorted/parallel/bitonic';
import { cocktailShakerSort as cocktailNamed } from '../src/sorted/parallel/cocktail';
import { combSort as combNamed } from '../src/sorted/parallel/comb';
import { compareBy as compareByFromUtils, defaultCompareFn as defaultCompareFnFromUtils } from '../src/utils';
import { compareBy as compareByDirect } from '../src/utils/compareBy';
import { defaultCompareFn as defaultCompareFnDirect } from '../src/utils/defaultCompareFn';
import { assertArrayInput as assertArrayInputDirect } from '../src/utils/assertion';

describe('sorted index exports', () => {
  it('re-exports all sorting functions', () => {
    expect(sortedExports.bubbleSort).toBe(bubbleSort);
    expect(sortedExports.insertionSort).toBe(insertionSort);
    expect(sortedExports.selectionSort).toBe(selectionSort);
    expect(sortedExports.mergeSort).toBe(mergeSort);
    expect(sortedExports.quickSort).toBe(quickSort);
    expect(sortedExports.heapSort).toBe(heapSort);
    expect(sortedExports.timSort).toBe(timSort);
    expect(sortedExports.gnomeSort).toBe(gnomeSort);
    expect(sortedExports.shellSort).toBe(shellSort);
    expect(sortedExports.introSort).toBe(introSort);
    expect(sortedExports.blockSort).toBe(blockSort);
    expect(sortedExports.countingSort).toBe(countingSort);
    expect(sortedExports.radixSort).toBe(radixSort);
    expect(sortedExports.bucketSort).toBe(bucketSort);
    expect(sortedExports.pigeonholeSort).toBe(pigeonholeSort);
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

  it('supports named imports for gnome', () => {
    expect(gnomeNamed).toBe(gnomeSort);
    expect(gnomeNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('supports named imports for shell', () => {
    expect(shellNamed).toBe(shellSort);
    expect(shellNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('supports named imports for intro', () => {
    expect(introNamed).toBe(introSort);
    expect(introNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('supports named imports for block', () => {
    expect(blockNamed).toBe(blockSort);
    expect(blockNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('supports named imports for counting', () => {
    expect(countingNamed).toBe(countingSort);
    expect(countingNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('supports named imports for radix', () => {
    expect(radixNamed).toBe(radixSort);
    expect(radixNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('supports named imports for bucket', () => {
    expect(bucketNamed).toBe(bucketSort);
    expect(bucketNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('supports named imports for pigeonhole', () => {
    expect(pigeonholeNamed).toBe(pigeonholeSort);
    expect(pigeonholeNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('supports named imports for bitonic', () => {
    expect(bitonicNamed).toBe(sortedExports.bitonicSort);
    expect(bitonicNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('supports named imports for cocktail', () => {
    expect(cocktailNamed).toBe(sortedExports.cocktailShakerSort);
    expect(cocktailNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('supports named imports for comb', () => {
    expect(combNamed).toBe(sortedExports.combSort);
    expect(combNamed([3, 2, 1])).toEqual([1, 2, 3]);
  });
});

describe('utils barrel exports', () => {
  it('re-exports compare helpers', () => {
    expect(compareByFromUtils).toBe(compareByDirect);
    expect(defaultCompareFnFromUtils).toBe(defaultCompareFnDirect);
    expect(utilsExports.assertArrayInput).toBe(assertArrayInputDirect);
  });

  it('keeps compatibility export contract for helper barrel', () => {
    expect(Object.keys(utilsExports).sort()).toEqual(['assertArrayInput', 'compareBy', 'defaultCompareFn']);
  });
});
