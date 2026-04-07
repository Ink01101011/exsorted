export function assertArrayInput(arr: unknown): asserts arr is unknown[] {
  if (!Array.isArray(arr)) {
    throw new TypeError('Input must be an array');
  }
}
