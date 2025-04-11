// src/screens/WorkoutHistoryScreen.tsx
// FINAL IMPLEMENTATION - Based on user snippet + API Service

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, LayoutAnimation, Platform, UIManager, RefreshControl } from 'react-native';
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
            <View style={styles.exerciseList}>
            {item.exercises?.map((exercise, index) => (
                <View key={exercise.id || index} style={styles.exerciseItem}>
                    <Text style={[styles.exerciseName, { color: theme.text }]}>
                        {exercise.name}
                    </Text>
                    {/* Map through performed sets */}
                    {exercise.performedSets && exercise.performedSets.length > 0 ? (
                        exercise.performedSets.map((set, setIndex) => (
                        <Text key={set.id} style={[styles.exerciseDetails, { color: theme.secondaryText }]}>
                            • Set {setIndex + 1}: {set.weight || 'BW'} { 'lbs'/* Add unit */} x {set.reps || '?'} reps
                        </Text>
                        ))
                    ) : (
                        <Text style={[styles.exerciseDetails, { color: theme.secondaryText, fontStyle: 'italic' }]}>
                            No detailed sets logged.
                        </Text>
                    )}
                    {exercise.note && (
                        <Text style={[styles.exerciseNote, { color: theme.secondaryText }]}>
                        Note: {exercise.note}
                        </Text>
                    )}
                </View>
            ))}
            </View>
        )}
        </Card>
    );
  };

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      data={sessions} // Data comes from state, sorted by service
      renderItem={renderSessionItem}
      keyExtractor={(item) => item.id}
      refreshControl={ // Use RefreshControl for pull-to-refresh
        <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary} // iOS color
            colors={[theme.primary]} // Android color
        />
       }
      ListEmptyComponent={
        !isLoading && !isRefreshing? ( // Show only if not loading and not refreshing
          <View style={styles.centered}>
            <Text style={{ color: theme.text, textAlign: 'center' }}>No workout history found yet! Complete a session to see it here.</Text>
          </View>
        ) : null
      }
    />
  );
};

// Styles adapted from your snippet
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 30, flexGrow: 1 }, // Ensure content can grow for empty state
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  sessionCard: { marginBottom: 16, padding: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  headerTextContainer: { flex: 1, marginRight: 10 },
  sessionName: { fontSize: 17, fontWeight: '600', marginBottom: 5 },
  sessionDate: { fontSize: 13, marginBottom: 4 },
  sessionStats: { fontSize: 13 },
  exerciseList: { marginTop: 8, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 12, marginHorizontal: 16, paddingBottom: 16, borderTopColor: '#eee' /* use theme.borderColor */ },
  exerciseItem: { marginBottom: 10 },
  exerciseName: { fontSize: 15, fontWeight: '500', marginBottom: 4 },
  exerciseDetails: { fontSize: 14, marginBottom: 2, marginLeft: 5 },
  exerciseNote: { fontSize: 13, fontStyle: 'italic', marginLeft: 5, marginTop: 2, opacity: 0.8 },
});

export default WorkoutHistoryScreen;