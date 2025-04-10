// src/components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle, View } from 'react-native'; // Added View
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
  icon?: React.ReactElement; // <-- ADDED: Optional icon element prop
  iconPosition?: 'left' | 'right'; // <-- ADDED: Control icon position
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
  icon, // <-- Destructure icon
  iconPosition = 'left', // <-- Default icon position to left
}) => {
  const { theme, themeMode } = useAppTheme();

  // --- Style calculation functions (getButtonStyle, getTextStyle, etc.) remain the same ---
  const getButtonStyle = (): ViewStyle => { /* ... same as before ... */
    switch (variant) {
        case 'primary': return { backgroundColor: theme.buttonPrimaryBackground, borderColor: theme.buttonPrimaryBackground };
        case 'secondary': return { backgroundColor: theme.buttonSecondaryBackground, borderColor: theme.buttonSecondaryBackground };
        case 'outline': return { backgroundColor: 'transparent', borderColor: theme.primary, borderWidth: 1 };
        case 'ghost': return { backgroundColor: 'transparent', borderColor: 'transparent', borderWidth: 1 }; // Ensure border for layout consistency maybe? Or keep transparent?
        default: return { backgroundColor: theme.buttonPrimaryBackground, borderColor: theme.buttonPrimaryBackground };
    }
  };
  const getTextStyle = (): TextStyle => { /* ... same as before ... */
     switch (variant) {
        case 'primary': return { color: theme.buttonPrimaryText };
        case 'secondary': return { color: theme.buttonSecondaryText };
        case 'outline': case 'ghost': return { color: theme.primary };
        default: return { color: theme.buttonPrimaryText };
     }
  };
  const getSizeStyle = (): ViewStyle => { /* ... same as before ... */
     switch (size) {
        case 'small': return { paddingVertical: 8, paddingHorizontal: 12, gap: 4 }; // Add gap for icon
        case 'medium': return { paddingVertical: 12, paddingHorizontal: 16, gap: 6 }; // Add gap for icon
        case 'large': return { paddingVertical: 16, paddingHorizontal: 24, gap: 8 }; // Add gap for icon
        default: return { paddingVertical: 12, paddingHorizontal: 16, gap: 6 };
    }
  };
  const getFontSize = (): TextStyle => { /* ... same as before ... */
     switch (size) {
         case 'small': return { fontSize: 14 };
         case 'medium': return { fontSize: 16 };
         case 'large': return { fontSize: 18 };
         default: return { fontSize: 16 };
     }
  };
  // --- ---

  const buttonStyles: StyleProp<ViewStyle> = [
    styles.button,
    getButtonStyle(),
    getSizeStyle(),
    (isLoading || disabled) && styles.disabled,
    style,
    // Adjust flexDirection based on icon position
    { flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row' }
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
        <>
          {/* Render icon if provided */}
          {icon}
          {/* Render text title */}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // Keep as row by default, let prop handle reverse
    // flexDirection: 'row', // Set dynamically now
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Base border width, color/style set by variants
    // gap is set dynamically by size now
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    // Margin between icon/text handled by 'gap' style in getSizeStyle
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;