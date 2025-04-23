// src/screens/LogSessionScreen.tsx
// V1.5 Update: Initialize from route.params.template, add RPE/Notes logging, pass scheduledWorkoutId to saveSession

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity, Platform, UIManager, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { Exercise as LocalExercise, LogExercise, PerformedSet, WorkoutSession, WorkoutTemplate } from '../types/workout'; // Use local types where appropriate
import workoutService from '../services/workoutService';
import { Clock, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../navigation/WorkoutNavigator'; // Ensure this ParamList defines LogSession params
import uuid from 'react-native-uuid';

// Define the expected parameters passed to this screen
// Adjust Exercise structure if needed based on what HomeScreen passes
type LogSessionParams = {
    template: WorkoutTemplate; // Expecting the full local WorkoutTemplate type
    scheduledWorkoutId: string;
};

// Type guard for route params
function hasLogSessionParams(params: any): params is LogSessionParams {
    return params && typeof params === 'object' && 'template' in params && 'scheduledWorkoutId' in params;
}


// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type LogSessionScreenProps = NativeStackScreenProps<WorkoutStackParamList, 'LogSession'>;


const LogSessionScreen: React.FC<LogSessionScreenProps> = ({ route, navigation }) => {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const userId = user?.userId;
  const username = user?.username || userId; // Use username if available for owner

  // State
  const [workoutName, setWorkoutName] = useState<string>('New Session');
  const [logExercises, setLogExercises] = useState<LogExercise[]>([]); // State to hold exercises being logged
  const [scheduledWorkoutId, setScheduledWorkoutId] = useState<string | null>(null); // State for the schedule ID
  const [templateId, setTemplateId] = useState<string | undefined>(undefined); // Store original template ID
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null); // Keep track of expanded exercise

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // --- Initialize State from Route Params ---
  useEffect(() => {
    console.log('LogSessionScreen Mounted. Processing route.params...');
    if (hasLogSessionParams(route.params)) {
        const { template, scheduledWorkoutId: schedId } = route.params;
        console.log('Received Template:', template?.name, 'Schedule ID:', schedId);

        setWorkoutName(template.name || 'Workout Session');
        setTemplateId(template.id); // Store the original template ID
        setScheduledWorkoutId(schedId); // Store the schedule ID

        // Map template exercises to initial LogExercise state
        const initialExercises: LogExercise[] = (template.exercises || []).map((ex: LocalExercise): LogExercise => ({
            id: ex.id, // Use the exercise definition ID
            name: ex.name,
            targetSets: ex.sets ?? '', // Target sets from template
            targetReps: ex.reps ?? '', // Target reps from template
            targetWeight: ex.weight ?? '', // Target weight from template
            targetRest: ex.restPeriod,
            note: ex.note,
            performedSets: [], // Start with empty performed sets
        }));
        setLogExercises(initialExercises);
        console.log(`Initialized ${initialExercises.length} exercises for logging.`);

    } else {
         console.error("LogSessionScreen: Invalid or missing route params!", route.params);
         Alert.alert("Error", "Could not load workout details.", [{ text: "OK", onPress: () => navigation.goBack() }]);
    }
  }, [route.params]); // Rerun if route params change (should only be once)

  // --- Timer Effect ---
  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => { // Cleanup interval on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // Run timer effect only once on mount

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Set Manipulation Functions ---
  const addSet = (exerciseId: string) => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate adding set
    setLogExercises(currentExercises =>
      currentExercises.map(ex => {
        if (ex.id === exerciseId) {
          // Try to copy reps/weight from the previous set, or fall back to target/empty
          const lastSet = ex.performedSets[ex.performedSets.length - 1];
          const newSet: PerformedSet = {
            id: uuid.v4(), // Use uuid directly
            reps: lastSet?.reps ?? null, // Start with previous reps or null
            weight: lastSet?.weight ?? null, // Start with previous weight or null
            rpe: undefined, // Start RPE/Notes as empty
            notes: undefined,
          };
          return { ...ex, performedSets: [...ex.performedSets, newSet] };
        }
        return ex;
      })
    );
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof PerformedSet, value: string | number | undefined) => {
     // Ensure value is string for reps/weight/notes, number for rpe before setting state
     let processedValue: string | number | null | undefined = value;
     if (field === 'rpe') {
         processedValue = typeof value === 'string' ? parseInt(value, 10) : value;
         if (isNaN(processedValue as number)) processedValue = undefined; // Handle invalid number parse
     }
     // Reps and weight should remain strings based on local type, notes too
      if (field === 'reps' || field === 'weight' || field === 'notes') {
          processedValue = value?.toString() ?? null; // Ensure string or null
      }


    setLogExercises(currentExercises =>
      currentExercises.map(ex => {
        if (ex.id === exerciseId) {
          const updatedSets = ex.performedSets.map(set =>
            set.id === setId ? { ...set, [field]: processedValue } : set
          );
          return { ...ex, performedSets: updatedSets };
        }
        return ex;
      })
    );
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate deleting set
     setLogExercises(currentExercises =>
      currentExercises.map(ex => {
        if (ex.id === exerciseId) {
          const updatedSets = ex.performedSets.filter(set => set.id !== setId);
          return { ...ex, performedSets: updatedSets };
        }
        return ex;
      })
    );
  };

  const toggleExpandExercise = (exerciseId: string) => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate expand/collapse
    setExpandedExerciseId(currentId => (currentId === exerciseId ? null : exerciseId));
  };

  // --- Save Workout Logic ---
  const validateWorkout = (): boolean => {
    const hasPerformedSet = logExercises.some(ex =>
        ex.performedSets.length > 0 &&
        ex.performedSets.some(set => (set.reps?.trim() ?? '') !== '' || (set.weight?.trim() ?? '') !== '')
    );
    if (!hasPerformedSet) {
      Alert.alert('Log Performance', 'Please log reps or weight for at least one set.');
      return false;
    }
    return true;
  };

  const completeWorkout = async () => {
    if (!validateWorkout() || !userId || !username) {
        if (!userId || !username) Alert.alert("Error", "User identity not found. Cannot save session.");
        return;
    }

    setIsLoading(true);
    if (timerRef.current) {
      clearInterval(timerRef.current); // Stop timer
    }

    try {
      // Prepare data structure matching SaveSessionData type in workoutService
      const sessionToSave = {
        userId: userId,
        owner: username, // Pass owner derived from user context
        templateId: templateId, // Pass original template ID
        scheduledWorkoutId: scheduledWorkoutId, // Pass the ID received from params
        name: workoutName,
        // Pass the current state of logExercises directly (service maps it internally now)
        exercises: logExercises,
        duration: elapsedTime,
        completedAt: new Date().toISOString(), // Use current time as completion time
      };

      console.log("Attempting to save session with data:", JSON.stringify(sessionToSave, null, 2));
      await workoutService.saveSession(sessionToSave); // Call service with correct data structure

      Alert.alert(
        'Workout Complete!',
        'Your session has been logged successfully.',
        // Navigate back to the Workout Hub or Home after saving
        [{ text: 'OK', onPress: () => navigation.navigate('WorkoutRoot') }]
      );
    } catch (error: any) {
      console.error('Error completing workout:', error);
      Alert.alert('Error', `Failed to log workout session: ${error.message || 'Unknown error'}`);
      // Don't reset isLoading if save fails, allow retry? Or reset it? Reset for now.
       setIsLoading(false);
      // Restart timer if needed? For now, it stays stopped.
    }
     // Do not set isLoading false here if success navigation happens
  };

  // --- Rendering ---

  // Memoize summary calculation? Not strictly needed unless performance issues arise.
  const getExerciseSummary = (exercise: LogExercise) => {
    // ... (keep existing summary logic, ensure it handles string reps/weight) ...
    const setCount = exercise.performedSets.length;
    let loggedSetsCount = 0;
    let totalReps = 0;
    let totalVolume = 0; // Volume = reps * weight

    exercise.performedSets.forEach(set => {
        const reps = parseInt(set.reps ?? '0', 10); // Use '0' if null/empty
        const weight = parseFloat(set.weight ?? '0'); // Use '0' if null/empty
        let setLogged = false;
        if (!isNaN(reps) && reps > 0) {
            totalReps += reps;
            setLogged = true;
        }
         if (!isNaN(weight) && weight > 0) {
            totalVolume += (isNaN(reps) || reps <= 0 ? 1 : reps) * weight; // Add weight even if reps=0? Or use reps if > 0? Use reps if > 0.
             // totalVolume += (reps > 0 ? reps : 1) * weight; // Alt: assume 1 rep if weight logged but reps aren't
            setLogged = true;
        }
        if(setLogged) loggedSetsCount++;
    });

    const avgReps = loggedSetsCount > 0 ? Math.round(totalReps / loggedSetsCount * 10) / 10 : 0;
    // Avg weight calculation might be less meaningful, maybe show max weight or total volume?
    // Let's just show set count for now.
    // const avgWeight = validWeightSets > 0 ? Math.round(totalWeight / validWeightSets * 10) / 10 : 0;

    return { setCount: loggedSetsCount, avgReps };
  };

  // Show loading indicator until exercises are initialized
  if (logExercises.length === 0 && !route.params) { // Or use a separate loading state
      return (
          <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.text }]}>Loading Workout...</Text>
          </View>
      );
  }


  return (
    // Use KeyboardAvoidingView for better input handling
    <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust offset if needed
    >
      <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
        <Text style={[styles.title, { color: theme.text }]}>{workoutName}</Text>
        <View style={styles.timerContainer}>
          <Clock size={16} color={theme.secondaryText} />
          <Text style={[styles.timer, { color: theme.text }]}>
            {formatTime(elapsedTime)}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {logExercises.map((exercise, index) => {
           const summary = getExerciseSummary(exercise); // Calculate summary based on performedSets
           const isExpanded = expandedExerciseId === exercise.id;
           return (
            <Card key={exercise.id} style={styles.exerciseCard}>
              {/* Exercise Header */}
              <TouchableOpacity onPress={() => toggleExpandExercise(exercise.id)} activeOpacity={0.7} style={styles.exerciseHeaderTouchable}>
                <View style={styles.exerciseHeader}>
                    <View style={styles.exerciseHeaderInfo}>
                        <Text style={[styles.exerciseName, { color: theme.text }]}>
                           {index + 1}. {exercise.name}
                        </Text>
                         {/* Display TARGET sets/reps if available */}
                         {(exercise.targetSets || exercise.targetReps) && (
                            <Text style={[styles.summaryText, { color: theme.secondaryText }]}>
                                Target: {exercise.targetSets || '?'} sets x {exercise.targetReps || '?'} reps
                            </Text>
                         )}
                         {/* Display LOGGED summary if sets exist */}
                         {summary.setCount > 0 && (
                             <Text style={[styles.summaryText, { color: theme.secondaryText, marginTop: 2 }]}>
                                 Logged: {summary.setCount} sets {summary.avgReps > 0 ? `| Avg: ${summary.avgReps} reps` : ''}
                             </Text>
                         )}
                    </View>
                    {isExpanded ? <ChevronUp color={theme.primary} size={20} /> : <ChevronDown color={theme.secondaryText} size={20}/>}
                </View>
              </TouchableOpacity>

              {/* Sets Container (Expanded) */}
              {isExpanded && (
                <View style={styles.setsContainer}>
                  {/* Header Row */}
                  {exercise.performedSets.length > 0 && (
                     <View style={styles.setRowHeader}>
                         <Text style={[styles.setHeaderLabel, { color: theme.secondaryText}]}>Set</Text>
                         <Text style={[styles.setHeaderLabel, styles.inputHeaderLabel, { color: theme.secondaryText}]}>Weight (lbs)</Text>
                         <Text style={[styles.setHeaderLabel, styles.inputHeaderLabel, { color: theme.secondaryText}]}>Reps</Text>
                         <Text style={[styles.setHeaderLabel, styles.inputHeaderLabel, { color: theme.secondaryText}]}>RPE</Text>
                         <Text style={[styles.setHeaderLabel, styles.notesHeaderLabel, { color: theme.secondaryText}]}>Notes</Text>
                         <View style={styles.deleteHeaderPlaceholder} />{/* Placeholder for alignment */}
                     </View>
                  )}
                  {/* Performed Sets List */}
                  {exercise.performedSets.map((set, setIndex) => (
                    <View key={set.id} style={styles.setRow}>
                       <Text style={[styles.setLabel, { color: theme.text }]}>{setIndex + 1}</Text>
                       {/* Weight Input */}
                       <View style={styles.setInputGroup}>
                           <TextInput
                                style={[styles.setInput, { backgroundColor: theme.cardBackground, color: theme.text, borderColor: theme.borderColor }]}
                                value={set.weight ?? ''} // Use ?? '' for controlled input
                                onChangeText={value => updateSet(exercise.id, set.id, 'weight', value)}
                                placeholder="-"
                                placeholderTextColor={theme.secondaryText}
                                keyboardType="numeric"
                                selectTextOnFocus // Improve UX
                            />
                       </View>
                       {/* Reps Input */}
                       <View style={styles.setInputGroup}>
                            <TextInput
                                style={[styles.setInput, { backgroundColor: theme.cardBackground, color: theme.text, borderColor: theme.borderColor }]}
                                value={set.reps ?? ''} // Use ?? '' for controlled input
                                onChangeText={value => updateSet(exercise.id, set.id, 'reps', value)}
                                placeholder="-"
                                placeholderTextColor={theme.secondaryText}
                                keyboardType="numeric"
                                selectTextOnFocus
                            />
                       </View>
                       {/* RPE Input */}
                       <View style={styles.setInputGroup}>
                            <TextInput
                                style={[styles.setInput, { backgroundColor: theme.cardBackground, color: theme.text, borderColor: theme.borderColor }]}
                                value={set.rpe?.toString() ?? ''} // Handle potential number type
                                onChangeText={value => updateSet(exercise.id, set.id, 'rpe', value)}
                                placeholder="-"
                                placeholderTextColor={theme.secondaryText}
                                keyboardType="numeric"
                                maxLength={2} // RPE 1-10
                                selectTextOnFocus
                            />
                       </View>
                       {/* Notes Input */}
                        <View style={[styles.setInputGroup, styles.notesInputGroup]}>
                            <TextInput
                                style={[styles.setInput, styles.notesInput, { backgroundColor: theme.cardBackground, color: theme.text, borderColor: theme.borderColor }]}
                                value={set.notes ?? ''}
                                onChangeText={value => updateSet(exercise.id, set.id, 'notes', value)}
                                placeholder="-"
                                placeholderTextColor={theme.secondaryText}
                                multiline // Allow multiple lines for notes
                            />
                       </View>
                       {/* Delete Button */}
                       <TouchableOpacity onPress={() => deleteSet(exercise.id, set.id)} style={styles.deleteSetButton}>
                            <Trash2 color={theme.error} size={18} />
                       </TouchableOpacity>
                    </View>
                  ))}
                  {/* Add Set Button */}
                  <Button
                    title="Add Set"
                    onPress={() => addSet(exercise.id)}
                    variant="ghost" // Use ghost or outline
                    size="small"
                    icon={<Plus size={16} color={theme.primary} />}
                    style={styles.addSetButton}
                    textStyle={{ color: theme.primary }} // Style text for ghost button
                  />
                </View>
              )}
            </Card>
           );
        })}
      </ScrollView>

      {/* Footer / Complete Button */}
      <View style={[styles.footer, { borderTopColor: theme.borderColor, backgroundColor: theme.cardBackground } ]}>
        <Button
          title="Complete Workout"
          onPress={completeWorkout}
          isLoading={isLoading}
          style={styles.completeButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

// --- Styles (Minor adjustments needed for new inputs) ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  loadingText: { marginTop: 10, fontSize: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 20, fontWeight: '600' },
  timerContainer: { flexDirection: 'row', alignItems: 'center' },
  timer: { marginLeft: 6, fontSize: 16, fontWeight: '500', fontVariant: ['tabular-nums'] },
  content: { padding: 16, paddingBottom: 120 }, // Increased paddingBottom for footer overlap
  exerciseCard: { marginBottom: 16, padding: 0 }, // Remove padding from card itself
  exerciseHeaderTouchable: { padding: 16 }, // Add padding to touchable area
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exerciseHeaderInfo: { flex: 1, marginRight: 10 },
  exerciseName: { fontSize: 18, fontWeight: '600', marginBottom: 4 }, // Reduced margin
  summaryText: { fontSize: 13, },
  setsContainer: { paddingTop: 12, paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#EEEEEE', marginTop: 12 }, // Use theme color?
  setRowHeader: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 5, alignItems: 'center', gap: 8 }, // Add gap
  setHeaderLabel: { flex: 0.7, fontSize: 12, textAlign: 'center'}, // Adjust flex basis
  inputHeaderLabel: { flex: 1, textAlign: 'center'},
  notesHeaderLabel: { flex: 1.5, textAlign: 'center'}, // Wider for notes
  deleteHeaderPlaceholder: { width: 28 }, // Match delete button width
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 }, // Add gap
  setLabel: { width: 30, fontSize: 14, textAlign: 'center', marginRight: 5 }, // Adjusted width/margin
  setInputGroup: { flex: 1, borderWidth: 1, borderRadius: 6, }, // Simplified border/padding
  notesInputGroup: { flex: 1.5 }, // Make notes wider
  setInput: { paddingVertical: 8, paddingHorizontal: 4, fontSize: 14, textAlign: 'center', },
  notesInput: { textAlign: 'left', }, // Align notes left
  // inputUnits: { fontSize: 14, marginLeft: 4 }, // Removed units text for now
  deleteSetButton: { padding: 5 }, // Removed margin
  addSetButton: { marginTop: 10, alignSelf: 'center' }, // Center button
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, paddingBottom: 30 }, // Consider safe area
  completeButton: { /* No specific style needed? */ },
});

export default LogSessionScreen;