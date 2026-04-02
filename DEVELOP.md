# DEVELOP

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Build (minified output)
pnpm run minify

# Run tests
pnpm test --ci

# Lint with OXC
pnpm run lint

# Type-check without emitting
pnpm run typecheck

# Format files
pnpm run format

# Check formatting in CI
pnpm run format:check
```

## Quality Gates

- `husky` + `lint-staged` run on pre-commit to auto-format and apply OXC fixes to staged files.
- GitHub Actions `CI` workflow runs format check, lint, typecheck, tests, and build.
- GitHub Actions `Security` workflow runs scheduled and PR `pnpm audit` checks for CVEs.
