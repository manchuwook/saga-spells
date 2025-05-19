# Deployment Guide

This document provides instructions for deploying the Saga Spells application to Cloudflare Pages, a fast, secure, and easy-to-use static site hosting platform.

## Prerequisites

Before deploying, ensure you have:

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up)
2. The latest production build of your application
3. Git repository with your project (GitHub, GitLab, or Bitbucket)

## Automated Deployment with GitHub Actions

We've configured GitHub Actions to automatically build and test the application. For deployment, you have two options:

### Option 1: Add Deployment to GitHub Actions (Recommended)

The CI workflow in `.github/workflows/ci.yml` includes a deployment job that you can customize:

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: saga-spells
    directory: dist
    gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

To use this:

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add the following secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

The deployment will run automatically when changes are pushed to the main branch.

## Building the Production Version

Create an optimized production build of the application:

Create an optimized production build of the application:

```bash
# Install dependencies (if not already installed)
pnpm install

# Build the optimized production version
pnpm build:prod
```

This will generate a `dist` folder containing the fully optimized build ready for deployment, with:
- Code splitting for optimal loading performance
- Lazy-loaded components to reduce initial bundle size
- Compressed assets (both Gzip and Brotli formats)
- Optimized images
- Minified CSS and JavaScript
- Tree-shaken unused code

You can analyze the bundle size distribution by opening `dist/stats.html` in your browser after building.

## Deploying to Cloudflare Pages

### Option 1: Direct GitHub Integration (Recommended)

1. **Connect your GitHub repository to Cloudflare Pages**:
   - Log in to your Cloudflare dashboard
   - Navigate to "Pages"
   - Click "Create a project"
   - Connect your GitHub account and select the saga-spells repository

2. **Configure your deployment**:
   - Set the production branch (usually `main` or `master`)
   - Configure build settings:
     - Build command: `pnpm build`
     - Build output directory: `dist`
     - Node.js version: `16` (or newer)

3. **Environment variables** (if needed):
   - No environment variables are required for basic functionality
   - For custom domains or advanced settings, follow Cloudflare's documentation

4. **Configure PWA settings** (optional but recommended):
   - Enable "Cache API" in the Cloudflare Pages settings
   - Set appropriate cache headers for PWA assets:
     - Set `Cache-Control: public, max-age=31536000` for static assets with hashed filenames
     - Set `Cache-Control: no-cache` for service worker files like `sw.js`

5. **Deploy**:
   - Click "Save and Deploy"
   - Cloudflare will build and deploy your application
   - Once complete, you'll receive a URL to access your deployed application

### Option 2: Manual Deployment

If you prefer to deploy manually or use a different CI/CD pipeline:

1. **Build the project locally**:
   ```bash
   pnpm build
   ```

2. **Install Cloudflare Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

3. **Authenticate with Cloudflare**:
   ```bash
   wrangler login
   ```

4. **Create a `wrangler.toml` configuration file**:
   ```toml
   name = "saga-spells"
   type = "webpack"
   account_id = "your-account-id"
   workers_dev = true
   route = ""
   zone_id = ""
   compatibility_date = "2023-01-01"

   [site]
   bucket = "./dist"
   entry-point = "workers-site"
   ```

5. **Deploy to Cloudflare Pages**:
   ```bash
   wrangler pages publish dist --project-name=saga-spells
   ```

## Custom Domain Setup

To use a custom domain with your Cloudflare Pages deployment:

1. Navigate to your Pages project in the Cloudflare dashboard
2. Go to the "Custom domains" tab
3. Click "Set up a custom domain"
4. Follow the instructions to configure your domain

## Post-Deployment Verification

After deploying, verify that:

1. The application loads correctly at the provided URL
2. All spells and data are displayed properly
3. The filter functionality works
4. Spellbooks can be created and managed
5. PDF exports work as expected

## Troubleshooting

If you encounter issues with your deployment:

- **Blank Page**: Check if the build output directory is set correctly 
- **Missing Assets**: Ensure all assets are properly referenced with relative paths
- **API Errors**: Verify that the spell data JSON files are included in the build
- **Route Errors**: Make sure the `_redirects` file is included to support SPA routing

For specific Cloudflare Pages issues, consult the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/).

## Continuous Deployment

For automatic deployments when you push changes to your repository:

1. Ensure your GitHub repository is connected to Cloudflare Pages
2. Cloudflare will automatically build and deploy when changes are pushed to the configured branch
3. Preview deployments are created for pull requests

## Cache Considerations

Cloudflare aggressively caches content for performance. To ensure users get the latest version:

1. Use versioned filenames for assets (Vite handles this automatically)
2. Set appropriate cache headers for dynamic content
3. When making significant updates, consider purging the cache in Cloudflare dashboard
