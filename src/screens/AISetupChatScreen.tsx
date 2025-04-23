import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatMessageList from '../components/ChatMessageList';
import ChatInput from '../components/ChatInput';
import { ChatMessage } from '../types/chat';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import profileService from '../services/profileService';
import aiService from '../services/aiService';
import { v4 as uuid } from 'uuid';
import workoutService from '../services/workoutService';

// --- V1.5 Imports ---
import { generateClient } from 'aws-amplify/api';
import { createScheduledWorkout } from '../graphql/mutations'; // Import mutation
import { CreateScheduledWorkoutInput } from '../API'; // Import Input type
import { WorkoutTemplate } from '../types/workout'; // Import local type
import { addDays, format, getDay } from 'date-fns'; // Date functions
// --- End V1.5 Imports ---

type AISetupChatScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AISetupChat'>;
};

// --- V1.5 Helper ---
// Map day names to numbers used by date-fns getDay (0=Sunday, 1=Monday...)
const dayNameToNum: { [key: string]: number } = {
    sunday: 0, sun: 0,
    monday: 1, mon: 1,
    tuesday: 2, tue: 2, tues: 2,
    wednesday: 3, wed: 3,
    thursday: 4, thu: 4, thur: 4, thurs: 4,
    friday: 5, fri: 5,
    saturday: 6, sat: 6,
};
// --- End V1.5 Helper ---

