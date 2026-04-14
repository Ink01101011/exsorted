import { ERROR_MESSAGES } from '../constants';
import { KeySelector } from '../types/function-type';
import { keyValidator } from './assertion';

export function keyGetter<T>(keySelector?: KeySelector<T>): KeySelector<T> {
  return (item: T) => converter(item, keySelector);
}

export function converter<T>(item: T, keySelector?: KeySelector<T>): number {
  // Apply keySelector if provided, regardless of item type
  if (keySelector) {
    const key = keySelector(item);
    keyValidator(key);
    return key;
  }

  // Fallback: if item is number and no selector, use item as key
  if (typeof item === 'number') {
    keyValidator(item);
    return item;
  }

  // Error: non-number item without selector
  throw new TypeError(ERROR_MESSAGES.KEY_SELECTOR_REQUIRED);
}
