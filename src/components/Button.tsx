import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { theme, themeMode } = useAppTheme();

  const getButtonStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.buttonPrimaryBackground,
          borderColor: theme.buttonPrimaryBackground,
        };
      case 'secondary':
        return {
          backgroundColor: theme.buttonSecondaryBackground,
          borderColor: theme.buttonSecondaryBackground,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.primary,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: theme.buttonPrimaryBackground,
          borderColor: theme.buttonPrimaryBackground,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return { color: theme.buttonPrimaryText };
      case 'secondary':
        return { color: theme.buttonSecondaryText };
      case 'outline':
      case 'ghost':
        return { color: theme.primary };
      default:
        return { color: theme.buttonPrimaryText };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 12 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 16 };
    }
  };

  const getFontSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'medium':
        return { fontSize: 16 };
      case 'large':
        return { fontSize: 18 };
      default:
        return { fontSize: 16 };
    }
  };

  const buttonStyles: StyleProp<ViewStyle> = [
    styles.button,
    getButtonStyle(),
    getSizeStyle(),
    (isLoading || disabled) && styles.disabled,
    style,
  ];

  const textStyles: StyleProp<TextStyle> = [
    styles.text,
    getTextStyle(),
    getFontSize(),
    textStyle,
  ];

  const indicatorColor = variant === 'primary' ? theme.buttonPrimaryText : theme.primary;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button; 