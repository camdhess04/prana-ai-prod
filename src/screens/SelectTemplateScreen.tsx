import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import workoutService from '../services/workoutService';
import { WorkoutTemplate, WorkoutSession } from '../types/workout';
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
     Alert.alert(
         "Delete Template",
         `Are you sure you want to delete the template "${templateName}"? This cannot be undone.`,
         [
             { text: "Cancel", style: "cancel" },
             {
                 text: "Delete",
                 style: "destructive",
                 onPress: async () => {
                     if (!userId) return;
                     setIsDeleting(templateId);
                     try {
                         await workoutService.deleteTemplate(templateId);
                         await loadTemplates();
                     } catch (error: any) {
                         console.error('Error deleting template:', error);
                         Alert.alert('Error', `Failed to delete template: ${error.message}`);
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

    const sessionData = {
      templateId: template.id,
      userId: userId || 'unknown',
      name: template.name,
      exercises: template.exercises?.map(ex => ({
        id: ex.id,
        name: ex.name,
        targetSets: ex.sets,
        targetReps: ex.reps,
        weight: ex.weight || '',
        restPeriod: ex.restPeriod,
        note: ex.note,
        performedSets: [],
        sets: '',
        reps: '',
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

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      data={templates}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card style={styles.templateCard}>
           <View style={styles.cardHeader}>
               <Text style={[styles.templateName, { color: theme.text }]}>{item.name}</Text>
               <TouchableOpacity onPress={() => handleDeleteTemplate(item.id, item.name)} disabled={isDeleting === item.id}>
                    {isDeleting === item.id
                        ? <ActivityIndicator size="small" color={theme.error} />
                        : <Trash2 color={theme.error} size={20} />
                    }
               </TouchableOpacity>
           </View>

          <View style={styles.exerciseList}>
            {item.exercises?.slice(0, 3).map((exercise) => (
              <Text
                key={exercise.id}
                style={[styles.exerciseItem, { color: theme.secondaryText }]}
                numberOfLines={1}
              >
                • {exercise.name} ({exercise.sets} x {exercise.reps})
              </Text>
            ))}
            {item.exercises && item.exercises.length > 3 && (
                <Text style={[styles.exerciseItem, { color: theme.secondaryText }]}>...</Text>
            )}
          </View>

          <Button
            title="Start Workout"
            onPress={() => startWorkout(item)}
            style={styles.button}
            variant="outline"
          />
        </Card>
      )}
      refreshing={isLoading}
      onRefresh={loadTemplates}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  templateCard: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  templateName: { fontSize: 18, fontWeight: '600', marginBottom: 8, flexShrink: 1, paddingRight: 5 },
  exerciseList: { marginBottom: 16, marginLeft: 5 },
  exerciseItem: { fontSize: 14, marginBottom: 4 },
  button: { alignSelf: 'flex-start' },
});

export default SelectTemplateScreen; 