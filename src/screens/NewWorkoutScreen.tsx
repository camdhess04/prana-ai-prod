import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { Exercise } from '../types/workout';
import uuid from 'react-native-uuid';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../navigation/WorkoutNavigator';

type NewWorkoutScreenProps = NativeStackScreenProps<WorkoutStackParamList, 'NewWorkout'>;

const NewWorkoutScreen: React.FC<NewWorkoutScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const userId = user?.userId;

  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: uuid.v4().toString(), name: '', sets: '', reps: '', weight: '', note: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addExercise = () => {
    setExercises([
      ...exercises,
      { id: uuid.v4().toString(), name: '', sets: '', reps: '', weight: '', note: '' }
    ]);
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string) => {
    setExercises(currentExercises =>
      currentExercises.map(exercise =>
        exercise.id === id ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const removeExercise = (id: string) => {
    if (exercises.length <= 1) {
      Alert.alert('Cannot Remove', 'You need at least one exercise in your workout.');
      return;
    }
    setExercises(currentExercises =>
      currentExercises.filter(exercise => exercise.id !== id)
    );
  };

  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Missing Information', 'Please enter a name for your workout template.');
      return;
    }

    const hasNamedExercise = exercises.some(exercise => exercise.name.trim() !== '');
    if (!hasNamedExercise) {
      Alert.alert('Missing Information', 'Please enter a name for at least one exercise.');
      return;
    }

    const exercisesToSave = exercises.filter(ex => ex.name.trim() !== '');
    if(exercisesToSave.length === 0) {
      Alert.alert('Missing Information', 'Please add details to at least one exercise.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting to save workout template (mocked):');
      console.log('UserId:', userId);
      console.log('Workout Name:', workoutName);
      console.log('Exercises:', JSON.stringify(exercisesToSave, null, 2));

      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert(
        'Workout Saved (Mock)',
        'Your workout template structure has been logged to the console.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving workout (mock):', error);
      Alert.alert('Error', 'Failed to save workout (mock). Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Input
        label="Workout Template Name"
        value={workoutName}
        onChangeText={setWorkoutName}
        placeholder="e.g., Upper Body Strength"
        containerStyle={{ marginBottom: 16 }}
      />

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Exercises</Text>

      {exercises.map((exercise, index) => (
        <Card key={exercise.id} style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={[styles.exerciseTitle, { color: theme.text }]}>
              Exercise {index + 1}
            </Text>
            {exercises.length > 1 && (
              <Button
                title="Remove"
                variant="ghost"
                size="small"
                onPress={() => removeExercise(exercise.id)}
                style={styles.removeButton}
                textStyle={{ color: theme.error }}
              />
            )}
          </View>

          <Input
            label="Exercise Name"
            value={exercise.name}
            onChangeText={(value) => updateExercise(exercise.id, 'name', value)}
            placeholder="e.g., Bench Press"
          />

          <View style={styles.row}>
            <Input
              label="Sets"
              value={String(exercise.sets)}
              onChangeText={(value) => updateExercise(exercise.id, 'sets', value)}
              placeholder="e.g., 3"
              keyboardType="numeric"
              containerStyle={styles.input}
            />

            <Input
              label="Reps"
              value={String(exercise.reps)}
              onChangeText={(value) => updateExercise(exercise.id, 'reps', value)}
              placeholder="e.g., 8-12"
              containerStyle={styles.input}
            />

            <Input
              label="Weight (kg/lb)"
              value={String(exercise.weight || '')}
              onChangeText={(value) => updateExercise(exercise.id, 'weight', value)}
              placeholder="e.g., 60"
              keyboardType="numeric"
              containerStyle={styles.input}
            />
          </View>

          <Input
            label="Notes (Optional)"
            value={exercise.note || ''}
            onChangeText={(value) => updateExercise(exercise.id, 'note', value)}
            placeholder="e.g., Focus on form"
            multiline
            numberOfLines={2}
          />
        </Card>
      ))}

      <Button
        title="Add Exercise"
        variant="outline"
        onPress={addExercise}
        style={styles.addButton}
      />

      <Button
        title="Save Workout Template"
        onPress={saveWorkout}
        isLoading={isLoading}
        style={styles.saveButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
  },
  exerciseCard: {
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    marginRight: -8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
  },
  input: {
    flex: 1,
  },
  addButton: {
    marginTop: 0,
    marginBottom: 24,
  },
  saveButton: {
    marginBottom: 30,
  },
});

export default NewWorkoutScreen; 