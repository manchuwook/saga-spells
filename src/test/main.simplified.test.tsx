/// <reference types="vitest" />
import { describe, it, expect, vi } from 'vitest';

// Mock necessary dependencies 
vi.mock('react', () => ({
  default: { 
    StrictMode: ({ children }: { children: any }) => children,
    createElement: vi.fn(),
  },
  createElement: vi.fn(),
  StrictMode: ({ children }: { children: any }) => children,
}));

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
    unmount: vi.fn(),
  })),
}));

vi.mock('react-router-dom', () => ({
  RouterProvider: vi.fn(),
}));

vi.mock('@mantine/core', () => ({
  MantineProvider: vi.fn(),
  ColorSchemeScript: vi.fn(),
  localStorageColorSchemeManager: vi.fn(() => ({})),
}));

vi.mock('@mantine/notifications', () => ({
  Notifications: vi.fn(),
}));

vi.mock('@mantine/modals', () => ({
  ModalsProvider: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: vi.fn(),
}));

vi.mock('../lib/router', () => ({
  router: {},
}));

vi.mock('../theme/mantineTheme', () => ({
  baseTheme: {},
}));

vi.mock('../context/SpellbooksContext', () => ({
  SpellbooksProvider: vi.fn(),
}));

describe('main.tsx', () => {
  it('should set up the main app structure', () => {
    // Create a mock root element
    const mockRoot = document.createElement('div');
    mockRoot.id = 'root';
    document.body.appendChild(mockRoot);
    
    // Mock getElementById
    vi.spyOn(document, 'getElementById').mockReturnValue(mockRoot);
    
    // Import the main module
    require('../main.tsx');
    
    // Basic expectations
    expect(document.getElementById).toHaveBeenCalledWith('root');
  });
});
