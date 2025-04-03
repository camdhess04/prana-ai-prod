import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, AppTheme } from '../theme/colors';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  theme: AppTheme;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = '@prana_theme_mode';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme(); // 'light', 'dark', or null
  const [themeMode, setThemeModeState] = useState<ThemeMode>(systemColorScheme || 'light');
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  // Load theme preference from storage on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
        if (storedTheme) {
          setThemeModeState(storedTheme);
        } else {
          // If no stored theme, use system preference
          setThemeModeState(systemColorScheme || 'light');
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
        // Fallback to system or default if loading fails
        setThemeModeState(systemColorScheme || 'light');
      } finally {
        setIsLoadingTheme(false);
      }
    };

    loadThemePreference();
  }, [systemColorScheme]); // Rerun if system theme changes while app is running

  // Function to update state and save preference
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  const toggleTheme = () => {
    const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newThemeMode);
  };

  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  // Don't render children until theme is loaded to prevent flash of wrong theme
  if (isLoadingTheme) {
    return null; // Or return a loading indicator component
  }

  return (
    <ThemeContext.Provider value={{ themeMode, theme: currentTheme, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context easily
export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}; 