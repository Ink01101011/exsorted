# CHANGE

Versioned release notes.

## 1.1.0 - 2026-04-14

### Added in 1.1.0

- `src/sorted/non-compare/bucket/bucketSort.ts`, `src/sorted/non-compare/pigeonhole/pigeonholeSort.ts`
  - Added stable integer-key bucket sort and pigeonhole sort implementations.
- `__tests__/bucketSort.test.ts`, `__tests__/pigeonholeSort.test.ts`
  - Added correctness, stability, mutation, and error coverage for the new non-comparison algorithms.
- `scripts/integration.cjs`
  - Expanded package-level smoke coverage to root, grouped subpaths, per-algorithm subpaths, helper/types paths, and both CJS/ESM entrypoints.
- `package.json`
  - Added `release:check` script to run lint, typecheck, unit tests, and integration smoke checks before publish.

### Changed in 1.1.0

- `src/sorted/non-compare/counting/countingSort.ts`, `src/sorted/non-compare/radix/radixSort.ts`
  - Hardened integer-key sorting behavior, stability, and negative-key support.
- `src/sorted/standard/block/blockSort.ts`
  - Simplified the implementation to stable buffered merges after block-local sorting for predictable correctness.
- `README.md`
  - Documented bucket sort and pigeonhole sort, corrected the algorithm matrix footnote, and aligned the API reference with introSort overloads.
- `.github/workflows/ci.yml`
  - Added integration smoke tests to the CI pipeline.

### Fixed in 1.1.0

- Restored benchmark verification correctness for `blockSort` across the benchmark datasets used by the project.
- Corrected public export coverage for non-comparison subpaths and package entrypoints.
- Corrected pigeonhole range errors to report pigeonhole-specific messaging instead of counting-sort wording.

### Notes for 1.1.0

- `1.1.0` is the first release that includes `bucketSort` and `pigeonholeSort` in the documented public API and publish validation flow.

## 1.0.4-5 - 2026-04-08

### Added in 1.0.4-5

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

### Changed in 1.0.4-5

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

### Fixed in 1.0.4-5

- Prevented introSort threshold off-by-one API surprise.
- Reduced repeated input-guard logic across algorithms to keep validation behavior consistent.

### Notes for 1.0.4-5

- Benchmark now reports failed verification cases without aborting the full run.

## 1.0.2 - 2026-04-05

### Added in 1.0.2

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

### Changed in 1.0.2

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

### Removed in 1.0.2

- `CHANGE`
  - Replaced by `CHANGE.md`.

### Notes for 1.0.2

- Build outputs were validated against tsup targets.
- Toolchain now includes Husky, lint-staged, OXC, Prettier, CI, and CVE audit workflow.
