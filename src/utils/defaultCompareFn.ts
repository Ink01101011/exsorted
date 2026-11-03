/**
 * Default comparator used by every comparison sort.
 *
 * Orders values by type first (undefined < null < boolean < number < bigint <
 * string < Date < array < object < symbol < other), then within a type:
 * numbers/bigints/booleans/Dates by value (NaN and invalid Dates last),
 * strings by UTF-16 code units, and arrays/objects by a deterministic
 * structural serialization.
 *
 * Arrays and objects are a deterministic fallback, not a fast path. For
 * object data, prefer an explicit comparator or `compareBy`.
 */
export function defaultCompareFn<T>(a: T, b: T): number {
  return compareValues(a, b, normalizeComplexValue);
}

/**
 * Creates a comparator with the same ordering as `defaultCompareFn` that
 * caches each object's serialization by identity.
 *
 * Sorts create one per call (as a default parameter), so the cache lives only
 * for that sort. That turns O(n log n) serializations into O(n). Do not reuse
 * one instance after mutating the compared objects.
 *
 * @internal
 */
export function createSortCompareFn<T>(): (a: T, b: T) => number {
  const cache = new WeakMap<object, string>();
  const normalize = (value: unknown): string => {
    if (typeof value !== 'object' || value === null) return normalizeComplexValue(value);
    let serialized = cache.get(value);
    if (serialized === undefined) {
      serialized = stableSerialize(value);
      cache.set(value, serialized);
    }
    return serialized;
  };
  return (a: T, b: T) => compareValues(a, b, normalize);
}

function compareValues(a: unknown, b: unknown, normalize: (value: unknown) => string): number {
  // Fast paths for the most common homogeneous primitives.
  if (typeof a === 'string' && typeof b === 'string') {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) || Number.isNaN(b)) {
      if (Number.isNaN(a) && Number.isNaN(b)) return 0;
      return Number.isNaN(a) ? 1 : -1;
    }
    return a - b;
  }

  const rankA = getTypeRank(a);
  const rankB = getTypeRank(b);

  if (rankA !== rankB) {
    return rankA - rankB;
  }

  if (typeof a === 'bigint' && typeof b === 'bigint') {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b);
  }

  if (a instanceof Date && b instanceof Date) {
    const timeA = a.getTime();
    const timeB = b.getTime();
    if (Number.isNaN(timeA) && Number.isNaN(timeB)) return 0;
    if (Number.isNaN(timeA)) return 1;
    if (Number.isNaN(timeB)) return -1;
    return timeA - timeB;
  }

  const normalizedA = normalize(a);
  const normalizedB = normalize(b);

  if (normalizedA < normalizedB) return -1;
  if (normalizedA > normalizedB) return 1;
  return 0;
}

function getTypeRank(value: unknown): number {
  if (value === undefined) return 0;
  if (value === null) return 1;
  if (typeof value === 'boolean') return 2;
  if (typeof value === 'number') return 3;
  if (typeof value === 'bigint') return 4;
  if (typeof value === 'string') return 5;
  if (value instanceof Date) return 6;
  if (Array.isArray(value)) return 7;
  if (typeof value === 'object') return 8;
  if (typeof value === 'symbol') return 9;
  return 10;
}

function normalizeComplexValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'symbol') return value.toString();
  if (typeof value === 'function') return value.name || 'anonymous';
  return stableSerialize(value);
}

type WalkTask = { kind: 'value'; value: unknown } | { kind: 'text'; text: string } | { kind: 'exit'; obj: object };

function serializeLeaf(val: unknown): string {
  if (val === undefined) return 'u';
  if (typeof val === 'boolean') return `b:${val}`;
  if (typeof val === 'number') return `n:${val}`;
  if (typeof val === 'bigint') return `i:${val}`;
  if (typeof val === 'string') return `s:${JSON.stringify(val)}`;
  if (typeof val === 'symbol') return `y:${val.toString()}`;
  if (typeof val === 'function') return `f:${val.name || 'anonymous'}`;
  return String(val);
}

/** Nesting depth at which serialization switches from recursion to an explicit stack. */
const MAX_RECURSIVE_DEPTH = 512;

/** Serializes values that have no children, or returns undefined for containers. */
function serializeTerminal(val: unknown): string | undefined {
  if (val === null) return 'null';
  if (typeof val !== 'object') return serializeLeaf(val);
  if (val instanceof Date) {
    const time = val.getTime();
    // '~' sorts after every ISO digit/sign, matching the top-level rule that invalid Dates sort last.
    return Number.isNaN(time) ? 'Date:~Invalid' : `Date:${val.toISOString()}`;
  }
  if (val instanceof RegExp) return `RegExp:${val.toString()}`;
  return undefined;
}

