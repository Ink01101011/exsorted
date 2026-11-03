# CHANGE

Versioned release notes.

## 1.3.0 - 2026-11-03

### Added

- Meme sorts 🃏 (#11: #23, #31, #32, #33), exported from `exsorted`, `exsorted/meme`, and per-algorithm subpaths `exsorted/bogo`, `exsorted/stalin`, `exsorted/sleep`, `exsorted/stooge`:
  - `src/sorted/meme/bogo/bogoSort.ts` — in-place Bogo Sort with comparator support; `options.maxShuffles` (default 1,000,000) makes it throw a `RangeError` instead of hanging, and `options.random` lets callers inject a random source.
  - `src/sorted/meme/stalin/stalinSort.ts` — lossy, stable Stalin Sort that returns a new array.
  - `src/sorted/meme/sleep/sleepSort.ts` — async Sleep Sort returning a `Promise`; optional `keySelector` and `options.msPerUnit`; rejects negative/non-finite keys and delays above the `setTimeout` limit before starting any timer.
  - `src/sorted/meme/stooge/stoogeSort.ts` — in-place Stooge Sort with comparator support.
- `__tests__/memeSorts.test.ts` — coverage for all four meme sorts.
- `.github/dependabot.yml` — weekly updates for GitHub Actions.

### Fixed

- `pigeonholeSort` no longer throws `RangeError: Maximum call stack size exceeded` when a single key holds ~150k+ items. Holes are copied by index instead of `push(...hole)` (#63).
- `defaultCompareFn` (#64):
  - No longer throws on an invalid `Date` nested in an array or object; nested invalid Dates sort after valid ones, like top-level Dates.
  - Serializes nested values iteratively, so deeply nested input (20k+ levels) no longer overflows the call stack.
  - `Map` and `Set` now compare by their entries instead of always comparing equal.
  - Nested primitives are tagged by type, so `1n` vs `1`, `'1'` vs `1`, and `'null'` vs `null` no longer collide inside objects.
  - Note: the internal serialization format changed. Relative order of objects/arrays whose nested values differ only in type, or that contain strings needing JSON escaping, may differ from 1.2.x.
- Security workflow (#66): added/updated pnpm overrides for `handlebars`, `js-yaml@4`, `brace-expansion@1`, `browserslist`, and `baseline-browser-mapping`. `pnpm audit --audit-level high` is clean again (remaining: 1 moderate `minimatch` via jest's `glob`, 1 low `deepmerge` with no fix; both dev-only).

### Performance

- Default comparator (#65):
  - String/string and number/number comparisons take a direct fast path. Strings compare by raw UTF-16 code units, as before.
  - Every comparison sort now defaults to a per-call comparator (`createSortCompareFn`, internal) that caches each object's serialization by identity for the duration of that sort. That means O(n) serializations instead of O(n log n). Measured on 50k nested objects: `quickSort` 1501 → 114 ms, `timSort` 1176 → 105 ms. On 200k strings: `quickSort` 170 → 86 ms. The exported `defaultCompareFn` keeps the same ordering and stays uncached.
  - `scripts/benchmark.cjs` adds default-comparator cases for objects and strings.
  - `README.md` documents the default comparator on objects as a deterministic fallback, plus the performance notes for `bitonicSort` and `bucketSort` with clustered keys.

### Changed

- `release:check` now runs `pnpm audit --audit-level high` first, so the release gate matches CI.
- `.github/workflows/ci.yml` — added top-level `permissions: contents: read`.
- `.github/workflows/ci.yml`, `.github/workflows/cve.yml` — actions pinned to commit SHAs (v4.4.0).
- `scripts/integration.cjs` — CJS/ESM checks for the meme entry and the new subpaths.
- `README.md`, `package.json` — documented the meme sorts and added their subpath exports.

## 1.2.1 - 2026-05-08

### Added

- `SKILL.md`
  - Added contributor guide covering how to implement a new sorting algorithm end-to-end: source file conventions, barrel exports, `package.json` subpath entries, test checklist, README update points, and quality gates.

### Changed

- `src/utils/defaultCompareFn.ts`
  - Replaced module-level `_activePath` Set with a call-local `seen` parameter threaded through `_walk`. Each `stableSerialize` call now owns its own `Set`, eliminating shared mutable state and making the function re-entrant safe and multi-threaded runtime safe.
  - Removed the `try/finally` cleanup block — no longer needed since the `Set` is garbage-collected when each call returns.
- `README.md`
  - Fixed missing `comb` entry in the `exsorted/<name>` single-algorithm subpaths list.
  - Added **Contributing** section linking to `SKILL.md`, `DEVELOP.md`, and the issue tracker.
  - Added `Contributing` entry to the Table of Contents.

## 1.2.0 - 2026-05-01

### Added

- `src/sorted/parallel/cocktail/cocktailShakerSort.ts`
  - Added a generic, type-safe in-place Cocktail Shaker Sort implementation with comparator support.
- `src/sorted/parallel/cocktail/index.ts`
  - Added barrel export for `cocktailShakerSort`.
- `__tests__/cocktailShakerSort.test.ts`
  - Added behavior, comparator, object, mutation, and export coverage for `cocktailShakerSort`.
- `src/sorted/parallel/circle/circleSort.ts`
  - Added a generic, type-safe in-place Circle Sort implementation with comparator support.
- `src/sorted/parallel/circle/index.ts`
  - Added barrel export for `circleSort`.
- `__tests__/circleSort.test.ts`
  - Added behavior, comparator, object, mutation, and export coverage for `circleSort`.
- `src/sorted/parallel/comb/combSort.ts`
  - Added a generic, type-safe in-place Comb Sort implementation with comparator support.
- `src/sorted/parallel/comb/index.ts`
  - Added barrel export for `combSort`.
- `__tests__/combSort.test.ts`
  - Added behavior, comparator, object, mutation, and export coverage for `combSort`.

### Changed

- `src/sorted/parallel/index.ts`
  - Added `cocktailShakerSort`, `circleSort`, and `combSort` re-exports from the parallel group barrel.
- `package.json`
  - Added `./cocktail` subpath export.
  - Added `./circle` subpath export.
  - Added `./comb` subpath export.
  - Updated package description/keywords and version metadata for the 1.2.0 release.
- `__tests__/exports.test.ts`
  - Added named subpath export assertions for `cocktailShakerSort`, `circleSort`, and `combSort`.
- `scripts/integration.cjs`
  - Extended CJS/ESM smoke checks to validate parallel-group and per-algorithm exports for cycle, bitonic, cocktail, circle, and comb.
- `README.md`
  - Updated algorithm counts and docs sections (tables, imports, API signatures, algorithm notes, and subpath list) to include cocktail, circle, and comb sorts.

## 1.1.1 - 2026-04-22

### Changed in 1.1.1

- `src/sorted/base/quick/quickSort.ts`
  - Replaced Lomuto partition with 3-way partition (Dutch National Flag) to handle duplicate-heavy inputs in O(n) instead of O(n²).
  - Added recursion depth limit (`2 * log2(n)`) with automatic fallback to heap sort, preventing stack overflow on large or adversarial inputs and guaranteeing O(n log n) worst case.
- `src/utils/defaultCompareFn.ts`
  - Hoisted `_activePath` (Set) and `_walk` to module level to eliminate per-comparison-call allocations of `Set`, `WeakMap`, and closures.
  - Replaced ID-based `[Circular#N]` cycle marker with `[Circular]` — removes the need for a `WeakMap` entirely while keeping correct deterministic comparison of cyclic structures.

### Changed in 1.1.1 (non-code)

- `package.json`
  - Expanded `description` to include algorithm count, module formats, and zero-dependency note for better npm discoverability.
  - Expanded `keywords` from 20 to 32 entries, adding `javascript`, `sort-algorithm`, `sorting-algorithm`, `timsort`, `introsort`, `tree-shaking`, `tree-shakeable`, `zero-dependency`, `comparator`, `data-structures`, `performance`, `typed`.
- `README.md`
  - Added **Features** section listing algorithm count, TypeScript generics, tree-shaking, dual module support, zero dependencies, and flexible API.

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
- `src/sorted/non-compare/bucket/bucketSort.ts`
  - Added safe-integer/range guards to prevent precision-loss bucket assignment on extreme key ranges.
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
- Restored `assertArrayInput` as a compatibility export from the helper barrel (deprecated).

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
