// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthStackNavigator';
import { signIn, fetchAuthSession, fetchUserAttributes } from '@aws-amplify/auth';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { signIn: contextSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔑 SCREEN: Attempting sign-in via context...");
      await contextSignIn(email.trim(), password.trim());
      // No need to do anything else here - the Hub listener in AuthContext
      // will handle success by updating state and triggering navigation
    } catch (err: any) {
      console.error("❌ SCREEN: Sign-in error caught:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.keyboardAvoidingContainer, { backgroundColor: theme.background }]}
    >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
            <Text style={[styles.title, { color: theme.text }]}>Welcome Back!</Text>

            <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={styles.inputContainer}
            />

            <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoCorrect={false}
                spellCheck={false}
                containerStyle={styles.inputContainer}
            />

            {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}

            <Button
                title="Sign In"
                onPress={handleSignIn}
                isLoading={isLoading}
                disabled={isLoading}
                style={styles.button}
            />

            <Button
                title="Don't have an account? Sign Up"
                variant="ghost"
                onPress={() => navigation.navigate('Signup')}
                disabled={isLoading}
                style={styles.switchButton}
            />
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Use same styles as before
const styles = StyleSheet.create({
  keyboardAvoidingContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  inputContainer: { width: '100%' },
  button: { marginTop: 20, width: '100%' },
  switchButton: { marginTop: 15 },
  errorText: { marginTop: 10, marginBottom: 10, textAlign: 'center', color: 'red' } // Apply theme.error if possible later
});

export default LoginScreen;