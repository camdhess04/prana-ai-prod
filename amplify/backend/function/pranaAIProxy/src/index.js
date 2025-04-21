/* amplify/backend/function/pranaAiProxy/src/index.js */
/* eslint-disable @typescript-eslint/no-var-requires */
// Uses Anthropic SDK - Fetches API Key from SSM - Includes Plan Generation Logic
// Contains fixes for:
// 1. Empty messages array error on initial call.
// 2. Uses Sonnet 3.5 model for plan generation for better speed.

const Anthropic = require("@anthropic-ai/sdk");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const MODEL_NAME = "claude-3-haiku-20240307";
const PLAN_MODEL_NAME = "claude-3-5-sonnet-20240620"; // Use Sonnet 3.5 for faster plan generation
const MAX_TOKENS_CHAT = 1500;
const MAX_TOKENS_PLAN = 2048; // Allow more tokens for plan generation
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
        console.log(`LAMBDA: Successfully fetched API key from SSM. Preview: ${keyPrefix}......${keySuffix} (Length: ${key.length})`);
        apiKey = key;
        return apiKey;
    } catch (error) {
        console.error(`LAMBDA ERROR: Failed to fetch API Key from SSM:`, error);
        throw new Error(`AI Service config error: ${error.message}`);
    }
}

// --- Prompts ---
const onboardingSystemPrompt = `You are Prana, an friendly, enthusiastic, empathetic, and highly knowledgeable personal trainer and strength coach for the Prana AI fitness app. Your personality is motivating and supportive. Your primary goal right now is to onboard a new user by getting to know them and gathering essential information to create their optimal, personalized workout plan.

Start by greeting the user warmly, ask for their **first name** so you can address them personally in future messages, and sprinkle an emoji or two. Begin by asking the user "What should I call you?" so you can use their first name. You greet each new user by name if provided, sprinkle an emoji or two, and speak in an upbeat but not cringe tone. Engage the user in a natural, flowing conversation. Ask only 1-2 concise questions per turn. Use emojis occasionally to keep the tone light and encouraging! When asking for measurements like height and weight, please ask for the units they prefer (e.g., cm or ft/in, kg or lbs) - we can convert later if needed.

Guide the user through the following topics:

1.  **Welcome & Experience:** Start with a friendly welcome. Ask for their current fitness experience level (e.g., "Just starting out", "Been training consistently for a while", "Very experienced/Advanced"). Guide them toward "Beginner", "Intermediate", or "Advanced".
2.  **Primary Goal:** Ask about their main fitness goal right now. Examples: Build Muscle (Hypertrophy), Get Stronger (Strength), Lose Fat/Weight, Improve Endurance, General Health & Fitness, Athletic Performance.
3.  **Secondary Goals:** Ask if they have any other important fitness goals.
4.  **Time Commitment:** Ask how many days per week they can realistically train, AND the average time (in minutes) they usually have for each workout session.
5.  **Time Available Per Session (ask for **one average number in minutes**, e.g. 60)**
6.  **Current Split/Preferences (Optional):** Ask if they are currently following a specific workout split (like PPL, Upper/Lower, Full Body etc.) and if they like it. Ask if there are any specific exercises they love doing or any they really dislike or want to avoid. Mention you can optimize their current split or create something new.
7.  **Onboarding Depth (User Choice):** Briefly explain you can create a solid plan now, but more details allow for better personalization. Ask if they prefer a "Quick Setup" (using info gathered so far) or if they're happy to provide a few more "Detailed Stats" (like age, height, weight, injuries). Store their choice as "chill" (quick) or "intermediate" (detailed). Proceed based on choice.
8.  **Metrics (If Detailed Chosen):** Ask for Age, Height (value+units), Weight (value+units). Also ask *if they're comfortable sharing* their Gender (optional).
9.  **Health/History (If Detailed Chosen):** Ask about any current or past Injuries or physical Limitations you should be aware of.
10. **Performance Notes (Optional, If Detailed Chosen):** Ask if they want to share any notes on their current performance, like recent personal records (PRs) or typical weights used on key exercises (e.g., squat, bench, deadlift).

**VERY IMPORTANT - FINAL OUTPUT:**
Once you are confident you have gathered all the necessary information based on their chosen onboarding depth ("chill" or "intermediate"), your **ONLY** response must be a single, valid JSON object. Do not include *any* other text, greetings, summaries, or explanations before or after the JSON (e.g., no "Okay, here is the JSON:" or "Thanks!"). The JSON object must contain these exact keys, using the collected data or \`null\` if the information wasn't provided or applicable:

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
  "availableDays": string[] | null,
  "timePerSessionMinutes": number | null,
  "onboardingLevel": string | null
}
\`\`\`

Start the conversation now with your friendly welcome and ask for their fitness experience level.
`; // End of prompt string

