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

type AISetupChatScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AISetupChat'>;
};

const AISetupChatScreen: React.FC<AISetupChatScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { user, markOnboardingComplete } = useAuth();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const greet = async () => {
      const hello = await aiService.startOnboardingConversation();  // gets Claude opener
      setMessages([hello]);
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

    // Add user message optimistically and clear input
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInputText('');
    setIsLoading(true); // Show loading indicator for AI response
    flatListRef.current?.scrollToEnd({ animated: true }); // Scroll down

    try {
        // --- Call the REAL aiService ---
        // Pass the current messages array INCLUDING the latest user message for history
        const aiResponse = await aiService.sendOnboardingMessage(userMessage.text, currentMessages);
        // --- --- --- --- --- --- --- ---

        // --- UPDATED FINAL DATA CHECK ---
        let potentialJsonMatch = null;
        let extractedJsonString = null;
        if (typeof aiResponse.text === 'string') {
            // Regex to find a JSON object surrounded by optional characters/whitespace
            // Handles potential markdown code blocks ```json ... ``` or just { ... }
            const jsonRegex = /```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/m;
            potentialJsonMatch = aiResponse.text.match(jsonRegex);

            if (potentialJsonMatch) {
                 // Prefer capture group 1 (inside ```json) or fallback to group 2 (just {...})
                 extractedJsonString = potentialJsonMatch[1] || potentialJsonMatch[2];
                 console.log("AISetupChatScreen: Found potential JSON block.");
            }
        }

        let isFinalData = false;
        let profileData = null;

        // Check if we found and can parse the JSON
        if (extractedJsonString) {
            try {
                profileData = JSON.parse(extractedJsonString); // Try parsing the extracted string
                // Add a basic validation check again
                if (profileData && typeof profileData === 'object' && ('primaryGoal' in profileData || 'age' in profileData)) {
                     isFinalData = true; // Mark as final ONLY if parse AND validation succeed
                     console.log("AI Onboarding Completed! Successfully parsed Profile Data:", profileData);

                    // --- CALL REAL SAVE PROFILE ---
                    if (user?.userId && user?.username) {
                        setIsLoading(true);
                        try {
                            await profileService.saveUserProfile(profileData, user.userId, user.username);
                            Alert.alert("Profile Saved!", "Your initial profile is saved!"); // Update Alert text maybe
                            markOnboardingComplete(); // Trigger navigation via context state

                            // --- AI PLAN GENERATION & SAVE ---------------------------------
                            try {
                              const aiPlanWorkouts = await aiService.generateWorkoutPlan(profileData);

                              const savePromises = aiPlanWorkouts.map((day: { name: string; description: string; exercises: Array<{ id: string; name: string; sets: string; reps: string; weight: string; restPeriod: number | null; note: string }> }) => {
                                const cleanedExercises = day.exercises.map((ex: { id: string; name: string; sets: string; reps: string; weight: string; restPeriod: number | null; note: string }) => ({
                                  ...ex,
                                  id: uuid()
                                }));
                                return workoutService.saveTemplate({
                                  userId: user.userId,
                                  owner: user.username,
                                  name: day.name,
                                  description: day.description,
                                  exercises: cleanedExercises,
                                  isAIPlan: true
                                });
                              });

                              await Promise.all(savePromises);
                              console.log('✅  Saved AI plan templates:', savePromises.length);
                              Alert.alert('Plan Ready!', 'Your personalized AI program is live in Templates.');
                            } catch (e) {
                              console.error('Plan generation failed:', e);
                              Alert.alert('Oops', 'AI plan could not be created. You can retry later.');
                            }
                            // ----------------------------------------------------------------

                        } catch (saveError: any) {
                            console.error("Failed to save profile:", saveError);
                            Alert.alert("Error", `Could not save your profile: ${saveError.message}`);
                            setMessages(prev => [...prev, { 
                                id: uuid(), 
                                text: "Sorry, I couldn't save your profile right now.", 
                                sender: 'ai', 
                                timestamp: new Date() 
                            }]);
                        } finally { 
                            setIsLoading(false); 
                        }
                    } else {
                        console.error("User data missing during profile save");
                        Alert.alert("Error", "User information is missing. Please try again.");
                    }
                    // --- END REAL SAVE PROFILE ---

                } else {
                     // Parsed object didn't contain expected keys
                     console.warn("Parsed JSON object did not contain expected keys. Treating as text.", profileData);
                     profileData = null; // Reset parsed data
                     isFinalData = false;
                }
            } catch (e) {
                console.error("Failed to parse extracted JSON:", e);
                // JSON parsing failed, treat as regular text
                 isFinalData = false;
                 profileData = null;
            }
        }
        // --- END UPDATED CHECK ---

        // Add AI response message bubble ONLY if it wasn't the final data step OR if JSON parsing failed
        if (!isFinalData) {
            // Add the raw text from AI to the chat
            setMessages(prevMessages => [...prevMessages, {
                id: aiResponse.id,
                text: aiResponse.text, // Show the full AI text including any wrappers
                sender: 'ai',
                timestamp: aiResponse.timestamp,
            }]);
        }

    } catch (error) {
         console.error("Error processing message in handleSend:", error);
         // Add generic error message bubble
          const errorMsg: ChatMessage = { 
              id: uuid(), 
              text: "Sorry, an error occurred.", 
              sender: 'ai', 
              timestamp: new Date()
          };
          setMessages(prevMessages => [...prevMessages, errorMsg]);
    } finally {
        setIsLoading(false); // Stop loading indicator
        // Scroll again just in case error message added height
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
};

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.chatContainer}>
        <ChatMessageList messages={messages} isLoading={isLoading} />
        <ChatInput 
          onSend={handleSend}
          isLoading={isLoading}
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
    justifyContent: 'space-between',
  },
});

export default AISetupChatScreen; 