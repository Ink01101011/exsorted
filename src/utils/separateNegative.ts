export function absValues(arr: number[]): number[] {
  return arr.map(Math.abs);
}

export function separateBySignWithKeys<T>(arr: T[], keys: number[]): [T[], number[], T[], number[]] {
  const negatives: T[] = [];
  const negativeKeys: number[] = [];
  const nonNegatives: T[] = [];
  const nonNegativeKeys: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (keys[i] < 0) {
      negatives.push(arr[i]);
      negativeKeys.push(keys[i]);
    } else {
      nonNegatives.push(arr[i]);
      nonNegativeKeys.push(keys[i]);
    }
  }

  return [negatives, negativeKeys, nonNegatives, nonNegativeKeys];
}

export function buildStableNegativePrefix<T>(negatives: T[], negativeAbsKeys: number[]): T[] {
  const result: T[] = [];

  for (let end = negatives.length - 1; end >= 0; ) {
    const absKey = negativeAbsKeys[end];
    let start = end;

    while (start - 1 >= 0 && negativeAbsKeys[start - 1] === absKey) {
      start--;
    }

    for (let i = start; i <= end; i++) {
      result.push(negatives[i]);
    }

    end = start - 1;
  }

  return result;
}