// New prompt specifically for plan generation
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
      console.log(`LAMBDA: Initializing Anthropic client with key: ${keyPrefix}......${keySuffix} (Length: ${key.length})`);
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

      // *** FIX for empty messages array: Anthropic requires ≥1 message ***
      if (messagesForClaude.length === 0) {
          console.log("LAMBDA: History and userInput were empty. Sending placeholder message to Claude.")
          // Sending an empty content user message, or a generic starter
          // An empty content message might be sufficient and less likely to confuse the initial prompt.
          messagesForClaude = [{ role: 'user', content: '[Start Conversation]' }];
      }
      // *** END FIX ***

      console.log(`LAMBDA: Calling Claude (${MODEL_NAME}) for onboarding... Message count: ${messagesForClaude.length}`);
      const claudeResponse = await anthropic.messages.create({
        model: MODEL_NAME,
        max_tokens: MAX_TOKENS_CHAT,
        system: onboardingSystemPrompt,
        messages: messagesForClaude, // Pass the potentially fixed array
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
            if (parsedData && typeof parsedData === 'object' && ('primaryGoal' in parsedData || 'age' in parsedData)) {
              isFinalData = true;
              console.log("LAMBDA: Detected final PROFILE JSON data.");
              // Important: Return the PARSED data, but keep the original text response (which might include intro text)
              responseContent = extractedJsonString; // Send back just the JSON string in 'text' for easier client parsing? Or keep original? Let's keep original for now.
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

      // Construct the prompt for plan generation
      const planUserPrompt = `Here is the user profile, please generate the workout plan JSON array: ${JSON.stringify(profileData, null, 2)}`;

      // *** USE CORRECT MODEL FOR PLAN GENERATION ***
      console.log(`LAMBDA: Calling Claude (${PLAN_MODEL_NAME}) for plan generation...`);
      const claudeResponse = await anthropic.messages.create({
        model: PLAN_MODEL_NAME, // Use the specified Sonnet model
        max_tokens: MAX_TOKENS_PLAN,
        system: planGenerationSystemPrompt,
        messages: [{ role: 'user', content: planUserPrompt }]
      });
      // *** END MODEL FIX ***
      console.log("LAMBDA: Raw Claude Plan Response Content Type:", claudeResponse.content?.[0]?.type);

      if (claudeResponse.content?.[0]?.type === 'text') {
        responseContent = claudeResponse.content[0].text;
        // Attempt to parse the response directly as JSON Array
        try {
          // Trim whitespace in case the model adds extra newlines
          parsedData = JSON.parse(responseContent.trim());
          // Validate it's an array and has the expected structure
          if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].name && parsedData[0].exercises) {
            console.log(`LAMBDA: Successfully parsed workout plan JSON with ${parsedData.length} workout days.`);
            isFinalData = true; // Mark true to indicate successful plan generation
          } else {
            console.error("LAMBDA ERROR: AI response did not contain valid plan JSON array structure.", parsedData);
            throw new Error("AI failed to generate a valid workout plan structure.");
          }
        } catch (e) {
          console.error("LAMBDA ERROR: Failed to parse plan JSON array from AI response:", e);
          console.log("Raw response that failed parsing:", responseContent); // Log the raw response
          throw new Error(`AI returned an invalid format for the workout plan.`);
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
    // For plan generation, text might be just the JSON, parsedData is the JS array
    // For onboarding, text is the AI chat message, parsedData is null until the final step where it holds the profile object
    const lambdaResponse = { text: responseContent, isFinalData, parsedData };
    console.log("LAMBDA: Sending success response back.");
    return { statusCode: 200, headers, body: JSON.stringify(lambdaResponse) };

  } catch (error) {
    console.error("LAMBDA ERROR: Error processing AI request:", error);
    let errorMessage = error.message || 'Internal Server Error processing AI request';
    // Check for specific Anthropic error types if the SDK provides them clearly
    if (error.constructor && error.constructor.name === 'AuthenticationError') { // Example check
         console.error("Anthropic Authentication Error - Check API Key again!");
         errorMessage = "AI Authentication Error: Invalid API Key provided.";
    } else if (error.constructor && error.constructor.name === 'APIError') { // Example check
         console.error(`Anthropic API Error (${error.status || 'unknown'}):`, error.message);
         errorMessage = `AI Service Error: ${error.message}`;
     } else if (error.status === 400) { // Catching specific status codes if needed
         console.error("Anthropic Bad Request Error (400):", error.message);
         errorMessage = `AI Service Bad Request: ${error.message}`;
     } else if (error.status === 404) {
         console.error("Anthropic Not Found Error (404):", error.message);
         errorMessage = `AI Service Not Found Error (Model incorrect?): ${error.message}`;
     }
    return { statusCode: 500, headers, body: JSON.stringify({ error: errorMessage }) };
  }
};