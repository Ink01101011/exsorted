import { createSortCompareFn, defaultCompareFn } from '../src/utils/defaultCompareFn';
import { quickSort } from '../src/sorted/base/quick/quickSort';

// ---------------------------------------------------------------------------
// Basic graph handling — shared refs vs genuine cycles
// ---------------------------------------------------------------------------

describe('defaultCompareFn: shared references vs cycles', () => {
  it('treats a shared reference as non-cyclic structural data', () => {
    const shared = { value: 1 };
    const withSharedRefs = { a: shared, b: shared };
    const withDuplicatedStructure = { a: { value: 1 }, b: { value: 1 } };

    expect(defaultCompareFn(withSharedRefs, withDuplicatedStructure)).toBe(0);
    expect(defaultCompareFn(withDuplicatedStructure, withSharedRefs)).toBe(0);
  });

  it('handles genuine self-referential cycles without throwing', () => {
    const left: { id: number; self?: unknown } = { id: 1 };
    left.self = left;

    const right: { id: number; self?: unknown } = { id: 1 };
    right.self = right;

    expect(() => defaultCompareFn(left, right)).not.toThrow();
    expect(defaultCompareFn(left, right)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Nested shared references (multi-level)
// ---------------------------------------------------------------------------

describe('defaultCompareFn: nested shared references', () => {
  it('handles the same object shared at different nesting depths', () => {
    const leaf = { value: 99 };
    const mid = { child: leaf, extra: leaf }; // shared at same level
    const graph = { a: mid, b: leaf }; // shared across depths

    const mirror = {
      a: { child: { value: 99 }, extra: { value: 99 } },
      b: { value: 99 },
    };

    expect(() => defaultCompareFn(graph, mirror)).not.toThrow();
    expect(defaultCompareFn(graph, mirror)).toBe(0);
  });

  it('handles an array with the same object at multiple indices', () => {
    const shared = { x: 1 };
    const withShared = [shared, shared, shared];
    const withDuplicates = [{ x: 1 }, { x: 1 }, { x: 1 }];

    expect(() => defaultCompareFn(withShared, withDuplicates)).not.toThrow();
    expect(defaultCompareFn(withShared, withDuplicates)).toBe(0);
  });

  it('distinguishes shared objects with different values', () => {
    const sharedA = { value: 1 };
    const a = { x: sharedA, y: sharedA };

    const sharedB = { value: 2 };
    const b = { x: sharedB, y: sharedB };

    expect(defaultCompareFn(a, b)).toBeLessThan(0);
    expect(defaultCompareFn(b, a)).toBeGreaterThan(0);
  });

  it('handles three-level deep nesting with shared leaf', () => {
    const leaf = { v: 7 };
    const l2a = { leaf };
    const l2b = { leaf }; // same leaf as l2a
    const root = { l2a, l2b, direct: leaf }; // shared across all three paths

    const mirrorLeaf = { v: 7 };
    const mirrorRoot = {
      l2a: { leaf: { v: 7 } },
      l2b: { leaf: { v: 7 } },
      direct: mirrorLeaf,
    };

    expect(() => defaultCompareFn(root, mirrorRoot)).not.toThrow();
    expect(defaultCompareFn(root, mirrorRoot)).toBe(0);
  });

  it('handles shared objects inside nested arrays', () => {
    const shared = { tag: 'X' };
    const graph = { items: [[shared, shared], [shared]] };
    const mirror = { items: [[{ tag: 'X' }, { tag: 'X' }], [{ tag: 'X' }]] };

    expect(() => defaultCompareFn(graph, mirror)).not.toThrow();
    expect(defaultCompareFn(graph, mirror)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Mixed shared references + cycles in the same graph
// ---------------------------------------------------------------------------

describe('defaultCompareFn: mixed shared references and cycles', () => {
  it('handles a node that is both shared and part of a cycle', () => {
    // container → shared → container (cycle), and container.ref2 = shared (shared ref)
    const shared: { value: number; back?: unknown } = { value: 10 };
    const container = { ref1: shared, ref2: shared };
    shared.back = container;

    expect(() => defaultCompareFn(container, container)).not.toThrow();
    expect(defaultCompareFn(container, container)).toBe(0);
  });

  it('handles diamond-shaped graph (two paths converge on same node)', () => {
    const bottom = { value: 1 };
    const left = { child: bottom };
    const right = { child: bottom };
    const top = { left, right };

    const mBottom = { value: 1 };
    const mLeft = { child: mBottom };
    const mRight = { child: mBottom };
    const mTop = { left: mLeft, right: mRight };

    expect(() => defaultCompareFn(top, mTop)).not.toThrow();
    expect(defaultCompareFn(top, mTop)).toBe(0);
  });

  it('handles A→B→A mutual cycle with an external shared alias to A', () => {
    const a: { id: number; next?: unknown } = { id: 1 };
    const b: { id: number; next?: unknown } = { id: 2 };
    a.next = b;
    b.next = a; // A → B → A

    const left = { entry: a, alias: a }; // alias is a second reference to a
    const right = { entry: a, alias: a }; // same objects — symmetrical

    expect(() => defaultCompareFn(left, right)).not.toThrow();
    expect(defaultCompareFn(left, right)).toBe(0);
  });

  it('compares two structurally identical cyclic graphs as equal', () => {
    const a1: { id: number; self?: unknown } = { id: 1 };
    a1.self = a1;

    const a2: { id: number; self?: unknown } = { id: 1 };
    a2.self = a2;

    expect(() => defaultCompareFn(a1, a2)).not.toThrow();
    expect(defaultCompareFn(a1, a2)).toBe(0);
  });

  it('compares two cyclic graphs with different payloads as non-equal', () => {
    const a1: { id: number; self?: unknown } = { id: 1 };
    a1.self = a1;

    const a2: { id: number; self?: unknown } = { id: 2 };
    a2.self = a2;

    expect(() => defaultCompareFn(a1, a2)).not.toThrow();
    expect(defaultCompareFn(a1, a2)).not.toBe(0);
  });

  it('handles a multi-node cycle with a dangling shared subtree', () => {
    // Cycle: head → mid → tail → head
    // Shared: both mid and tail point to the same metadata node
    const meta = { info: 'shared-meta' };
    const head: { name: string; next?: unknown; meta?: unknown } = { name: 'head', meta };
    const mid: { name: string; next?: unknown; meta?: unknown } = { name: 'mid', meta };
    const tail: { name: string; next?: unknown; meta?: unknown } = { name: 'tail', meta };
    head.next = mid;
    mid.next = tail;
    tail.next = head; // close cycle

    expect(() => defaultCompareFn(head, head)).not.toThrow();
    expect(defaultCompareFn(head, head)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Regression: #64 — nested invalid Date, deep nesting, Map/Set, type collisions
// ---------------------------------------------------------------------------

describe('defaultCompareFn: robustness on nested values (#64)', () => {
  it('does not throw on an invalid Date nested in an array or object', () => {
    expect(() => defaultCompareFn([new Date(NaN)], [new Date(0)])).not.toThrow();
    expect(() => defaultCompareFn({ d: new Date(NaN) }, { d: new Date(0) })).not.toThrow();
  });

  it('sorts nested invalid Dates after valid ones, like top-level Dates', () => {
    expect(defaultCompareFn([new Date(NaN)], [new Date(0)])).toBeGreaterThan(0);
    expect(defaultCompareFn([new Date(0)], [new Date(NaN)])).toBeLessThan(0);
    expect(defaultCompareFn([new Date(NaN)], [new Date(NaN)])).toBe(0);
  });

  it('sorts arrays containing invalid Dates with quickSort', () => {
    const input = [[new Date(NaN)], [new Date(0)]];
    expect(() => quickSort(input)).not.toThrow();
    expect(input[0][0].getTime()).toBe(0);
  });

  it('handles very deep nesting without exceeding the call stack', () => {
    let deep: unknown[] = [];
    for (let i = 0; i < 20_000; i++) deep = [deep];
    let deepObj: Record<string, unknown> = {};
    for (let i = 0; i < 20_000; i++) deepObj = { next: deepObj };

    expect(() => defaultCompareFn(deep, [1])).not.toThrow();
    expect(() => defaultCompareFn(deepObj, { next: 1 })).not.toThrow();
    expect(defaultCompareFn(deep, deep)).toBe(0);
  });

  it('distinguishes Maps and Sets by their contents', () => {
    expect(defaultCompareFn(new Map([[1, 1]]), new Map([[2, 2]]))).not.toBe(0);
    expect(defaultCompareFn(new Map([[1, 1]]), new Map([[1, 1]]))).toBe(0);
    expect(defaultCompareFn(new Set([1]), new Set([2]))).not.toBe(0);
    expect(defaultCompareFn(new Set([1, 2]), new Set([1, 2]))).toBe(0);
  });

  it('distinguishes primitives of different types inside objects', () => {
    expect(defaultCompareFn({ a: BigInt(1) }, { a: 1 })).not.toBe(0);
    expect(defaultCompareFn({ a: '1' }, { a: 1 })).not.toBe(0);
    expect(defaultCompareFn({ a: 'true' }, { a: true })).not.toBe(0);
    expect(defaultCompareFn([null], ['null'])).not.toBe(0);
  });

  it('is antisymmetric on the new cases', () => {
    const pairs: [unknown, unknown][] = [
      [{ a: BigInt(1) }, { a: 1 }],
      [new Map([[1, 1]]), new Map([[2, 2]])],
      [[new Date(NaN)], [new Date(0)]],
    ];
    for (const [a, b] of pairs) {
      expect(Math.sign(defaultCompareFn(a, b))).toBe(-Math.sign(defaultCompareFn(b, a)));
    }
  });
});

// ---------------------------------------------------------------------------
// #65 — string fast path and per-sort cached comparator
// ---------------------------------------------------------------------------

describe('defaultCompareFn: string fast path (#65)', () => {
  it('compares top-level strings by raw UTF-16 code units', () => {
    // A quote (0x22) sorts before 'a'; JSON-escaping would not change this, but a backslash would.
    expect(defaultCompareFn('"', 'a')).toBeLessThan(0);
    expect(defaultCompareFn('\\', ']')).toBeLessThan(0);
    expect(defaultCompareFn('B', 'a')).toBeLessThan(0);
    expect(defaultCompareFn('same', 'same')).toBe(0);
  });
});

describe('createSortCompareFn (#65)', () => {
  const samples: unknown[] = [
    undefined,
    null,
    true,
    false,
    0,
    -1,
    NaN,
    BigInt(2),
    'a',
    'b"',
    new Date(0),
    new Date(NaN),
    [1, 2],
    [1, '2'],
    { a: 1 },
    { a: '1' },
    { b: [1, { c: 2 }] },
    new Map([[1, 1]]),
    new Set([1]),
  ];

  it('orders every pair exactly like defaultCompareFn', () => {
    const cached = createSortCompareFn<unknown>();
    for (const a of samples) {
      for (const b of samples) {
        expect(Math.sign(cached(a, b))).toBe(Math.sign(defaultCompareFn(a, b)));
      }
    }
  });

  it('serializes each object at most once per instance', () => {
    const cached = createSortCompareFn<{ id: number }>();
    let reads = 0;
    const make = (id: number) => {
      const obj = {} as { id: number };
      Object.defineProperty(obj, 'id', {
        enumerable: true,
        get: () => {
          reads++;
          return id;
        },
      });
      return obj;
    };
    const a = make(1);
    const b = make(2);
    for (let i = 0; i < 10; i++) cached(a, b);
    expect(reads).toBe(2);
  });

  it('uses a fresh cache for each sort call, so mutation between sorts is respected', () => {
    const a = { v: 1 };
    const b = { v: 2 };
    expect(quickSort([b, a])).toEqual([{ v: 1 }, { v: 2 }]);
    a.v = 3;
    expect(quickSort([a, b])).toEqual([{ v: 2 }, { v: 3 }]);
  });
});
