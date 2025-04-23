/* amplify/backend/function/pranaAiProxy/src/index.js */
/* eslint-disable @typescript-eslint/no-var-requires */
// Uses Anthropic SDK - Fetches API Key from SSM - Includes Plan Generation Logic
// Personality: Friendly, Encouraging Coach with Humor
// Fixes: Empty messages array error, Uses Sonnet 3.5 for plan gen, Increased plan tokens, Stricter availableDays prompt

const Anthropic = require("@anthropic-ai/sdk");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const MODEL_NAME = "claude-3-haiku-20240307"; // Good for chat
const PLAN_MODEL_NAME = "claude-3-5-sonnet-20240620"; // Faster plan generation
const MAX_TOKENS_CHAT = 1500;
const MAX_TOKENS_PLAN = 4096; // Keep at 4096
const API_KEY_PARAM_NAME = "/prana-ai/dev/anthropic-api-key";
const AWS_REGION = "us-east-1"; // Make sure this matches your AWS region

const ssmClient = new SSMClient({ region: AWS_REGION });
let anthropic;
let apiKey = null;
let initializationError = null;

async function getApiKey() {
    if (apiKey) {
        console.log("LAMBDA: Using cached API key.");
        return apiKey;
    }
    console.log(`LAMBDA: Attempting to fetch API key from SSM Parameter: ${API_KEY_PARAM_NAME}`);
    try {
        const command = new GetParameterCommand({ Name: API_KEY_PARAM_NAME, WithDecryption: true });
        const response = await ssmClient.send(command);
        const key = response.Parameter?.Value;
        if (!key) throw new Error("API Key parameter found but value is empty.");
        const keyPrefix = key.substring(0, 7);
        const keySuffix = key.substring(key.length - 4);
        console.log(`LAMBDA: Successfully fetched API key from SSM. Preview: ${keyPrefix}.........${keySuffix} (Length: ${key.length})`);
        apiKey = key;
        return apiKey;
    } catch (error) {
        console.error(`LAMBDA ERROR: Failed to fetch API Key from SSM:`, error);
        throw new Error(`AI Service config error: ${error.message}`);
    }
}

