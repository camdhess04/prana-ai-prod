import React from 'react';
import { TextInput, View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  icon,
  iconPosition = 'left',
  ...textInputProps
}) => {
  const { theme } = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontFamily: theme.fontFamilyRegular,
      color: theme.secondaryText,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: 10,
      backgroundColor: theme.inputBackground,
      borderColor: error ? theme.error : theme.borderColor,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 14,
      fontSize: 16,
      fontFamily: theme.fontFamilyMonoRegular,
      color: theme.text,
    },
    iconWrapper: {
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 12,
      fontFamily: theme.fontFamilyRegular,
      color: theme.error,
      marginTop: 6,
    },
  });

  const inputSpecificStyle: StyleProp<TextStyle> = [styles.input, inputStyle];
  if (icon && iconPosition === 'left') {
    inputSpecificStyle.push({ paddingLeft: 0 });
  } else if (icon && iconPosition === 'right') {
    inputSpecificStyle.push({ paddingRight: 0 });
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconWrapper}>{icon}</View>
        )}
        <TextInput
          style={inputSpecificStyle}
          placeholderTextColor={theme.tertiaryText}
          {...textInputProps}
        />
        {icon && iconPosition === 'right' && (
          <View style={styles.iconWrapper}>{icon}</View>
        )}
      </View>
      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

export default Input; 