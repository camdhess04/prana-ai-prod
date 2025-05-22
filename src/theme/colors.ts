// src/theme/colors.ts
// V3.2 - Multi-Theme Architecture

// Font Family Constants
export const FONT_FAMILY_REGULAR = 'SpaceGrotesk-Regular';
export const FONT_FAMILY_MEDIUM = 'SpaceGrotesk-Medium';
export const FONT_FAMILY_BOLD = 'SpaceGrotesk-Bold';

// IBM Plex Mono Font Family Constants
export const FONT_FAMILY_MONO_REGULAR = 'IBMPlexMono-Regular';
export const FONT_FAMILY_MONO_MEDIUM = 'IBMPlexMono-Medium';
export const FONT_FAMILY_MONO_BOLD = 'IBMPlexMono-Bold';

// --- Base Palettes ---
const classyPalette = {
  // Brand/Accent Colors - Refined for a more "classy" feel
  accentBrass: '#A88F6A',     // Was #B08D57 - Muted Gold/Antique Brass
  accentPortRed: '#6A2E35',   // Was #5E2D2D - Deeper Burgundy/Merlot
  accentSaddleBrown: '#704A3A',// Was #7B4C3A - Adjusted to complement

  // Dark Theme Base (Keeping these as they provide a good foundation)
  darkBg: '#1A1F24', 
  darkCard: '#2E3430',
  darkTextPrimary: '#F2ECE3', 
  darkTextSecondary: '#B9B6AF',
  darkBorder: '#4A5568', 

  // Light Theme Base (Keeping these as they provide a good foundation)
  lightBg: '#F9FAFB', 
  lightCard: '#FFFFFF', 
  lightTextPrimary: '#1F2937', 
  lightTextSecondary: '#6B7280',
  lightBorder: '#D1D5DB',

  // Common
  pureWhite: '#FFFFFF',
  trueBlack: '#0A0A0A', 

  // System Semantic
  errorRed: '#EF4444', // Standard, good visibility
  successGreen: '#22C55E', // Standard, good visibility
};

const greenTerminalPalette = {
  darkBg: '#0D170D', // Darker, less saturated green-black
  darkCard: '#182818', // Slightly lighter dark green
  darkText: '#30E030',
  darkAccent: '#50FF50',
  darkSecondaryText: '#20B020', // Slightly brighter dimmer green
  darkBorder: '#2A4A2A', 
  lightBg: '#F0FFF0', // Honeydew like, very light green
  lightCard: '#FFFFFF',
  lightText: '#0A1A0A', // Dark green for text
  lightAccent: '#1A8A1A',
  lightSecondaryText: '#2A6A2A',
  lightBorder: '#B0D0B0',
};

const blueTerminalPalette = {
  darkBg: '#0D1117',
  darkCard: '#161B22',
  darkText: '#79C0FF',
  darkAccent: '#58A6FF',
  darkSecondaryText: '#388BFD',
  darkBorder: '#30363D',
  lightBg: '#F0F8FF', // AliceBlue like
  lightCard: '#FFFFFF',
  lightText: '#030A14',
  lightAccent: '#1F6FEB', // Slightly adjusted for better vibrancy
  lightSecondaryText: '#2C5080',
  lightBorder: '#C0D8F0',
};

// --- NEW PALETTES ---
const springPeachPalette = {
  bg: '#FFF5EE', // Seashell
  card: '#FFFFFF',
  text: '#7D4F34', // Darker, warm brown
  primaryAccent: '#FF8C69', // Coral Peach
  secondaryAccent: '#FFA07A', // Light Salmon
  buttonTextOnPrimary: '#FFFFFF',
  borderColor: '#FFDAB9', // Peach Puff
};

const springPinkPalette = {
  bg: '#FFF0F5', // Lavender Blush
  card: '#FFFFFF',
  text: '#5C374C', // Dark Plum for primary text
  primaryAccent: '#FF69B4', // Hot Pink
  secondaryAccent: '#DB7093', // Pale Violet Red
  buttonTextOnPrimary: '#FFFFFF',
  buttonTextOnSecondary: '#FFFFFF', // Assuming white text on Pale Violet Red
  accentText: '#C71585', // Medium Violet Red for accents
  borderColor: '#FFD9E5',
};

