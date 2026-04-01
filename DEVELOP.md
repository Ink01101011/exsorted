# DEVELOP

```bash
# Install dependencies
npm install

# Build
npm run build

# Build (minified output)
npm run minify

# Run tests
npm test

# Lint with OXC
npm run lint

# Type-check without emitting
npm run typecheck

# Format files
npm run format

# Check formatting in CI
npm run format:check
```

## Quality Gates

- `husky` + `lint-staged` run on pre-commit to auto-format and apply OXC fixes to staged files.
- GitHub Actions `CI` workflow runs format check, lint, typecheck, tests, and build.
- GitHub Actions `Security` workflow runs dependency review on PRs and scheduled `npm audit` checks for CVEs.
