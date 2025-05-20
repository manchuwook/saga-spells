import { MantineColorScheme, MantineTheme, Text, createTheme, mergeMantineTheme } from '@mantine/core';
import { ThemeColors } from '../context/ThemeContext';

// Helper type for theme context
type ThemeWithColorScheme = MantineTheme & { colorScheme?: MantineColorScheme };
type MantineColorShadeType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * StyleService provides a centralized location for managing styles across the application.
 * It integrates with Mantine's theme system for consistent styling throughout the app.
 */
export class StyleService {
    private static instance: StyleService;
    private mantineTheme!: MantineTheme;
    private colorScheme: MantineColorScheme = 'dark';
    private customTheme: ThemeColors = {
        primaryColor: 'brown.5',
        accentColor: 'blue.6',
        borderRadius: 4,
        fontScale: 1,
        imageEnabled: false,
    };
    private constructor() {
        // Private constructor to enforce singleton pattern
        // Initialize with a default Mantine theme
        const defaultTheme = createTheme({
            primaryColor: 'blue',
            primaryShade: { light: 6, dark: 6 },
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
            radius: {
                xs: '2px',
                sm: '3px',
                md: '4px',
                lg: '6px',
                xl: '8px'
            },
            components: {
                Modal: {
                    styles: (theme: ThemeWithColorScheme) => ({
                        header: {
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
                        },
                        body: {
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
                        },
                    }),
                },
            },
        });

        this.mantineTheme = defaultTheme as MantineTheme;
    }

    /**
     * Get the singleton instance of StyleService
     */
    public static getInstance(): StyleService {
        if (!StyleService.instance) {
            StyleService.instance = new StyleService();
        }
        return StyleService.instance;
    }

    /**
     * Initialize the service with theme information
     */
    public initialize(mantineTheme: MantineTheme, colorScheme: MantineColorScheme, customTheme: ThemeColors): void {
        this.mantineTheme = mantineTheme;
        this.colorScheme = colorScheme;
        this.customTheme = customTheme;
        this.updateMantineTheme();
    }

    /**
     * Update the Mantine color scheme
     */
    public updateColorScheme(colorScheme: MantineColorScheme): void {
        this.colorScheme = colorScheme;
    }

    /**
     * Update the custom theme settings and regenerate Mantine theme
     */
    public updateCustomTheme(customTheme: Partial<ThemeColors>): void {
        this.customTheme = { ...this.customTheme, ...customTheme };
        this.updateMantineTheme();
    }
    /**
     * Update Mantine theme based on custom theme settings
     * This method creates a new Mantine theme that incorporates our custom settings
     */
    private updateMantineTheme(): void {
        // Extract primary color name (e.g., 'blue' from 'blue.6')
        const primaryColorName = this.customTheme.primaryColor.split('.')[0];

        // Extract shade value or default to 6
        const primaryShadeValue = parseInt(this.customTheme.primaryColor.split('.')[1] || '6');
        const safeShade = (primaryShadeValue >= 1 && primaryShadeValue <= 9) ?
            primaryShadeValue as MantineColorShadeType :
            6 as MantineColorShadeType;

        // Set radius values based on our custom borderRadius
        const radiusXs = `${this.customTheme.borderRadius * 0.5}px`;
        const radiusSm = `${this.customTheme.borderRadius * 0.75}px`;
        const radiusMd = `${this.customTheme.borderRadius}px`;
        const radiusLg = `${this.customTheme.borderRadius * 1.5}px`;
        const radiusXl = `${this.customTheme.borderRadius * 2}px`;

        // Set font sizes with scale
        const fontSizeXs = `${12 * this.customTheme.fontScale}px`;
        const fontSizeSm = `${14 * this.customTheme.fontScale}px`;
        const fontSizeMd = `${16 * this.customTheme.fontScale}px`;
        const fontSizeLg = `${18 * this.customTheme.fontScale}px`;
        const fontSizeXl = `${20 * this.customTheme.fontScale}px`;

        // Create custom theme extensions
        const customExtensions = createTheme({
            primaryColor: primaryColorName,
            primaryShade: {
                light: safeShade,
                dark: safeShade
            },
            radius: {
                xs: radiusXs,
                sm: radiusSm,
                md: radiusMd,
                lg: radiusLg,
                xl: radiusXl
            },
            fontSizes: {
                xs: fontSizeXs,
                sm: fontSizeSm,
                md: fontSizeMd,
                lg: fontSizeLg,
                xl: fontSizeXl
            },
            components: {
                // Card styling
                Card: {
                    styles: (theme: ThemeWithColorScheme) => ({
                        root: {
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : 'white',
                            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3],
                        },
                    }),
                },
                // Modal styling
                Modal: {
                    styles: (theme: ThemeWithColorScheme) => ({
                        header: {
                            backgroundColor: theme.colorScheme === 'dark' ? '#1A1B1E' : 'white',
                            color: theme.colorScheme === 'dark' ? 'white' : 'black',
                            borderBottom: theme.colorScheme === 'dark' ? '1px solid #2C2E33' : 'inherit',
                        },
                        content: {
                            backgroundColor: theme.colorScheme === 'dark' ? '#1A1B1E' : 'white',
                        },
                        body: {
                            backgroundColor: theme.colorScheme === 'dark' ? '#1A1B1E' : 'white',
                        },
                        close: {
                            color: theme.colorScheme === 'dark' ? 'white' : 'black',
                        },
                    }),
                },
                // Text input styling
                TextInput: {
                    styles: (theme: ThemeWithColorScheme) => ({
                        input: {
                            backgroundColor: theme.colorScheme === 'dark' ? 'var(--mantine-color-dark-5)' : 'white',
                            borderColor: theme.colorScheme === 'dark' ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                            fontSize: `${this.customTheme.fontScale}rem`,
                        },
                        label: {
                            color: theme.colorScheme === 'dark' ? 'var(--mantine-color-gray-2)' : 'var(--mantine-color-dark-8)',
                            fontSize: `${this.customTheme.fontScale}rem`,
                        }
                    }),
                },
                // Tabs styling
                Tabs: {
                    styles: (theme: ThemeWithColorScheme) => ({
                        tab: {
                            color: theme.colorScheme === 'dark' ? 'var(--mantine-color-gray-4)' : 'var(--mantine-color-dark-6)',
                            '&[dataActive="true"]': {
                                color: theme.colorScheme === 'dark'
                                    ? `var(--mantine-color-${this.customTheme.accentColor.split('.')[0]}-4)`
                                    : `var(--mantine-color-${this.customTheme.accentColor.split('.')[0]}-6)`,
                            },
                        },
                    }),
                },
            },
        });

