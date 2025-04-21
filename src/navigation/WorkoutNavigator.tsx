import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutStartScreen from '../screens/WorkoutStartScreen';
import NewWorkoutScreen from '../screens/NewWorkoutScreen';
import SelectTemplateScreen from '../screens/SelectTemplateScreen';
import LogSessionScreen from '../screens/LogSessionScreen';
import AIPlanScreen from '../screens/AIPlanScreen';
import CoachNotebookScreen from '../screens/CoachNotebookScreen';
import WorkoutHistoryScreen from '../screens/WorkoutHistoryScreen';
import { useAppTheme } from '../context/ThemeContext';

export type WorkoutStackParamList = {
  WorkoutRoot: undefined;
  NewWorkout: undefined;
  SelectTemplate: undefined;
  LogSession: { session: any };
  AIPlan: undefined;
  CoachNotebook: { plan: any };
  WorkoutHistory: undefined;
};

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

const WorkoutNavigator = () => {
  const { theme } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.cardBackground },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="WorkoutRoot"
        component={WorkoutStartScreen}
      />
      <Stack.Screen 
        name="NewWorkout" 
        component={NewWorkoutScreen} 
      />
      <Stack.Screen 
        name="SelectTemplate" 
        component={SelectTemplateScreen} 
      />
      <Stack.Screen 
        name="LogSession" 
        component={LogSessionScreen} 
      />
      <Stack.Screen 
        name="AIPlan" 
        component={AIPlanScreen} 
      />
      <Stack.Screen 
        name="CoachNotebook" 
        component={CoachNotebookScreen} 
      />
      <Stack.Screen 
        name="WorkoutHistory" 
        component={WorkoutHistoryScreen} 
      />
    </Stack.Navigator>
  );
};

export default WorkoutNavigator; 