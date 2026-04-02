# CHANGE

Changed date: 2026-04-01

This file summarizes all diffs currently introduced in this working tree.

## Added Files

- .github/workflows/ci.yml
  - Added CI workflow to run format check, lint, typecheck, tests, and build on push/PR.
- .github/workflows/cve.yml
  - Added security workflow with scheduled weekly pnpm audit.
- .husky/pre-commit
  - Added pre-commit hook to run lint-staged.
- .oxlintrc.json
  - Added OXC linter configuration for TypeScript with strict correctness/suspicious categories.
- .prettierignore
  - Added ignore rules for node_modules, dist, coverage, and lockfiles.
- tsup.config.ts
  - Added bundling config for ESM+CJS output, declaration generation, minify, and treeshake.
- DEVELOP.md
  - Added standalone development command guide moved from README.

## Updated Files

- package.json
  - Changed package outputs to dual module targets:
    - main: dist/index.cjs
    - module: dist/index.mjs
    - exports map for import/require/types
  - Added sideEffects: false for tree-shaking.
  - Switched build script from tsc to tsup.
  - Added scripts: minify, lint, lint:fix, typecheck, format, format:check, prepare.
  - Added lint-staged config.
  - Added devDependencies: husky, lint-staged, oxlint, prettier, tsup.
- pnpm-lock.yaml
  - Updated lockfile for newly added tooling dependencies.
- tsconfig.json
  - Added ignoreDeprecations: "6.0" to avoid TypeScript deprecation build failure.
- README.md
  - Applied formatting normalization.
  - Kept project docs and quality gates.
  - Removed in-file DEVELOP section; its content was moved into DEVELOP.md.

## Removed Files

- CHANGE
  - Replaced by CHANGE.md.

## Notes

- Tooling now supports: Husky + lint-staged, OXC linting, Prettier formatting, minified/tree-shake-friendly builds, CI checks, and pnpm-based CVE security audit checks.
