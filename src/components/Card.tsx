import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  // Add specific props for card variants if needed in the future
  // e.g., variant?: 'default' | 'elevated' | 'outlined';
  // e.g., shadowIntensity?: 'subtle' | 'medium' | 'strong';
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  const { theme } = useAppTheme();

  // Define styles inside the component to access theme
  const styles = StyleSheet.create({
    cardBase: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12, // Slightly larger, more modern radius
      // Shadow properties for a "classy" elevation
      // iOS Shadow
      shadowColor: theme.text, // Use a dark color for shadow, could be a dedicated shadow color in theme
      shadowOffset: {
        width: 0,
        height: Platform.OS === 'ios' ? 2 : 4, // Subtle for iOS, slightly more for Android if using elevation
      },
      shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.8, // More subtle opacity for iOS shadow
      shadowRadius: Platform.OS === 'ios' ? 4 : 6,   // Softer radius
      // Android Elevation (shadows are different)
      elevation: Platform.OS === 'android' ? 5 : 0, // Moderate elevation for Android
      // Border as an alternative or supplement to shadow for a cleaner look
      borderWidth: Platform.OS === 'android' ? 0 : 0.5, // Very subtle border for iOS if needed, or keep 0
      borderColor: theme.borderColor, // Use the theme's border color
      padding: 16, // Default padding, can be overridden by style prop or no padding if card content handles it
    },
    // Example: Outlined variant style
    /*
    outlinedCard: {
      borderWidth: 1.5,
      borderColor: theme.borderColor,
      elevation: 0, // No elevation for outlined cards
      shadowOpacity: 0, // No shadow for outlined cards
    },
    */
  });

  const cardStyle: StyleProp<ViewStyle> = [
    styles.cardBase,
    // if (variant === 'outlined') cardStyle.push(styles.outlinedCard);
    style, // Apply external styles last to allow overrides
  ];

  return <View style={cardStyle}>{children}</View>;
};

export default Card; 