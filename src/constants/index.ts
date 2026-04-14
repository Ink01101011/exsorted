export const ERROR_MESSAGES = {
  KEY_SELECTOR_REQUIRED: 'Key selector is required for non-numeric items.',
  COUNTING_SORT_RANGE_TOO_LARGE: (threshold: number) =>
    `The range of keys is too large to be efficient (recommended max range: ${threshold})`,
  KEY_NOT_INTEGER: `The key must be a safe integer (between ${Number.MIN_SAFE_INTEGER} and ${Number.MAX_SAFE_INTEGER}) for sorting to work correctly`,
} as const;

export const INTRO_INSERTION_SORT_THRESHOLD = 16;
export const RADIX_SORT_THRESHOLD_DIGITS = 10;
export const PIGEONHOLE_SORT_THRESHOLD_RANGE = 1e6;
export const COUNTING_SORT_THRESHOLD_RANGE = 1e6;
