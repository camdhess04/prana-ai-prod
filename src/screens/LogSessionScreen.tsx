import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { LogExercise, PerformedSet, WorkoutSession } from '../types/workout';
import workoutService from '../services/workoutService';
import { Clock, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../navigation/WorkoutNavigator';
import uuid from 'react-native-uuid';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type LogSessionScreenProps = NativeStackScreenProps<WorkoutStackParamList, 'LogSession'>;

type SessionRouteParam = {
     templateId?: string;
     userId: string;
     name: string;
     exercises: LogExercise[];
}

const LogSessionScreen: React.FC<LogSessionScreenProps> = ({ route, navigation }) => {
  // Add debug logging for route params
  console.log('LogSession route.params:', JSON.stringify(route.params, null, 2));

  const initialSessionData = route.params?.session as SessionRouteParam;

  const { theme } = useAppTheme();
  const { user } = useAuth();
  const userId = user?.userId;

  const [workoutName, setWorkoutName] = useState(initialSessionData?.name || 'New Session');
  const [exercises, setExercises] = useState<LogExercise[]>(
      initialSessionData?.exercises?.map(ex => ({ ...ex, performedSets: ex.performedSets || [] })) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addSet = (exerciseId: string) => {
    setExercises(currentExercises =>
      currentExercises.map(ex => {
        if (ex.id === exerciseId) {
          const lastSet = ex.performedSets[ex.performedSets.length - 1];
          const newSet: PerformedSet = {
            id: uuid.v4().toString(),
            reps: lastSet?.reps || String(ex.targetReps || ''),
            weight: lastSet?.weight || String(ex.weight || ''),
          };
          return { ...ex, performedSets: [...ex.performedSets, newSet] };
        }
        return ex;
      })
    );
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof PerformedSet, value: string) => {
    setExercises(currentExercises =>
      currentExercises.map(ex => {
        if (ex.id === exerciseId) {
          const updatedSets = ex.performedSets.map(set =>
            set.id === setId ? { ...set, [field]: value } : set
          );
          return { ...ex, performedSets: updatedSets };
        }
        return ex;
      })
    );
  };

  const deleteSet = (exerciseId: string, setId: string) => {
     setExercises(currentExercises =>
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
    setExpandedExerciseId(currentId => currentId === exerciseId ? null : exerciseId);
  };

  const validateWorkout = () => {
    const hasPerformedSet = exercises.some(ex => ex.performedSets.length > 0 && ex.performedSets.some(set => String(set.reps).trim() || String(set.weight).trim()));
    if (!hasPerformedSet) {
      Alert.alert('Log Performance', 'Please log reps or weight for at least one set in an exercise.');
      return false;
    }
    return true;
  };

  const completeWorkout = async () => {
    if (!validateWorkout() || !userId) {
        if (!userId) Alert.alert("Error", "User ID not found.");
        return;
    }

    setIsLoading(true);
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const completedSessionData: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt' | '_version' | '_lastChangedAt' | '_deleted'> = {
        userId: userId,
        templateId: initialSessionData?.templateId,
        name: workoutName,
        exercises: exercises.map(ex => ({
            id: ex.id,
            name: ex.name,
            sets: ex.targetSets || ex.sets,
            reps: ex.targetReps || ex.reps,
            weight: ex.weight,
            restPeriod: ex.restPeriod,
            note: ex.note,
            performedSets: ex.performedSets
        })) as any,
        duration: elapsedTime,
        completedAt: new Date().toISOString(),
        owner: user?.username || userId
      };

      console.log("Attempting to save session:", completedSessionData);
      await workoutService.saveSession(completedSessionData);

      Alert.alert(
        'Workout Complete!',
        'Session logged locally (Cloud save TBD).',
        [{ text: 'OK', onPress: () => navigation.popToTop() }]
      );
    } catch (error: any) {
      console.error('Error completing workout:', error);
      Alert.alert('Error', `Failed to log workout session: ${error.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const getExerciseSummary = (exercise: LogExercise) => {
    const setCount = exercise.performedSets.length;
    let totalReps = 0;
    let totalWeight = 0;
    let validWeightSets = 0;

    exercise.performedSets.forEach(set => {
        const reps = parseInt(set.reps, 10);
        const weight = parseFloat(set.weight);
        if (!isNaN(reps)) totalReps += reps;
        if (!isNaN(weight) && weight > 0) {
            totalWeight += weight * (isNaN(reps) ? 1 : reps);
            totalWeight += weight;
            validWeightSets++;
        }
    });

    const avgReps = setCount > 0 ? Math.round(totalReps / setCount * 10) / 10 : 0;
    const avgWeight = validWeightSets > 0 ? Math.round(totalWeight / validWeightSets * 10) / 10 : 0;

    return { setCount, avgReps, avgWeight };
};

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
        <Text style={[styles.title, { color: theme.text }]}>{workoutName}</Text>
        <View style={styles.timerContainer}>
          <Clock size={16} color={theme.text} />
          <Text style={[styles.timer, { color: theme.text }]}>
            {formatTime(elapsedTime)}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {exercises.map((exercise, index) => {
           const summary = getExerciseSummary(exercise);
           const isExpanded = expandedExerciseId === exercise.id;
           return (
            <Card key={exercise.id} style={styles.exerciseCard}>
              <TouchableOpacity onPress={() => toggleExpandExercise(exercise.id)} activeOpacity={0.7}>
                <View style={styles.exerciseHeader}>
                    <View style={styles.exerciseHeaderInfo}>
                        <Text style={[styles.exerciseName, { color: theme.text }]}>
                        {index + 1}. {exercise.name}
                        </Text>
                        <Text style={[styles.summaryText, { color: theme.secondaryText }]}>
                            Target: {exercise.targetSets || '?'} sets x {exercise.targetReps || '?'} reps
                            {summary.setCount > 0 && ` | Logged: ${summary.setCount} sets`}
                            {summary.avgReps > 0 && ` | Avg: ${summary.avgReps} reps`}
                            {summary.avgWeight > 0 && ` | Avg: ${summary.avgWeight} ${'lbs'/* Add unit later */}`}
                        </Text>
                    </View>
                    {isExpanded ? <ChevronUp color={theme.primary} /> : <ChevronDown color={theme.secondaryText} />}
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.setsContainer}>
                  {exercise.performedSets.map((set, setIndex) => (
                    <View key={set.id} style={styles.setRow}>
                       <Text style={[styles.setLabel, { color: theme.secondaryText }]}>Set {setIndex + 1}</Text>
                       <View style={styles.setInputGroup}>
                           <TextInput
                                style={[styles.setInput, { backgroundColor: theme.cardBackground, color: theme.text, borderColor: theme.borderColor }]}
                                value={set.weight}
                                onChangeText={value => updateSet(exercise.id, set.id, 'weight', value)}
                                placeholder="Weight"
                                placeholderTextColor={theme.secondaryText}
                                keyboardType="numeric"
                            />
                            <Text style={[styles.inputUnits, {color: theme.secondaryText}]}>lbs</Text>
                       </View>
                       <View style={styles.setInputGroup}>
                            <TextInput
                                style={[styles.setInput, { backgroundColor: theme.cardBackground, color: theme.text, borderColor: theme.borderColor }]}
                                value={set.reps}
                                onChangeText={value => updateSet(exercise.id, set.id, 'reps', value)}
                                placeholder="Reps"
                                placeholderTextColor={theme.secondaryText}
                                keyboardType="numeric"
                            />
                             <Text style={[styles.inputUnits, {color: theme.secondaryText}]}>reps</Text>
                       </View>
                       <TouchableOpacity onPress={() => deleteSet(exercise.id, set.id)} style={styles.deleteSetButton}>
                            <Trash2 color={theme.error} size={18} />
                       </TouchableOpacity>
                    </View>
                  ))}
                  <Button
                    title="Add Set"
                    onPress={() => addSet(exercise.id)}
                    variant="outline"
                    size="small"
                    icon={<Plus size={16} color={theme.primary} />}
                    style={styles.addSetButton}
                  />
                </View>
              )}
            </Card>
           );
        })}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.borderColor, backgroundColor: theme.background } ]}>
        <Button
          title="Complete Workout"
          onPress={completeWorkout}
          isLoading={isLoading}
          style={styles.completeButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 20, fontWeight: '600' },
  timerContainer: { flexDirection: 'row', alignItems: 'center' },
  timer: { marginLeft: 6, fontSize: 16, fontWeight: '500', fontVariant: ['tabular-nums'] },
  content: { padding: 16, paddingBottom: 100 },
  exerciseCard: { marginBottom: 16 },
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  exerciseHeaderInfo: { flex: 1, marginRight: 10 },
  exerciseName: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  summaryText: { fontSize: 13, },
  setsContainer: { paddingTop: 0, paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: StyleSheet.hairlineWidth, marginTop: 12 },
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  setLabel: { width: 45, fontSize: 14, },
  setInputGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8},
  setInput: { flex: 1, paddingVertical: 8, fontSize: 16, textAlign: 'center', paddingHorizontal: 4 },
  inputUnits: { fontSize: 14, marginLeft: 4 },
  deleteSetButton: { padding: 5, marginLeft: 4 },
  addSetButton: { marginTop: 10, alignSelf: 'flex-start' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, paddingBottom: 30 },
  completeButton: { },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
});

export default LogSessionScreen; 