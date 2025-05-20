// src/screens/LogSessionScreen.tsx
// V1.5.3 Update: Integrated SetInputModal for focused set logging

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform, UIManager, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { Exercise as LocalExercise, LogExercise, PerformedSet, WorkoutTemplate } from '../types/workout';
import workoutService from '../services/workoutService';
import progressionService, { SuggestionMap } from '../services/progressionService';
import SetInputModal from '../components/SetInputModal';
import { Clock, Plus, Trash2, ChevronDown, ChevronUp, Zap, Edit3 } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../navigation/WorkoutNavigator';
import uuid from 'react-native-uuid';
import { format } from 'date-fns';

// Param Types and Guards (Keep existing)
type ScheduledNavParams = { template: WorkoutTemplate; scheduledWorkoutId: string; };
type ManualNavParams = { session: { templateId?: string; userId: string; name: string; exercises: LocalExercise[]; } };
type LogSessionRouteParams = ScheduledNavParams | ManualNavParams | undefined;
function isScheduledNavParams(params: LogSessionRouteParams): params is ScheduledNavParams { return !!params && typeof params === 'object' && 'template' in params && 'scheduledWorkoutId' in params; }
function isManualNavParams(params: LogSessionRouteParams): params is ManualNavParams { return !!params && typeof params === 'object' && 'session' in params && typeof params.session === 'object' && 'exercises' in params.session; }

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) { UIManager.setLayoutAnimationEnabledExperimental(true); }

type LogSessionScreenProps = NativeStackScreenProps<WorkoutStackParamList, 'LogSession'>;

