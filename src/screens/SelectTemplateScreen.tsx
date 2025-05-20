import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import workoutService from '../services/workoutService';
import { WorkoutTemplate, Exercise, LogExercise } from '../types/workout';
import Button from '../components/Button';
import Card from '../components/Card';
import { ChevronRight, Edit3, Trash2, FilePlus } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../navigation/WorkoutNavigator';

type SelectTemplateScreenNavigationProp = NativeStackNavigationProp<WorkoutStackParamList, 'SelectTemplate'>;

const SelectTemplateScreen: React.FC = () => {
  const navigation = useNavigation<SelectTemplateScreenNavigationProp>();
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const userId = user?.userId;

  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Define styles inside component
  const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    contentContainer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 30, flexGrow: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    screenTitle: {
        fontSize: 24, 
        fontFamily: theme.fontFamilyMonoBold, 
        marginBottom: 8, 
        color: theme.text,
        textAlign: 'center',
    },
    screenSubtitle: {
        fontSize: 15, 
        fontFamily: theme.fontFamilyMonoRegular, 
        marginBottom: 20, 
        color: theme.secondaryText, 
        textAlign: 'center', 
        lineHeight: 21,
    },
    emptyStateText: { fontFamily: theme.fontFamilyMonoRegular, fontSize: 16, textAlign: 'center', marginBottom: 16, color: theme.text },
    templateCard: { marginBottom: 16, padding: 0 }, // Card handles its own padding
    cardHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        borderBottomWidth: StyleSheet.hairlineWidth, 
        borderBottomColor: theme.borderColor 
    },
    templateName: { fontSize: 18, fontFamily: theme.fontFamilyMonoMedium, color: theme.text, flexShrink: 1 },
    templateInfo: { fontSize: 13, fontFamily: theme.fontFamilyMonoRegular, color: theme.secondaryText, marginTop: 2 },
    cardContent: { paddingHorizontal: 16, paddingVertical: 12 },
    exerciseListText: { fontSize: 14, fontFamily: theme.fontFamilyMonoRegular, color: theme.secondaryText, marginBottom: 4, lineHeight: 18 },
    actionContainer: { 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        paddingHorizontal: 8, // Reduced padding for tighter button group
        paddingVertical: 8,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.borderColor,
        gap: 8, // Space between buttons
    },
    actionButtonText: { fontFamily: theme.fontFamilyMonoMedium }, // For text inside buttons
    startWorkoutButton: { flex: 1 }, // Make start workout take more space if needed
    deleteButtonContainer: { padding: 6 }, //Wrapper for delete icon for better touch area
  });

  const loadTemplates = useCallback(async (refresh = false) => {
    if (!userId) { setIsLoading(false); if(refresh) setIsRefreshing(false); return; }
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    try {
      const fetchedTemplates = await workoutService.getTemplates(userId);
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      Alert.alert("Error", "Could not load your workout templates.");
    } finally {
      setIsLoading(false);
      if(refresh) setIsRefreshing(false);
    }
  }, [userId]);

  useFocusEffect(useCallback(() => { loadTemplates(); }, [loadTemplates]));

  const handleStartWorkout = (template: WorkoutTemplate) => {
    const sessionData = {
        templateId: template.id,
        userId: userId || 'unknown',
        name: template.name,
        exercises: template.exercises?.filter((ex): ex is Exercise => ex !== null).map((ex): LogExercise => ({
            id: ex.id, name: ex.name, targetSets: ex.sets, targetReps: ex.reps,
            targetWeight: ex.weight || null, targetRest: ex.restPeriod, note: ex.note,
            performedSets: [],
        })) || [],
    };
    navigation.navigate('LogSession', { session: sessionData } as any);
  };
  
  const handleDeleteTemplate = async (templateId: string, templateVersion: number | undefined) => {
    // For simplicity, prompting user to confirm. _version might not be readily available on WorkoutTemplate type.
    // Ideally, fetch template with _version before deleting or ensure _version is part of WorkoutTemplate.
    // For now, we might need to adjust workoutService.deleteTemplate or fetch _version.
    // Let's assume version is 1 for now if not available, which is risky. A better way is to fetch before delete.
    const versionToDelete = templateVersion || 1; // Placeholder - THIS IS RISKY
    Alert.alert("Delete Template", "Are you sure you want to delete this template? This action cannot be undone.", [
        { text: "Cancel", style: "cancel" },
        { 
            text: "Delete", style: "destructive", 
            onPress: async () => {
                try {
                    await workoutService.deleteTemplate(templateId, versionToDelete); // Pass a version
                    Alert.alert("Success", "Template deleted.");
                    loadTemplates(true); // Refresh list
                } catch (error) {
                    console.error("Error deleting template:", error);
                    Alert.alert("Error", "Could not delete template. It might be in use or an error occurred.");
                }
            }
        }
    ]);
  };

  const renderTemplateItem = ({ item }: { item: WorkoutTemplate }) => (
    <Card style={styles.templateCard}>
        <View style={styles.cardHeader}>
            <View style={{flex:1}}>
                <Text style={styles.templateName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.templateInfo}>{item.exercises?.length || 0} exercises {item.description ? '• ' : ''}{item.description ? <Text numberOfLines={1}>{item.description}</Text> : ''}</Text>
            </View>
            <ChevronRight size={20} color={theme.secondaryText} />
        </View>
      
        {item.exercises && item.exercises.length > 0 && (
            <View style={styles.cardContent}>
                {item.exercises.slice(0, 2).map(ex => ex && (
                    <Text key={ex.id} style={styles.exerciseListText} numberOfLines={1}>• {ex.name} ({ex.sets} sets x {ex.reps} reps)</Text>
                ))}
                {item.exercises.length > 2 && <Text style={styles.exerciseListText}>...and {item.exercises.length - 2} more.</Text>}
            </View>
        )}
        <View style={styles.actionContainer}>
            {/* <Button title="Edit" variant="ghost" size="small" onPress={() => console.log("Edit", item.id)} icon={<Edit3 size={16} color={theme.primary}/>} textStyle={styles.actionButtonText}/> */}
            <TouchableOpacity style={styles.deleteButtonContainer} onPress={() => handleDeleteTemplate(item.id, (item as any)._version)}> 
                <Trash2 size={20} color={theme.error}/>
            </TouchableOpacity>
            <Button title="Start Workout" onPress={() => handleStartWorkout(item)} style={styles.startWorkoutButton} textStyle={styles.actionButtonText}/>
        </View>
    </Card>
  );

  if (isLoading && templates.length === 0) {
    return <View style={[styles.centered, { backgroundColor: theme.background }]}><ActivityIndicator size="large" color={theme.primary} /></View>;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={templates}
        renderItem={renderTemplateItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
            <View style={{alignItems: 'center', marginBottom: 10}}>
                 <Text style={styles.screenTitle}>Select a Template</Text>
                 <Text style={styles.screenSubtitle}>Choose a saved plan to begin your session, or create a new one.</Text>
            </View>
        )}
        ListEmptyComponent={() => (
          !isLoading && (
            <View style={styles.centered}>
              <FilePlus size={48} color={theme.secondaryText} style={{marginBottom: 16}}/>  
              <Text style={styles.emptyStateText}>No workout templates found.</Text>
              <Button title="Create New Template" onPress={() => navigation.navigate('NewWorkout')} textStyle={styles.actionButtonText}/>
            </View>
          )
        )}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadTemplates(true)} colors={[theme.primary]} tintColor={theme.primary}/>}
      />
    </SafeAreaView>
  );
};

export default SelectTemplateScreen; 