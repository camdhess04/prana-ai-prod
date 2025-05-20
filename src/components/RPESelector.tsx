// src/components/RPESelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from '../context/ThemeContext'; // Assuming your theme context is here

interface RPESelectorProps {
  currentValue: number | null | undefined;
  onSelect: (value: number | null) => void;
  maxRpe?: number; // Typically 10
  style?: StyleProp<ViewStyle>;
  circleStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  selectedCircleStyle?: StyleProp<ViewStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
}

const RPESelector: React.FC<RPESelectorProps> = ({
  currentValue,
  onSelect,
  maxRpe = 10,
  style,
  circleStyle,
  textStyle,
  selectedCircleStyle,
  selectedTextStyle,
}) => {
  const { theme } = useAppTheme();

  const rpeValues = Array.from({ length: maxRpe }, (_, i) => i + 1);

  const handlePress = (value: number) => {
    if (currentValue === value) {
      onSelect(null); // Deselect if already selected
    } else {
      onSelect(value);
    }
  };

  // Define styles inside the component to access theme
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around', // Distribute circles evenly
      alignItems: 'center',
      paddingVertical: 8, // Add some vertical padding to the container
    },
    circleBase: {
      width: 32, // Adjust size as needed
      height: 32, // Adjust size as needed
      borderRadius: 16, // Make it a circle
      borderWidth: 1.5,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 2, // Space between circles
    },
    circleSelectedBase: {
      borderWidth: 1.5, // Can be same or different
    },
    textBase: {
      fontSize: 14, // Adjust size as needed
      fontFamily: theme.fontFamilyMonoRegular, // Use theme font
    },
    textSelectedBase: {
      fontFamily: theme.fontFamilyMonoBold, // Use theme font
    },
  });

  return (
    <View style={[styles.container, style]}>
      {rpeValues.map((value) => {
        const isSelected = currentValue === value;
        return (
          <TouchableOpacity
            key={value}
            style={[
              styles.circleBase,
              {
                borderColor: theme.borderColor || theme.secondaryText, // Fallback for border
                backgroundColor: theme.background, // Default background
              },
              circleStyle,
              isSelected && styles.circleSelectedBase,
              isSelected && { backgroundColor: theme.primary }, // Selected background
              isSelected && selectedCircleStyle,
            ]}
            onPress={() => handlePress(value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.textBase,
                { color: theme.secondaryText },
                textStyle,
                isSelected && styles.textSelectedBase,
                isSelected && { color: theme.buttonPrimaryText }, // Use buttonPrimaryText for selected state
                isSelected && selectedTextStyle,
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RPESelector; 