const AISetupChatScreen: React.FC<AISetupChatScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { user, markOnboardingComplete } = useAuth();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Initialize Amplify client (can be done once outside if preferred)
  const client = useRef(generateClient()).current;


  useEffect(() => {
    setIsLoading(true); // Start loading
    const greet = async () => {
      try {
         const hello = await aiService.startOnboardingConversation();
         setMessages([hello]);
      } catch (error) {
          console.error("Failed to get initial greeting:", error);
          // Set a default fallback message
          setMessages([{
              id: uuid(),
              text: "Hi there! I seem to be having trouble connecting. Let's try starting with your fitness experience?",
              sender: 'ai',
              timestamp: new Date()
          }]);
      } finally {
          setIsLoading(false); // Stop loading after greeting attempt
      }
    };
    greet();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading || !user?.userId || !user?.username) {
        console.log("Send cancelled: No input, loading, or user info missing.");
        return;
    }

    const userMessage: ChatMessage = {
        id: uuid(),
        text: inputText.trim(),
        sender: 'user',
        timestamp: new Date(),
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInputText('');
    setIsLoading(true);
    flatListRef.current?.scrollToEnd({ animated: true });

    try {
        const aiResponse = await aiService.sendOnboardingMessage(userMessage.text, currentMessages);

        let potentialJsonMatch = null;
        let extractedJsonString = null;
        if (typeof aiResponse.text === 'string') {
            const jsonRegex = /```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/m;
            potentialJsonMatch = aiResponse.text.match(jsonRegex);
            if (potentialJsonMatch) {
                 extractedJsonString = potentialJsonMatch[1] || potentialJsonMatch[2];
                 console.log("AISetupChatScreen: Found potential JSON block.");
            }
        }

        let isFinalData = false;
        let profileData = null; // Use declared variable

        if (extractedJsonString) {
            try {
                profileData = JSON.parse(extractedJsonString); // Assign to declared variable
                if (profileData && typeof profileData === 'object' && ('primaryGoal' in profileData || 'age' in profileData)) {
                     isFinalData = true;
                     console.log("AI Onboarding Completed! Successfully parsed Profile Data:", profileData);

                    if (user?.userId && user?.username) {
                        setIsLoading(true); // Ensure loading stays true
                        let profileSaved = false; // Flag for successful profile save

                        // --- SAVE PROFILE ---
                        try {
                            // We need profileData later, ensure it's correctly typed if possible
                            const validatedProfileData = profileData as { availableDays?: string[], [key: string]: any };

                            await profileService.saveUserProfile(validatedProfileData, user.userId, user.username);
                            profileSaved = true; // Mark as saved
                            console.log("Profile Saved!");
                           // Don't Alert yet, do it after scheduling

                            // --- GENERATE PLAN & TEMPLATES ---
                            let savedTemplates: WorkoutTemplate[] = []; // Store saved templates
                            try {
                                const aiPlanWorkouts = await aiService.generateWorkoutPlan(validatedProfileData);

                                // Map template data for saving
                                const templatePromises = aiPlanWorkouts.map(async (day: any) => { // Use 'any' for AI response shape flexibility
                                    const cleanedExercises = (day.exercises || []).map((ex: any) => ({
                                        id: uuid(), // Generate new UUID for local state/keys if needed, DB generates its own ID
                                        name: ex.name || 'Unnamed Exercise', // Provide defaults
                                        sets: ex.sets?.toString() ?? '',
                                        reps: ex.reps?.toString() ?? '',
                                        weight: ex.weight?.toString() ?? null, // Default to null if empty
                                        restPeriod: typeof ex.restPeriod === 'number' ? ex.restPeriod : null, // Ensure number or null
                                        note: ex.note || '',
                                    }));

                                    // Call saveTemplate and return the result
                                    return workoutService.saveTemplate({
                                        userId: user.userId,
                                        owner: user.username,
                                        name: day.name || 'Unnamed Workout', // Provide default name
                                        description: day.description || '',
                                        exercises: cleanedExercises,
                                        isAIPlan: true, // Mark as AI Plan
                                    });
                                });

                                savedTemplates = (await Promise.all(templatePromises))
                                                    .filter((t): t is WorkoutTemplate => !!t); // Filter out potential nulls & type guard

                                console.log(`✅ Saved ${savedTemplates.length} AI plan templates.`);
                               // Don't Alert yet

                            } catch (planGenError: any) {
                                console.error('Plan generation or template saving failed:', planGenError);
                                Alert.alert('Plan Error', `AI plan could not be created or templates saved: ${planGenError.message || 'Unknown error'}`);
                                // Should we stop here or allow proceeding without a schedule? Stop for now.
                                throw planGenError; // Re-throw to be caught by outer block
                            }

                            // --- V1.5: SCHEDULE THE PLAN ---
                            if (savedTemplates.length > 0 && validatedProfileData?.availableDays) {
                                // Alert user before starting potentially long process
                                Alert.alert('Creating Schedule...', 'Your plan templates are saved. Now generating your weekly schedule.');
                                setIsLoading(true); // Ensure loading indicator stays active

                                try {
                                    console.log('Attempting to schedule generated plan...');
                                    const SCHEDULE_WEEKS = 4; // Schedule 4 weeks ahead
                                    const availableDaysLower = validatedProfileData.availableDays
                                        .map((day: string) => day?.toLowerCase())
                                        .filter((day): day is string => !!day); // Filter out nulls/empty strings

                                    const availableDayNumbers = availableDaysLower
                                        .map((day: string) => dayNameToNum[day]) // Map using helper
                                        .filter((num?: number): num is number => num !== undefined); // Filter out invalid day names

                                    if (availableDayNumbers.length === 0) {
                                        console.warn("No valid available days found in profile. Cannot schedule.");
                                        Alert.alert("Schedule Info", "Couldn't create schedule - please check available days in your profile.");
                                    } else {
                                        const startDate = new Date(); // Start scheduling from today
                                        const schedulePromises = [];
                                        let templateIndex = 0;

                                        console.log(`Scheduling for ${SCHEDULE_WEEKS} weeks, starting ${format(startDate, 'yyyy-MM-dd')}`);
                                        console.log(`Available day numbers: ${availableDayNumbers.join(', ')}. Templates available: ${savedTemplates.length}`);

                                        for (let dayIndex = 0; dayIndex < SCHEDULE_WEEKS * 7; dayIndex++) {
                                            const currentDate = addDays(startDate, dayIndex);
                                            const currentDayNum = getDay(currentDate); // 0 = Sunday, 1 = Monday...

                                            if (availableDayNumbers.includes(currentDayNum)) {
                                                const templateToAssign = savedTemplates[templateIndex % savedTemplates.length];
                                                const currentDateStr = format(currentDate, 'yyyy-MM-dd');

                                                // Check if templateToAssign and its id are valid
                                                if (!templateToAssign || !templateToAssign.id) {
                                                    console.error(`Error: Template at index ${templateIndex % savedTemplates.length} is invalid or missing ID.`);
                                                    continue; // Skip this day if template is invalid
                                                }

                                                const input: CreateScheduledWorkoutInput = {
                                                    userId: user.userId,
                                                    date: currentDateStr,
                                                    status: 'Scheduled',
                                                    workoutTemplateId: templateToAssign.id,
                                                    owner: user.username,
                                                };

                                                schedulePromises.push(client.graphql({
                                                    query: createScheduledWorkout,
                                                    variables: { input }
                                                }));
                                                console.log(`Scheduled ${templateToAssign.name} for ${currentDateStr}`);
                                                templateIndex++;
                                            }
                                            // Else: It's a rest day, do nothing (don't create entry)
                                        }

                                        if (schedulePromises.length > 0) {
                                             console.log(`Attempting to save ${schedulePromises.length} scheduled workouts...`);
                                             await Promise.all(schedulePromises);
                                             console.log('✅ Successfully scheduled workouts.');
                                             // Single success alert at the end
                                             Alert.alert('Setup Complete!', `Your profile is saved, plan templates are ready, and your ${SCHEDULE_WEEKS}-week schedule is created!`);

                                        } else {
                                             console.log('No workout days found in availability to schedule.');
                                             Alert.alert('Schedule Info', 'Profile saved and plan templates created, but could not schedule workouts based on provided availability.');
                                        }
                                    }
                                } catch (scheduleError: any) {
                                    console.error('❌ Error scheduling workout plan:', scheduleError);
                                    if (scheduleError?.errors) { console.error("GraphQL Errors:", scheduleError.errors); }
                                    Alert.alert('Scheduling Error', `Profile and templates saved, but could not automatically schedule your plan: ${scheduleError.message || 'Unknown error'}`);
                                    // Proceed even if scheduling fails
                                } finally {
                                     // Decide when to mark onboarding complete. After scheduling attempt seems reasonable.
                                     markOnboardingComplete(); // Trigger navigation
                                     setIsLoading(false); // Final loading state reset
                                }
                            } else {
                                 console.warn("Skipping scheduling: No saved templates or available days.");
                                 // Still mark complete even if scheduling skipped
                                 markOnboardingComplete();
                                 setIsLoading(false);
                            }
                            // --- END SCHEDULING ---

                        } catch (profileSaveError: any) { // Catch profile save errors
                            console.error("Failed to save profile:", profileSaveError);
                            Alert.alert("Error", `Could not save your profile: ${profileSaveError.message}`);
                            // Don't proceed to plan generation if profile save failed
                            setIsLoading(false); // Reset loading here on critical failure
                        }
                        // No finally block here, handled within schedule block or profile save catch

                    } else { // Should not happen if profileData is valid, but good check
                        console.error("User data missing during profile save trigger");
                        Alert.alert("Error", "User information is missing. Please try again.");
                        setIsLoading(false);
                    }
                } else {
                     console.warn("Parsed JSON object did not contain expected keys. Treating as text.", profileData);
                     profileData = null;
                     isFinalData = false;
                     setIsLoading(false); // Reset loading if not final data
                }
            } catch (parseError: any) {
                console.error("Failed to parse extracted JSON:", parseError);
                 isFinalData = false;
                 profileData = null;
                 setIsLoading(false); // Reset loading on parse failure
            }
        } else {
             // Not final data, just add AI response bubble
             setMessages(prevMessages => [...prevMessages, {
                 id: aiResponse.id, text: aiResponse.text,
                 sender: 'ai', timestamp: aiResponse.timestamp,
             }]);
             setIsLoading(false); // Stop loading after getting AI response
        }

    } catch (error) { // Catch errors from aiService.sendOnboardingMessage
         console.error("Error processing message in handleSend:", error);
          const errorMsg: ChatMessage = {
              id: uuid(), text: "Sorry, an error occurred communicating with the AI.",
              sender: 'ai', timestamp: new Date()
          };
          setMessages(prevMessages => [...prevMessages, errorMsg]);
          setIsLoading(false); // Reset loading on communication error
    }
    // Removed finally block from here, handled within specific try/catch blocks now
     // setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100); // Keep scroll? Optional
};

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust as needed
    >
      <View style={styles.chatContainer}>
        <ChatMessageList messages={messages} isLoading={isLoading} />
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading} // Pass loading state to disable input
          value={inputText}
          onChangeText={setInputText}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    // Removed justifyContent, allow list to grow and push input down
  },
});

export default AISetupChatScreen;