// --- Prompts ---
const onboardingSystemPrompt = `You are Prana, an AI personal trainer and strength coach for the Prana AI fitness app. Your personality is like a friendly, encouraging, and highly knowledgeable coach who also has a bit of a sense of humor (think supportive fitness buddy meets expert). You're enthusiastic, empathetic, motivating, and maybe occasionally crack a light, relevant joke or use a fun analogy. Your primary goal right now is to onboard a new user by getting to know them through a natural, flowing conversation, gathering the essential info needed to eventually create their *awesome*, personalized workout plan.

Start by greeting the user warmly! Introduce yourself and immediately ask for their **first name** so you can stop calling them 'user' (because that's boring!). Something like: "Hey there! I'm Prana, your AI sidekick in the Prana app, ready to help you crush your fitness goals! 💪 Super stoked to work with you. First things first, what name should I call you?". Use their name when appropriate in future messages. Sprinkle in relevant emojis (like 💪, 🔥, 🤔, ✅, 🎉) naturally throughout the chat, but don't overdo it. Keep the tone upbeat, supportive, and engaging. Ask only 1-2 concise questions per turn to keep the chat flowing.

Guide the user through these topics like you're having a friendly consultation:

1.  **Welcome & Name:** Greet them warmly, introduce yourself, get their first name.
2.  **Experience Level:** Once you have their name, transition smoothly. Ask about their current fitness journey. Examples: "Awesome, nice to meet you, [User Name]! So, tell me a bit about your training background. Are you just kicking things off, have you been hitting it consistently for a while, or are you basically a seasoned pro at this point? (No judgment either way!)". Gently guide them towards "Beginner", "Intermediate", or "Advanced".
3.  **Primary Goal:** Find out the *main mission*. "Alright, [User Name], focus time! What's the number one target we're aiming for right now? Building muscle like the Hulk? Chasing pure strength? Looking to lean down? Boost that endurance? Just aiming for awesome overall health and fitness? Or maybe training for a specific sport?" (Offer examples like Hypertrophy, Strength, Fat/Weight Loss, Endurance, General Health, Athletic Performance).
4.  **Secondary Goals:** "Got it! Besides that main goal, is there anything else important on your fitness radar right now?"
5.  **Time Commitment:** Frame this realistically. "Okay, let's talk logistics. Realistically, how many days per week can you dedicate to working out? And roughly how much time, in minutes, do you usually have per session? (Be honest! Even 30 minutes is great if that's what fits!)" Get **days per week** AND **average minutes per session**.
6.  **Current Split/Preferences (Optional):** "Cool. Are you following a specific workout routine or split right now (like PPL, Upper/Lower, Full Body, etc.)? And how are you liking it? Also, super important – any exercises you absolutely LOVE doing, or any you'd rather avoid like burpees on a Monday morning? 😉 We can work with your current faves or build something fresh!"
7.  **Onboarding Depth (User Choice):** Briefly explain the trade-off. "Alright, [User Name], I've got a good picture now and could definitely build you a solid starting plan. BUT, if you're cool sharing a few more details (like age, height, weight, any old injuries nagging you), I can make the plan even *more* laser-focused on you. What do you prefer? A 'Quick Start' based on what we have, or dive into a few 'Extra Details' for max personalization?" Store their choice as "chill" (quick) or "intermediate" (detailed). Proceed based on their choice.
8.  **Metrics (If 'intermediate' Chosen):** "Awesome! Let's get those details. What's your age? And what's your current height and weight? (Let me know the units you prefer, like cm or ft/in, kg or lbs!). Also, if you're comfortable sharing, your gender can sometimes help fine-tune programming (totally optional though!)."
9.  **Health/History (If 'intermediate' Chosen):** "Super important one: Any current or past injuries, aches, pains, or physical limitations I should definitely know about? (e.g., 'My left shoulder gets grumpy on overhead presses', 'Patella tendonitis flares up sometimes')."
10. **Performance Notes (Optional, If 'intermediate' Chosen):** "Last one! Any notes on your current performance you wanna share? Like recent personal bests (PRs) you're proud of 🔥, or maybe the typical weights you use for key lifts like squats, bench, or deadlifts? No pressure if not!"

**VERY IMPORTANT - FINAL OUTPUT:**
Okay, deep breath! Once you are confident you have gathered all the necessary information based on their chosen onboarding depth ('chill' or 'intermediate'), your **ONLY** response must be a single, valid JSON object formatted exactly like this example. No extra chat before or after! No "Okay, here's your JSON profile:", just the raw JSON. Use \`null\` for any keys where info wasn't provided. **Crucially, for 'availableDays', provide an array of strings with the actual lowercase names of the days (e.g., "monday", "tuesday"). Do NOT provide ranges like "4-6 days".**

\`\`\`json
{
  "age": number | null,
  "heightCm": number | null,
  "weightKg": number | null,
  "gender": string | null,
  "experienceLevel": string | null,
  "primaryGoal": string | null,
  "secondaryGoal": string | null,
  "injuriesOrLimitations": string | null,
  "performanceNotes": string | null,
  "preferredSplit": string | null,
  "likedExercises": string[] | null,
  "dislikedExercises": string[] | null,
  "availableDays": ["monday", "wednesday", "friday"] | null, // <-- MODIFIED Example & Instruction! MUST be array of day names (lowercase) or null.
  "timePerSessionMinutes": number | null,
  "onboardingLevel": string | null
}
\`\`\`

Remember your persona: Friendly, encouraging, knowledgeable coach with a touch of humor. Keep the conversation flowing naturally. Start now by greeting the user and asking for their name!
`; // End of revised onboarding prompt string

const planGenerationSystemPrompt = `You are Prana, an expert personal trainer creating a workout plan based on user data. Your response MUST be ONLY a valid JSON array containing workout objects. Each workout object represents one day/template and must strictly follow this structure:
{
  "name": "Descriptive Name (e.g., AI Push Day A, AI Full Body 1)",
  "description": "Brief description of this workout's focus (e.g., Chest, Shoulders, Triceps focus)",
  "isAIPlan": true,
  "exercises": [
    {
      "id": "placeholder_id", // Use a placeholder, the frontend will generate real IDs
      "name": "Exercise Name (e.g., Barbell Bench Press)",
      "sets": "Target Sets (e.g., '3', '3-4')",
      "reps": "Target Reps (e.g., '8-12', '5', 'AMRAP')",
      "weight": "Suggested Starting Weight (e.g., '135 lbs', 'Bodyweight', '' for none)",
      "restPeriod": Number | null, // Rest in seconds (e.g., 60, 90) or null
      "note": "Optional brief note (e.g., 'Focus on tempo', 'Use incline bench')"
    }
    // ... more exercises for this workout day
  ]
}
Generate a plan appropriate for the user's profile (provided in the user message). Consider their experience level, goals, available time/days, preferences, and reported injuries/limitations (e.g., avoid aggravating patella tendonitis). Do not include any other text, greetings, or explanations before or after the JSON array.`;

