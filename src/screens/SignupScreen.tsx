// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthStackNavigator';

type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  // Make sure to get confirmSignUp and resendSignUp if you keep related buttons
  const { signUp, confirmSignUp, resendSignUp, fetchCurrentUserAttributes } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false); // Track if we need confirmation code

  const validatePassword = (): boolean => {
      if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return false;
      }
      if (password.length < 8) {
          setError('Password must be at least 8 characters long.');
          return false;
      }
      return true;
  }

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
    }
    if (!validatePassword()) return;

    setIsLoading(true);
    setError(null);

    try {
        console.log(`Attempting sign up for: ${email}`);
        const result = await signUp(email.trim(), password, email.trim());
        console.log('Sign up result:', result);
        
        if (result?.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
            setIsConfirming(true);
            setError(null);
            Alert.alert(
                'Check Your Email',
                'A confirmation code has been sent to your email address. Please enter it below.',
                [{ text: 'OK' }]
            );
        } else {
            setError('Signup status unclear. Please check your email or try logging in.');
        }
    } catch (err: any) {
        setIsLoading(false);
        console.error('Sign up error:', err);
        if (err.name === 'UsernameExistsException') {
            setError('An account with this email already exists. Please try logging in.');
        } else if (err.name === 'InvalidPasswordException') {
            setError('Password does not meet requirements (Min 8 chars recommended).');
        } else {
            setError('An unexpected error occurred during sign up.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async () => {
    if (!confirmationCode) {
        setError('Please enter the confirmation code.');
        return;
    }
    setIsLoading(true);
    setError(null);

    try {
        console.log(`Attempting confirmation for ${email} with code ${confirmationCode}`);
        await confirmSignUp(email.trim(), confirmationCode);
        console.log('Confirmation successful');

        // Attempt to fetch attributes after confirmation
        console.log('Attempting to fetch user attributes post-confirmation...');
        try {
            const attributes = await fetchCurrentUserAttributes();
            if (attributes) {
                console.log('Successfully fetched attributes post-confirmation:', attributes);
            } else {
                console.log('Fetched attributes returned null/empty post-confirmation.');
            }
        } catch (attrError) {
            console.warn('Error fetching attributes post-confirmation (continuing...):', attrError);
        }

        setIsLoading(false);
        Alert.alert(
            'Account Confirmed!',
            'Your account has been successfully confirmed. Please log in to continue.',
            [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ],
            { cancelable: false }
        );

    } catch (err: any) {
        setIsLoading(false);
        console.error('Error during confirmation:', err);
        if (err.name === 'CodeMismatchException') { setError('Invalid confirmation code.'); }
        else if (err.name === 'ExpiredCodeException') { setError('Confirmation code has expired.'); }
        else if (err.name === 'UserNotFoundException') { setError('User not found.'); setIsConfirming(false); }
        else if (err.name === 'LimitExceededException') { setError('Attempt limit exceeded.'); }
        else { setError('An error occurred during confirmation.'); }
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);
    try {
        await resendSignUp(email.trim());
        Alert.alert('Code Resent', 'A new confirmation code has been sent to your email.');
    } catch (err: any) {
        console.error('Resend code error:', err);
        setError('Failed to resend code. Please try again shortly.');
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

            {isConfirming ? (
                // Confirmation UI (keep as is)
                <>
                    <Text style={[styles.title, { color: theme.text }]}>Confirm Your Email</Text>
                    <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
                        Enter the code sent to {email}
                    </Text>
                    <Input
                        label="Confirmation Code"
                        value={confirmationCode}
                        onChangeText={setConfirmationCode}
                        placeholder="Enter 6-digit code"
                        keyboardType="numeric"
                        autoCorrect={false}
                        spellCheck={false}
                        containerStyle={styles.inputContainer}
                    />

                     {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}

                    <Button
                        title="Confirm Sign Up"
                        onPress={handleConfirmSignUp}
                        isLoading={isLoading}
                        disabled={isLoading}
                        style={styles.button}
                    />
                    <Button
                        title="Resend Code"
                        variant="ghost"
                        onPress={handleResendCode}
                        disabled={isLoading}
                        style={styles.switchButton}
                     />
                     <Button
                        title="Back to Sign Up"
                        variant="outline"
                        onPress={() => { setIsConfirming(false); setError(null); }}
                        disabled={isLoading}
                        style={styles.switchButton}
                    />
                </>
            ) : (
                // Initial Signup UI (keep as is)
                <>
                    <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
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
                        placeholder="Create a password (min. 8 characters)"
                        secureTextEntry
                        autoCorrect={false}
                        spellCheck={false}
                        containerStyle={styles.inputContainer}
                    />
                    <Input
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Enter your password again"
                        secureTextEntry
                        autoCorrect={false}
                        spellCheck={false}
                        containerStyle={styles.inputContainer}
                    />

                    {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}

                    <Button
                        title="Sign Up"
                        onPress={handleSignUp}
                        isLoading={isLoading}
                        disabled={isLoading}
                        style={styles.button}
                    />
                    <Button
                        title="Already have an account? Log In"
                        variant="ghost"
                        onPress={() => navigation.navigate('Login')}
                        disabled={isLoading}
                        style={styles.switchButton}
                    />
                </>
            )}
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    keyboardAvoidingContainer: { flex: 1 },
    scrollContainer: { flexGrow: 1, justifyContent: 'center' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center', paddingHorizontal: 10 },
    inputContainer: { width: '100%' },
    button: { marginTop: 20, width: '100%' },
    switchButton: { marginTop: 15 },
    errorText: { marginTop: 10, marginBottom: 10, textAlign: 'center', color: 'red' } // Ensure theme.error is applied if possible via inline style later
});

export default SignupScreen;