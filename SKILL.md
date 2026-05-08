# SKILL — Adding a New Algorithm to exsorted

This guide covers exactly what it takes to contribute a new sorting algorithm. Follow every step; the release pipeline validates all of them.

## Prerequisites

- TypeScript (generics, type guards, overloads)
- Jest (describe/it/expect patterns)
- Basic knowledge of the algorithm you are implementing

## Source Layout

```
src/
  sorted/
    base/          # O(n²) classics + merge/quick/heap
    standard/      # tim, gnome, shell, intro, block
    non-compare/   # counting, radix, bucket, pigeonhole
    parallel/      # cycle, bitonic, cocktail, circle, comb
  types/           # CompareFn, KeySelector, SortedArray, SelectorFn
  utils/           # compareBy, defaultCompareFn, assertion helpers
```

Place your algorithm in the group that best matches its behaviour. If it does not fit any group, discuss in a PR first.

---

## Step-by-step

### 1. Implement the algorithm

Create `src/sorted/<group>/<name>/<name>Sort.ts`.

**Template for a comparison-based, in-place algorithm:**

```typescript
import { CompareFn, SortedArray } from '../../../types/function-type';
import { assertArrayInput } from '../../../utils/assertion';
import { defaultCompareFn } from '../../../utils/defaultCompareFn';

export function <name>Sort<T>(arr: T[], compareFn: CompareFn<T> = defaultCompareFn): SortedArray<T> {
  assertArrayInput(arr);
  if (arr.length <= 1) return arr;

  // ... algorithm body, mutates arr in place ...

  return arr;
}
```

**Rules:**

| Rule                                                           | Why                                                             |
| -------------------------------------------------------------- | --------------------------------------------------------------- |
| Always call `assertArrayInput(arr)` first                      | Consistent error messaging across all algorithms                |
| Default `compareFn` to `defaultCompareFn`                      | Handles numbers, strings, and plain objects without extra setup |
| Return `SortedArray<T>` (alias for `T[]`)                      | Signals sorted intent in the type signature                     |
| In-place algorithms return the **same** reference              | Documented mutation contract; tests verify `result === arr`     |
| Non-comparison (integer-key) algorithms return a **new** array | Counting-family algorithms allocate new arrays by design        |

For a **non-comparison algorithm** (integer key), follow the overload pattern used in `countingSort`:

```typescript
export function <name>Sort<T extends number>(arr: T[]): T[];
export function <name>Sort<T>(arr: T[], keySelector: (item: T) => number): T[];
export function <name>Sort<T>(arr: T[], keySelector?: (item: T) => number): T[] { ... }
```

### 2. Create the barrel export

Create `src/sorted/<group>/<name>/index.ts`:

```typescript
export { <name>Sort } from './<name>Sort';
```

### 3. Re-export from the group barrel

Add to `src/sorted/<group>/index.ts`:

```typescript
export * from './<name>';
```

### 4. Add package.json export entries

Add two entries to the `"exports"` map in `package.json`:

```json
"./<name>": {
  "types": "./dist/sorted/<group>/<name>/index.d.ts",
  "import": "./dist/sorted/<group>/<name>/index.mjs",
  "require": "./dist/sorted/<group>/<name>/index.cjs"
}
```

If you are also adding a new **group** (rare), add a grouped subpath entry too.

### 5. Write tests

Create `__tests__/<name>Sort.test.ts`. The required test surface is:

```
numbers (ascending, default)
  ✓ sorts an unsorted array
  ✓ returns an already-sorted array unchanged
  ✓ sorts a reverse-sorted array
  ✓ handles an empty array
  ✓ handles a single-element array
  ✓ handles an array with duplicate values
  ✓ handles an array where all elements are equal
  ✓ handles negative numbers
  ✓ handles mixed negative and positive numbers

numbers (descending, custom comparator)
  ✓ sorts in descending order

strings (alphabetical, default)
  ✓ sorts strings alphabetically

objects (custom comparator)
  ✓ sorts objects by a numeric property
  ✓ works with compareBy helper

objects (without custom comparator)
  ✓ sorts deterministically with the default comparator

mutation
  ✓ mutates and returns the same array reference   (in-place only)
  — OR —
  ✓ returns a new array, does not mutate the original  (non-comparison only)

<group> exports
  ✓ re-exports <name>Sort from the <group> index

sorted index exports
  ✓ re-exports <name>Sort from the sorted index
```

See `__tests__/circleSort.test.ts` for a complete reference implementation.

### 6. Update README.md

Touch every section that covers algorithm metadata:

- **Features** — increment the algorithm count
- **Title** — increment the algorithm count in the heading
- **Algorithm table** — add a row with time complexity, space, stable, in-place
- **When to use** — add a bullet if the algorithm has a distinct use-case
- **Quick Start** — add to the relevant import example
- **Import Paths** — add to the group subpath list and the per-algorithm list
- **Available subpaths** — append `<name>` to the `exsorted/<name>` line
- **API Reference** — add the function signature under the correct group heading
- **Algorithm Notes** — add a one-line behaviour note
- **Mutation Behavior** — update if the mutation contract differs from existing entries

### 7. Update CHANGE.md

Add a `## <version> — <date>` section at the top. List every file created or changed under `### Added` and `### Changed`.

---

## Quality gates

All of the following must pass before a PR can merge:

```bash
pnpm run lint          # OXC — zero warnings
pnpm run typecheck     # tsc --noEmit
pnpm test --ci         # Jest unit tests
pnpm run test:integration  # CJS/ESM subpath smoke tests
pnpm run format:check  # Prettier
```

`pnpm run release:check` runs all five in one command.

The pre-commit hook (`husky` + `lint-staged`) auto-formats and applies OXC fixes to staged files, so most style issues are fixed before you even commit.
