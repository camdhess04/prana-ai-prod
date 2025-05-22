// src/screens/HomeScreen.tsx
// V1.5 Update: Fetches and displays Today's Scheduled Workout
// V1.5.1 Update: Added SafeAreaView for proper screen fitting
// V1.5.2 Update: Added Completed status handling

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; // <-- UPDATED IMPORT
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckCircle2, CalendarDays, TrendingUp, Search, Zap, Lightbulb } from 'lucide-react-native'; // Add CheckCircle2 import
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/MainTabNavigator'; // Assuming navigation prop comes from here
import scheduleService from '../services/scheduleService'; // Import the new service
import workoutService, { UserWorkoutStats } from '../services/workoutService'; // Import workoutService and UserWorkoutStats
import { ScheduledWorkout as APIScheduledWorkout, WorkoutTemplate as APIWorkoutTemplate, Exercise as APIExercise } from '../API'; // Import API type

// Define a more specific type for the workout template potentially nested in ScheduledWorkout
type NestedWorkoutTemplate = Pick<APIWorkoutTemplate, 'id' | 'name' | 'description' | 'isAIPlan'> & {
    exercises?: { items: (Pick<APIExercise, 'id' | 'name' | 'sets' | 'reps' | 'weight' | 'restPeriod' | 'note'> | null)[] | null } | null
};

type HomeScreenProps = BottomTabScreenProps<MainTabParamList, 'Home'>;

