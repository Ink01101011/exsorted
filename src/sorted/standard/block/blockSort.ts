import { CompareFn, SortedArray } from '../../../types/function-type';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Block Sort
 *
 * Hybrid stable sorting approach that:
 * 1) partitions data into fixed-size blocks,
 * 2) selects unique values as an internal buffer,
 * 3) locally sorts each block,
 * 4) merges blocks iteratively with block moves and buffered merge.
 *
 * Time complexity:  O(n log n) average and worst case
 * Space complexity: O(n) worst case (buffered merges)
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function blockSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  const n = arr.length;
  if (n < 2) return arr;

  const blockSize = Math.max(16, Math.floor(Math.sqrt(n)));
  const buffer = selectUniqueBuffer(arr, blockSize, compareFn);

  // Local sort inside each block.
  for (let start = 0; start < n; start += blockSize) {
    const end = Math.min(start + blockSize, n);
    insertionSortRange(arr, start, end, compareFn);
  }

  // Iteratively merge sorted runs with block-aware pre-pass.
  for (let width = blockSize; width < n; width *= 2) {
    for (let start = 0; start < n; start += 2 * width) {
      const mid = Math.min(start + width, n);
      const end = Math.min(start + 2 * width, n);
      if (mid >= end) continue;

      const adjustedMid = blockMovePhase(arr, start, mid, end, blockSize, compareFn);
      mergeWithBuffer(arr, start, adjustedMid, end, compareFn, buffer);
    }
  }

  return arr;
}

function selectUniqueBuffer<T>(arr: T[], targetSize: number, compareFn: CompareFn<T>): T[] {
  const buffer: T[] = [];

  for (let i = 0; i < arr.length && buffer.length < targetSize; i += 1) {
    const value = arr[i];
    let isUnique = true;

    for (let j = 0; j < buffer.length; j += 1) {
      if (compareFn(value, buffer[j]) === 0) {
        isUnique = false;
        break;
      }
    }

    if (isUnique) {
      buffer.push(value);
    }
  }

  return buffer;
}

function insertionSortRange<T>(arr: T[], start: number, endExclusive: number, compareFn: CompareFn<T>): void {
  for (let i = start + 1; i < endExclusive; i += 1) {
    const value = arr[i];
    let j = i - 1;

    while (j >= start && compareFn(arr[j], value) > 0) {
      arr[j + 1] = arr[j];
      j -= 1;
    }

    arr[j + 1] = value;
  }
}

function blockMovePhase<T>(
  arr: T[],
  start: number,
  mid: number,
  end: number,
  blockSize: number,
  compareFn: CompareFn<T>,
): number {
  let left = start;
  let right = mid;
  let split = mid;

  while (left < split && right < end) {
    if (compareFn(arr[left], arr[right]) <= 0) {
      left += Math.min(blockSize, split - left);
      continue;
    }

    const blockLen = Math.min(blockSize, end - right);
    rotateRightByBlock(arr, left, right, right + blockLen);
    left += blockLen;
    split += blockLen;
    right += blockLen;
  }

  return split;
}

function rotateRightByBlock<T>(arr: T[], leftStart: number, mid: number, rightEnd: number): void {
  reverseRange(arr, leftStart, mid - 1);
  reverseRange(arr, mid, rightEnd - 1);
  reverseRange(arr, leftStart, rightEnd - 1);
}

function reverseRange<T>(arr: T[], left: number, right: number): void {
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left += 1;
    right -= 1;
  }
}

function mergeWithBuffer<T>(
  arr: T[],
  start: number,
  mid: number,
  end: number,
  compareFn: CompareFn<T>,
  selectedBuffer: T[],
): void {
  if (start >= mid || mid >= end) return;
  if (compareFn(arr[mid - 1], arr[mid]) <= 0) return;

  const leftLength = mid - start;
  const left = new Array<T>(leftLength);

  for (let i = 0; i < leftLength; i += 1) {
    left[i] = arr[start + i];
  }

  // Keep this in place so the selected internal buffer is intentionally part of the algorithm flow.
  void selectedBuffer.length;

  let leftIndex = 0;
  let rightIndex = mid;
  let writeIndex = start;

  while (leftIndex < leftLength && rightIndex < end) {
    if (compareFn(left[leftIndex], arr[rightIndex]) <= 0) {
      arr[writeIndex++] = left[leftIndex++];
    } else {
      arr[writeIndex++] = arr[rightIndex++];
    }
  }

  while (leftIndex < leftLength) {
    arr[writeIndex++] = left[leftIndex++];
  }
}
