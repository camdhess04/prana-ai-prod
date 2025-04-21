                </View>
            </Card>

            {/* Temporarily removed for testing phase
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
            */}

            <Card>
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