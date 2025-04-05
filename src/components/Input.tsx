import React from 'react';
import { TextInput, View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

interface InputProps extends Omit<TextInputProps, 'onChangeText' | 'value' | 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  containerStyle,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  ...rest
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.cardBackground,
            color: theme.text,
            borderColor: error ? theme.error : theme.borderColor,
          },
          multiline && { height: (theme.text === '#FFFFFF' ? 20 : 16) * numberOfLines + 24, textAlignVertical: 'top' },
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.secondaryText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        {...rest}
      />
      {error && <Text style={[styles.error, { color: theme.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input; 