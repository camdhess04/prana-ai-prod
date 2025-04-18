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

import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports'; // Use aws-exports.js

console.log('🔧 Initializing Amplify with config from aws-exports.js:', awsconfig);
Amplify.configure(awsconfig); // Pass the whole object
console.log('✅ Amplify configured attempt complete.');

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