const springYellowPalette = {
  bg: '#FFFFF0', // Ivory
  card: '#FFFFFF',
  text: '#8B4513', // Saddle Brown
  primaryAccent: '#FFD700', // Gold
  secondaryAccent: '#F0E68C', // Khaki
  buttonTextOnPrimary: '#8B4513', // Saddle Brown text on Gold
  buttonTextOnSecondary: '#8B4513', // Saddle Brown text on Khaki
  borderColor: '#FFFACD', // Lemon Chiffon
};

const grayscalePalette = {
  lightBg: '#F5F5F5',
  lightCard: '#FFFFFF',
  lightText: '#212121',
  lightAccent: '#616161', // Medium grey (Primary buttons)
  lightSecondaryAccent: '#9E9E9E', // Lighter medium grey (Secondary buttons)
  lightButtonTextOnPrimary: '#FFFFFF',
  lightButtonTextOnSecondary: '#212121',
  lightBorder: '#E0E0E0',
  darkBg: '#1C1C1C',
  darkCard: '#2E2E2E',
  darkText: '#EAEAEA',
  darkAccent: '#757575', // Medium grey (Primary buttons)
  darkSecondaryAccent: '#424242', // Darker Grey (Secondary buttons)
  darkButtonTextOnPrimary: '#1C1C1C',
  darkButtonTextOnSecondary: '#EAEAEA',
  darkBorder: '#424242',
};

// --- Font Definitions (remains the same) ---
export const fonts = {
  spaceGroteskRegular: FONT_FAMILY_REGULAR,
  spaceGroteskMedium: FONT_FAMILY_MEDIUM,
  spaceGroteskBold: FONT_FAMILY_BOLD,
  ibmPlexMonoRegular: FONT_FAMILY_MONO_REGULAR,
  ibmPlexMonoMedium: FONT_FAMILY_MONO_MEDIUM,
  ibmPlexMonoBold: FONT_FAMILY_MONO_BOLD,
  // Add other weights if used by themes
  spaceGroteskLight: 'SpaceGrotesk-Light',
  spaceGroteskSemiBold: 'SpaceGrotesk-SemiBold',
  ibmPlexMonoLight: 'IBMPlexMono-Light',
  ibmPlexMonoSemiBold: 'IBMPlexMono-SemiBold',
};

// --- Helper Function to Create a Base Theme Structure ---
// This ensures all themes have the same properties for type safety with AppTheme
const createThemeObject = (
  p: {
    primary: string; secondary: string; accent?: string;
    background: string; cardBackground: string; inputBackground: string;
    text: string; secondaryText: string; tertiaryText: string;
    primaryButtonText: string; secondaryButtonText: string;
    borderColor: string; disabled: string; error: string; success: string; warning: string;
    statusBar: 'light-content' | 'dark-content';
    // Add common configurable UI elements here to establish the base structure
    tabBarActive?: string; tabBarInactive?: string;
    headerBackground?: string; headerText?: string;
    chatBubbleUser?: string; chatBubbleUserText?: string;
    chatBubbleAI?: string; chatBubbleAIText?: string;
  }
) => ({
  ...p, // Spread all passed properties first
  // Define defaults for common UI elements if not provided in p
  tabBarActive: p.tabBarActive || p.primary,
  tabBarInactive: p.tabBarInactive || p.secondaryText,
  headerBackground: p.headerBackground || p.background,
  headerText: p.headerText || p.text,
  chatBubbleUser: p.chatBubbleUser || p.primary,
  chatBubbleUserText: p.chatBubbleUserText || p.primaryButtonText,
  chatBubbleAI: p.chatBubbleAI || p.borderColor, 
  chatBubbleAIText: p.chatBubbleAIText || p.text,

  // Common font families
  fontFamilyLight: fonts.spaceGroteskLight,
  fontFamilyRegular: fonts.spaceGroteskRegular,
  fontFamilyMedium: fonts.spaceGroteskMedium,
  fontFamilySemiBold: fonts.spaceGroteskSemiBold,
  fontFamilyBold: fonts.spaceGroteskBold,
  fontFamilyMonoLight: fonts.ibmPlexMonoLight,
  fontFamilyMonoRegular: fonts.ibmPlexMonoRegular,
  fontFamilyMonoMedium: fonts.ibmPlexMonoMedium,
  fontFamilyMonoSemiBold: fonts.ibmPlexMonoSemiBold,
  fontFamilyMonoBold: fonts.ibmPlexMonoBold,
});