function sortedEntries(val: object): [string, unknown][] {
  return Object.entries(val as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
}

/**
 * Deterministic structural serialization.
 *
 * `seen` tracks only the active ancestor path, so a shared (non-cyclic)
 * reference serializes structurally while a genuine cycle serializes as
 * `[Circular]`.
 *
 * Shallow values take a fast recursive path; past MAX_RECURSIVE_DEPTH the
 * remaining subtree is walked with an explicit stack, so arbitrarily deep
 * input cannot overflow the call stack.
 */
function stableSerialize(value: unknown): string {
  const out: string[] = [];
  walkRecursive(value, new Set<object>(), 0, out);
  return out.join('');
}

function walkRecursive(val: unknown, seen: Set<object>, depth: number, out: string[]): void {
  const terminal = serializeTerminal(val);
  if (terminal !== undefined) {
    out.push(terminal);
    return;
  }
  const obj = val as object;
  if (seen.has(obj)) {
    out.push('[Circular]');
    return;
  }
  if (depth >= MAX_RECURSIVE_DEPTH) {
    walkIterative(obj, seen, out);
    return;
  }

  seen.add(obj);
  const next = depth + 1;
  if (Array.isArray(obj)) {
    out.push('[');
    for (let i = 0; i < obj.length; i++) {
      if (i > 0) out.push(',');
      walkRecursive(obj[i], seen, next, out);
    }
    out.push(']');
  } else if (obj instanceof Map) {
    out.push('Map{');
    let first = true;
    for (const [k, v] of obj) {
      if (!first) out.push(',');
      first = false;
      walkRecursive(k, seen, next, out);
      out.push('=>');
      walkRecursive(v, seen, next, out);
    }
    out.push('}');
  } else if (obj instanceof Set) {
    out.push('Set{');
    let first = true;
    for (const v of obj) {
      if (!first) out.push(',');
      first = false;
      walkRecursive(v, seen, next, out);
    }
    out.push('}');
  } else {
    out.push('{');
    const entries = sortedEntries(obj);
    for (let i = 0; i < entries.length; i++) {
      if (i > 0) out.push(',');
      out.push(`${JSON.stringify(entries[i][0])}:`);
      walkRecursive(entries[i][1], seen, next, out);
    }
    out.push('}');
  }
  seen.delete(obj);
}

/** Same output as walkRecursive, using an explicit stack instead of recursion. */
function walkIterative(value: unknown, seen: Set<object>, out: string[]): void {
  const stack: WalkTask[] = [{ kind: 'value', value }];

  // Tasks are pushed in reverse so they pop in their natural order.
  const pushSequence = (tasks: WalkTask[]): void => {
    for (let i = tasks.length - 1; i >= 0; i--) stack.push(tasks[i]);
  };

  while (stack.length > 0) {
    const task = stack.pop() as WalkTask;

    if (task.kind === 'text') {
      out.push(task.text);
      continue;
    }
    if (task.kind === 'exit') {
      seen.delete(task.obj);
      continue;
    }

    const terminal = serializeTerminal(task.value);
    if (terminal !== undefined) {
      out.push(terminal);
      continue;
    }
    const obj = task.value as object;
    if (seen.has(obj)) {
      out.push('[Circular]');
      continue;
    }
    seen.add(obj);

    const tasks: WalkTask[] = [];
    const separator = (i: number): void => {
      if (i > 0) tasks.push({ kind: 'text', text: ',' });
    };
    if (Array.isArray(obj)) {
      tasks.push({ kind: 'text', text: '[' });
      obj.forEach((v, i) => {
        separator(i);
        tasks.push({ kind: 'value', value: v });
      });
      tasks.push({ kind: 'text', text: ']' });
    } else if (obj instanceof Map) {
      tasks.push({ kind: 'text', text: 'Map{' });
      let i = 0;
      for (const [k, v] of obj) {
        separator(i++);
        tasks.push({ kind: 'value', value: k }, { kind: 'text', text: '=>' }, { kind: 'value', value: v });
      }
      tasks.push({ kind: 'text', text: '}' });
    } else if (obj instanceof Set) {
      tasks.push({ kind: 'text', text: 'Set{' });
      let i = 0;
      for (const v of obj) {
        separator(i++);
        tasks.push({ kind: 'value', value: v });
      }
      tasks.push({ kind: 'text', text: '}' });
    } else {
      tasks.push({ kind: 'text', text: '{' });
      sortedEntries(obj).forEach(([k, v], i) => {
        separator(i);
        tasks.push({ kind: 'text', text: `${JSON.stringify(k)}:` }, { kind: 'value', value: v });
      });
      tasks.push({ kind: 'text', text: '}' });
    }
    tasks.push({ kind: 'exit', obj });
    pushSequence(tasks);
  }
}
