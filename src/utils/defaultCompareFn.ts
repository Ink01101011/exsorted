export function defaultCompareFn<T>(a: T, b: T): number {
  const rankA = getTypeRank(a);
  const rankB = getTypeRank(b);

  if (rankA !== rankB) {
    return rankA - rankB;
  }

  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return 0;
    if (Number.isNaN(a)) return 1;
    if (Number.isNaN(b)) return -1;
    return a - b;
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

  const normalizedA = normalizeComplexValue(a);
  const normalizedB = normalizeComplexValue(b);

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

function stableSerialize(value: unknown): string {
  const activePath = new Set<object>();
  const objectIds = new WeakMap<object, number>();
  let nextId = 1;

  function idOf(obj: object): number {
    const existing = objectIds.get(obj);
    if (existing !== undefined) return existing;
    const id = nextId++;
    objectIds.set(obj, id);
    return id;
  }

  function walk(val: unknown): string {
    if (val === null) return 'null';
    if (typeof val !== 'object') return String(val);

    const refId = idOf(val);

    if (activePath.has(val)) {
      return `[Circular#${refId}]`;
    }

    activePath.add(val);

    let out: string;
    if (Array.isArray(val)) {
      out = `[${val.map(walk).join(',')}]`;
    } else if (val instanceof Date) {
      out = `Date:${val.toISOString()}`;
    } else {
      const entries = Object.entries(val as Record<string, unknown>)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([k, v]) => `${k}:${walk(v)}`);
      out = `{${entries.join(',')}}`;
    }

    activePath.delete(val);
    return out;
  }

  return walk(value);
}
