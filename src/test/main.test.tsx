/// <reference types="vitest" />
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import ReactDOM from 'react-dom/client';

// Mocks
vi.mock('react-dom/client', async () => {
  return {
    default: {
      createRoot: vi.fn(() => ({
        render: vi.fn(),
      })),
    },
    createRoot: vi.fn(() => ({
      render: vi.fn(),
    })),
  }
});

vi.mock('react-router-dom', () => ({
  RouterProvider: vi.fn(() => <div data-testid="router-provider">Router Provider</div>),
  createBrowserRouter: vi.fn(),
}));

vi.mock('./lib/router', () => ({
  router: {},
}));

vi.mock('./context/SpellbooksContext', () => ({
  SpellbooksProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="spellbooks-provider">{children}</div>
  ),
}));

vi.mock('./theme/mantineTheme', () => ({
  baseTheme: {},
}));

// Create a shallow renderer for the root component
const renderMain = () => {
  // Create a temporary div to render into
  const div = document.createElement('div');
  div.id = 'root';
  document.body.appendChild(div);
  
  // Import the main module
  require('../main.tsx');
  
  return div;
};

describe('main.tsx', () => {
  afterEach(() => {
    // Clean up the DOM after each test
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });
  it('creates root and renders the app with providers', () => {
    // Set up the DOM element
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    
    // Mock document.getElementById
    const getElementByIdSpy = vi.spyOn(document, 'getElementById');
    getElementByIdSpy.mockReturnValue(root);
    
    // Mock ReactDOM.createRoot to match Root interface
    const renderFn = vi.fn();
    const mockRoot = {
      render: renderFn,
      unmount: vi.fn()
    };
    const createRootFn = vi.fn(() => mockRoot);
    ReactDOM.createRoot = createRootFn;
    
    // Run the main module code
    require('../main.tsx');
    
    // Verify expectations
    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(createRootFn).toHaveBeenCalledWith(root);
    expect(renderFn).toHaveBeenCalledTimes(1);

    // Verify that React.StrictMode is used
    const renderedJSX = renderFn.mock.calls[0][0];
    expect(renderedJSX.type).toBe(React.StrictMode);
  });
});
