import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const ProfileScreen = () => {
  const { theme, toggleTheme } = useAppTheme();
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      console.log('Attempting sign out...');
      await signOut();
      console.log('Sign out successful (AuthContext should trigger navigation)');
    } catch (error) {
      console.error('Error signing out (mock):', error);
      Alert.alert('Error', 'Could not log out.');
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.username || user?.attributes?.email || 'User';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Profile</Text>

      <View style={styles.infoContainer}>
        <Text style={[styles.label, { color: theme.secondaryText }]}>Logged In As:</Text>
        <Text style={[styles.emailText, { color: theme.text }]}>{displayName}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Toggle Theme"
          onPress={toggleTheme}
          variant="secondary"
          style={styles.button}
        />

        <Button
          title="Log Out"
          onPress={handleLogout}
          isLoading={isLoggingOut}
          disabled={isLoggingOut}
          variant="primary"
          style={styles.button}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  infoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  emailText: {
    fontSize: 18,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    marginBottom: 15,
  },
});

export default ProfileScreen; 