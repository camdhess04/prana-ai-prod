// src/screens/HomeScreen.tsx
// V1.5 Update: Fetches and displays Today's Scheduled Workout
// V1.5.1 Update: Added SafeAreaView for proper screen fitting
// V1.5.2 Update: Added Completed status handling

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; // <-- UPDATED IMPORT
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckCircle2 } from 'lucide-react-native'; // Add CheckCircle2 import
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/MainTabNavigator'; // Assuming navigation prop comes from here
import scheduleService from '../services/scheduleService'; // Import the new service
import { ScheduledWorkout as APIScheduledWorkout, WorkoutTemplate as APIWorkoutTemplate, Exercise as APIExercise } from '../API'; // Import API type

// Define a more specific type for the workout template potentially nested in ScheduledWorkout
type NestedWorkoutTemplate = Pick<APIWorkoutTemplate, 'id' | 'name' | 'description' | 'isAIPlan'> & {
    exercises?: { items: (Pick<APIExercise, 'id' | 'name' | 'sets' | 'reps' | 'weight' | 'restPeriod' | 'note'> | null)[] | null } | null
};

type HomeScreenProps = BottomTabScreenProps<MainTabParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { theme } = useAppTheme();
    const { user, userProfile } = useAuth();
    const insets = useSafeAreaInsets();
    console.log('HomeScreen Insets:', JSON.stringify(insets)); // Log all insets

    // State for today's workout: 'loading', 'rest', 'error', or the workout object
    const [todaysWorkout, setTodaysWorkout] = useState<APIScheduledWorkout | 'loading' | 'rest' | 'error'>('loading');
    const [isLoading, setIsLoading] = useState<boolean>(true); // Separate loading state

    // Use nickname from userProfile if available, then username, then email, then fallback
    const displayName = userProfile?.nickname || user?.username || (user && 'attributes' in user ? (user as any).attributes?.email : null) || 'User';

    // Fetch data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            let isActive = true; // Flag to prevent state updates if component unmounts

            const fetchTodaysWorkout = async () => {
                if (!user?.userId) {
                    console.log("HomeScreen: No user ID found.");
                    if (isActive) setTodaysWorkout('error'); // Or a 'logged out' state?
                    setIsLoading(false);
                    return;
                }

                console.log("HomeScreen: Fetching today's workout...");
                setIsLoading(true); // Use separate loading state

                try {
                    const workout = await scheduleService.getTodaysWorkout(user.userId);
                    console.log("HS: Raw workout object from scheduleService:", JSON.stringify(workout, null, 2));

                    if (isActive) {
                        if (workout) {
                            console.log(`HS: Workout object received. ID: ${workout.id}, Status: ${workout.status}, Deleted: ${workout._deleted}, Template exists: ${!!workout.workoutTemplate}`);

                            if (!workout.workoutTemplate) {
                                console.error("HS: CRITICAL - Missing nested workoutTemplate data! Setting to 'error'.");
                                setTodaysWorkout('error');
                            } else if (workout._deleted) {
                                console.log("HS: Workout is marked deleted. Setting to 'rest'.");
                                setTodaysWorkout('rest');
                            } else {
                                console.log("HS: Valid workout object found. Setting todaysWorkout STATE to this OBJECT.");
                                setTodaysWorkout(workout);
                            }
                        } else {
                            console.log("HS: scheduleService returned null. Setting todaysWorkout STATE to 'rest'.");
                            setTodaysWorkout('rest');
                        }
                    }
                } catch (error) {
                    console.error("HomeScreen: Error fetching today's workout:", error);
                    if (isActive) setTodaysWorkout('error');
                } finally {
                    if (isActive) setIsLoading(false);
                }
            };

            fetchTodaysWorkout();

            return () => {
                isActive = false; // Cleanup function to set flag false when component unmounts/loses focus
            };
        }, [user?.userId]) // Dependency array includes userId
    );

    const handleStartWorkout = () => {
        // Ensure todaysWorkout is an object before navigating
        if (typeof todaysWorkout === 'object' && todaysWorkout?.workoutTemplate && todaysWorkout?.id) {
             // Type assertion needed if workoutTemplate isn't guaranteed by the state type alone
             const templateForNav = todaysWorkout.workoutTemplate as NestedWorkoutTemplate;

             // Map API Exercise type to local Exercise type if LogSessionScreen expects it
             // Or adjust LogSessionScreen to accept API types
             const exercisesForNav = templateForNav.exercises?.items
                ?.filter((ex): ex is APIExercise => !!ex) // Filter nulls
                .map(ex => ({
                    id: ex.id, name: ex.name,
                    sets: ex.sets ?? null, reps: ex.reps ?? null, weight: ex.weight ?? null, // Map to local type expectation (string | null)
                    restPeriod: ex.restPeriod ?? undefined, note: ex.note ?? undefined,
                    // Add performedSets: [] here if LogSessionScreen needs it initialized
                    performedSets: [], // Initialize empty performed sets for logging screen
                })) ?? [];


             // Pass template data and schedule ID to LogSession screen
            navigation.navigate('Workout', { // Navigate to Workout Tab first
                screen: 'LogSession',       // Then specify screen within Workout stack
                params: {
                    // Pass the relevant parts of the template, or adjust LogSessionScreen to handle API type
                     template: {
                        id: templateForNav.id,
                        name: templateForNav.name,
                        description: templateForNav.description,
                        isAIPlan: templateForNav.isAIPlan,
                        // Map exercises if needed or pass API type directly
                        exercises: exercisesForNav,
                    },
                    scheduledWorkoutId: todaysWorkout.id,
                },
            });
        } else {
            console.error("Cannot start workout - todaysWorkout data is invalid:", todaysWorkout);
            Alert.alert("Error", "Could not load workout data to start the session.");
        }
    };

    // Helper function to render the main action card content
    const renderTodaysWorkoutCard = () => {
        console.log(
            "HS Render: isLoading:", isLoading,
            "todaysWorkout is string?:", typeof todaysWorkout === 'string',
            "todaysWorkout string value:", typeof todaysWorkout === 'string' ? todaysWorkout : 'N/A',
            "todaysWorkout object status:", typeof todaysWorkout === 'object' && todaysWorkout !== null ? todaysWorkout.status : 'N/A'
        );

        if (isLoading) {
            return <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />;
        }

        switch (todaysWorkout) {
            case 'rest':
                return (
                    <>
                        <Text style={[styles.cardTitle, { color: theme.text, fontFamily: theme.fontFamilyMedium }]}>Rest Day</Text>
                        <Text style={[styles.cardDescription, { color: theme.secondaryText, fontFamily: theme.fontFamilyRegular }]}>
                            Time to recover and grow stronger! Enjoy your rest.
                        </Text>
                    </>
                );
            case 'error':
                return (
                    <>
                        <Text style={[styles.cardTitle, { color: theme.text, fontFamily: theme.fontFamilyMedium }]}>Error</Text>
                        <Text style={[styles.cardDescription, { color: theme.text, fontFamily: theme.fontFamilyRegular }]}>
                            Could not load today's workout. Please try again later.
                        </Text>
                    </>
                );
            case 'loading':
                return <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />;
            default:
                if (typeof todaysWorkout === 'object' && todaysWorkout?.id && todaysWorkout?.workoutTemplate) {
                    const workoutName = todaysWorkout.workoutTemplate.name ?? 'Unnamed Workout';
                    const workoutDescription = todaysWorkout.workoutTemplate.description ?? 'No description available.';

                    // Check for 'Completed' status
                    if (todaysWorkout.status === 'Completed') {
                        return (
                            <>
                                <View style={styles.completedHeader}>
                                    <Text style={[styles.cardTitle, { color: theme.text, fontFamily: theme.fontFamilyMedium }]}>
                                        Today: {workoutName}
                                    </Text>
                                    <CheckCircle2 size={24} color={theme.success} />
                                </View>
                                <Text style={[styles.cardDescription, { color: theme.success, fontWeight: '500', fontFamily: theme.fontFamilyRegular }]}>
                                    Workout Completed! Great job! ✅
                                </Text>
                            </>
                        );
                    }

                    // Default case: Workout is Scheduled
                    return (
                        <>
                            <Text style={[styles.cardTitle, { color: theme.text, fontFamily: theme.fontFamilyMedium }]}>
                                Today: {workoutName}
                            </Text>
                            <Text style={[styles.cardDescription, { color: theme.secondaryText, fontFamily: theme.fontFamilyRegular }]}>
                                {workoutDescription}
                            </Text>
                            <Button
                                title="Start Workout"
                                onPress={handleStartWorkout}
                                style={styles.cardButton}
                                variant="primary"
                            />
                        </>
                    );
                }
                return null;
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={[styles.greeting, { color: theme.text, fontFamily: theme.fontFamilyBold }]}>
                        Hello, {displayName}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.secondaryText, fontFamily: theme.fontFamilyRegular }]}>
                        Ready to make progress today?
                    </Text>
                </View>

                {/* Today's Workout Card - Now Dynamic */}
                <Card style={styles.actionCard}>
                    <Text style={[styles.cardTitle, { color: theme.text, fontFamily: theme.fontFamilyMedium }]}>Today's Workout</Text>
                    {renderTodaysWorkoutCard()}
                </Card>

                {/* Removed placeholder stats - Add back later if desired */}
                {/* <View style={styles.statsContainer}> ... </View> */}

                {/* Keep Progress Placeholder for now */}
                <Card style={[styles.progressCard, { backgroundColor: theme.cardBackground }]}>
                    <Text style={[styles.cardTitle, { color: theme.text, fontFamily: theme.fontFamilyMedium }]}>Recent Progress</Text>
                    <Text style={[styles.cardDescription, { color: theme.secondaryText, fontFamily: theme.fontFamilyRegular }]}>
                        View your recent achievements
                    </Text>
                    <Button 
                        title="View Progress" 
                        onPress={() => navigation.navigate('Progress')}
                        style={styles.cardButton}
                        variant="primary"
                    />
                </Card>

                {/* Keep AI Coach card - maybe update navigation later if Trainer tab removed permanently */}
                {/* <Card style={styles.coachCard}> ... </Card> */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        paddingBottom: 40,
        paddingHorizontal: 16,
    },
    header: {
        marginBottom: 24,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 4,
    },
    actionCard: {
        marginBottom: 24,
        padding: 16,
    },
    progressCard: {
        marginBottom: 24,
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    cardButton: {
        alignSelf: 'flex-start',
    },
    loader: {
        paddingVertical: 30,
    },
    progressPlaceholder: {
        textAlign: 'center',
        paddingVertical: 30,
        paddingHorizontal: 10,
        fontStyle: 'italic',
        fontSize: 14,
    },
    completedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    // coachCard style can be added if needed
});

export default HomeScreen;