/**
 * AWS Lambda handler function
 */
exports.handler = async (event) => {
  console.log('LAMBDA: Handler invoked.');
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
  };

  // Handle OPTIONS preflight requests
  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    console.log("LAMBDA: Handling OPTIONS preflight request");
    return { statusCode: 204, headers, body: '' };
  }

  // Initialize client if needed
  if (!anthropic && !initializationError) {
    try {
      const key = await getApiKey();
      const keyPrefix = key.substring(0, 7);
      const keySuffix = key.substring(key.length - 4);
      console.log(`LAMBDA: Initializing Anthropic client with key: ${keyPrefix}.........${keySuffix} (Length: ${key.length})`);
      anthropic = new Anthropic({ apiKey: key });
      console.log("LAMBDA: Anthropic client initialized successfully.");
    } catch (error) {
      console.error("LAMBDA ERROR: Failed to initialize Anthropic client:", error);
      initializationError = error.message || "Failed to initialize AI Client";
    }
  }

  if (initializationError || !anthropic) {
    console.error("LAMBDA ERROR: Anthropic client failed initialization:", initializationError);
    return { statusCode: 500, headers, body: JSON.stringify({ error: initializationError || 'Internal Server Error: AI Service init failed.' }) };
  }

  let requestBody;
  try {
    requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    if (!requestBody || !requestBody.action || !requestBody.payload) throw new Error("Missing action/payload");
    console.log("LAMBDA: Parsed request body action:", requestBody.action);
  } catch (e) {
    console.error("LAMBDA ERROR: Failed to parse request body:", e);
    return { statusCode: 400, headers, body: JSON.stringify({ error: `Invalid request body format: ${e.message}` }) };
  }

  // --- Main Logic ---
  try {
    let responseContent = "Default error response.";
    let isFinalData = false;
    let parsedData = null;

    // --- Onboarding Message Action ---
    if (requestBody.action === 'onboardingMessage') {
      const { userInput, history } = requestBody.payload;
      // Ensure history is an array, even if it's missing or null from payload
      const validHistory = Array.isArray(history) ? history : [];

      let messagesForClaude = validHistory
        .filter(m => m && m.text) // Filter out any null/undefined messages or messages without text
        .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

      // Add the current user input as the latest message if it exists
      if (userInput && typeof userInput === 'string' && userInput.trim()) {
          messagesForClaude.push({ role: 'user', content: userInput.trim() });
      }

      // Fix for empty messages array: Anthropic requires ≥1 message
      if (messagesForClaude.length === 0) {
          console.log("LAMBDA: History and userInput were empty. Sending placeholder message to Claude.")
          messagesForClaude = [{ role: 'user', content: '[Start Conversation]' }]; // Use placeholder
      }

      console.log(`LAMBDA: Calling Claude (${MODEL_NAME}) for onboarding... Message count: ${messagesForClaude.length}`);
      const claudeResponse = await anthropic.messages.create({
        model: MODEL_NAME,
        max_tokens: MAX_TOKENS_CHAT,
        system: onboardingSystemPrompt, // Use the NEW revised prompt
        messages: messagesForClaude,
      });
      console.log("LAMBDA: Raw Claude Response Content Type:", claudeResponse.content?.[0]?.type);

      if (claudeResponse.content?.[0]?.type === 'text') {
        responseContent = claudeResponse.content[0].text;
         // Use regex to find JSON block, handling potential ```json ... ``` wrappers
        const jsonRegex = /```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/m;
        const potentialJsonMatch = responseContent.match(jsonRegex);
        const extractedJsonString = potentialJsonMatch ? (potentialJsonMatch[1] || potentialJsonMatch[2]) : null;

        if (extractedJsonString) {
          try {
            parsedData = JSON.parse(extractedJsonString);
            // Basic validation check
            if (parsedData && typeof parsedData === 'object' && ('primaryGoal' in parsedData || 'age' in parsedData || 'experienceLevel' in parsedData)) {
              isFinalData = true;
              console.log("LAMBDA: Detected final PROFILE JSON data.");
              // Keep the original response text containing the JSON for the client
              // responseContent = extractedJsonString; // Don't do this, client expects text response + parsedData
            } else {
              parsedData = null; // Parsed but didn't validate
              isFinalData = false;
            }
          } catch (e) {
            console.warn("LAMBDA: Failed to parse potential JSON block:", e);
            isFinalData = false; // Failed parse
            parsedData = null;
          }
        } else {
            isFinalData = false; // No JSON block found
            parsedData = null;
        }
      } else {
        throw new Error("Unexpected response format from Claude");
      }
    }
    // --- Generate Plan Action ---
    else if (requestBody.action === 'generatePlan') {
      const { profileData } = requestBody.payload;
      if (!profileData) throw new Error("Missing profileData for plan generation");

      const planUserPrompt = `Here is the user profile, please generate the workout plan JSON array: ${JSON.stringify(profileData, null, 2)}`;

      console.log(`LAMBDA: Calling Claude (${PLAN_MODEL_NAME}) for plan generation...`);
      const claudeResponse = await anthropic.messages.create({
        model: PLAN_MODEL_NAME,
        max_tokens: MAX_TOKENS_PLAN, // Use 4096 limit
        system: planGenerationSystemPrompt,
        messages: [{ role: 'user', content: planUserPrompt }]
      });
      console.log("LAMBDA: Raw Claude Plan Response Content Type:", claudeResponse.content?.[0]?.type);

      if (claudeResponse.content?.[0]?.type === 'text') {
        responseContent = claudeResponse.content[0].text;
        try {
          // Trim whitespace just in case
          parsedData = JSON.parse(responseContent.trim());
          // Validate it's an array and has the expected structure
          if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].name && parsedData[0].exercises) {
            console.log(`LAMBDA: Successfully parsed workout plan JSON with ${parsedData.length} workout days.`);
            isFinalData = true;
          } else {
            console.error("LAMBDA ERROR: AI response did not contain valid plan JSON array structure.", parsedData);
            throw new Error("AI failed to generate a valid workout plan structure.");
          }
        } catch (e) {
          console.error("LAMBDA ERROR: Failed to parse plan JSON array from AI response:", e);
          console.log("Raw response that failed parsing:", responseContent);
          // Throw specific error to distinguish parsing failure from other issues
          throw new Error(`AI returned an invalid format for the workout plan. Parse Error: ${e.message}`);
        }
      } else {
        throw new Error("Unexpected response format from Claude during plan generation");
      }
    }
    // --- Unknown Action ---
    else {
      throw new Error(`Unknown action received: ${requestBody.action}`);
    }

    // --- Format Success Response ---
    const lambdaResponse = { text: responseContent, isFinalData, parsedData };
    console.log("LAMBDA: Sending success response back.");
    return { statusCode: 200, headers, body: JSON.stringify(lambdaResponse) };

  } catch (error) {
    console.error("LAMBDA ERROR: Error processing AI request:", error);
    let errorMessage = error.message || 'Internal Server Error processing AI request';
    // Add more specific error checking based on potential error types/statuses
    if (error.constructor && error.constructor.name === 'AuthenticationError') {
         console.error("Anthropic Authentication Error - Check API Key again!");
         errorMessage = "AI Authentication Error: Invalid API Key provided.";
    } else if (error.constructor && error.constructor.name === 'APIError') {
         console.error(`Anthropic API Error (${error.status || 'unknown'}):`, error.message);
         errorMessage = `AI Service Error: ${error.message}`;
     } else if (error.status === 400) {
         console.error("Anthropic Bad Request Error (400):", error.message);
         errorMessage = `AI Service Bad Request: ${error.message}`;
     } else if (error.status === 404) {
         console.error("Anthropic Not Found Error (404):", error.message);
         errorMessage = `AI Service Not Found Error (Model incorrect?): ${error.message}`;
     } else if (error.message?.includes("invalid format for the workout plan")) {
        // Keep the specific parsing error message
        errorMessage = error.message;
     }
    return { statusCode: 500, headers, body: JSON.stringify({ error: errorMessage }) };
  }
};