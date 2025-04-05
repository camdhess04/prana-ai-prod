import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: number; // Optional elevation prop
}

const Card: React.FC<CardProps> = ({ children, style, elevation = 1 }) => {
  const { theme } = useAppTheme();

  // Basic elevation/shadow styling (adjust as needed)
  const cardStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.1 * elevation,
      shadowRadius: 1.5 * elevation,
    },
    android: {
      elevation: elevation * 2, // Android elevation is different
    },
  });

  return (
    <View style={[
      styles.card,
      { backgroundColor: theme.cardBackground, borderColor: theme.borderColor },
      cardStyle,
      style // Allow custom styles to override
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12, // Rounded corners
    padding: 16,      // Default padding
    borderWidth: StyleSheet.hairlineWidth, // Subtle border
    // Default margin can be added here or applied where used
    // marginBottom: 16,
  },
});

export default Card; 