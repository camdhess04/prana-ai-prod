import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/MainTabNavigator';

type HomeScreenProps = BottomTabScreenProps<MainTabParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { user } = useAuth();

  const displayName = user?.username || user?.attributes?.email || 'User';

  const stats = {
    workoutsCompleted: 3,
    minutesAvg: 25,
    totalVolume: '4.5k'
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.text }]}>
          Hello, {displayName}
        </Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Welcome to your fitness journey
        </Text>
      </View>

      <Card style={styles.actionCard}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Today's Workout
        </Text>
        <Text style={[styles.cardDescription, { color: theme.secondaryText }]}>
          Your personalized workout is ready
        </Text>
        <Button
          title="Start Workout"
          onPress={() => navigation.navigate('Workout')}
          style={styles.cardButton}
        />
      </Card>

      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, { backgroundColor: theme.primary }]}>
          <Text style={[styles.statValue, { color: theme.buttonPrimaryText }]}>{stats.workoutsCompleted}</Text>
          <Text style={[styles.statLabel, { color: theme.buttonPrimaryText, opacity: 0.8 }]}>Workouts This Week</Text>
        </Card>

        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: theme.text }]}>{stats.minutesAvg}</Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Minutes Avg.</Text>
        </Card>

        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: theme.text }]}>{stats.totalVolume}</Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Total Volume</Text>
        </Card>
      </View>

      <Card>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Recent Progress
        </Text>
        <Text style={[styles.progressPlaceholder, { color: theme.secondaryText }]}>
          Progress charts will appear here as you log workouts
        </Text>
      </Card>

      <Card style={{marginTop: 16}}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Talk to Your AI Coach
        </Text>
        <Text style={[styles.cardDescription, { color: theme.secondaryText }]}>
          Get personalized guidance for your fitness journey
        </Text>
        <Button
          title="Chat Now"
          variant="outline"
          onPress={() => navigation.navigate('Trainer' as never)}
          style={styles.cardButton}
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
    paddingVertical: 40,
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
  },
  actionCard: {
    marginBottom: 16,
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
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  progressPlaceholder: {
    textAlign: 'center',
    paddingVertical: 30,
    paddingHorizontal: 10,
    fontStyle: 'italic',
    fontSize: 14,
  },
});

export default HomeScreen; 