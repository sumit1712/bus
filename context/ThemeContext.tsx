import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF5722',
    primaryContainer: '#FFCCBC',
    secondary: '#4CAF50',
    secondaryContainer: '#C8E6C9',
    tertiary: '#2196F3',
    tertiaryContainer: '#BBDEFB',
    error: '#F44336',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    onSurfaceVariant: '#757575',
  },
};

const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF8A65',
    primaryContainer: '#BF360C',
    secondary: '#81C784',
    secondaryContainer: '#2E7D32',
    tertiary: '#64B5F6',
    tertiaryContainer: '#1565C0',
    error: '#E57373',
    background: '#121212',
    surface: '#1E1E1E',
    onSurfaceVariant: '#BDBDBD',
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