const LogSessionScreen: React.FC<LogSessionScreenProps> = ({ route, navigation }) => {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const userId = user?.userId;
  const username = user?.username || userId;

  // --- State ---
  const [workoutName, setWorkoutName] = useState<string>('New Session');
  const [logExercises, setLogExercises] = useState<LogExercise[]>([]);
  const [scheduledWorkoutId, setScheduledWorkoutId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // --- State for Set Input Modal ---
  const [isSetModalVisible, setIsSetModalVisible] = useState(false);
  const [currentEditingSetInfo, setCurrentEditingSetInfo] = useState<{
    exerciseId: string;
    set?: Partial<PerformedSet>; // For editing an existing set or pre-filling a new one
    setIndex?: number; // Index if editing, undefined if new
    isNew: boolean;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // --- Initialize Session (Keep existing logic) ---
  useEffect(() => {
    let isActive = true;
    const initializeSession = async () => {
        setIsLoading(true);
        console.log('LogSessionScreen Mounted. Processing route.params:', JSON.stringify(route.params, null, 2));

        let initialName: string = 'New Session';
        let initialTemplateId: string | undefined = undefined;
        let initialScheduleId: string | null = null;
        let templateExercises: LocalExercise[] = [];
        let templateForProgression: WorkoutTemplate | undefined = undefined;

        if (isScheduledNavParams(route.params)) {
            console.log("Initializing from ScheduledNavParams (HomeScreen)");
            const { template, scheduledWorkoutId: schedId } = route.params;
            initialName = template.name || 'Workout Session';
            initialTemplateId = template.id;
            initialScheduleId = schedId;
            templateExercises = template.exercises || [];
            templateForProgression = template;

        } else if (isManualNavParams(route.params)) {
            console.log("Initializing from ManualNavParams (SelectTemplateScreen)");
            const { session } = route.params;
            initialName = session.name || 'Workout Session';
            initialTemplateId = session.templateId;
            initialScheduleId = null;
            templateExercises = session.exercises || [];
            console.log("Progression suggestions skipped for manually selected template in V1.5");

        } else {
            console.error("LogSessionScreen: Invalid or missing route params!", route.params);
            Alert.alert("Error", "Could not load workout details.", [{ text: "OK", onPress: () => navigation.goBack() }]);
            if (isActive) setIsLoading(false);
            return;
        }

        let suggestions: SuggestionMap = {};
        if (templateForProgression && userId) {
             try {
                console.log("Fetching progression suggestions...");
                suggestions = await progressionService.calculateSuggestions(userId, templateForProgression);
                console.log("Received suggestions:", suggestions);
            } catch (error) {
                console.error("Failed to fetch progression suggestions:", error);
            }
        }

        if (!isActive) return;

        const initialLogExercises: LogExercise[] = templateExercises.map((ex: LocalExercise): LogExercise => {
             const exerciseSuggestions = suggestions[ex.id] ?? {};
             return {
                id: ex.id, name: ex.name,
                targetSets: ex.sets ?? '',
                targetReps: exerciseSuggestions.reps ?? ex.reps ?? '',
                targetWeight: exerciseSuggestions.weight ?? ex.weight ?? '',
                targetRest: ex.restPeriod, note: ex.note,
                suggestionNote: exerciseSuggestions.note ?? null,
                performedSets: [],
             };
        });

        setWorkoutName(initialName);
        setTemplateId(initialTemplateId);
        setScheduledWorkoutId(initialScheduleId);
        setLogExercises(initialLogExercises);
        console.log(`Initialized ${initialLogExercises.length} exercises for logging.`);
        setIsLoading(false);
    };

    initializeSession();

    return () => { isActive = false };

  }, [route.params, userId]);

  // --- Timer Effect (Keep existing) ---
  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60); const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Modal Handling Functions ---
  const handleOpenSetModal = (exerciseId: string, set?: PerformedSet, setIndex?: number) => {
    const exercise = logExercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    let initialData: Partial<PerformedSet> = {};
    if (set) {
      initialData = { ...set };
    } else {
      const lastSet = exercise.performedSets[exercise.performedSets.length - 1];
      initialData = {
        reps: lastSet?.reps ?? exercise.targetReps ?? null,
        weight: lastSet?.weight ?? exercise.targetWeight ?? null,
        rpe: lastSet?.rpe,
        notes: lastSet?.notes,
      };
    }

    setCurrentEditingSetInfo({
      exerciseId,
      set: initialData,
      setIndex,
      isNew: !set,
    });
    setIsSetModalVisible(true);
  };

  const handleCloseSetModal = () => {
    setIsSetModalVisible(false);
    setCurrentEditingSetInfo(null);
  };

  const handleSaveSet = (savedSetData: PerformedSet) => {
    if (!currentEditingSetInfo) return;
    const { exerciseId, isNew, setIndex } = currentEditingSetInfo;

    setLogExercises(currentExercises =>
      currentExercises.map(ex => {
        if (ex.id === exerciseId) {
          let updatedSets: PerformedSet[];
          if (isNew || setIndex === undefined) {
            updatedSets = [...ex.performedSets, savedSetData];
          } else {
            updatedSets = ex.performedSets.map((s, idx) =>
              idx === setIndex ? savedSetData : s
            );
          }
          return { ...ex, performedSets: updatedSets };
        }
        return ex;
      })
    );
    handleCloseSetModal();
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    setLogExercises(currentExercises =>
        currentExercises.map(ex => {
          if (ex.id === exerciseId) {
            const updatedSets = ex.performedSets.filter(set => set.id !== setId);
            return { ...ex, performedSets: updatedSets };
          } return ex;
        })
      );
  };
  const toggleExpandExercise = (exerciseId: string) => {
      setExpandedExerciseId(currentId => (currentId === exerciseId ? null : exerciseId));
  };

  // --- Save Workout Logic (Keep existing, ensures scheduledWorkoutId is passed) ---
  const validateWorkout = (): boolean => {
       const hasPerformedSet = logExercises.some(ex =>
           ex.performedSets.length > 0 &&
           ex.performedSets.some(set => (set.reps?.trim() ?? '') !== '' || (set.weight?.trim() ?? '') !== '')
       );
       if (!hasPerformedSet) { Alert.alert('Log Performance', 'Please log reps or weight for at least one set.'); return false; }
       return true;
  };
  const completeWorkout = async () => {
      if (!validateWorkout() || !userId || !username) {
          if (!userId || !username) Alert.alert("Error", "User identity not found.");
          return;
      }
      setIsSaving(true);
      if (timerRef.current) clearInterval(timerRef.current);

      try {
        const sessionToSave = {
          userId: userId, owner: username, templateId: templateId,
          scheduledWorkoutId: scheduledWorkoutId,
          name: workoutName, exercises: logExercises,
          duration: elapsedTime, completedAt: new Date().toISOString(),
        };
        console.log("Attempting to save session with data:", JSON.stringify(sessionToSave, null, 2));
        await workoutService.saveSession(sessionToSave);
        Alert.alert('Workout Complete!', 'Session logged successfully.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } catch (error: any) {
        console.error('Error completing workout:', error);
        Alert.alert('Error', `Failed to log workout session: ${error.message || 'Unknown error'}`);
        setIsSaving(false);
      }
  };

  // --- Rendering Helpers (Keep existing) ---
  const getExerciseSummary = (exercise: LogExercise) => {
     const setCount = exercise.performedSets.length; let loggedSetsCount = 0; let totalReps = 0; let totalVolume = 0;
     exercise.performedSets.forEach(set => {
         const reps = parseInt(set.reps ?? '0', 10); const weight = parseFloat(set.weight ?? '0'); let setLogged = false;
         if (!isNaN(reps) && reps > 0) { totalReps += reps; setLogged = true; }
         if (!isNaN(weight) && weight > 0) { totalVolume += (reps > 0 ? reps : 1) * weight; setLogged = true; }
         if(setLogged) loggedSetsCount++;
     });
     const avgReps = loggedSetsCount > 0 ? Math.round(totalReps / loggedSetsCount * 10) / 10 : 0;
     return { setCount: loggedSetsCount, avgReps };
  };

  // Define styles inside the component or pass theme to a style factory function
  const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    kav: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    loadingText: { marginTop: 10, fontSize: 16, fontFamily: theme.fontFamilyMonoRegular, color: theme.text },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth
    },
    title: { fontSize: 22, fontFamily: theme.fontFamilyMonoBold, color: theme.text },
    timerContainer: { flexDirection: 'row', alignItems: 'center' },
    timer: { marginLeft: 8, fontSize: 18, fontFamily: theme.fontFamilyMonoMedium, color: theme.text, letterSpacing: 0.5 },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 120,
        paddingTop: 8
    },
    exerciseCard: { marginBottom: 16, padding: 0 },
    exerciseHeaderTouchable: { paddingVertical: 12, paddingHorizontal: 16 },
    exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    exerciseHeaderInfo: { flex: 1, marginRight: 10 },
    exerciseName: {
        fontSize: 18,
        fontFamily: theme.fontFamilyMonoMedium,
        color: theme.text,
        marginBottom: 8,
    },
    summaryText: { fontSize: 14, fontFamily: theme.fontFamilyMonoRegular, color: theme.secondaryText, lineHeight: 20 },
    suggestedValueText: {
        fontFamily: theme.fontFamilyMonoMedium,
        letterSpacing: 0.2,
    },
    suggestionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    suggestionText: {
        marginLeft: 6,
        fontSize: 13,
        fontFamily: theme.fontFamilyMonoRegular,
        fontStyle: 'italic',
        letterSpacing: 0.2,
    },
    setsContainer: { paddingTop: 12, paddingHorizontal: 16, paddingBottom: 8, borderTopWidth: StyleSheet.hairlineWidth, marginTop: 12 },
    setRowHeader: {
        flexDirection: 'row', marginBottom: 8, paddingHorizontal: 0, alignItems: 'center',
        gap: 8, borderBottomWidth: 1, paddingBottom: 8,
    },
    setHeaderLabel: {
        fontSize: 11,
        fontFamily: theme.fontFamilyMonoMedium,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        textAlign: 'center',
        color: theme.secondaryText
    },
    setNumberHeaderLabel: { flex: 0.5, textAlign: 'center' },
    inputHeaderLabel: { flex: 1, textAlign: 'center' },
    notesHeaderLabel: { flex: 2, textAlign: 'center' },
    editDeleteHeaderPlaceholder: { width: 56 },
    setRowDisplay: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth, gap: 8,
    },
    setLabel: { 
        width: 30, fontSize: 14, fontFamily: theme.fontFamilyMonoMedium,
        textAlign: 'center', color: theme.text 
    },
    setDataText: {
        flex: 1, fontSize: 14, fontFamily: theme.fontFamilyMonoRegular,
        textAlign: 'center', paddingHorizontal: 4, color: theme.text
    },
    notesTextDisplay: {
        flex: 2, textAlign: 'left', fontStyle: 'italic',
        opacity: 0.8, fontFamily: theme.fontFamilyMonoRegular
    },
    setActions: { flexDirection: 'row', width: 56, justifyContent: 'space-around' },
    setActionButton: { padding: 4 },
    addSetButton: { marginTop: 16, marginBottom: 8, alignSelf: 'center' },
    footer: {
        padding: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth,
        paddingBottom: Platform.OS === 'ios' ? 40 : 30,
        backgroundColor: theme.cardBackground 
    },
    completeButton: { },
  });

  if (isLoading) {
      return (
          <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
              <View style={styles.centered}>
                 <ActivityIndicator size="large" color={theme.primary} />
                 <Text style={styles.loadingText}>Loading Workout...</Text>
              </View>
          </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <KeyboardAvoidingView
            style={styles.kav}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
                <Text style={styles.title}>{workoutName}</Text>
                <View style={styles.timerContainer}>
                    <Clock size={18} color={theme.secondaryText} />
                    <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                {logExercises.map((exercise, index) => {
                const summary = getExerciseSummary(exercise);
                const isExpanded = expandedExerciseId === exercise.id;
                return (
                    <Card key={exercise.id} style={styles.exerciseCard}>
                        <TouchableOpacity onPress={() => toggleExpandExercise(exercise.id)} activeOpacity={0.7} style={styles.exerciseHeaderTouchable}>
                            <View style={styles.exerciseHeader}>
                                <View style={styles.exerciseHeaderInfo}>
                                    <Text style={styles.exerciseName}>{index + 1}. {exercise.name}</Text>
                                    <Text style={styles.summaryText}>
                                        Target:
                                        <Text style={ exercise.suggestionNote
                                            ? [styles.suggestedValueText, { color: theme.primary } ]
                                            : { fontFamily: theme.fontFamilyMonoMedium, color: theme.text }
                                        }>
                                            {` ${exercise.targetSets || '?'} sets x ${exercise.targetReps || '?'} reps ${exercise.targetWeight ? `@ ${exercise.targetWeight}` : ''}`}
                                        </Text>
                                    </Text>
                                    {exercise.suggestionNote && (
                                        <View style={[styles.suggestionContainer, { backgroundColor: theme.primary + '20' }]}>
                                            <Zap size={12} color={theme.primary} />
                                            <Text style={[styles.suggestionText, { color: theme.primary }]}>{exercise.suggestionNote}</Text>
                                        </View>
                                    )}
                                    {summary.setCount > 0 && (
                                        <Text style={[styles.summaryText, { marginTop: 4 }]}>
                                            Logged: {summary.setCount} sets {summary.avgReps > 0 ? `| Avg: ${summary.avgReps} reps` : ''}
                                        </Text>
                                    )}
                                </View>
                                {isExpanded ? <ChevronUp color={theme.primary} size={20} /> : <ChevronDown color={theme.secondaryText} size={20}/>}
                            </View>
                        </TouchableOpacity>

                        {isExpanded && (
                            <View style={[styles.setsContainer, { borderTopColor: theme.borderColor ?? '#EEEEEE'}]}>
                            {exercise.performedSets.length > 0 && (
                                <View style={[styles.setRowHeader, { borderBottomColor: theme.borderColor ?? theme.secondaryText }]}>
                                    <Text style={[styles.setHeaderLabel, styles.setNumberHeaderLabel]}>Set</Text>
                                    <Text style={[styles.setHeaderLabel, styles.inputHeaderLabel]}>Weight</Text>
                                    <Text style={[styles.setHeaderLabel, styles.inputHeaderLabel]}>Reps</Text>
                                    <Text style={[styles.setHeaderLabel, styles.inputHeaderLabel]}>RPE</Text>
                                    <Text style={[styles.setHeaderLabel, styles.notesHeaderLabel]}>Notes</Text>
                                    <View style={styles.editDeleteHeaderPlaceholder} />
                                </View>
                            )}
                            {exercise.performedSets.map((set, setIndex) => (
                                <View key={set.id} style={[styles.setRowDisplay, { borderBottomColor: theme.borderColor }]}>
                                    <Text style={styles.setLabel}>{setIndex + 1}</Text>
                                    <Text style={styles.setDataText}>{set.weight || '-'}</Text>
                                    <Text style={styles.setDataText}>{set.reps || '-'}</Text>
                                    <Text style={styles.setDataText}>{set.rpe ?? '-'}</Text>
                                    <Text style={[styles.setDataText, styles.notesTextDisplay]} numberOfLines={1}>{set.notes || '-'}</Text>
                                    <View style={styles.setActions}>
                                        <TouchableOpacity onPress={() => handleOpenSetModal(exercise.id, set, setIndex)} style={styles.setActionButton}>
                                            <Edit3 color={theme.primary} size={18} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => deleteSet(exercise.id, set.id)} style={styles.setActionButton}>
                                            <Trash2 color={theme.error} size={18} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                            <Button
                                title="Add Set"
                                onPress={() => handleOpenSetModal(exercise.id, undefined, exercise.performedSets.length)}
                                variant="ghost" size="small"
                                icon={<Plus size={16} color={theme.primary} />} 
                                style={styles.addSetButton} textStyle={{ color: theme.primary, fontFamily: theme.fontFamilyMonoMedium }}
                            />
                            </View>
                        )}
                    </Card>
                );
              })}
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: theme.borderColor }]}>
                <Button title="Complete Workout" onPress={completeWorkout} isLoading={isSaving} style={styles.completeButton} />
            </View>

            {currentEditingSetInfo && (
                <SetInputModal
                    isVisible={isSetModalVisible}
                    onClose={handleCloseSetModal}
                    onSave={handleSaveSet}
                    initialSetData={currentEditingSetInfo.set}
                    exerciseName={logExercises.find(ex => ex.id === currentEditingSetInfo.exerciseId)?.name}
                    setNumber={currentEditingSetInfo.isNew 
                        ? (logExercises.find(ex => ex.id === currentEditingSetInfo.exerciseId)?.performedSets.length ?? 0) + 1
                        : (currentEditingSetInfo.setIndex ?? 0) + 1
                    }
                />
            )}
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LogSessionScreen;