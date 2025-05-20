import { useMantineColorScheme, useMantineTheme, MantineTheme } from '@mantine/core';
import { useTheme } from '../context/ThemeContext';
import { styleService } from '../services/StyleService';
import { useEffect, useMemo } from 'react';

/**
 * A custom hook that provides access to the StyleService
 * while ensuring it stays in sync with the current theme and color scheme.
 * This hook is designed to integrate with Mantine's theme system.
 */
export function useStyles() {
  const { colors } = useTheme();
  const { colorScheme } = useMantineColorScheme();
  const mantineTheme = useMantineTheme();
  const isDark = colorScheme === 'dark';
  
  // Keep StyleService in sync with the current theme and color scheme
  useEffect(() => {
    styleService.updateColorScheme(colorScheme);
    styleService.updateCustomTheme(colors);
  }, [colorScheme, colors]);
  
  // Initialize StyleService with the Mantine theme when it's available
  useEffect(() => {
    if (mantineTheme) {
      styleService.initialize(mantineTheme, colorScheme, colors);
    }
  }, [mantineTheme, colorScheme, colors]);
  
  // Memoize the theme to avoid unnecessary re-renders
  const theme = useMemo<MantineTheme>(() => styleService.getTheme(), [
    colorScheme, 
    colors.primaryColor,
    colors.borderRadius,
    colors.fontScale
  ]);
  
  return {
    isDark,
    styleService,
    theme,
    // Add commonly used style getters here for convenience
    modalStyles: styleService.getModalStyles(),
    cardStyles: styleService.getCardStyles(),
    shellStyles: styleService.getShellStyles(),    textStyles: styleService.getTextStyles(),
    inputStyles: styleService.getInputStyles(),
    buttonStyles: styleService.getButtonStyles(),
    tabsStyles: styleService.getTabsStyles(),
    getNavLinkColor: (isActive: boolean) => styleService.getNavLinkColor(isActive),
    getNotificationStyles: (color?: string) => styleService.getNotificationStyles(color),
  };
}
