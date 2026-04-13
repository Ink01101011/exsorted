export const THRESHOLD_RANGE = 1e6;

export const ERROR_MESSAGES = {
  KEY_SELECTOR_REQUIRED: 'Key selector is required for non-numeric items.',
  RANGE_TOO_LARGE: `The range of keys is too large for countingSort to be efficient (recommended max range: ${THRESHOLD_RANGE})`,
  KEY_NOT_INTEGER: `The key must be a safe integer (between ${Number.MIN_SAFE_INTEGER} and ${Number.MAX_SAFE_INTEGER}) for countingSort to work correctly`,
} as const;
