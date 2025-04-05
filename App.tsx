// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import RootNavigator from './src/navigation/RootNavigator';

// --- Simple Amplify Configuration ---
Amplify.configure(awsconfig);
// --- No Debug Logging Settings Here ---

export default function App() {
  return (
    <SafeAreaProvider>
       <ThemeProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
       </ThemeProvider>
    </SafeAreaProvider>
  );
}