# CI/CD Configuration

This document explains the Continuous Integration and Continuous Deployment (CI/CD) setup for the SAGA Spells project.

## GitHub Actions Workflows

### Main Workflow (`ci.yml`)

This workflow runs on each push to the main branch and on pull requests:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - name: Install dependencies
        run: pnpm install --no-frozen-lockfile
      - name: Run tests
        run: pnpm test
      - name: Build
        run: pnpm build
```

#### Key Features:

- **Simplified Setup**: Uses the latest GitHub Actions best practices
- **PNPM Caching**: Uses built-in caching mechanisms for faster installations
- **No-Frozen-Lockfile**: Allows for dependency updates during CI
- **Conditional Deployment**: Only deploys on pushes to main, not on pull requests

### Release Workflow (`release.yml`)

This workflow runs when a new GitHub Release is published:

```yaml
name: Release PWA

on:
  release:
    types: [published]

jobs:
  build-and-deploy:
    steps:
    - Checkout code
    - Setup Node.js
    - Install pnpm
    - Setup cache
    - Install dependencies
    - Build app
    - Create ZIP artifact
    - Upload artifact to release
```

#### Key Features:

- **Automated Releases**: Triggered when a new release is published
- **Artifact Creation**: Zips the build directory for easy distribution
- **Release Attachment**: Attaches the ZIP file to the GitHub release

### Lighthouse CI (`lighthouse.yml`)

This workflow runs performance tests using Google Lighthouse:

```yaml
name: Lighthouse CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lighthouse:
    steps:
    - Checkout code
    - Setup Node.js
    - Install pnpm
    - Setup cache
    - Install dependencies
    - Build app
    - Run Lighthouse CI
    - Format and report results
```

#### Key Features:

- **Performance Testing**: Runs Lighthouse to check performance, accessibility, SEO, etc.
- **Multiple Runs**: Executes tests 3 times for more reliable results
- **Report Storage**: Uploads reports to temporary public storage
- **PR Comments**: Adds test results as comments on pull requests

## Lighthouse Configuration

The Lighthouse configuration in `.github/lighthouse/config.json` defines:

- Performance thresholds for various metrics
- Minimum scores for each category (Performance, Accessibility, etc.)
- Server setup for testing the production build

## PNPM Workspace Configuration

This project uses PNPM workspaces. To ensure proper functioning in GitHub Actions, the `pnpm-workspace.yaml` file must include a `packages` field:

```yaml
packages:
  - '.'  # Root package

ignoredBuiltDependencies:
  - gifsicle
  - jpegtran-bin
  - mozjpeg
  - pngquant-bin
onlyBuiltDependencies:
  - cwebp-bin
  - esbuild
  - optipng-bin
```

If you encounter the error `ERR_PNPM_INVALID_WORKSPACE_CONFIGURATION packages field missing or empty`, make sure your `pnpm-workspace.yaml` has the `packages` field configured correctly.

### Installation Command

In the GitHub Actions workflows, we use:

```yaml
- name: Install dependencies
  run: pnpm install --no-frozen-lockfile
```

The `--no-frozen-lockfile` flag allows PNPM to update the lockfile if needed, which can help resolve dependency issues during CI runs.

### Adding Environment Variables

For sensitive data like API keys, add them as GitHub Secrets and reference them in workflows:

```yaml
env:
  MY_API_KEY: ${{ secrets.MY_API_KEY }}
```

### Modifying Test Requirements

To change Lighthouse thresholds, edit `.github/lighthouse/config.json`.

## Running Locally

To simulate CI/CD workflows locally:

```bash
# Test
pnpm test

# Build
pnpm build:prod

# Performance testing
pnpm lighthouse
```

## Best Practices

1. Always run tests locally before pushing
2. Keep the build process fast by optimizing dependencies
3. Monitor GitHub Actions runs for failures
4. Update dependencies regularly to maintain security
