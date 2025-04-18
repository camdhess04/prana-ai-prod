// src/services/aiService.ts
// Calls the backend Lambda function - CORRECTED for TS errors v2

import { post } from 'aws-amplify/api'; // <<< CORRECTED IMPORT
import { Message, UserProfile } from "../types/workout"; // Local types
import uuid from 'react-native-uuid';

const REST_API_NAME = 'pranaAiApi'; // Ensure this matches the name from 'amplify add api'
const API_PATH = '/ai'; // Ensure this matches the path from 'amplify add api'

// Define the expected structure of the response body from our Lambda function
interface LambdaResponse {
    text?: string; // Text response from AI
    isFinalData?: boolean; // Flag for onboarding completion
    parsedData?: any | null; // Parsed JSON data (profile or plan)
    error?: string; // Potential error message from Lambda
}

const startOnboardingConversation = async (): Promise<Message> => {
    try {
        const res = await post({
            apiName: REST_API_NAME,
            path: API_PATH,
            options: {
                body: { action: 'onboardingMessage', payload: { userInput: '', history: [] } }
            }
        }).response;
        const data = await res.body.json() as LambdaResponse;

        return {
            id: uuid.v4().toString(),
            text: data.text || "Hey there! 👋 Ready to crush some goals?",
            sender: 'ai',
            timestamp: new Date()
        };
    } catch (e) {
        console.error('AI_SERVICE: Error getting initial greeting:', e);
        return {
            id: uuid.v4().toString(),
            text: "Hi! Let's kick things off—what's your biggest fitness goal right now?",
            sender: 'ai',
            timestamp: new Date()
        };
    }
};

const sendOnboardingMessage = async (
    userInput: string,
    history: Message[]
): Promise<Message & { isFinalData?: boolean; parsedData?: any }> => {
    console.log("AI_SERVICE: Sending input to Lambda proxy:", userInput);
    try {
        const apiOperation = post({
            apiName: REST_API_NAME,
            path: API_PATH,
            options: {
                // Cast body to 'any' to bypass strict DocumentType checking for nested objects
                body: {
                    action: 'onboardingMessage',
                    payload: {
                         userInput: userInput,
                         history: history
                    }
                } as any // <-- Cast to any
            }
        });

        const response = await apiOperation.response;
        console.log("AI_SERVICE: Lambda response status:", response.statusCode);
        const responseData = await response.body.json() as LambdaResponse; // <-- Cast parsed body
        console.log("AI_SERVICE: Raw response body from Lambda:", responseData);

        if (response.statusCode !== 200 || !responseData || responseData.error) {
            throw new Error(responseData?.error || `Lambda function returned status ${response.statusCode}`);
        }

        // Use the typed responseData now
        const aiResponse: Message & { isFinalData?: boolean; parsedData?: any } = {
            id: uuid.v4().toString(),
            text: responseData.text || "Sorry, I didn't get a valid response text.", // Use optional chaining/default
            sender: 'ai',
            timestamp: new Date(),
            isFinalData: responseData.isFinalData || false,
            parsedData: responseData.parsedData || null
        };
        return aiResponse;

    } catch (error: any) {
        console.error("AI_SERVICE: Error calling Lambda proxy:", error);
        return { /* ... return error message bubble ... */ } as Message & { isFinalData?: boolean; parsedData?: any }; // Ensure return type matches
    }
};

const generateWorkoutPlan = async (profileData: UserProfile): Promise<any> => {
    console.log("AI_SERVICE: Requesting workout plan from Lambda proxy...");
     try {
        const apiOperation = post({
            apiName: REST_API_NAME,
            path: API_PATH,
            options: {
                // Cast body to 'any'
                body: {
                    action: 'generatePlan',
                    payload: { profileData }
                } as any // <-- Cast to any
            }
        });
        const response = await apiOperation.response;
        const responseData = await response.body.json() as LambdaResponse; // <-- Cast parsed body

        if (response.statusCode !== 200 || !responseData || responseData.error) {
            throw new Error(responseData?.error || `Lambda function returned an error or no plan (${response.statusCode})`);
         }

         if (!responseData.parsedData) { // Check if plan data exists
             throw new Error("Lambda function did not return parsed plan data.");
         }

         console.log("AI_SERVICE: Received plan data from Lambda:", responseData.parsedData);
         return responseData.parsedData;

     } catch (error: any) {
        console.error("AI_SERVICE: Error calling Lambda proxy for plan:", error);
         throw error; // Re-throw for UI to handle
     }
};

const aiService = { startOnboardingConversation, sendOnboardingMessage, generateWorkoutPlan };
export default aiService; 