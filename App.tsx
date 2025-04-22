// App.tsx - Amplify v6 React Native setup (TS-safe and production-ready)

import 'react-native-get-random-values';
import 'text-encoding-polyfill';
import { Buffer } from 'buffer';
import { decode, encode } from 'base-64';

if (typeof BigInt === 'undefined') (global as any).BigInt = require('big-integer');
if (typeof Buffer === 'undefined') (global as any).Buffer = Buffer;
if (!global.btoa) (global as any).btoa = encode;
if (!global.atob) (global as any).atob = decode;

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';

import { Amplify } from 'aws-amplify';
const amplifyconfig = require('amplifyconfiguration.json'); // Try require without ./

// Check if require worked at module level
console.log('🔧 Config loaded via require at module level:', amplifyconfig ? 'Yes' : 'No');

export default function App() {
  // --- Configure Amplify inside the component ---
  try {
    // Check if config object is valid before configuring
    if (!amplifyconfig || typeof amplifyconfig !== 'object') {
      throw new Error("Amplify config object is invalid or missing.");
    }
    console.log('🔧 Calling Amplify.configure inside App component...');
    Amplify.configure(amplifyconfig);
    console.log('✅ Amplify configured successfully inside App component.');
  } catch (err) {
    // Log error but don't necessarily crash the whole app maybe?
    // Or perhaps re-throw if Amplify config is critical? For now, just log.
    console.error("❌ Error configuring Amplify inside App component:", err);
  }
  // ---------------------------------------------

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
