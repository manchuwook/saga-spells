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
  build-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
    - Checkout code
    - Setup Node.js
    - Install pnpm
    - Setup cache
    - Install dependencies
    - Run tests
    - Build app
  
  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
    - Checkout code
    - Setup Node.js
    - Install pnpm
    - Setup cache
    - Install dependencies
    - Build app
    - Deploy (placeholder)
```

#### Key Features:

- **Matrix Testing**: Tests on multiple Node.js versions (18.x and 20.x)
- **Dependency Caching**: Uses pnpm's store path for fast installations
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

## Customizing the Workflows

### Deployment

The deployment step in `ci.yml` is currently a placeholder. You should replace it with your actual deployment commands based on your hosting provider:

- For Netlify: Use the Netlify GitHub Action
- For Vercel: Use the Vercel GitHub Action
- For GitHub Pages: Use the GitHub Pages Action
- For custom servers: Set up SSH and deploy via scripts

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
