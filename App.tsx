import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';

// Root component that uses the theme context
function AppContent() {
  const { theme, themeMode, toggleTheme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>
         Prana.ai V2 - Let's Build!
      </Text>
      <Text style={[styles.text, { color: theme.secondaryText }]}>
        Current Mode: {themeMode}
      </Text>
      <Button title="Toggle Theme" onPress={toggleTheme} color={theme.primary} />
      <StatusBar style={themeMode === 'light' ? 'dark' : 'light'} />
    </View>
  );
}

// Main App component wrapping everything with the provider
export default function App() {
  return (
    <SafeAreaProvider>
       <ThemeProvider>
          <AppContent />
       </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Basic styles - we'll make these theme-aware later
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
