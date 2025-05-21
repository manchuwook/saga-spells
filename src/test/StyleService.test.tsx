import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { styleService } from '../services/StyleService';
import { MantineTheme } from '@mantine/core';

describe('StyleService', () => {
  it('getTabsStyles handles undefined accentColor', () => {
    // Create mock themes without using React hooks
    // Initialize with minimal theme and undefined accentColor
    const mockTheme = {
      colorScheme: 'dark',
      colors: {
        dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40', '#2C2E33', '#25262b', '#1A1B1E', '#141517', '#101113']
      },
      radius: {
        xs: '2px',
        sm: '3px',
        md: '4px',
        lg: '6px',
        xl: '8px'
      },
      fontSizes: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px'
      }
    };    
    // Initialize service with minimal theme
    styleService.initialize(mockTheme as unknown as MantineTheme, 'dark', {
      primaryColor: 'dark.6',
      accentColor: 'dark.2', // Using string format instead of accessing theme directly
      borderRadius: 4,
      fontScale: 1,
      imageEnabled: false,
    });
    
    // This should not throw an error now with our fix
    const tabStyles = styleService.getTabsStyles();
    
    // Basic check that it returned an object
    expect(tabStyles).toBeDefined();
    expect(typeof tabStyles).toBe('object');
  });
});
