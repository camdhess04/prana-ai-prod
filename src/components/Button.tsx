// src/components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode; // Allow an icon to be passed
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = true, // Default to true for consistency, can be overridden
}) => {
  const { theme } = useAppTheme();

  const styles = StyleSheet.create({
    containerBase: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10, // Slightly more rounded
      borderWidth: 1.5, // Consistent border width for outline/ghost
      opacity: disabled ? 0.6 : 1,
    },
    textBase: {
      fontWeight: '600', // Medium weight for button text
      marginLeft: icon && title ? (size === 'small' ? 6 : 8) : 0, // Space if icon AND title exist
      // marginRight: icon && title ? (size === 'small' ? 6 : 8) : 0, // Removed to allow icon-only buttons to not have extra margin if text is empty
    },
    // Sizes
    smallContainer: { paddingVertical: 8, paddingHorizontal: 14 },
    mediumContainer: { paddingVertical: 12, paddingHorizontal: 20 }, 
    largeContainer: { paddingVertical: 16, paddingHorizontal: 28 },
    smallText: { fontSize: 13, fontFamily: theme.fontFamilyMedium }, // Use theme font
    mediumText: { fontSize: 15, fontFamily: theme.fontFamilyMedium }, // Use theme font
    largeText: { fontSize: 17, fontFamily: theme.fontFamilyMedium }, // Use theme font

    // Variants - Light Theme Specifics handled by theme colors
    primaryContainer: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    primaryText: {
      color: theme.primaryButtonText,
    },
    secondaryContainer: {
      backgroundColor: theme.secondary,
      borderColor: theme.secondary,
    },
    secondaryText: {
      color: theme.secondaryButtonText,
    },
    outlineContainer: {
      backgroundColor: 'transparent',
      borderColor: theme.primary, // Outline uses primary color for border
    },
    outlineText: {
      color: theme.primary, // Outline uses primary color for text
    },
    ghostContainer: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    ghostText: {
      color: theme.primary, // Ghost uses primary color for text
    },
    dangerContainer: {
      backgroundColor: theme.error,
      borderColor: theme.error,
    },
    dangerText: {
      color: theme.primaryButtonText, // Assuming white text on danger buttons
    },
    fullWidth: {
      width: '100%',
    },
    autoWidth: {
      alignSelf: 'flex-start', // Or 'center', 'flex-end' as needed
    },
  });

  const containerStyles: StyleProp<ViewStyle>[] = [styles.containerBase];
  const textStylesArray: StyleProp<TextStyle>[] = [styles.textBase]; // Renamed to avoid conflict with prop

  // Apply size styles
  switch (size) {
    case 'small':
      containerStyles.push(styles.smallContainer);
      textStylesArray.push(styles.smallText);
      break;
    case 'large':
      containerStyles.push(styles.largeContainer);
      textStylesArray.push(styles.largeText);
      break;
    default: // medium
      containerStyles.push(styles.mediumContainer);
      textStylesArray.push(styles.mediumText);
      break;
  }

  // Apply variant styles
  switch (variant) {
    case 'primary':
      containerStyles.push(styles.primaryContainer);
      textStylesArray.push(styles.primaryText);
      break;
    case 'secondary':
      containerStyles.push(styles.secondaryContainer);
      textStylesArray.push(styles.secondaryText);
      break;
    case 'outline':
      containerStyles.push(styles.outlineContainer);
      textStylesArray.push(styles.outlineText);
      break;
    case 'ghost':
      containerStyles.push(styles.ghostContainer);
      textStylesArray.push(styles.ghostText);
      break;
    case 'danger':
      containerStyles.push(styles.dangerContainer);
      textStylesArray.push(styles.dangerText);
      break;
  }
  
  if (fullWidth) {
    containerStyles.push(styles.fullWidth);
  } else {
    containerStyles.push(styles.autoWidth);
  }

  // Apply external styles
  if (style) containerStyles.push(style);
  if (textStyle) textStylesArray.push(textStyle); // Apply to the array

  // Determine color for ActivityIndicator based on button variant
  let indicatorColor = theme.primary;
  if (variant === 'primary' || variant === 'secondary' || variant === 'danger') {
    indicatorColor = theme.primaryButtonText;
  }
  
  // Add marginRight to icon if title also exists to ensure spacing
  const iconWithMargin = icon && title && React.isValidElement(icon) ? 
    React.cloneElement(icon as React.ReactElement<any>, { style: { marginRight: size === 'small' ? 6 : 8 } }) 
    : icon;

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.75} // Slightly adjusted active opacity
    >
      {isLoading ? (
        <ActivityIndicator size={size === 'small' ? 'small' : 'small'} color={indicatorColor} />
      ) : (
        <>
          {iconWithMargin}
          {title && <Text style={textStylesArray}>{title}</Text>} 
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;