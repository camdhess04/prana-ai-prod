import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import workoutService from '../services/workoutService';
import { WorkoutTemplate, Exercise, WorkoutSession, LogExercise } from '../types/workout';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../navigation/WorkoutNavigator';
import { Trash2 } from 'lucide-react-native';

type SelectTemplateScreenProps = NativeStackScreenProps<WorkoutStackParamList, 'SelectTemplate'>;

const SelectTemplateScreen: React.FC<SelectTemplateScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const userId = user?.userId;

  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadTemplates();
    }, [userId])
  );

  const loadTemplates = async () => {
    if (!userId) {
        setIsLoading(false);
        console.error("User ID missing, cannot load templates.");
        setTemplates([]);
        return;
     }
    setIsLoading(true);
    try {
      const data = await workoutService.getTemplates(userId);
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      Alert.alert('Error', 'Failed to load workout templates.');
    } finally {
      setIsLoading(false);
    }
  };

   const handleDeleteTemplate = (templateId: string, templateName: string) => {
     const currentUserId = user?.userId;
     if (!currentUserId) {
       Alert.alert("Error", "Cannot delete template: User not identified.");
       return;
     }
     Alert.alert(
       "Delete Template",
       `Are you sure you want to delete "${templateName}"? This action cannot be undone.`,
       [
         { text: "Cancel", style: "cancel" },
         {
           text: "Delete",
           style: "destructive",
           onPress: async () => {
             setIsDeleting(templateId);
             try {
               await workoutService.deleteTemplate(templateId, currentUserId);
               await loadTemplates(); // Reload list
             } catch (error: any) {
               console.error('Error deleting template:', error);
               Alert.alert("Error", `Failed to delete template: ${error.message || 'Unknown error'}`);
             } finally {
               setIsDeleting(null);
             }
           },
         },
       ]
     );
   };


  const startWorkout = (template: WorkoutTemplate) => {
    console.log("Selected template for session:", JSON.stringify(template, null, 2));
    // Prepare session data matching the LogExercise structure needed by LogSessionScreen
    const sessionData = {
        templateId: template.id,
        userId: userId || 'unknown',
        name: template.name,
        exercises: template.exercises?.filter((ex): ex is Exercise => ex !== null).map((ex): LogExercise => ({
            id: ex.id,
            name: ex.name,
            targetSets: ex.sets,
            targetReps: ex.reps,
            weight: ex.weight || '',
            restPeriod: ex.restPeriod,
            note: ex.note,
            performedSets: [],
            sets: ex.sets,
            reps: ex.reps,
        })) || [],
    };
    console.log("Navigating to LogSession with sessionData:", JSON.stringify(sessionData, null, 2));
    navigation.navigate('LogSession', { session: sessionData });
  };

  if (isLoading && templates.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!isLoading && templates.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text, marginBottom: 15, textAlign: 'center' }}>
            No workout templates found. Create one first!
        </Text>
        <Button
          title="Create New Workout"
          onPress={() => navigation.navigate('NewWorkout')}
          style={styles.button}
        />
      </View>
    );
  }

  const renderTemplateItem = ({ item }: { item: WorkoutTemplate }) => (
    <Card style={styles.templateCard}>
       <View style={styles.cardHeader}>
           <Text style={[styles.templateName, { color: theme.text }]}>{item.name}</Text>
           <TouchableOpacity onPress={() => handleDeleteTemplate(item.id, item.name)} disabled={isDeleting === item.id}>
                {isDeleting === item.id ? <ActivityIndicator size="small" color={theme.error} /> : <Trash2 color={theme.error} size={20} />}
           </TouchableOpacity>
       </View>

       {item.exercises && item.exercises.length > 0 ? (
            <View style={styles.exerciseList}>
                {item.exercises.filter((ex): ex is Exercise => ex !== null).map((exercise) => (
                <Text
                    key={exercise.id}
                    style={[styles.exerciseItem, { color: theme.secondaryText }]}
                    numberOfLines={1}
                >
                    • {exercise.name} ({exercise.sets} x {exercise.reps})
                </Text>
                ))}
            </View>
        ) : (
            <Text style={[styles.exerciseItem, { color: theme.secondaryText, fontStyle: 'italic' }]}>
                No exercises in this template.
            </Text>
        )}

      <Button
        title="Start Workout"
        onPress={() => startWorkout(item)}
        style={styles.button}
        variant="outline"
      />
    </Card>
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      data={templates}
      renderItem={renderTemplateItem}
      keyExtractor={(item) => item.id}
      refreshing={isLoading}
      onRefresh={loadTemplates}
      ListEmptyComponent={
         !isLoading ? (
             <View style={styles.centered}>
                <Text style={{ color: theme.text, marginBottom: 15, textAlign: 'center' }}>
                    No workout templates found. Create one first!
                </Text>
                <Button title="Create New Workout" onPress={() => navigation.navigate('NewWorkout')} />
             </View>
         ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, paddingTop: 50 },
  templateCard: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  templateName: { fontSize: 18, fontWeight: '600', flexShrink: 1, paddingRight: 5 },
  exerciseList: { marginBottom: 16, marginLeft: 5, paddingTop: 5, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#eee' },
  exerciseItem: { fontSize: 14, marginBottom: 4 },
  button: { alignSelf: 'flex-start', marginTop: 8 },
});

export default SelectTemplateScreen; 