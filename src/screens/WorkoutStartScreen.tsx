import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Card from '../components/Card';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../navigation/WorkoutNavigator';

type WorkoutStartScreenProps = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutRoot'>;

const WorkoutStartScreen: React.FC<WorkoutStartScreenProps> = ({ navigation }) => {
    const { theme } = useAppTheme();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.content}
        >
            <Card elevation={2} style={styles.mainCard}>
                <Text style={[styles.title, { color: theme.text }]}>Ready to Train</Text>
                <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
                    Choose an option below to start your workout
                </Text>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Create New Workout"
                        onPress={() => navigation.navigate('NewWorkout')}
                        style={styles.button}
                    />

                    <Button
                        title="Use Previous Workout"
                        variant="outline"
                        onPress={() => navigation.navigate('SelectTemplate')}
                        style={styles.button}
                    />
                </View>
            </Card>

            <Card style={styles.planCard}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>
                        Your AI Workout Plan
                    </Text>
                </View>

                <Text style={[styles.planDescription, { color: theme.secondaryText }]}>
                    Get personalized workouts tailored to your goals and progress
                </Text>

                <Button
                    title="View Your Plan"
                    variant="secondary"
                    onPress={() => navigation.navigate('AIPlan')}
                    style={styles.planButton}
                />
            </Card>

            <Card>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>
                        Workout History
                    </Text>
                </View>

                <Text style={[styles.planDescription, { color: theme.secondaryText }]}>
                    Review your past workouts and track your progress
                </Text>

                <Button
                    title="View History"
                    variant="secondary"
                    onPress={() => navigation.navigate('WorkoutHistory')}
                    style={styles.planButton}
                />
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    mainCard: {
        marginBottom: 20,
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    buttonContainer: {
        gap: 12,
    },
    button: {
        // Buttons will take full width by default
    },
    planCard: {
        marginBottom: 16,
    },
    cardHeader: {
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    planDescription: {
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    planButton: {
        alignSelf: 'flex-start',
    },
});

export default WorkoutStartScreen; 