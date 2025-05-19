# Saga Spells

A spell management application for the SAGA tabletop role-playing game system. This web-based tool helps players and game masters manage spells, create spellbooks for characters, and export spell information for reference during gameplay.

![Saga Spells App](./public/assets/img/parchment1.png)

## Features

- **Comprehensive Spell Browser**: Browse, search, and filter the complete SAGA spell database
- **Custom Spellbooks**: Create and manage spellbooks for your characters
- **Advanced Filtering**: Filter spells by class, school, complexity, and keywords
- **PDF Export**: Export spell lists and spellbooks to PDF for easy printing and reference
- **Dark/Light Mode**: Toggle between light and dark themes for comfortable viewing
- **Offline Support**: Access your spells and spellbooks even without an internet connection
- **Progressive Web App**: Install on your device for quick access and offline functionality
- **Optimized Performance**: Fast loading times with code splitting and lazy loading

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [pnpm](https://pnpm.io/) (v10 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/saga-spells.git
   cd saga-spells
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to http://localhost:5173

### Building for Production

To create an optimized production build:

```bash
pnpm build:prod
```

## CI/CD Workflows

This project uses GitHub Actions for continuous integration and deployment:

### Main Workflow (`ci.yml`)

- Triggers on pushes to `main` branch and pull requests
- Runs on Node.js 18.x and 20.x
- Installs dependencies with pnpm
- Runs tests with Vitest
- Builds the application
- Deploys automatically when changes are pushed to the main branch

### Release Workflow (`release.yml`)

- Triggers when a new release is published
- Builds the application
- Creates a ZIP artifact of the build
- Attaches the artifact to the GitHub release

### Lighthouse CI (`lighthouse.yml`)

- Runs Lighthouse performance tests
- Generates reports for Performance, Accessibility, Best Practices, SEO, and PWA
- Comments on pull requests with the Lighthouse scores and reports

To run these workflows locally before pushing:

```bash
# Run tests
pnpm test

# Build the app
pnpm build

# Run Lighthouse tests
pnpm lighthouse
```

This will:
- Clean the previous build
- Type check all TypeScript code
- Bundle and optimize all assets
- Apply code splitting and lazy loading
- Compress assets (Gzip and Brotli)
- Optimize images
- Generate bundle analysis (available at dist/stats.html)

To preview the production build locally:

```bash
pnpm preview
```

## Usage

### Viewing Spells

The main page displays all available spells. Use the filter panel to narrow down spells by:
- Spell class
- School of magic
- Complexity level
- Keywords
- Text search

### Creating Spellbooks

1. Navigate to the Spellbooks page
2. Click "New Spellbook"
3. Enter a name, character name, and optional description
4. Add spells to your spellbook from the main spells page

### Exporting

- Export individual spells or entire spellbooks to PDF
- Customize the export format with different layout options

## Data Storage

All spellbooks are stored in your browser's local storage. To prevent data loss:
- Use the export feature regularly to back up your spellbooks
- Do not clear your browser data without exporting first

## Contributing

Contributions are welcome! See [DEVELOPMENT.md](./DEVELOPMENT.md) for details on setting up the development environment and contributing guidelines.

## Deployment

For information on deploying this application to production, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/), [Vite](https://vitejs.dev/), and [Mantine UI](https://mantine.dev/)
- PDF generation powered by [jsPDF](https://parall.ax/products/jspdf) and [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- Inspired by the SAGA TTRPG system
