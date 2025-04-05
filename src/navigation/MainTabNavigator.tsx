import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import WorkoutNavigator from './WorkoutNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import TrainerScreen from '../screens/TrainerScreen';
import { useAppTheme } from '../context/ThemeContext';
import { Home, Dumbbell, User, Bot } from 'lucide-react-native';

export type MainTabParamList = {
  Home: undefined;
  Workout: undefined;
  Trainer: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.cardBackground },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Home color={color} size={size} />;
          } else if (route.name === 'Workout') {
            return <Dumbbell color={color} size={size} />;
          } else if (route.name === 'Trainer') {
            return <Bot color={color} size={size} />;
          } else if (route.name === 'Profile') {
            return <User color={color} size={size} />;
          }
          // Fallback icon
          return <Home color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workout" component={WorkoutNavigator} />
      <Tab.Screen name="Trainer" component={TrainerScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator; 