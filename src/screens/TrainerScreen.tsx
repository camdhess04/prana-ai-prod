// src/screens/TrainerScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

const TrainerScreen = () => {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>  
      <Text style={[styles.text, { color: theme.text }]}>AI Trainer Chat Screen</Text>
      {/* We will put the chat interface here later */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default TrainerScreen; 