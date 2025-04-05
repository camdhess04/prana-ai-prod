import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import AuthStackNavigator from './AuthStackNavigator';
import MainTabNavigator from './MainTabNavigator';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { darkTheme } from '../theme/colors';

const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  const { theme } = useAppTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Temporarily commenting out the navigationTheme
  // const navigationTheme = {
  //   dark: theme === darkTheme,
  //   colors: {
  //     primary: theme.primary,
  //     background: theme.background,
  //     card: theme.cardBackground,
  //     text: theme.text,
  //     border: theme.borderColor,
  //     notification: theme.primary,
  //   },
  // };

  return (
    <NavigationContainer>
      {user ? <MainTabNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator; 