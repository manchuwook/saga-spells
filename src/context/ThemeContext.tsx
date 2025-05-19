import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

// Define the theme types (simplified to match what we use with Mantine)
type ThemeColors = {
  primaryColor: string;
  accentColor: string;
  borderRadius: number;
  fontScale: number;
  imageEnabled: boolean;
};

interface ThemeContextType {
  colors: ThemeColors;
  updateTheme: (newColors: Partial<ThemeColors>) => void;
  resetTheme: () => void;
}

// Default theme values
const defaultTheme: ThemeColors = {
  primaryColor: 'brown.5',
  accentColor: 'blue.6',
  borderRadius: 4,
  fontScale: 1,
  imageEnabled: false,
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// LocalStorage key for theme
const THEME_STORAGE_KEY = 'saga-spells-custom-theme';

// Theme provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with stored theme or default
  const [colors, setColors] = useState<ThemeColors>(() => {
    // Try to get theme from localStorage
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme ? JSON.parse(storedTheme) : defaultTheme;
  });

  // Function to update theme
  const updateTheme = (newColors: Partial<ThemeColors>) => {
    setColors(prevColors => {
      const updatedColors = {
        ...prevColors,
        ...newColors,
      };
      
      // Save to localStorage
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(updatedColors));
      
      return updatedColors;
    });
  };

  // Function to reset theme to defaults
  const resetTheme = () => {
    setColors(defaultTheme);
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(defaultTheme));
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ colors, updateTheme, resetTheme }),
    [colors]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
