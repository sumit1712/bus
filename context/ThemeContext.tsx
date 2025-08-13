import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#E91E63', // Modern Pink-Red
    primaryContainer: '#FCE4EC',
    secondary: '#00BCD4', // Cyan
    secondaryContainer: '#E0F2F1',
    tertiary: '#FF9800', // Orange
    tertiaryContainer: '#FFF3E0',
    error: '#F44336',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    onSurfaceVariant: '#616161',
    outline: '#E0E0E0',
  },
};

const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#F48FB1', // Light Pink
    primaryContainer: '#880E4F',
    secondary: '#4DD0E1', // Light Cyan
    secondaryContainer: '#00695C',
    tertiary: '#FFB74D', // Light Orange
    tertiaryContainer: '#E65100',
    error: '#EF5350',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    onSurfaceVariant: '#BDBDBD',
    outline: '#424242',
  },
};

interface ThemeContextType {
  theme: MD3Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};