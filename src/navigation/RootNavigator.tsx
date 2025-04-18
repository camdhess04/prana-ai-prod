import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../screens/LoadingScreen';
import AuthStackNavigator from './AuthStackNavigator';
import MainTabNavigator from './MainTabNavigator';
import AISetupChatScreen from '../screens/AISetupChatScreen';

// Define the param list for the root stack
export type RootStackParamList = {
  Loading: undefined;
  Auth: undefined; // Route for AuthStackNavigator
  Main: undefined; // Route for MainTabNavigator
  AISetupChat: undefined; // Route for the setup chat
  // Add other top-level modal/full-screen routes here if needed
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user, isLoading: isAuthLoading, onboardingStatus } = useAuth();

  if (isAuthLoading || onboardingStatus === 'checking') {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          onboardingStatus === 'complete' ? (
            <Stack.Screen name="Main" component={MainTabNavigator} />
          ) : (
            <Stack.Screen name="AISetupChat" component={AISetupChatScreen} />
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator; 