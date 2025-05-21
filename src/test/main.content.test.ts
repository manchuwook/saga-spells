/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';

// We won't try to import the actual main.tsx file since it has dependencies
// that are difficult to mock. Instead, we'll verify that the structure
// of main.tsx matches what we expect by checking key parts of it.

describe('main.tsx', () => {
  it('should export or contain expected components', async () => {
    // Instead of importing the file directly, we'll check its structure
    // by reading the file content and verifying key patterns
    
    const fs = await import('fs');
    const path = await import('path');
    
    // Read the main.tsx file
    const mainPath = path.resolve('src/main.tsx');
    const mainContent = fs.readFileSync(mainPath, 'utf-8');
    
    // Check for important components/patterns
    expect(mainContent).toContain('import React from');
    expect(mainContent).toContain('import ReactDOM from');
    expect(mainContent).toContain('createRoot');
    expect(mainContent).toContain('MantineProvider');
    expect(mainContent).toContain('SpellbooksProvider');
    expect(mainContent).toContain('RouterProvider');
    expect(mainContent).toContain('QueryClientProvider');
    
    // Verify the component structure
    expect(mainContent).toContain('React.StrictMode');
    expect(mainContent).toContain('<ColorSchemeScript');
    expect(mainContent).toContain('defaultColorScheme="dark"');
  });
});
