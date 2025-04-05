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
        headerStyle: { backgroundColor: theme.cardBackground },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="WorkoutRoot"
        component={WorkoutStartScreen}
        options={{ title: 'Workout Hub' }}
      />
      <Stack.Screen name="NewWorkout" component={NewWorkoutScreen} options={{ title: 'Create Workout' }} />
      <Stack.Screen name="SelectTemplate" component={SelectTemplateScreen} options={{ title: 'Select Template' }} />
      <Stack.Screen name="LogSession" component={LogSessionScreen} options={{ title: 'Log Session' }} />
      <Stack.Screen name="AIPlan" component={AIPlanScreen} options={{ title: 'AI Workout Plan' }} />
      <Stack.Screen name="CoachNotebook" component={CoachNotebookScreen} options={{ title: 'Coach Notebook' }} />
      <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} options={{ title: 'Workout History' }} />
    </Stack.Navigator>
  );
};

export default WorkoutNavigator; 