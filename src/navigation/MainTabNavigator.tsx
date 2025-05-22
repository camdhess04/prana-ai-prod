import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { Home, Dumbbell, User } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import WorkoutNavigator from './WorkoutNavigator';
import type { WorkoutStackParamList } from './WorkoutNavigator';
import ProfileScreen from '../screens/ProfileScreen';

// Define ParamList for the MainTabNavigator
export type MainTabParamList = {
  Home: undefined;
  Workout: NavigatorScreenParams<WorkoutStackParamList>;
  Profile: undefined;
  Explore: undefined;
  Progress: undefined;
  // Add other tab screen params here if any in the future
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.cardBackground,
          borderTopColor: theme.borderColor,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Home color={color} size={size} />;
          } else if (route.name === 'Workout') {
            return <Dumbbell color={color} size={size} />;
          } else if (route.name === 'Profile') {
            return <User color={color} size={size} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workout" component={WorkoutNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator; 