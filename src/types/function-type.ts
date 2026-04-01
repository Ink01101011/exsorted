export type CompareFn<T> = (a: T, b: T) => number;

export type ReturnedSortFn<T> = T[];

export type SelectorFn<T, K> = (item: T) => K;
