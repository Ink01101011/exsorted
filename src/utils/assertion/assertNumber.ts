import { ERROR_MESSAGES } from '../../constants';

export function guardRange(
  size: number,
  threshold: number,
  getMessage: (threshold: number) => string = ERROR_MESSAGES.COUNTING_SORT_RANGE_TOO_LARGE,
): void {
  if (size > threshold) {
    throw new RangeError(getMessage(threshold));
  }
}

export function keyValidator(key: number): void {
  if (!Number.isSafeInteger(key)) {
    throw new TypeError(ERROR_MESSAGES.KEY_NOT_INTEGER);
  }
}