const fitnessTips = [
    "Consistency over intensity! Small, regular efforts build lasting habits and results.",
    "Listen to your body. Rest days are just as important as workout days for recovery and growth.",
    "Proper form trumps heavy weight every time. Focus on quality movement to prevent injury.",
    "Fuel your gains! A balanced diet with enough protein is crucial for muscle repair and energy.",
    "Warm-up before every workout and cool-down afterwards to improve performance and reduce soreness.",
    "Challenge yourself progressively. Gradually increase weight, reps, or intensity to keep making progress.",
    "Sleep is your superpower. Aim for 7-9 hours of quality sleep for optimal recovery and hormone balance.",
    "Set realistic and specific goals. Knowing what you\'re working towards keeps motivation high.",
    "Find an activity you genuinely enjoy. Exercise shouldn\'t always feel like a chore!",
    "Track your progress! Seeing how far you\'ve come can be a huge motivator.",
    "Remember, the only bad workout is the one that didn\'t happen... or the one where you drop a dumbbell on your foot. Avoid that.",
    "Sweat is just your fat crying. Make it weep.",
    "Why did the scarecrow win an award? Because he was outstanding in his field! You can be too... in the gym.",
    "Your body can do anything. It\'s just your brain you have to convince... and sometimes your Netflix queue.",
    "I don\'t sweat, I sparkle. And right now, I\'m a disco ball."
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { theme } = useAppTheme();
    const { user, userProfile } = useAuth();
    const userId = user?.userId; // Get userId for fetching stats
    const insets = useSafeAreaInsets();
    // console.log('HomeScreen Insets:', JSON.stringify(insets));

    // State for today's workout: 'loading', 'rest', 'error', or the workout object
    const [todaysWorkout, setTodaysWorkout] = useState<APIScheduledWorkout | 'loading' | 'rest' | 'error'>('loading');
    const [isLoading, setIsLoading] = useState<boolean>(true); // Separate loading state
    const [workoutStats, setWorkoutStats] = useState<UserWorkoutStats | null | 'loading'>('loading'); // New state for stats
    const [currentTip, setCurrentTip] = useState<string>(fitnessTips[0]); // Initialize with the first tip

    // Use nickname from userProfile if available, then username, then email, then fallback
    const displayName = userProfile?.nickname || user?.username || (user && 'attributes' in user ? (user as any).attributes?.email : null) || 'User';

    // Moved styles definition inside the component to access theme
    const styles = StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme.background, // Ensure safe area bg matches theme
        },
        container: {
            flex: 1,
        },
        content: {
            paddingHorizontal: 20, // Consistent horizontal padding for scroll content
            paddingTop: Platform.OS === 'ios' ? insets.top + 10 : 20, // Adjust top padding for notch
            paddingBottom: insets.bottom + 20, // Ensure content doesn't hide behind bottom nav/notch
        },
        header: {
            marginBottom: 28, // Increased space after header
        },
        greeting: {
            fontSize: 32, // Slightly larger greeting
            fontFamily: theme.fontFamilyBold,
            color: theme.text,
            marginBottom: 4, // Space between greeting and subtitle
        },
        subtitle: {
            fontSize: 18, // Slightly larger subtitle
            fontFamily: theme.fontFamilyRegular,
            color: theme.secondaryText, // Use secondary text for less emphasis
        },
        // Base card style for consistency
        cardBase: {
            marginBottom: 20, // Consistent bottom margin for all cards
            padding: 18, // Slightly increased padding
            borderRadius: 12, // Softer corners
        },
        actionCard: { // For "Today's Workout"
            // Extends cardBase
        },
        statsCard: {
            // Extends cardBase
            // marginTop is handled by cardBase.marginBottom of previous element
        },
        centeredContentCard: { // New style to center content within a card
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 20, // Ensure some padding for centered content
        },
        statsTitle: {
            fontSize: 20,
            fontFamily: theme.fontFamilyBold,
            color: theme.text,
            marginBottom: 18,
            textAlign: 'left',
        },
        statRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14, // Increased padding slightly
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: theme.borderColor,
        },
        lastStatRow: {
            borderBottomWidth: 0,
        },
        statIconContainer: { // New style for icon
            marginRight: 12,
        },
        statTextContainer: { // New container for value and label, to push label to the right
            flex: 1, 
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        statValue: {
            fontSize: 24, 
            fontFamily: theme.fontFamilyMonoBold,
            color: theme.primary,
        },
        statLabel: {
            fontSize: 15,
            fontFamily: theme.fontFamilyRegular,
            color: theme.secondaryText,
            flexShrink: 1,
            textAlign: 'right',
        },
        horizontalCardContainer: {
            flexDirection: 'row',
            marginHorizontal: -6, // Negative margin to counteract card's internal padding if cards have margin themselves
        },
        halfWidthCard: {
            // Extends cardBase
            flex: 1,
            marginHorizontal: 6, // Space between half-width cards
            padding: 16, // Slightly less padding for smaller cards
        },
        cardTitle: { // General card title (can be overridden)
            fontSize: 18, 
            fontFamily: theme.fontFamilyBold, // Bolder titles
            color: theme.text,
            marginBottom: 10, // Consistent margin
        },
        cardDescription: { // General card description
            fontSize: 14,
            fontFamily: theme.fontFamilyRegular,
            color: theme.secondaryText,
            marginBottom: 16, // Consistent margin
            lineHeight: 20,
        },
        cardButton: { // Style for buttons within cards
            marginTop: 'auto', // Pushes button to bottom if content is shorter
            // Button component itself will handle its internal padding and text style
        },
        smallButton: {
            paddingVertical: 10, // Adjusted padding for a better tap target
            paddingHorizontal: 14,
        },
        smallButtonText: {
            fontSize: 14, // Slightly larger for readability
            fontFamily: theme.fontFamilyMedium,
        },
        loader: {
            paddingVertical: 30, 
            alignSelf: 'center',
        },
        completedHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10, // Increased space
        },
        // Text specific to info states in cards (e.g. Rest Day, Error)
        infoCardTextTitle: {
            fontSize: 18,
            fontFamily: theme.fontFamilyBold,
            color: theme.text,
            marginBottom: 6,
        },
        infoCardTextDescription: {
            fontSize: 14,
            fontFamily: theme.fontFamilyRegular,
            color: theme.secondaryText,
            lineHeight: 20,
        }
    });

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

            const fetchWorkoutStats = async () => {
              if (userId && isActive) { 
                setWorkoutStats('loading'); 
                try {
                  const stats = await workoutService.getUserWorkoutStats(userId);
                  if (isActive) {
                    setWorkoutStats(stats);
                  }
                } catch (error) {
                  console.error("HomeScreen: Error fetching workout stats:", error);
                  if (isActive) {
                    setWorkoutStats(null); 
                  }
                }
              } else {
                if (isActive) setWorkoutStats(null); 
              }
            };

            // Select a random tip
            if (isActive) {
                const randomIndex = Math.floor(Math.random() * fitnessTips.length);
                setCurrentTip(fitnessTips[randomIndex]);
            }

            fetchTodaysWorkout();
            fetchWorkoutStats(); // Call the new function to fetch stats

            return () => {
                isActive = false; // Cleanup function to set flag false when component unmounts/loses focus
            };
        }, [userId]) // Dependency array includes userId
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
                        <Text style={styles.infoCardTextTitle}>Rest Day</Text>
                        <Text style={styles.infoCardTextDescription}>
                            Time to recover and grow stronger! Enjoy your rest.
                        </Text>
                    </>
                );
            case 'error':
                return (
                    <>
                        <Text style={styles.infoCardTextTitle}>Error</Text>
                        <Text style={styles.infoCardTextDescription}>
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
                                    <Text style={styles.infoCardTextTitle}>
                                        Today: {workoutName}
                                    </Text>
                                    <CheckCircle2 size={24} color={theme.success} />
                                </View>
                                <Text style={[styles.infoCardTextDescription, { color: theme.success, fontFamily: theme.fontFamilyMedium }]}>
                                    Workout Completed! Great job! ✅
                                </Text>
                            </>
                        );
                    }

                    // Default case: Workout is Scheduled
                    return (
                        <>
                            <Text style={styles.infoCardTextTitle}>
                                Today: {workoutName}
                            </Text>
                            <Text style={styles.infoCardTextDescription}>
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
        <SafeAreaView style={styles.safeArea}>
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

                {/* Quick Stats Card */}
                {workoutStats === 'loading' && (
                  <Card style={[styles.cardBase, styles.statsCard, styles.centeredContentCard]}> 
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.statLabel, { textAlign: 'center', marginTop: 12, color: theme.secondaryText }]}>
                      Loading activity...
                    </Text>
                  </Card>
                )}

                {workoutStats && typeof workoutStats === 'object' && (
                  <Card style={[styles.cardBase, styles.statsCard]}>
                    <Text style={styles.statsTitle}>This Week's Activity</Text>
                    <View style={styles.statRow}>
                      <View style={styles.statIconContainer}>
                        <CalendarDays size={22} color={theme.primary} />
                      </View>
                      <View style={styles.statTextContainer}>
                        <Text style={styles.statValue}>{workoutStats.workoutsThisWeek}</Text>
                        <Text style={styles.statLabel}>Workouts This Week</Text>
                      </View>
                    </View>
                    <View style={[styles.statRow, styles.lastStatRow]}>
                      <View style={styles.statIconContainer}>
                        <TrendingUp size={22} color={theme.primary} />
                      </View>
                      <View style={styles.statTextContainer}>
                        <Text style={styles.statValue}>{workoutStats.totalWorkouts}</Text>
                        <Text style={styles.statLabel}>Total Workouts Logged</Text>
                      </View>
                    </View>
                  </Card>
                )}

                {/* Today's Workout Card */}
                <Card style={[styles.cardBase, styles.actionCard]}> 
                    <Text style={styles.cardTitle}>Today's Workout</Text>
                    {renderTodaysWorkoutCard()} 
                </Card>

                {/* Conditional rendering for Explore/Blank Workout OR Fitness Tip */}
                {(todaysWorkout === 'rest' || todaysWorkout === 'error' || (typeof todaysWorkout === 'object' && todaysWorkout?.status === 'Completed')) ? (
                    <View style={styles.horizontalCardContainer}>
                        <Card style={[styles.cardBase, styles.halfWidthCard, { marginRight: 0 }]}> 
                            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                                <Search size={18} color={theme.primary} style={{marginRight: 8}}/>
                                <Text style={[styles.cardTitle, { fontSize: 16, marginBottom: 0 }]}>Explore</Text>
                            </View>
                            <Text style={[styles.cardDescription, { fontSize: 12, marginBottom: 16, marginLeft: 26 }]}>
                                Discover new movements.
                            </Text>
                            <Button 
                                title="Browse Library"
                                onPress={() => navigation.navigate('Explore')}
                                variant="secondary"
                                style={styles.smallButton} 
                                textStyle={styles.smallButtonText}
                            />
                        </Card>
                        <Card style={[styles.cardBase, styles.halfWidthCard, { marginLeft: 0 }]}> 
                            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                                <Zap size={18} color={theme.primary} style={{marginRight: 8}}/>
                                <Text style={[styles.cardTitle, { fontSize: 16, marginBottom: 0 }]}>Quick Start</Text>
                            </View>
                            <Text style={[styles.cardDescription, { fontSize: 12, marginBottom: 16, marginLeft: 26 }]}>
                                Begin a new session.
                            </Text>
                            <Button 
                                title="Blank Workout"
                                onPress={() => navigation.navigate('Workout', { screen: 'NewWorkout' })}
                                variant="secondary"
                                style={styles.smallButton}
                                textStyle={styles.smallButtonText}
                            />
                        </Card>
                    </View>
                ) : (
                    // Show Fitness Tip if there IS an active/pending workout for today
                    (typeof todaysWorkout === 'object' && todaysWorkout?.status !== 'Completed') && (
                        <Card style={[styles.cardBase, styles.actionCard, {marginTop: 8}]}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                                <Lightbulb size={20} color={theme.primary} style={{marginRight: 10}}/>
                                <Text style={styles.cardTitle}>Fitness Tip</Text>
                            </View>
                            <Text style={styles.cardDescription}>
                                {currentTip}
                            </Text>
                            {/* Optionally, could add a button like "Learn More" or "Dismiss" if tips were dynamic */}
                        </Card>
                    )
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;