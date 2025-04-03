export const palette = {
  // Primary Palette
  primaryBase: '#6A0DAD', // A vibrant purple
  primaryLight: '#B074D9',
  primaryDark: '#480975',

  // Neutrals
  neutralBlack: '#0F0F0F',
  neutralDarkGrey: '#3C3C3C',
  neutralMediumGrey: '#8A8A8A',
  neutralLightGrey: '#D1D1D1',
  neutralWhite: '#FFFFFF',

  // Accents
  accentGreen: '#4CAF50',
  accentRed: '#F44336',
  accentBlue: '#2196F3',
  accentYellow: '#FFEB3B',
};

export const lightTheme = {
  background: palette.neutralWhite,
  cardBackground: palette.neutralLightGrey,
  text: palette.neutralBlack,
  primary: palette.primaryBase,
  secondaryText: palette.neutralMediumGrey,
  borderColor: palette.neutralLightGrey,
  buttonPrimaryBackground: palette.primaryBase,
  buttonPrimaryText: palette.neutralWhite,
  buttonSecondaryBackground: palette.neutralLightGrey,
  buttonSecondaryText: palette.neutralBlack,
  error: palette.accentRed,
  success: palette.accentGreen,
  // ... add more as needed
};

export const darkTheme = {
  background: palette.neutralBlack,
  cardBackground: palette.neutralDarkGrey,
  text: palette.neutralWhite,
  primary: palette.primaryLight, // Lighter primary for dark mode contrast
  secondaryText: palette.neutralLightGrey,
  borderColor: palette.neutralDarkGrey,
  buttonPrimaryBackground: palette.primaryLight,
  buttonPrimaryText: palette.neutralBlack,
  buttonSecondaryBackground: palette.neutralDarkGrey,
  buttonSecondaryText: palette.neutralWhite,
  error: palette.accentRed,
  success: palette.accentGreen,
  // ... add more as needed
};

export type AppTheme = typeof lightTheme; // Define a type based on one theme structure 