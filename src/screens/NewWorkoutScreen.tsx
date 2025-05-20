// src/screens/NewWorkoutScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import workoutService from '../services/workoutService';
import { Exercise } from '../types/workout';
import uuid from 'react-native-uuid';
import { PlusCircle, Trash2, Save } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../navigation/WorkoutNavigator';

// Local type matching the expected structure for workoutService.saveTemplate
interface TemplateDataToSave {
    userId: string;
    name: string;
    description?: string | null;
    exercises: Exercise[];
    owner: string;
    isAIPlan?: boolean | null;
}

type NewWorkoutScreenProps = NativeStackScreenProps<WorkoutStackParamList, 'NewWorkout'>;

const NewWorkoutScreen: React.FC<NewWorkoutScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const authUserId = user?.userId ?? 'anonymous';

  const [workoutName, setWorkoutName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: uuid.v4().toString(), name: '', sets: '', reps: '', weight: '', restPeriod: null, note: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { flexGrow: 1 },
    content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
    screenTitle: {
      fontSize: 26, 
      fontFamily: theme.fontFamilyBold,
      color: theme.text,
      marginBottom: 8,
    },
    screenSubtitle: {
      fontSize: 16, 
      fontFamily: theme.fontFamilyRegular,
      color: theme.secondaryText, 
      marginBottom: 24, 
      lineHeight: 22,
    },
    fieldGroup: { marginBottom: 20 },
    label: { 
      fontFamily: theme.fontFamilyMedium,
      color: theme.secondaryText, 
      fontSize: 14, 
      marginBottom: 8, 
    },
    exerciseCard: { 
      marginBottom: 24, 
    },
    exerciseHeader: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: 16, 
    },
    exerciseTitle: { 
      fontSize: 19, 
      fontFamily: theme.fontFamilyMonoMedium,
      color: theme.text, 
    },
    row: { 
      flexDirection: 'row', 
      gap: 16,
      marginBottom: 0,
    },
    inputInRow: { 
      flex: 1, 
    },
    actionButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 16,
        gap: 16,
    },
    addExerciseButton: {
        flex: 1,
    },
    saveTemplateButton: {
        flex: 1,
    },
    buttonText: {
        fontFamily: theme.fontFamilyMedium,
    }
  });

  const addExercise = () => {
    setExercises([...exercises, { id: uuid.v4().toString(), name: '', sets: '', reps: '', weight: '', restPeriod: null, note: '' }]);
  };

  const updateExerciseField = (id: string, field: keyof Exercise, value: string | number | null) => {
    setExercises(current => current.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  const removeExercise = (id: string) => {
    if (exercises.length <= 1) { Alert.alert('Cannot Remove', 'A workout template must have at least one exercise.'); return; }
    setExercises(current => current.filter(ex => ex.id !== id));
  };

  const saveWorkout = async () => {
    if (!workoutName.trim()) { Alert.alert('Missing Name', 'Please enter a name for your workout template.'); return; }
    if (exercises.some(ex => !ex.name.trim())) { Alert.alert('Missing Exercise Name', 'Please ensure all exercises have a name.'); return; }
    if (authUserId === 'anonymous') { Alert.alert('Authentication Error', 'Valid User ID not found. Cannot save template.'); return; }

    setIsLoading(true);
    const templateToSave: TemplateDataToSave = {
      userId: authUserId,
      name: workoutName.trim(),
      description: description.trim() || null,
      exercises: exercises.map(ex => ({ 
        ...ex, 
        sets: ex.sets || null, 
        reps: ex.reps || null, 
        weight: ex.weight || null, 
        note: ex.note || null,
        restPeriod: ex.restPeriod ? parseInt(String(ex.restPeriod), 10) : null 
      })), 
      owner: authUserId,
      isAIPlan: false,
    };

    try {
      await workoutService.saveTemplate(templateToSave);
      Alert.alert('Success', 'Workout template saved!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      console.error('Error saving workout template:', error);
      Alert.alert('Error', 'Could not save workout template. '+ (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.screenTitle}>Create New Template</Text>
        <Text style={styles.screenSubtitle}>Design your custom workout plan. Add exercises and set your targets.</Text>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Template Name</Text>
          <Input value={workoutName} onChangeText={setWorkoutName} placeholder="e.g., Leg Day Annihilation" />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <Input value={description} onChangeText={setDescription} placeholder="e.g., Quads, hams, glutes, and calves focus." multiline />
        </View>

        {exercises.map((exercise, index) => (
          <Card key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseTitle}>Exercise {index + 1}</Text>
              {exercises.length > 1 && (
                <TouchableOpacity onPress={() => removeExercise(exercise.id)} hitSlop={{top:10, bottom:10, left:10, right:10}}>
                    <Trash2 size={20} color={theme.error} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Exercise Name</Text>
              <Input value={exercise.name} onChangeText={(value) => updateExerciseField(exercise.id, 'name', value)} placeholder="e.g., Barbell Squats" />
            </View>
            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.inputInRow]}>
                <Text style={styles.label}>Sets</Text>
                <Input value={String(exercise.sets ?? '')} onChangeText={(value) => updateExerciseField(exercise.id, 'sets', value)} placeholder="e.g., 3" keyboardType="numeric" />
              </View>
              <View style={[styles.fieldGroup, styles.inputInRow]}>
                <Text style={styles.label}>Reps</Text>
                <Input value={String(exercise.reps ?? '')} onChangeText={(value) => updateExerciseField(exercise.id, 'reps', value)} placeholder="e.g., 10" keyboardType="numeric" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.inputInRow]}>
                <Text style={styles.label}>Weight (kg/lb)</Text>
                <Input value={String(exercise.weight || '')} onChangeText={(value) => updateExerciseField(exercise.id, 'weight', value)} placeholder="e.g., 100" keyboardType="numeric" />
              </View>
              <View style={[styles.fieldGroup, styles.inputInRow]}>
                <Text style={styles.label}>Rest (sec)</Text>
                <Input value={String(exercise.restPeriod || '')} onChangeText={(value) => updateExerciseField(exercise.id, 'restPeriod', value)} placeholder="e.g., 90" keyboardType="numeric" />
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <Input value={exercise.note || ''} onChangeText={(value) => updateExerciseField(exercise.id, 'note', value)} placeholder="e.g., Focus on depth" multiline />
            </View>
          </Card>
        ))}
        <View style={styles.actionButtonRow}>
            <Button 
                title="Add Exercise" 
                variant="outline" 
                onPress={addExercise} 
                style={styles.addExerciseButton} 
                icon={<PlusCircle size={18} color={theme.primary}/>} 
                textStyle={styles.buttonText}
                fullWidth={false}
            />
            <Button 
                title="Save Template" 
                onPress={saveWorkout} 
                isLoading={isLoading} 
                style={styles.saveTemplateButton} 
                icon={<Save size={18} color={theme.primaryButtonText}/>} 
                textStyle={styles.buttonText} 
                fullWidth={false}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewWorkoutScreen;