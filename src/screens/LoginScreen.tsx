// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthStackNavigator';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Final Workaround Version of handleSignIn ---
  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Attempting sign in for: ${email}`);
      await signIn({ username: email.trim(), password });
      console.log('Sign in successful (AuthContext will handle navigation)');
      // Navigation handled by AuthContext/RootNavigator
      // No need to set isLoading false on success

    } catch (err: any) {
      setIsLoading(false); // Set loading false on failure
      console.error('Sign in error:', err);
      // Provide user-friendly messages
      if (err.name === 'UserNotFoundException' || err.name === 'NotAuthorizedException') {
          setError('Incorrect email or password. Please try again.');
      } else if (err.name === 'UserNotConfirmedException') {
          setError('Your email is not confirmed yet. Please check your email or sign up again.');
      } else if (err.message && err.message.includes('An unknown error has occurred')) {
           // Specific guidance for the known issue
           setError('Login failed. Please tap "Sign In" again.');
      } else {
          setError('An unexpected error occurred. Please try again.');
      }
    }
  };
  // --- End of handleSignIn ---

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
                containerStyle={styles.inputContainer}
            />

            {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}

            <Button
                title="Sign In"
                onPress={handleSignIn} // Uses the simplified version
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