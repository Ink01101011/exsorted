import { CompareFn, SortedArray } from '../../../types/function-type';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

/**
 * Block Sort
 *
 * Block-oriented hybrid sort that:
 * 1) partitions data into fixed-size blocks,
 * 2) allocates fixed-size internal scratch space,
 * 3) locally sorts each block,
 * 4) merges blocks iteratively with block moves and buffered merge.
 *
 * Practical complexity: typically O(n log n) for mixed input distributions;
 * this simplified implementation can perform more data movement in fallback
 * block rotations when internal scratch space is insufficient for a move.
 *
 * Space complexity: O(n) worst case due to merge buffering.
 *
 * Stability: designed to keep equal elements in their original relative order.
 *
 * @param arr - The array to sort (mutated in place)
 * @param compareFn - Optional comparator; defaults to ascending numeric/lexicographic order
 * @returns The sorted array
 */
export function blockSort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  const n = arr.length;
  if (n < 2) return arr;

  const blockSize = Math.max(16, Math.floor(Math.sqrt(n)));
  const buffer = new Array<T>(blockSize);

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

      const adjustedMid = blockMovePhase(arr, start, mid, end, blockSize, compareFn, buffer);
      mergeWithBuffer(arr, start, adjustedMid, end, compareFn);
    }
  }

  return arr;
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
  internalBuffer: T[],
): number {
  let left = start;
  let right = mid;
  let split = mid;

  while (left < split && right < end) {
    const leftBlockEnd = Math.min(left + blockSize - 1, split - 1);

    if (compareFn(arr[leftBlockEnd], arr[right]) <= 0) {
      left += Math.min(blockSize, split - left);
      continue;
    }

    const blockLen = Math.min(blockSize, end - right);

    // Preserve stability by rotating only when the entire right block is
    // strictly smaller than the current left boundary element.
    if (compareFn(arr[right + blockLen - 1], arr[left]) >= 0) {
      left += Math.min(blockSize, split - left);
      continue;
    }

    rotateRightByBlock(arr, left, right, right + blockLen, internalBuffer);
    left += blockLen;
    split += blockLen;
    right += blockLen;
  }

  return split;
}

function rotateRightByBlock<T>(arr: T[], leftStart: number, mid: number, rightEnd: number, internalBuffer: T[]): void {
  const rightLength = rightEnd - mid;

  if (rightLength > 0 && internalBuffer.length >= rightLength) {
    for (let i = 0; i < rightLength; i += 1) {
      internalBuffer[i] = arr[mid + i];
    }

    for (let i = mid - 1; i >= leftStart; i -= 1) {
      arr[i + rightLength] = arr[i];
    }

    for (let i = 0; i < rightLength; i += 1) {
      arr[leftStart + i] = internalBuffer[i];
    }
    return;
  }

  // Fallback when available internal buffer is too small.
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

function mergeWithBuffer<T>(arr: T[], start: number, mid: number, end: number, compareFn: CompareFn<T>): void {
  if (start >= mid || mid >= end) return;
  if (compareFn(arr[mid - 1], arr[mid]) <= 0) return;

  const leftLength = mid - start;
  const left = new Array<T>(leftLength);

  for (let i = 0; i < leftLength; i += 1) {
    left[i] = arr[start + i];
  }

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
