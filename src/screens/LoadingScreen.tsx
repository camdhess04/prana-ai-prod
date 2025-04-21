import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

const LoadingScreen = () => {
  const { theme } = useAppTheme(); // theme might be undefined for a split second

  // Provide default colors if theme isn't ready yet
  const backgroundColor = theme ? theme.background : '#FFFFFF'; // Default white
  const indicatorColor = theme ? theme.primary : '#0000FF'; // Default blue

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <ActivityIndicator size="large" color={indicatorColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen; 