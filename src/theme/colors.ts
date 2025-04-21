// src/theme/colors.ts

// Define the structure of your theme object
export interface AppTheme {
  background: string;
  cardBackground: string;
  text: string;
  secondaryText: string;
  primary: string;
  secondary: string; // Example secondary color
  accent: string; // Example accent color
  error: string;
  success: string;
  warning: string;
  borderColor: string;
  buttonPrimaryBackground: string;
  buttonPrimaryText: string;
  buttonSecondaryBackground: string;
  buttonSecondaryText: string;
  // Add any other color properties your components might need
}

// Define the light theme colors
export const lightTheme: AppTheme = {
  background: '#F4F4F8', // Off-white
  cardBackground: '#FFFFFF', // White
  text: '#1C1C1E', // Very dark gray (almost black)
  secondaryText: '#6E6E73', // Medium gray
  primary: '#007AFF', // Apple blue
  secondary: '#5856D6', // Indigo
  accent: '#FF9500', // Orange
  error: '#FF3B30', // Red
  success: '#34C759', // Green
  warning: '#FFCC00', // Yellow
  borderColor: '#D1D1D6', // Light gray border
  buttonPrimaryBackground: '#007AFF',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondaryBackground: '#E5E5EA', // Light gray button background
  buttonSecondaryText: '#000000', // Black text for light gray button
};

// Define the dark theme colors
export const darkTheme: AppTheme = {
  background: '#000000', // Black
  cardBackground: '#1C1C1E', // Very dark gray
  text: '#FFFFFF', // White
  secondaryText: '#8E8E93', // Lighter gray
  primary: '#0A84FF', // Brighter Apple blue
  secondary: '#5E5CE6', // Brighter Indigo
  accent: '#FF9F0A', // Brighter Orange
  error: '#FF453A', // Brighter Red
  success: '#30D158', // Brighter Green
  warning: '#FFD60A', // Brighter Yellow
  borderColor: '#38383A', // Darker gray border
  buttonPrimaryBackground: '#0A84FF',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondaryBackground: '#3A3A3C', // Dark gray button background
  buttonSecondaryText: '#FFFFFF', // White text for dark gray button
};

// You can also export the type alias directly if preferred elsewhere
export type Theme = AppTheme; 