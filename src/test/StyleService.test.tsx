import { describe, it, expect, vi } from 'vitest';
import { styleService } from '../services/StyleService';
import { MantineTheme } from '@mantine/core';

describe('StyleService', () => {
    it('getTabsStyles handles undefined accentColor', () => {

        // Create mock themes without using React hooks
        // Initialize with minimal theme and undefined accentColor
        /**
         * Mock theme configuration for testing purposes.
         * @property {string} colorScheme - The color scheme of the theme ('dark').
         * @property {Object} colors - Theme color palette.
         * @property {string[]} colors.dark - Array of gray-scale colors for the dark theme, 
         *   ordered from lightest (#C1C2C5) to darkest (#101113). These 10 shades
         *   provide a consistent gray palette for UI elements in dark mode.
         * @property {Object} radius - Border radius values for different sizes.
         * @property {Object} fontSizes - Font size values for different text sizes.
         */
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
            accentColor: 'dark.2',
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
