export type CompareFn<T> = (a: T, b: T) => number;

export type SortedArray<T> = T[];

export type SelectorFn<T, K> = (item: T) => K;

export type KeySelector<T> = (item: T) => number;
