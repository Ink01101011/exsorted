export const THRESHOLD_RANGE = 1e6;

export const ERROR_MESSAGES = {
  KEY_SELECTOR_REQUIRED:
    'Your array contains objects, but no key selector or fallback strategy was provided. Please provide a key selector function or specify a fallback strategy.',
  CONVERTER_KEY_SELECTOR_REQUIRED: 'Key selector is required for non-numeric item.',
  RANGE_TOO_LARGE: `The range of keys is too large for countingSort to be efficient (recommended max range: ${THRESHOLD_RANGE})`,
  KEY_NOT_INTEGER: 'The Key should be a finite integer for countingSort to work correctly',
} as const;
