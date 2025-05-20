// src/screens/WorkoutHistoryScreen.tsx
// FINAL IMPLEMENTATION - Based on user snippet + API Service

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, LayoutAnimation, Platform, UIManager, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import workoutService from '../services/workoutService'; // Import our service
import { WorkoutSession, SessionExercise, PerformedSet } from '../types/workout'; // Use correct types
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { format } from 'date-fns'; // For formatting dates
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../navigation/WorkoutNavigator';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type WorkoutHistoryScreenProps = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutHistory'>;

const WorkoutHistoryScreen: React.FC<WorkoutHistoryScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const userId = user?.userId;

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // For pull-to-refresh
  const [expandedSessions, setExpandedSessions] = useState<{[key: string]: boolean}>({});

  // Load sessions when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSessions(false); // Don't show pull-to-refresh indicator on focus load
    }, [userId])
  );

  const loadSessions = async (refreshing = false) => {
    if (!userId) { setIsLoading(false); setIsRefreshing(false); console.error("User ID missing..."); setSessions([]); return; }

    if (refreshing) {
        setIsRefreshing(true);
    } else if (sessions.length === 0) { // Only show full screen loader on initial load
         setIsLoading(true);
    }

    try {
      // Call the service function that uses the custom query
      const data = await workoutService.getSessionsByUserId(userId);
      setSessions(data);
    } catch (error) {
      console.error('Error loading workout history:', error);
      Alert.alert('Error', 'Failed to load workout history.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
      loadSessions(true); // Indicate it's a pull-to-refresh action
  };

  // Toggle expanded state for a session card
  const toggleExpand = (sessionId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSessions(prev => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  // Helper to format duration
  const formatDuration = (seconds: number | null | undefined = 0) => {
    seconds = seconds || 0;
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Define styles inside the component or pass theme to a style factory function
  const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 30, flexGrow: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
    sessionCard: { marginBottom: 16, padding: 0 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
    headerTextContainer: { flex: 1, marginRight: 10 },
    sessionName: { fontSize: 18, fontFamily: theme.fontFamilyMonoMedium, marginBottom: 5 }, // Adjusted size
    sessionDate: { fontSize: 13, fontFamily: theme.fontFamilyMonoRegular, marginBottom: 4 },
    sessionStats: { fontSize: 13, fontFamily: theme.fontFamilyMonoRegular },
    exerciseList: { marginTop: 8, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 12, marginHorizontal: 16, paddingBottom: 16 },
    exerciseItem: { marginBottom: 12 }, // More spacing
    exerciseName: { fontSize: 16, fontFamily: theme.fontFamilyMonoMedium, marginBottom: 6 }, // Adjusted size
    exerciseDetails: { fontSize: 14, fontFamily: theme.fontFamilyMonoRegular, marginBottom: 3, marginLeft: 8, lineHeight: 20 }, // Line height for readability
    exerciseNote: { fontSize: 13, fontFamily: theme.fontFamilyMonoRegular, fontStyle: 'italic', marginLeft: 8, marginTop: 3, opacity: 0.85 },
    noHistoryText: { fontFamily: theme.fontFamilyMonoRegular, fontSize: 16, textAlign: 'center'},
  });

  // --- Render Logic ---

  if (isLoading) { // Show loader only on initial load
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const renderSessionItem = ({ item }: { item: WorkoutSession }) => {
    const isExpanded = expandedSessions[item.id];
    // Ensure borderColor is applied correctly
    const cardBorderStyle = { borderBottomColor: theme.borderColor ?? '#eee', borderBottomWidth: StyleSheet.hairlineWidth };
    const listBorderStyle = { borderTopColor: theme.borderColor ?? '#eee', borderTopWidth: StyleSheet.hairlineWidth };

    return (
        <Card style={styles.sessionCard}>
        <TouchableOpacity
            style={styles.header}
            onPress={() => toggleExpand(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.headerTextContainer}>
                <Text style={[styles.sessionName, { color: theme.text }]} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={[styles.sessionDate, { color: theme.secondaryText }]}>
                    {format(new Date(item.completedAt), 'eee, MMM d, yyyy • h:mm a')}
                </Text>
                <Text style={[styles.sessionStats, { color: theme.secondaryText }]}>
                    {item.exercises?.length || 0} Exercises • {formatDuration(item.duration)}
                </Text>
            </View>
            {isExpanded ? (
                <ChevronUp color={theme.primary} size={20} />
            ) : (
                <ChevronDown color={theme.secondaryText} size={20} />
            )}
        </TouchableOpacity>

        {/* Expandable Exercise Details */}
        {isExpanded && (
            <View style={[styles.exerciseList, listBorderStyle]}>
            {(item.exercises ?? [])
                .filter((ex): ex is SessionExercise & {id: string; name: string} => !!ex && !!ex.id && !!ex.name) // Filter nulls
                .map((exercise) => (
                    <View key={exercise.id} style={styles.exerciseItem}>
                        <Text style={[styles.exerciseName, { color: theme.text }]}>
                            {exercise.name}
                        </Text>
                        {(exercise.performedSets ?? [])
                            .filter((set): set is PerformedSet & {id: string} => !!set && !!set.id) // Filter nulls
                            .map((set, setIndex) => (
                                <Text key={set.id} style={[styles.exerciseDetails, { color: theme.secondaryText }]}>
                                    • Set {setIndex + 1}: {set.weight || 'BW'} {set.weight ? 'lbs' : ''} x {set.reps || '?'} reps
                                    {set.rpe !== undefined && set.rpe !== null ? ` @ RPE ${set.rpe}` : ''}
                                    {set.notes ? ` (${set.notes})` : ''}
                                </Text>
                            ))
                        }
                        {!(exercise.performedSets?.length) && (
                            <Text style={[styles.exerciseDetails, { color: theme.secondaryText, fontStyle: 'italic' }]}>
                                No sets logged for this exercise.
                            </Text>
                        )}
                        {/* Display top-level exercise note if present */}
                        {exercise.note && (
                            <Text style={[styles.exerciseNote, { color: theme.secondaryText }]}>
                                Note: {exercise.note}
                            </Text>
                        )}
                    </View>
                ))}
                {!(item.exercises?.length) && (
                     <Text style={[styles.exerciseDetails, { color: theme.secondaryText, fontStyle: 'italic' }]}>
                        No exercises logged for this session.
                    </Text>
                )}
            </View>
        )}
        </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {isLoading && sessions.length === 0 ? (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        ) : null}
        {!isLoading && sessions.length === 0 ? (
            <View style={styles.centered}>
                <Text style={[styles.noHistoryText, { color: theme.text }]}>No workout history found yet! Complete a session to see it here.</Text>
            </View>
        ) : (
            <FlatList
                style={styles.container}
                contentContainerStyle={styles.content}
                data={sessions}
                renderItem={renderSessionItem}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={theme.primary}
                        colors={[theme.primary]}
                    />
                }
            />
        )}
    </SafeAreaView>
  );
};

export default WorkoutHistoryScreen;