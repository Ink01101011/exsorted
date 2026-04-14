import { ERROR_MESSAGES } from '../../constants';

export function guardRange(size: number, threshold: number): void {
  if (size > threshold) {
    throw new RangeError(ERROR_MESSAGES.COUNTING_SORT_RANGE_TOO_LARGE(threshold));
  }
}

export function keyValidator<T extends number>(key: T): void {
  if (!Number.isSafeInteger(key)) {
    throw new TypeError(ERROR_MESSAGES.KEY_NOT_INTEGER);
  }
}
