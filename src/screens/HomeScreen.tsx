// src/screens/HomeScreen.tsx
// V1.5 Update: Fetches and displays Today's Scheduled Workout

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
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
    const { user } = useAuth();

    // State for today's workout: 'loading', 'rest', 'error', or the workout object
    const [todaysWorkout, setTodaysWorkout] = useState<APIScheduledWorkout | 'loading' | 'rest' | 'error'>('loading');
    const [isLoading, setIsLoading] = useState<boolean>(true); // Separate loading state

    const displayName = user?.username || user?.attributes?.email || 'User';

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
                // setTodaysWorkout('loading'); // Set specific state if preferred

                try {
                    const workout = await scheduleService.getTodaysWorkout(user.userId);
                    console.log("HomeScreen: Fetched workout:", workout?.id, workout?.status, workout?.workoutTemplate?.name);

                    if (isActive) {
                        if (workout && workout.status === 'Scheduled') {
                             // Ensure workoutTemplate is included - adjust based on actual service return
                            if (!workout.workoutTemplate) {
                                console.error("HomeScreen: ScheduledWorkout found, but missing nested workoutTemplate data!");
                                setTodaysWorkout('error');
                            } else {
                                setTodaysWorkout(workout as APIScheduledWorkout); // Cast needed if service returns union/null
                            }
                        } else {
                            // Treat null result, non-Scheduled status, or missing template as Rest/Nothing scheduled
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
        if (isLoading) {
            return <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />;
        }

        switch (todaysWorkout) {
            case 'rest':
                return (
                    <>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Rest Day</Text>
                        <Text style={[styles.cardDescription, { color: theme.secondaryText }]}>
                            Time to recover and grow stronger! Enjoy your rest.
                        </Text>
                        {/* Optionally add a button to view schedule or log activity */}
                    </>
                );
            case 'error':
                return (
                    <>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Error</Text>
                        <Text style={[styles.cardDescription, { color: theme.text }]}>
                            Could not load today's workout. Please try again later.
                        </Text>
                        {/* Optionally add a refresh button */}
                    </>
                );
            // Check if it's a valid workout object
            case 'loading': // Should be handled by isLoading state, but included for completeness
                 return <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />;
            default: // Assumes it's an APIScheduledWorkout object here
                const workoutName = todaysWorkout.workoutTemplate?.name ?? 'Unnamed Workout';
                const workoutDescription = todaysWorkout.workoutTemplate?.description ?? 'No description available.';
                return (
                    <>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>
                            Today: {workoutName}
                        </Text>
                        <Text style={[styles.cardDescription, { color: theme.secondaryText }]}>
                            {workoutDescription}
                        </Text>
                        <Button
                            title="Start Workout"
                            onPress={handleStartWorkout}
                            style={styles.cardButton}
                        />
                    </>
                );
        }
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false} // Hide scrollbar if desired
        >
            <View style={styles.header}>
                <Text style={[styles.greeting, { color: theme.text }]}>
                    Hello, {displayName}
                </Text>
                <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
                    Ready to make progress today?
                </Text>
            </View>

            {/* Today's Workout Card - Now Dynamic */}
            <Card style={styles.actionCard}>
                {renderTodaysWorkoutCard()}
            </Card>

            {/* Removed placeholder stats - Add back later if desired */}
            {/* <View style={styles.statsContainer}> ... </View> */}

            {/* Keep Progress Placeholder for now */}
            <Card style={styles.progressCard}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                    Recent Progress
                </Text>
                <Text style={[styles.progressPlaceholder, { color: theme.secondaryText }]}>
                    Progress charts will appear here soon!
                </Text>
            </Card>

            {/* Keep AI Coach card - maybe update navigation later if Trainer tab removed permanently */}
            {/* <Card style={styles.coachCard}> ... </Card> */}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingVertical: 40, // Adjust as needed, consider safe area
        paddingHorizontal: 16,
    },
    header: {
        marginBottom: 24,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold', // Consider '700' or '800' for more weight
    },
    subtitle: {
        fontSize: 16,
        marginTop: 4, // Add some space
    },
    actionCard: {
        marginBottom: 24, // Increased spacing
        padding: 16, // Consistent padding
    },
    progressCard: { // Style for progress card
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
        paddingVertical: 30, // Give loader some space
    },
    // Removed statsContainer and statCard styles as they are commented out
    progressPlaceholder: {
        textAlign: 'center',
        paddingVertical: 30,
        paddingHorizontal: 10,
        fontStyle: 'italic',
        fontSize: 14,
    },
    // coachCard style can be added if needed
});

export default HomeScreen;