// --- "Classy" Theme Definitions (Formerly lightTheme/darkTheme) ---
export const classyLightTheme = createThemeObject({
  primary: classyPalette.accentPortRed,
  secondary: classyPalette.accentSaddleBrown,
  accent: classyPalette.accentBrass, 
  background: classyPalette.lightBg,
  cardBackground: classyPalette.lightCard,
  inputBackground: classyPalette.lightCard,
  text: classyPalette.lightTextPrimary,
  secondaryText: classyPalette.lightTextSecondary,
  tertiaryText: classyPalette.lightTextSecondary + '99',
  primaryButtonText: classyPalette.pureWhite,
  secondaryButtonText: classyPalette.pureWhite,
  borderColor: classyPalette.lightBorder,
  disabled: classyPalette.lightTextSecondary + '77',
  error: classyPalette.errorRed,
  success: classyPalette.successGreen,
  warning: '#FFA000', 
  statusBar: 'dark-content',
});

export const classyDarkTheme = createThemeObject({
  primary: classyPalette.accentBrass,
  secondary: classyPalette.accentPortRed,
  accent: classyPalette.accentSaddleBrown,
  background: classyPalette.darkBg,
  cardBackground: classyPalette.darkCard,
  inputBackground: classyPalette.darkBorder,
  text: classyPalette.darkTextPrimary,
  secondaryText: classyPalette.darkTextSecondary,
  tertiaryText: classyPalette.darkTextSecondary + '99',
  primaryButtonText: classyPalette.trueBlack,
  secondaryButtonText: classyPalette.darkTextPrimary, 
  borderColor: classyPalette.darkBorder,
  disabled: classyPalette.darkTextSecondary + '77',
  error: classyPalette.errorRed,
  success: classyPalette.successGreen,
  warning: '#FFC107',
  statusBar: 'light-content',
});

// --- Green Terminal Theme Definitions ---
export const greenLightTheme = createThemeObject({
  primary: greenTerminalPalette.lightAccent,
  secondary: greenTerminalPalette.lightSecondaryText, 
  background: greenTerminalPalette.lightBg,
  cardBackground: greenTerminalPalette.lightCard,
  inputBackground: greenTerminalPalette.lightCard,
  text: greenTerminalPalette.lightText,
  secondaryText: greenTerminalPalette.lightSecondaryText,
  tertiaryText: greenTerminalPalette.lightSecondaryText + '99',
  primaryButtonText: classyPalette.pureWhite,
  secondaryButtonText: classyPalette.pureWhite,
  borderColor: greenTerminalPalette.lightBorder,
  disabled: greenTerminalPalette.lightSecondaryText + '77',
  error: classyPalette.errorRed,
  success: classyPalette.successGreen,
  warning: '#FFA000',
  statusBar: 'dark-content',
  chatBubbleAI: greenTerminalPalette.lightBorder + 'BF',
  chatBubbleAIText: greenTerminalPalette.lightText,
});

export const greenDarkTheme = createThemeObject({
  primary: greenTerminalPalette.darkAccent, 
  secondary: greenTerminalPalette.darkSecondaryText,
  background: greenTerminalPalette.darkBg,
  cardBackground: greenTerminalPalette.darkCard,
  inputBackground: greenTerminalPalette.darkBorder, // Darker green input
  text: greenTerminalPalette.darkText,
  secondaryText: greenTerminalPalette.darkSecondaryText,
  tertiaryText: greenTerminalPalette.darkSecondaryText + '99',
  primaryButtonText: greenTerminalPalette.darkBg, // Dark bg text on bright green buttons
  secondaryButtonText: greenTerminalPalette.darkText, // Bright green text for secondary
  borderColor: greenTerminalPalette.darkBorder,
  disabled: greenTerminalPalette.darkSecondaryText + '77',
  error: classyPalette.errorRed,
  success: classyPalette.successGreen,
  warning: '#FFC107',
  statusBar: 'light-content',
  // Override chat bubble for terminal feel
  chatBubbleAI: greenTerminalPalette.darkCard, // Card color for AI bubble
  chatBubbleAIText: greenTerminalPalette.darkText,
});

