// App.tsx - Add these lines FIRST
import 'react-native-get-random-values'; // For crypto
import 'text-encoding-polyfill';        // For TextEncoder/Decoder
import { Buffer } from 'buffer';         // For Buffer API
import {decode, encode} from 'base-64'; // For atob/btoa used by Amplify

// Polyfill checks/assignments (needed for some libraries)
if (typeof BigInt === 'undefined') global.BigInt = require('big-integer');
if(typeof Buffer === 'undefined') global.Buffer = Buffer;
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

// --- NOW your other imports ---
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