import { CompareFn, SelectorFn } from '../types/function-type';
import { defaultCompareFn } from './defaultCompareFn';

export function compareBy<T, K>(selector: SelectorFn<T, K>, compareFn?: CompareFn<K>): CompareFn<T> {
  const comparator = compareFn ?? defaultCompareFn;
  return function (a: T, b: T) {
    return comparator(selector(a), selector(b));
  };
}