// --- Blue Terminal Theme Definitions ---
export const blueLightTheme = createThemeObject({
  primary: blueTerminalPalette.lightAccent,        // e.g., #1F6FEB (strong blue)
  secondary: blueTerminalPalette.lightSecondaryText, // e.g., #2C5080 (darker/desaturated blue)
  background: blueTerminalPalette.lightBg,
  cardBackground: blueTerminalPalette.lightCard,   // #FFFFFF (white)
  inputBackground: blueTerminalPalette.lightCard,
  text: blueTerminalPalette.lightText,             // #030A14 (dark blue/black)
  secondaryText: blueTerminalPalette.lightSecondaryText,
  tertiaryText: blueTerminalPalette.lightSecondaryText + '99',
  primaryButtonText: classyPalette.pureWhite,
  secondaryButtonText: classyPalette.pureWhite,
  borderColor: blueTerminalPalette.lightBorder,
  disabled: blueTerminalPalette.lightSecondaryText + '77',
  error: classyPalette.errorRed,
  success: classyPalette.successGreen,
  warning: '#FFA000',
  statusBar: 'dark-content',
  chatBubbleAI: blueTerminalPalette.lightBorder + 'BF',
  chatBubbleAIText: blueTerminalPalette.lightText,
});

export const blueDarkTheme = createThemeObject({
  primary: blueTerminalPalette.darkAccent,
  secondary: blueTerminalPalette.darkSecondaryText,
  background: blueTerminalPalette.darkBg,
  cardBackground: blueTerminalPalette.darkCard,
  inputBackground: blueTerminalPalette.darkBorder,
  text: blueTerminalPalette.darkText,
  secondaryText: blueTerminalPalette.darkSecondaryText,
  tertiaryText: blueTerminalPalette.darkSecondaryText + '99',
  primaryButtonText: blueTerminalPalette.darkBg,
  secondaryButtonText: blueTerminalPalette.darkText,
  borderColor: blueTerminalPalette.darkBorder,
  disabled: blueTerminalPalette.darkSecondaryText + '77',
  error: classyPalette.errorRed,
  success: classyPalette.successGreen,
  warning: '#FFC107',
  statusBar: 'light-content',
  chatBubbleAI: blueTerminalPalette.darkCard,
  chatBubbleAIText: blueTerminalPalette.darkText,
});

// --- NEW THEME OBJECTS ---

// Peach Themes
export const peachLightTheme = createThemeObject({
  primary: springPeachPalette.primaryAccent,
  secondary: springPeachPalette.secondaryAccent,
  accent: springPeachPalette.primaryAccent, // Can be same as primary or different
  background: springPeachPalette.bg,
  cardBackground: springPeachPalette.card,
  inputBackground: springPeachPalette.card,
  text: springPeachPalette.text,
  secondaryText: springPeachPalette.text + 'AA',
  tertiaryText: springPeachPalette.text + '88',
  primaryButtonText: springPeachPalette.buttonTextOnPrimary,
  secondaryButtonText: springPeachPalette.buttonTextOnPrimary, // Assuming primary color text on secondary accent buttons
  borderColor: springPeachPalette.borderColor,
  disabled: springPeachPalette.text + '55',
  error: classyPalette.errorRed,
  success: classyPalette.successGreen,
  warning: '#FFA000',
  statusBar: 'dark-content',
});

// Pink Themes
export const pinkLightTheme = createThemeObject({
  primary: springPinkPalette.primaryAccent,
  secondary: springPinkPalette.secondaryAccent,
  accent: springPinkPalette.accentText, 
  background: springPinkPalette.bg,
  cardBackground: springPinkPalette.card,
  inputBackground: springPinkPalette.card,
  text: springPinkPalette.text,
  secondaryText: springPinkPalette.text + 'AA',
  tertiaryText: springPinkPalette.text + '88',
  primaryButtonText: springPinkPalette.buttonTextOnPrimary,
  secondaryButtonText: springPinkPalette.buttonTextOnSecondary,
  borderColor: springPinkPalette.borderColor,
  disabled: springPinkPalette.text + '55',
  error: classyPalette.errorRed,
  success: classyPalette.successGreen,
  warning: '#FFA000',
  statusBar: 'dark-content',
});

