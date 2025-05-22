/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

// Import useLocation so we can reference it directly in tests
import { useLocation } from 'react-router-dom';

// Mock the dependencies
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
    useLocation: vi.fn(() => ({ pathname: '/' })),
  };
});

// Mock for ThemeContext to test different theme configurations
const mockTheme = {
  colors: {
    imageEnabled: false,
    borderRadius: 4,
    fontScale: 1,
    primaryColor: 'blue',
    accentColor: 'blue.6'
  }
};

vi.mock('../context/ThemeContext', () => ({
  useTheme: vi.fn(() => mockTheme)
}));

vi.mock('../components/ThemeCustomizer', () => ({
  ThemeCustomizer: ({ opened }: { opened: boolean }) => (
    <div data-testid="theme-customizer" data-opened={opened}>Theme Customizer</div>
  )
}));

vi.mock('../components/ColorSchemeToggle', () => ({
  ColorSchemeToggle: () => <div data-testid="color-scheme-toggle">Color Scheme Toggle</div>
}));

vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: ({ onToggle }: { onToggle: () => void }) => (
    <button data-testid="theme-toggle" onClick={onToggle}>Theme Toggle</button>
  )
}));

vi.mock('../components/Prefetcher', () => ({
  Prefetcher: () => <div data-testid="prefetcher">Prefetcher</div>
}));

// Mock the Mantine hooks with different color schemes
const mockSetColorScheme = vi.fn();
const mockToggleColorScheme = vi.fn();
let mockColorScheme = 'dark';

vi.mock('@mantine/core', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useMantineColorScheme: () => ({
      colorScheme: mockColorScheme,
      setColorScheme: mockSetColorScheme,
      toggleColorScheme: mockToggleColorScheme,
    }),
  };
});

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockColorScheme = 'dark';
    // Reset mock theme to default values
    mockTheme.colors = {
      imageEnabled: false,
      borderRadius: 4,
      fontScale: 1,
      primaryColor: 'blue',
      accentColor: 'blue.6'
    };
    // Reset useLocation to default path
    vi.mocked(useLocation).mockReturnValue({ pathname: '/' });
  });

  it('renders the main layout correctly with dark theme', () => {
    render(
      <BrowserRouter>
        <MantineProvider>
          <App />
        </MantineProvider>
      </BrowserRouter>
    );
    
    // Check that the title is rendered
    expect(screen.getByText('SAGA Spells Manager')).toBeInTheDocument();
    
    // Check that the navigation links are rendered
    expect(screen.getByText('Spells Library')).toBeInTheDocument();
    expect(screen.getByText('My Spellbooks')).toBeInTheDocument();
    
    // Check that the mocked components are rendered
    expect(screen.getByTestId('color-scheme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('theme-customizer')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('prefetcher')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    
    // Test that theme customizer is initially closed
    expect(screen.getByTestId('theme-customizer')).toHaveAttribute('data-opened', 'false');
  });

  it('renders with light theme', () => {
    // Change the mock color scheme
    mockColorScheme = 'light';

    render(
      <BrowserRouter>
        <MantineProvider>
          <App />
        </MantineProvider>
      </BrowserRouter>
    );
    
    // Verify the component rendered with light theme
    expect(screen.getByText('SAGA Spells Manager')).toBeInTheDocument();
  });

  it('toggles theme settings when the theme toggle button is clicked', () => {
    render(
      <BrowserRouter>
        <MantineProvider>
          <App />
        </MantineProvider>
      </BrowserRouter>
    );
    
    // Check initial state (theme customizer should be closed)
    expect(screen.getByTestId('theme-customizer')).toHaveAttribute('data-opened', 'false');
    
    // Click the theme toggle button
    fireEvent.click(screen.getByTestId('theme-toggle'));
    
    // Check that the theme customizer is now open
    expect(screen.getByTestId('theme-customizer')).toHaveAttribute('data-opened', 'true');
    
    // Click again to close
    fireEvent.click(screen.getByTestId('theme-toggle'));
    
    // Check that it's closed again
    expect(screen.getByTestId('theme-customizer')).toHaveAttribute('data-opened', 'false');
  });

  it('applies different style when imageEnabled is true', () => {
    // Change the theme context mock
    mockTheme.colors.imageEnabled = true;
    
    render(
      <BrowserRouter>
        <MantineProvider>
          <App />
        </MantineProvider>
      </BrowserRouter>
    );
    
    // Verify the component rendered with the image background enabled
    expect(screen.getByTestId('outlet').parentElement).toHaveStyle({
      backgroundImage: 'url("/assets/img/parchment1.png")'
    });
  });

  it('applies different nav link styles based on current route', () => {
    // Mock being on the spellbooks route
    vi.mocked(useLocation).mockReturnValue({ pathname: '/spellbooks' });
    
    render(
      <BrowserRouter>
        <MantineProvider>
          <App />
        </MantineProvider>
      </BrowserRouter>
    );
    
    // Check that the "My Spellbooks" link is bold (active)
    const spellbooksLink = screen.getByText('My Spellbooks');
    expect(spellbooksLink).toHaveStyle({ fontWeight: 'bold' });
    
    // And "Spells Library" is not bold (inactive)
    const spellsLibraryLink = screen.getByText('Spells Library');
    expect(spellsLibraryLink).not.toHaveStyle({ fontWeight: 'bold' });
  });
});
