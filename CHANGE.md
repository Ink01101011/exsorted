# CHANGE

Versioned release notes.

## 1.0.3 - 2026-04-08

### Added

- `src/utils/assertArrayInput.ts`
  - Added reusable `assertArrayInput` helper for array input validation.
- `scripts/benchmark.cjs`
  - Added Markdown summary table output (average ms and relative speed).
  - Added verification table for failed sorting cases.
- `__tests__/introSort.test.ts`
  - Added coverage for threshold-as-second-argument API.
  - Added coverage for legacy third-argument threshold compatibility.
  - Added threshold semantics test to prevent off-by-one regression.
  - Added invalid-threshold validation coverage.
- `__tests__/algorithms.test.ts`, `__tests__/timSort.test.ts`
  - Added explicit non-array input validation coverage.

### Changed

- `src/sorted/standard/intro/introSort.ts`
  - Added overload-style API:
    - `introSort(arr, threshold)`
    - `introSort(arr, compareFn, threshold?)`
  - Kept backward compatibility for legacy call pattern.
  - Updated threshold cutoff logic to partition length (`high - low + 1`).
  - Clarified threshold docs and validation behavior.
- `src/sorted/base/merge/mergeSort.ts`
  - Kept public validation at entry point and used internal recursive helper `_mergeSort`.
- `src/sorted/base/bubble/bubbleSort.ts`
- `src/sorted/base/insertion/insertionSort.ts`
- `src/sorted/base/selection/selectionSort.ts`
- `src/sorted/base/quick/quickSort.ts`
- `src/sorted/base/heap/heapSort.ts`
- `src/sorted/standard/tim/timSort.ts`
- `src/sorted/standard/gnome/gnomeSort.ts`
- `src/sorted/standard/shell/shellSort.ts`
- `src/sorted/standard/block/blockSort.ts`
- `src/sorted/standard/intro/introSort.ts`
  - Replaced duplicated inline `Array.isArray` guard with shared `assertArrayInput` helper.
- `src/utils/index.ts`
  - Exported `assertArrayInput`.
- `README.md`
  - Updated introSort usage/signatures for threshold-as-second-argument support.
  - Clarified threshold semantics as partition length and recommended range.
  - Added benchmark usage and environment variable options (`BENCH_SIZES`, `BENCH_REPEATS`, `BENCH_WARMUP`).
- `scripts/benchmark.cjs`
  - Expanded benchmark execution to all sorting algorithms.
  - Kept detailed per-case `console.table` output.

### Fixed

- Prevented introSort threshold off-by-one API surprise.
- Reduced repeated input-guard logic across algorithms to keep validation behavior consistent.

### Notes

- Benchmark now reports failed verification cases without aborting the full run.

## 1.0.2 - 2026-04-05

### Added

- `.github/workflows/ci.yml`
  - CI workflow for format check, lint, typecheck, tests, and build.
- `.github/workflows/cve.yml`
  - Weekly security audit workflow.
- `.husky/pre-commit`
  - Pre-commit hook running lint-staged.
- `.oxlintrc.json`
  - OXC linter configuration.
- `.prettierignore`
  - Ignore rules for generated and dependency files.
- `tsup.config.ts`
  - Build config for ESM/CJS + declaration output.
- `DEVELOP.md`
  - Developer workflow/command guide.

### Changed

- `README.md`
  - Added Tim Sort, Gnome Sort, and Shell Sort in algorithm matrix and examples.
  - Expanded docs with subpath imports, API reference, mutation behavior, and helper usage.
- `__tests__/algorithms.test.ts`, `__tests__/sorting.test.ts`, `__tests__/mutation.test.ts`, `__tests__/exports.test.ts`
  - Added/expanded matrix coverage and export assertions for gnomeSort/shellSort.
- `src/sorted/standard/gnome/gnomeSort.ts`
  - Fixed single-element edge case behavior.
- `package.json`
  - Added grouped/per-algorithm exports and dual module targets.
  - Added tooling scripts (lint, format, typecheck, minify, prepare).
  - Added tree-shaking metadata and lint-staged config.
- `pnpm-lock.yaml`
  - Updated for tooling dependencies.
- `tsconfig.json`
  - Added `ignoreDeprecations: "6.0"`.

### Removed

- `CHANGE`
  - Replaced by `CHANGE.md`.

### Notes

- Build outputs were validated against tsup targets.
- Toolchain now includes Husky, lint-staged, OXC, Prettier, CI, and CVE audit workflow.