        // Merge the base theme with our custom extensions
        this.mantineTheme = mergeMantineTheme(this.mantineTheme, customExtensions as MantineTheme);
    }

    /**
     * Check if dark mode is enabled
     */
    public get isDark(): boolean {
        return this.colorScheme === 'dark';
    }

    /**
     * Get the current Mantine theme with our customizations applied
     */
    public getTheme(): MantineTheme {
        return this.mantineTheme;
    }

    /**
     * Get modal styles with consistent theming
     */
    public getModalStyles() {
        return {
            header: {
                backgroundColor: this.isDark ? '#1A1B1E' : 'white',
                color: this.isDark ? 'white' : 'black',
                borderBottom: this.isDark ? '1px solid #2C2E33' : 'inherit',
            },
            content: {
                backgroundColor: this.isDark ? '#1A1B1E' : 'white',
            },
            body: {
                backgroundColor: this.isDark ? '#1A1B1E' : 'white',
            },
            close: {
                color: this.isDark ? 'white' : 'black',
            },
            overlayProps: {
                backgroundOpacity: 0.65,
                blur: 3,
                color: this.isDark ? 'black' : '#e6d9c2',
            }
        };
    }

    /**
     * Get card styles with consistent theming that integrates with Mantine
     */
    public getCardStyles() {
        return {
            radius: this.mantineTheme.radius.md,
            padding: this.mantineTheme.spacing?.md,
            withBorder: true,
            shadow: "sm",
            bg: this.isDark ? 'dark.6' : 'white',
        };
    }
    /**
     * Get shell/container styles for main app layout
     */
    public getShellStyles() {
        const spacingXs = this.mantineTheme.spacing?.xs;
        const spacingSm = this.mantineTheme.spacing?.sm;

        // Helper function to convert px string to rem
        const pxToRem = (pxValue: string): string => {
            const numValue = Number(pxValue.replace('px', ''));
            return isNaN(numValue) ? '0.875rem' : `${numValue / 16}rem`;
        };

        // Helper function to get primary color with shade
        const getPrimaryColorWithShade = () => {
            const colorParts = this.customTheme.primaryColor.split('.');
            const colorName = colorParts[0];
            const shade = colorParts[1] || '5';
            return `var(--mantine-color-${colorName}-${shade})`;
        };

        return {
            main: {
                backgroundImage: this.customTheme.imageEnabled ? 'url("/assets/img/parchment1.png")' : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundColor: this.isDark ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-gray-0)',
            },
            navbar: {
                borderRadius: `0 ${this.mantineTheme.radius.md} ${this.mantineTheme.radius.md} 0`,
                backgroundColor: this.isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)',
                borderRight: `1px solid ${this.isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'}`,
            },
            navButton: {
                borderRadius: this.mantineTheme.radius.sm,
                padding: `${spacingXs}px ${spacingSm}px`,
                fontSize: pxToRem(this.mantineTheme.fontSizes.sm || '14px'), // Default to 14px if undefined
                transition: 'all 0.2s ease',
            },
            header: {
                backgroundColor: this.isDark
                    ? 'var(--mantine-color-dark-7)'
                    : getPrimaryColorWithShade(),
                borderBottom: `1px solid ${this.isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'}`,
            }
        };
    }

    /**
     * Get notification styles with consistent theming
     */
    public getNotificationStyles(color: string = 'blue') {
        return {
            color,
            icon: null, // Override with your icon when calling this method
            autoClose: 3000,
            withBorder: true,
            style: { borderRadius: this.mantineTheme.radius.md },
        };
    }
    /**
       * Get text styles for different purposes
       */
    public getTextStyles(purpose: 'heading' | 'body' | 'label' = 'body') {
        // Helper function to determine text size
        const getTextSize = () => {
            if (purpose === 'heading') return 'lg';
            if (purpose === 'label') return 'sm';
            return 'md';
        };

        // Helper function to determine text color
        const getTextColor = () => {
            if (this.isDark) {
                if (purpose === 'heading') return 'white';
                if (purpose === 'label') return 'gray.1';
                return 'white'; // Maximum contrast for dark mode
            } else {
                if (purpose === 'heading') return 'dark.8';
                if (purpose === 'label') return 'dark.7';
                return 'dark.6';
            }
        };

        return {
            size: getTextSize(),
            c: getTextColor(),
            ...(this.isDark && { fw: purpose === 'body' ? 500 : undefined }) // Add font weight in dark mode for body text
        };
    }

    /**
     * Get color for active/inactive navigation items
     */
    public getNavLinkColor(isActive: boolean): string {
        if (isActive) {
            return this.customTheme.accentColor;
        }
        return this.isDark ? 'gray.3' : 'dark.6';
    }

    /**
     * Get form input styles with consistent theming
     */
    public getInputStyles() {
        return {
            input: {
                backgroundColor: this.isDark ? 'var(--mantine-color-dark-5)' : 'white',
                borderColor: this.isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                borderRadius: this.mantineTheme.radius.sm,
                fontSize: this.mantineTheme.fontSizes.sm,
            },
            label: {
                color: this.isDark ? 'var(--mantine-color-gray-2)' : 'var(--mantine-color-dark-8)',
                fontSize: this.mantineTheme.fontSizes.sm,
            }
        };
    }

    /**
     * Get button styles with consistent theming
     */
    public getButtonStyles(variant: 'primary' | 'secondary' | 'outline' = 'primary') {
        // Helper function to determine button color
        const getButtonColor = () => {
            if (variant === 'primary') {
                return this.customTheme.primaryColor;
            }
            if (variant === 'secondary') {
                return this.customTheme.accentColor;
            }
            return this.isDark ? 'gray.4' : 'dark.4';
        };

        return {
            color: getButtonColor(),
            variant: variant === 'outline' ? 'outline' : 'filled',
            radius: this.mantineTheme.radius.sm,
            size: 'sm',
        };
    }

    /**
     * Get tab styles with consistent theming
     */    public getTabsStyles() {
        // Get the theme's Tabs styles or fallback to our custom styles if not defined
        const themeTabsStyles = this.mantineTheme.components?.Tabs?.styles;

        if (themeTabsStyles) {
            // If theme has Tabs styles defined, use those
            return themeTabsStyles(this.mantineTheme as unknown as ThemeWithColorScheme);
        }

        // Otherwise return our custom styles
        return {
            tab: {
                color: this.isDark ? 'var(--mantine-color-gray-2)' : 'var(--mantine-color-dark-6)',
                backgroundColor: this.isDark ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-white)',
                '&[data-active="true"]': {
                    color: this.isDark
                        ? `var(--mantine-color-${this.customTheme.accentColor.split('.')[0]}-4)`
                        : `var(--mantine-color-${this.customTheme.accentColor.split('.')[0]}-6)`,
                    borderColor: this.isDark
                        ? `var(--mantine-color-${this.customTheme.accentColor.split('.')[0]}-4)`
                        : `var(--mantine-color-${this.customTheme.accentColor.split('.')[0]}-6)`,
                },
            },
            tabsList: {
                borderBottomColor: this.isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)',
            },
            panel: {
                color: this.isDark ? 'var(--mantine-color-white)' : 'var(--mantine-color-dark-8)',
            },
        };
    }
}

// Export a singleton instance
export const styleService = StyleService.getInstance();