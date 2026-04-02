import { defaultCompareFn } from '../utils/defaultCompareFn';

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
