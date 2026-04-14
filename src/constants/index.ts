export const ERROR_MESSAGES = {
  KEY_SELECTOR_REQUIRED: 'Key selector is required for non-numeric items.',
  KEY_CACHE_LENGTH_MISMATCH: 'Array length and cached key length must match.',
  COUNTING_SORT_RANGE_TOO_LARGE: (threshold: number) =>
    `The range of keys is too large to be efficient (recommended max range: ${threshold})`,
  BUCKET_SORT_RANGE_TOO_LARGE: (threshold: number) =>
    `The bucket key range is too large to be efficient (recommended max range: ${threshold})`,
  BUCKET_SORT_RANGE_UNSAFE_INTEGER:
    'The bucket key range cannot be represented safely. Use a smaller key range for bucketSort.',
  BUCKET_SORT_OFFSET_UNSAFE_INTEGER:
    'The bucket key offset cannot be represented safely. Use a smaller key range for bucketSort.',
  PIGEONHOLE_SORT_RANGE_TOO_LARGE: (threshold: number) =>
    `The pigeonhole key range is too large to be efficient (recommended max range: ${threshold})`,
  KEY_NOT_INTEGER: `The key must be a safe integer (between ${Number.MIN_SAFE_INTEGER} and ${Number.MAX_SAFE_INTEGER}) for sorting to work correctly`,
} as const;

export const INTRO_INSERTION_SORT_THRESHOLD = 16;
export const RADIX_SORT_THRESHOLD_DIGITS = 10;
export const PIGEONHOLE_SORT_THRESHOLD_RANGE = 1e6;
export const COUNTING_SORT_THRESHOLD_RANGE = 1e6;
export const BUCKET_SORT_THRESHOLD_RANGE = 1e6;