// Yellow Themes
export const yellowLightTheme = createThemeObject({
  primary: springYellowPalette.primaryAccent,
  secondary: springYellowPalette.secondaryAccent,
  accent: springYellowPalette.primaryAccent,
  background: springYellowPalette.bg,
  cardBackground: springYellowPalette.card,
  inputBackground: springYellowPalette.card,
  text: springYellowPalette.text,
  secondaryText: springYellowPalette.text + 'AA',
  tertiaryText: springYellowPalette.text + '88',
  primaryButtonText: springYellowPalette.buttonTextOnPrimary,
  secondaryButtonText: springYellowPalette.buttonTextOnSecondary,
  borderColor: springYellowPalette.borderColor,
  disabled: springYellowPalette.text + '55',
  error: classyPalette.errorRed,
  success: classyPalette.successGreen,
  warning: '#FFA000',
  statusBar: 'dark-content',
});

// Grayscale Themes
export const grayscaleLightTheme = createThemeObject({
  primary: grayscalePalette.lightAccent,
  secondary: grayscalePalette.lightSecondaryAccent,
  accent: grayscalePalette.lightAccent, 
  background: grayscalePalette.lightBg,
  cardBackground: grayscalePalette.lightCard,
  inputBackground: grayscalePalette.lightCard,
  text: grayscalePalette.lightText,
  secondaryText: grayscalePalette.lightSecondaryAccent,
  tertiaryText: grayscalePalette.lightSecondaryAccent + '99',
  primaryButtonText: grayscalePalette.lightButtonTextOnPrimary,
  secondaryButtonText: grayscalePalette.lightButtonTextOnSecondary,
  borderColor: grayscalePalette.lightBorder,
  disabled: grayscalePalette.lightSecondaryAccent + '77',
  error: classyPalette.errorRed,
  success: classyPalette.successGreen,
  warning: '#FFA000',
  statusBar: 'dark-content',
});

export const grayscaleDarkTheme = createThemeObject({
  primary: grayscalePalette.darkAccent,
  secondary: grayscalePalette.darkSecondaryAccent,
  accent: grayscalePalette.darkAccent, 
  background: grayscalePalette.darkBg,
  cardBackground: grayscalePalette.darkCard,
  inputBackground: grayscalePalette.darkCard, // Or darkBorder for more contrast
  text: grayscalePalette.darkText,
  secondaryText: grayscalePalette.darkSecondaryAccent,
  tertiaryText: grayscalePalette.darkSecondaryAccent + '99',
  primaryButtonText: grayscalePalette.darkButtonTextOnPrimary,
  secondaryButtonText: grayscalePalette.darkButtonTextOnSecondary,
  borderColor: grayscalePalette.darkBorder,
  disabled: grayscalePalette.darkSecondaryAccent + '77',
  error: classyPalette.errorRed,
  success: classyPalette.successGreen,
  warning: '#FFC107',
  statusBar: 'light-content',
});

// --- Common Theme Properties (remains the same) ---
export const commonThemeProps = {
  // borderRadius: 8, 
  // elevation: 4,    
}; 

// AppTheme type will eventually need to be a union of all theme types or a generic structure
// For now, to keep things compiling while ThemeContext is updated, it points to one.
export type AppTheme = typeof classyLightTheme; 

// Export all themes for ThemeContext to use
export const themes = {
  classyLight: classyLightTheme,
  classyDark: classyDarkTheme,
  greenLight: greenLightTheme,
  greenDark: greenDarkTheme,
  blueLight: blueLightTheme,
  blueDark: blueDarkTheme,
  // Adding new themes
  peachLight: peachLightTheme,
  pinkLight: pinkLightTheme,
  yellowLight: yellowLightTheme,
  grayscaleLight: grayscaleLightTheme,
  grayscaleDark: grayscaleDarkTheme,
}; 