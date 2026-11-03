import { bogoSort } from '../src/sorted/meme/bogo/bogoSort';
import { stoogeSort } from '../src/sorted/meme/stooge/stoogeSort';
import { stalinSort } from '../src/sorted/meme/stalin/stalinSort';
import { sleepSort } from '../src/sorted/meme/sleep/sleepSort';
import { ERROR_MESSAGES } from '../src/constants';
import { compareBy } from '../src/utils/compareBy';
import * as memeExports from '../src/sorted/meme';
import * as sortedExports from '../src/sorted';
import * as rootExports from '../src';

interface Person {
  name: string;
  age: number;
}
const people: Person[] = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 },
];
const byAge = (a: Person, b: Person) => a.age - b.age;

// bogoSort is kept to small inputs: its average cost is O(n · n!).
describe.each([
  ['bogoSort', bogoSort],
  ['stoogeSort', stoogeSort],
] as const)('%s (in-place comparison meme sort)', (_name, sortFn) => {
  describe('numbers (ascending, default)', () => {
    it('sorts an unsorted array', () => {
      expect(sortFn([5, 3, 8, 1, 2])).toEqual([1, 2, 3, 5, 8]);
    });
    it('returns an already-sorted array unchanged', () => {
      expect(sortFn([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });
    it('sorts a reverse-sorted array', () => {
      expect(sortFn([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
    });
    it('handles an empty array', () => {
      expect(sortFn([])).toEqual([]);
    });
    it('handles a single-element array', () => {
      expect(sortFn([42])).toEqual([42]);
    });
    it('handles an array with duplicate values', () => {
      expect(sortFn([3, 1, 4, 1, 5, 3])).toEqual([1, 1, 3, 3, 4, 5]);
    });
    it('handles an array where all elements are equal', () => {
      expect(sortFn([7, 7, 7, 7])).toEqual([7, 7, 7, 7]);
    });
    it('handles negative numbers', () => {
      expect(sortFn([-3, -1, -4, -2])).toEqual([-4, -3, -2, -1]);
    });
    it('handles mixed negative and positive numbers', () => {
      expect(sortFn([3, -2, 0, -1, 2])).toEqual([-2, -1, 0, 2, 3]);
    });
  });

  describe('numbers (descending, custom comparator)', () => {
    it('sorts in descending order', () => {
      expect(sortFn([5, 3, 8, 1, 2], (a, b) => b - a)).toEqual([8, 5, 3, 2, 1]);
    });
  });

  describe('strings (alphabetical, default)', () => {
    it('sorts strings alphabetically', () => {
      expect(sortFn(['banana', 'apple', 'cherry'])).toEqual(['apple', 'banana', 'cherry']);
    });
  });

  describe('objects (custom comparator)', () => {
    it('sorts objects by a numeric property', () => {
      expect(
        sortFn(
          people.map((p) => ({ ...p })),
          byAge,
        ).map((p) => p.name),
      ).toEqual(['Bob', 'Alice', 'Charlie']);
    });
    it('works with compareBy helper', () => {
      const result = sortFn(
        people.map((p) => ({ ...p })),
        compareBy((p: Person) => p.age),
      );
      expect(result.map((p) => p.name)).toEqual(['Bob', 'Alice', 'Charlie']);
    });
  });

  describe('objects (without custom comparator)', () => {
    it('sorts deterministically with the default comparator', () => {
      expect(sortFn([{ id: 2 }, { id: 1 }])).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });

  describe('mutation', () => {
    it('mutates and returns the same array reference', () => {
      const arr = [3, 1, 2];
      const result = sortFn(arr);
      expect(result).toBe(arr);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  it('throws on non-array input', () => {
    expect(() => sortFn(null as unknown as number[])).toThrow(TypeError);
  });
});

describe('bogoSort specifics', () => {
  it('gives up with a RangeError after maxShuffles', () => {
    // A comparator that always reports "out of order" makes every permutation unsorted.
    const never = () => 1;
    expect(() => bogoSort([1, 2], never, { maxShuffles: 5 })).toThrow(ERROR_MESSAGES.BOGO_SORT_GAVE_UP(5));
  });

  it('uses the injected random source', () => {
    const random = jest.fn(() => 0); // j = 0 swaps [2, 1] into [1, 2]
    expect(bogoSort([2, 1], undefined, { random })).toEqual([1, 2]);
    expect(random).toHaveBeenCalled();
  });

  it('does not shuffle an already-sorted array', () => {
    const random = jest.fn(Math.random);
    bogoSort([1, 2, 3], undefined, { random });
    expect(random).not.toHaveBeenCalled();
  });
});

describe('stoogeSort specifics', () => {
  it('sorts a larger random array correctly', () => {
    const input = Array.from({ length: 60 }, (_, i) => (i * 37) % 61);
    expect(stoogeSort(input.slice())).toEqual(input.slice().sort((a, b) => a - b));
  });
});

describe('stalinSort', () => {
  it('drops out-of-order elements (issue example)', () => {
    expect(stalinSort([1, 2, 5, 3, 4, 7, 6])).toEqual([1, 2, 5, 7]);
  });
  it('keeps every element of an already-sorted array', () => {
    expect(stalinSort([1, 2, 2, 3])).toEqual([1, 2, 2, 3]);
  });
  it('keeps only the first element of a reverse-sorted array', () => {
    expect(stalinSort([5, 4, 3, 2, 1])).toEqual([5]);
  });
  it('handles empty and single-element arrays', () => {
    expect(stalinSort([])).toEqual([]);
    expect(stalinSort([42])).toEqual([42]);
  });
  it('supports a custom comparator', () => {
    expect(stalinSort([5, 3, 4, 1], (a, b) => b - a)).toEqual([5, 3, 1]);
  });
  it('sorts strings and objects', () => {
    expect(stalinSort(['b', 'a', 'c'])).toEqual(['b', 'c']);
    expect(stalinSort(people, byAge).map((p) => p.name)).toEqual(['Alice', 'Charlie']);
  });
  it('returns a new array and does not mutate the input', () => {
    const arr = [3, 1, 2];
    const result = stalinSort(arr);
    expect(result).not.toBe(arr);
    expect(arr).toEqual([3, 1, 2]);
  });
  it('throws on non-array input', () => {
    expect(() => stalinSort(null as unknown as number[])).toThrow(TypeError);
  });
});

describe('sleepSort', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const run = async <T>(promise: Promise<T>): Promise<T> => {
    await jest.runAllTimersAsync();
    return promise;
  };

  it('sorts non-negative numbers', async () => {
    await expect(run(sleepSort([3, 1, 2, 0, 5]))).resolves.toEqual([0, 1, 2, 3, 5]);
  });
  it('keeps equal keys in input order (stable)', async () => {
    const input = [
      { id: 'a', k: 2 },
      { id: 'b', k: 1 },
      { id: 'c', k: 2 },
      { id: 'd', k: 1 },
    ];
    const result = await run(sleepSort(input, (x) => x.k));
    expect(result.map((x) => x.id)).toEqual(['b', 'd', 'a', 'c']);
  });
  it('handles an empty array', async () => {
    await expect(run(sleepSort([]))).resolves.toEqual([]);
  });
  it('scales delays with msPerUnit', async () => {
    const promise = sleepSort([2, 1], undefined, { msPerUnit: 100 });
    let done = false;
    void promise.then(() => (done = true));
    await jest.advanceTimersByTimeAsync(150);
    expect(done).toBe(false);
    await jest.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toEqual([1, 2]);
  });
  it('does not mutate the input', async () => {
    const arr = [3, 1, 2];
    const result = await run(sleepSort(arr));
    expect(result).not.toBe(arr);
    expect(arr).toEqual([3, 1, 2]);
  });
  it('rejects negative, NaN and infinite keys', async () => {
    await expect(sleepSort([1, -1])).rejects.toThrow(ERROR_MESSAGES.SLEEP_SORT_INVALID_KEY);
    await expect(sleepSort([NaN])).rejects.toThrow(ERROR_MESSAGES.SLEEP_SORT_INVALID_KEY);
    await expect(sleepSort([Infinity])).rejects.toThrow(ERROR_MESSAGES.SLEEP_SORT_INVALID_KEY);
  });
  it('rejects delays beyond the timer limit instead of firing early', async () => {
    await expect(sleepSort([3e9])).rejects.toThrow(RangeError);
  });
  it('rejects non-number items without a keySelector', async () => {
    await expect(sleepSort([{ a: 1 }] as unknown as number[])).rejects.toThrow(ERROR_MESSAGES.KEY_SELECTOR_REQUIRED);
  });
  it('rejects non-array input', async () => {
    await expect(sleepSort(null as unknown as number[])).rejects.toThrow(TypeError);
  });
  it('starts no timers when a key is invalid', async () => {
    await expect(sleepSort([1, 2, -1])).rejects.toThrow();
    expect(jest.getTimerCount()).toBe(0);
  });
});

describe('meme exports', () => {
  it('re-exports every meme sort from the meme, sorted and root indexes', () => {
    for (const mod of [memeExports, sortedExports, rootExports]) {
      expect(mod.bogoSort).toBe(bogoSort);
      expect(mod.stalinSort).toBe(stalinSort);
      expect(mod.sleepSort).toBe(sleepSort);
      expect(mod.stoogeSort).toBe(stoogeSort);
    }
    expect(memeExports.__exsortedMemeEntry).toBe(true);
  });
});
