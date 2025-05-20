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
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity, Platform } from 'react-native';

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
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontFamily: theme.fontFamilyMedium,
          fontSize: 18,
        },
        contentStyle: { backgroundColor: theme.background },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: Platform.OS === 'ios' ? 16 : 0, padding:4 }}>
            <ChevronLeft size={26} color={theme.primary} />
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen
        name="WorkoutRoot"
        component={WorkoutStartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="NewWorkout" 
        component={NewWorkoutScreen} 
        options={{ title: 'Create Template' }}
      />
      <Stack.Screen 
        name="SelectTemplate" 
        component={SelectTemplateScreen} 
        options={{ title: 'Select Template' }}
      />
      <Stack.Screen 
        name="LogSession" 
        component={LogSessionScreen} 
        options={{ title: 'Log Session' }}
      />
      <Stack.Screen 
        name="AIPlan" 
        component={AIPlanScreen} 
        options={{ title: 'AI Generated Plan' }}
      />
      <Stack.Screen 
        name="CoachNotebook" 
        component={CoachNotebookScreen} 
        options={{ title: 'Coach Notebook' }}
      />
      <Stack.Screen 
        name="WorkoutHistory" 
        component={WorkoutHistoryScreen} 
        options={{ title: 'Workout History' }}
      />
    </Stack.Navigator>
  );
};

export default WorkoutNavigator; 