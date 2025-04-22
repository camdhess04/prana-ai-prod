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

// --- Paste the JSON content directly as a JS object ---
const amplifyconfig = {
  "aws_project_region": "us-east-1",
  "aws_cognito_identity_pool_id": "us-east-1:1ac8630c-e637-4672-aa7b-81bc3450c6a7",
  "aws_cognito_region": "us-east-1",
  "aws_user_pools_id": "us-east-1_eKXsGL89U",
  "aws_user_pools_web_client_id": "3c3crvf6nvtvtbr7m89jhbfcpe",
  "oauth": {},
  "aws_cognito_username_attributes": [
    "EMAIL"
  ],
  "aws_cognito_social_providers": [],
  "aws_cognito_signup_attributes": [
    "EMAIL"
  ],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": [],
  "aws_cognito_password_protection_settings": {
    "passwordPolicyMinLength": 8,
    "passwordPolicyCharacters": []
  },
  "aws_cognito_verification_mechanisms": [
    "EMAIL"
  ],
  "aws_appsync_graphqlEndpoint": "https://qzvdt5bs2retjmgifkgwcqo2lm.appsync-api.us-east-1.amazonaws.com/graphql",
  "aws_appsync_region": "us-east-1",
  "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
  "aws_cloud_logic_custom": [
    {
      "name": "pranaAiApi",
      "endpoint": "https://93sryfkx06.execute-api.us-east-1.amazonaws.com/dev",
      "region": "us-east-1"
    }
  ]
};
// -----------------------------------------------------

console.log('🔧 Using INLINE Amplify config object');

export default function App() {
  // Configure Amplify inside the component
  try {
    if (!amplifyconfig || typeof amplifyconfig !== 'object') { // Basic check
      throw new Error("Inline Amplify config object is invalid or missing.");
    }
    console.log('🔧 Calling Amplify.configure inside App component (inline)...');
    Amplify.configure(amplifyconfig);
    console.log('✅ Amplify configured successfully inside App component (inline).');
  } catch (err) {
    console.error("❌ Error configuring Amplify inside App component (inline):", err);
  }

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
