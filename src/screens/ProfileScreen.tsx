import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useAppTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      console.log('Attempting sign out...');
      await signOut();
      console.log('Sign out successful (AuthContext should trigger navigation)');
    } catch (error) {
      console.error('Error signing out (mock):', error);
      Alert.alert('Error', 'Failed to sign out');
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.username || user?.attributes?.email || 'User';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.signOutButton}>
          <Text style={[styles.signOutText, { color: theme.primary }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <View style={[styles.profileCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.username, { color: theme.text }]}>{displayName}</Text>
          <Text style={[styles.email, { color: theme.secondaryText }]}>{user?.attributes?.email || 'No email'}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Toggle Theme"
            onPress={toggleTheme}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="ghost"
            style={styles.button}
            textStyle={{ color: theme.error }}
          />
        </View>
      </View>
    </View>
  );
}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  signOutButton: {
    padding: 10,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  profileCard: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
  },
}); 