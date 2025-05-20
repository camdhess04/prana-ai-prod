// src/context/ThemeContext.tsx
// Corrected imports and initial context value

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native'; // Added Appearance for initial sync
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import the `themes` object and the AppTheme type
import { themes, type AppTheme } from '../theme/colors';

// Define the names of available themes based on the keys of the themes object
export type ThemeName = keyof typeof themes;

interface ThemeContextType {
  currentThemeName: ThemeName;
  theme: AppTheme; // This will be the actual theme object like themes.classyLight, themes.greenDark etc.
  setTheme: (name: ThemeName) => void;
  availableThemes: typeof themes; // Expose all theme definitions
  isLoadingTheme: boolean;
}

// Determine a sensible initial default theme name
const systemPreferredMode = Appearance.getColorScheme() || 'light';
const initialDefaultThemeName: ThemeName = systemPreferredMode === 'dark' ? 'classyDark' : 'classyLight';

const defaultThemeContextValue: ThemeContextType = {
  currentThemeName: initialDefaultThemeName,
  theme: themes[initialDefaultThemeName], 
  setTheme: () => console.warn('setTheme called on default ThemeContext value'),
  availableThemes: themes,
  isLoadingTheme: true,
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContextValue);

interface ThemeProviderProps {
  children: ReactNode;
}

const SELECTED_THEME_NAME_STORAGE_KEY = '@prana_selected_theme_name_v1';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme(); // For potential future use or initial intelligent default beyond classy
  const [currentThemeNameState, setCurrentThemeNameState] = useState<ThemeName>(initialDefaultThemeName);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  useEffect(() => {
    let isActive = true;
    const loadSelectedThemeName = async () => {
      try {
        const storedThemeName = await AsyncStorage.getItem(SELECTED_THEME_NAME_STORAGE_KEY) as ThemeName | null;
        if (isActive) {
            if (storedThemeName && themes[storedThemeName]) { // Check if stored name is a valid key
                setCurrentThemeNameState(storedThemeName);
            } else {
                // Fallback to classyLight/Dark based on system if no valid stored theme
                const fallbackThemeName: ThemeName = (systemColorScheme === 'dark') ? 'classyDark' : 'classyLight';
                setCurrentThemeNameState(fallbackThemeName);
                // Optionally, save this fallback choice to storage if nothing was there
                // await AsyncStorage.setItem(SELECTED_THEME_NAME_STORAGE_KEY, fallbackThemeName);
            }
        }
      } catch (error) {
        console.error("Failed to load selected theme name:", error);
        if (isActive) {
            // Fallback on error
            const fallbackThemeName: ThemeName = (systemColorScheme === 'dark') ? 'classyDark' : 'classyLight';
            setCurrentThemeNameState(fallbackThemeName);
        }
      } finally {
        if (isActive) {
            setIsLoadingTheme(false);
        }
      }
    };

    loadSelectedThemeName();
    return () => { isActive = false; };
  }, [systemColorScheme]); 

  const setThemeByName = async (name: ThemeName) => {
    if (!themes[name]) {
        console.warn(`Attempted to set invalid theme name: ${name}`);
        return;
    }
    try {
      await AsyncStorage.setItem(SELECTED_THEME_NAME_STORAGE_KEY, name);
      setCurrentThemeNameState(name);
    } catch (error) {
      console.error("Failed to save selected theme name:", error);
    }
  };

  const currentThemeObject = themes[currentThemeNameState] || themes[initialDefaultThemeName]; // Fallback just in case

  const providerValue: ThemeContextType = {
    currentThemeName: currentThemeNameState,
    theme: currentThemeObject,
    setTheme: setThemeByName,
    availableThemes: themes,
    isLoadingTheme
  };

  return (
    <ThemeContext.Provider value={providerValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context easily
export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) { // Should not happen if used within provider
    console.error("useAppTheme must be used within a ThemeProvider - returning emergency default");
    return defaultThemeContextValue; // Emergency fallback
  }
  return context;
};