import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Card from '../components/Card';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../navigation/WorkoutNavigator';
import { Dumbbell, CalendarPlus, History, Zap, Brain, PlayCircle, Info, Hourglass } from 'lucide-react-native';
import { WorkoutSession as LocalWorkoutSession, WorkoutStatusValues } from '../types/workout';
import workoutService from '../services/workoutService';
import { useAuth } from '../context/AuthContext';

type WorkoutStartScreenNavigationProp = NativeStackNavigationProp<WorkoutStackParamList, 'WorkoutRoot'>;

// Function to format time (seconds into MM:SS)
const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const WorkoutStartScreen: React.FC = () => {
    const navigation = useNavigation<WorkoutStartScreenNavigationProp>();
    const { theme } = useAppTheme();
    const { user } = useAuth(); // Get the user object
    const userId = user?.userId;

    const [resumableSessionInfo, setResumableSessionInfo] = useState<LocalWorkoutSession | null | 'loading'>('loading');

    useFocusEffect(
      useCallback(() => {
        let isActive = true;
        const checkForResumableSession = async () => {
          if (!userId) {
            if (isActive) setResumableSessionInfo(null); // No user, so no resumable session
            return;
          }

          if (isActive) setResumableSessionInfo('loading'); // Set to loading before fetching
          try {
            console.log('WorkoutStartScreen: Checking for resumable session for userId:', userId);
            // Corrected to use getResumableSession as per our service definition
            const session = await workoutService.getResumableSession(userId); 
            if (isActive) {
              setResumableSessionInfo(session);
              if (session) {
                console.log(`WorkoutStartScreen: Found resumable session '${session.name}' (ID: ${session.id}, Status: ${session.status})`);
              } else {
                console.log('WorkoutStartScreen: No resumable session found.');
              }
            }
          } catch (error) {
            console.error('WorkoutStartScreen: Error fetching resumable session:', error);
            if (isActive) setResumableSessionInfo(null); // Set to null on error
          }
        };

        checkForResumableSession();

        return () => {
          isActive = false; // Cleanup to prevent state updates on unmounted component
        };
      }, [userId]) // Re-run if userId changes
    );

    const styles = StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: theme.background },
        container: { flexGrow: 1 },
        headerContainer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
        headerTitle: {
            fontSize: 30, // Slightly larger title
            fontFamily: theme.fontFamilyBold, // Space Grotesk Bold
            color: theme.text,
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 17,
            fontFamily: theme.fontFamilyRegular, // Space Grotesk Regular
            color: theme.secondaryText,
            lineHeight: 24, // Improved line height
        },
        card: {
            marginHorizontal: 20,
            marginBottom: 20,
            // Card component now handles its own internal padding and shadow/border
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10, // Space between icon/title and description
            // Padding now handled by Card's default or custom style if Card sets padding to 0
        },
        cardTitle: {
            fontSize: 19, // More prominent card titles
            fontFamily: theme.fontFamilyMonoMedium, // IBM Plex Mono Medium
            marginLeft: 12,
            color: theme.text,
        },
        cardDescription: {
            fontSize: 14,
            fontFamily: theme.fontFamilyMonoRegular, // IBM Plex Mono Regular
            color: theme.secondaryText,
            marginBottom: 20, // More space before button
            lineHeight: 20,
        },
        cardButton: {
            // Button component's internal padding and fullWidth prop will handle this
        },
        buttonText: { // Common text style for buttons on this screen
            fontFamily: theme.fontFamilyMedium, // Space Grotesk Medium for button text
        },
        scrollViewContent: { paddingBottom: 30, paddingTop: 8 },
        // Styles for the new resumable workout card
        infoCard: { // Used for loading and "no active workout" states
            marginHorizontal: 20,
            marginBottom: 20,
            padding: 16, // Explicit padding
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.cardBackground, // Standard card background
        },
        infoCardText: {
            fontFamily: theme.fontFamilyMonoRegular,
            fontSize: 14,
            color: theme.secondaryText,
        },
        // activeWorkoutCard is handled by inline styles for now for dynamic background/border
        activeWorkoutTitle: { // Re-using cardTitle but might need specific adjustments
            fontSize: 19,
            fontFamily: theme.fontFamilyMonoMedium,
            marginLeft: 10, // Space from icon
            color: theme.primary, // Emphasize with primary color
        },
        activeWorkoutDescription: { // Re-using cardDescription but might need adjustments
            fontSize: 14,
            fontFamily: theme.fontFamilyMonoRegular,
            color: theme.text, // Standard text for details
            marginTop: 8,
            lineHeight: 20,
        },
    });

    const cardSections = [
        {
            icon: <Dumbbell size={24} color={theme.primary} />,
            title: 'New Blank Workout',
            description: 'Start fresh and build your session as you go. Perfect for spontaneous training.',
            buttonTitle: 'Start Blank Session',
            onPress: () => navigation.navigate('NewWorkout'),
            buttonVariant: 'primary' as const,
        },
        {
            icon: <CalendarPlus size={24} color={theme.primary} />,
            title: 'From Template',
            description: 'Choose from your saved workout templates to begin a structured session.',
            buttonTitle: 'Select Template',
            onPress: () => navigation.navigate('SelectTemplate'),
            buttonVariant: 'secondary' as const,
        },
        {
            icon: <History size={24} color={theme.primary} />,
            title: 'Workout History',
            description: 'Review your past workouts, track your progress, and see how far you\'ve come.',
            buttonTitle: 'View History',
            onPress: () => navigation.navigate('WorkoutHistory'),
            buttonVariant: 'outline' as const,
        },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Ready to Train?</Text>
                    <Text style={styles.subtitle}>Log a new session, pick a template, or view your history.</Text>
                </View>

                {/* Active/Resumable Workout Section */}
                {resumableSessionInfo === 'loading' && (
                  <Card style={styles.infoCard}>
                    <ActivityIndicator size="small" color={theme.primary} />
                    <Text style={[styles.infoCardText, { marginLeft: 10 }]}>
                      Checking for active workout...
                    </Text>
                  </Card>
                )}

                {resumableSessionInfo && typeof resumableSessionInfo === 'object' && (
                  <Card style={[
                      styles.card, // Base card style
                      { 
                        backgroundColor: theme.primary + '1A', // Lighter tint (e.g., 10% opacity)
                        borderColor: theme.primary, 
                        borderWidth: 1, 
                        // marginBottom: 20 already in styles.card
                      }
                  ]}>
                    <View style={styles.cardHeader}>
                      {resumableSessionInfo.status === WorkoutStatusValues.PAUSED 
                        ? <PlayCircle size={22} color={theme.primary} /> 
                        : <Hourglass size={22} color={theme.primary} /> // Or Zap
                      }
                      <Text style={[styles.cardTitle, { color: theme.primary, marginLeft: 10 }]}>
                        {resumableSessionInfo.status === WorkoutStatusValues.PAUSED 
                          ? 'Resume Paused Workout' 
                          : 'Continue Active Workout'}
                      </Text>
                    </View>
                    <Text style={[styles.cardDescription, { color: theme.text, marginTop: 4, marginBottom: 4 }]}>
                      Workout: {resumableSessionInfo.name}
                    </Text>
                    {resumableSessionInfo.currentElapsedTime !== undefined && resumableSessionInfo.currentElapsedTime !== null && (
                      <Text style={[styles.cardDescription, { color: theme.secondaryText, fontSize: 13, marginTop: 0, marginBottom: 12 }]}>
                        Progress: {formatTime(resumableSessionInfo.currentElapsedTime)}
                      </Text>
                    )}
                    <Button
                      title={resumableSessionInfo.status === WorkoutStatusValues.PAUSED ? "Resume Now" : "Open Workout"}
                      variant="primary" 
                      onPress={() => {
                        if (resumableSessionInfo && typeof resumableSessionInfo === 'object') {
                          navigation.navigate('LogSession', { session: resumableSessionInfo });
                        }
                      }}
                      style={styles.cardButton}
                      textStyle={styles.buttonText}
                      fullWidth={true}
                    />
                  </Card>
                )}

                {resumableSessionInfo === null && (
                  <Card style={styles.infoCard}>
                    <Info size={18} color={theme.secondaryText} />
                    <Text style={[styles.infoCardText, { marginLeft: 10 }]}>
                      No active workout. Ready for a new one?
                    </Text>
                  </Card>
                )}

                {cardSections.map((section, index) => (
                    <Card key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            {section.icon}
                            <Text style={styles.cardTitle}>{section.title}</Text>
                        </View>
                        <Text style={styles.cardDescription}>{section.description}</Text>
                        <Button
                            title={section.buttonTitle}
                            onPress={section.onPress}
                            variant={section.buttonVariant}
                            style={styles.cardButton} // External button style (e.g. for margin if needed)
                            textStyle={styles.buttonText} // Apply common button text style
                            fullWidth={true} // Ensure buttons take full card width
                        />
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default WorkoutStartScreen; 