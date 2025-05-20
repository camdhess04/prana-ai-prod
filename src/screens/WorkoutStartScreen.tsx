import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Card from '../components/Card';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../navigation/WorkoutNavigator';
import { Dumbbell, CalendarPlus, History, Zap, Brain } from 'lucide-react-native';

type WorkoutStartScreenNavigationProp = NativeStackNavigationProp<WorkoutStackParamList, 'WorkoutRoot'>;

const WorkoutStartScreen: React.FC = () => {
    const navigation = useNavigation<WorkoutStartScreenNavigationProp>();
    const { theme } = useAppTheme();

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
            icon: <Brain size={24} color={theme.primary} />,
            title: 'AI Generated Plan',
            description: 'Let Prana AI craft a personalized workout plan based on your goals and history.',
            buttonTitle: 'Get AI Plan',
            onPress: () => navigation.navigate('AIPlan'),
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