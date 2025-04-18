// src/services/profileService.ts
// FINAL - Handles UserProfile CRUD using Amplify API Category + Corrected Types

import { generateClient, type GraphQLResult } from 'aws-amplify/api';
// Import generated mutations, queries, and types for UserProfile
// Ensure these were generated after the last 'amplify push' with the UserProfile model
import { createUserProfile, updateUserProfile } from '../graphql/mutations';
import { getUserProfile as getUserProfileQuery } from '../graphql/queries'; // Alias the query
import {
    CreateUserProfileInput, // Input type for creating
    UpdateUserProfileInput, // Input type for updating (requires _version)
    GetUserProfileQuery,    // Type for the Get query result structure
    UserProfile as APIUserProfile // Generated API model type
} from '../API';
// Import local TS type for function return consistency if desired
import { UserProfile } from '../types/workout';

const client = generateClient();

/**
 * Fetches the UserProfile by user's Cognito Sub ID.
 * Returns the mapped UserProfile or null if not found/error.
 */
const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!userId) {
        console.warn("PROFILE_SERVICE: getUserProfile called without userId");
        return null;
    }
    console.log(`PROFILE_SERVICE: Getting profile for ${userId}...`);
    try {
        // Use the specific generated query type for better type checking
        const result = await client.graphql<GraphQLResult<GetUserProfileQuery>>({
            query: getUserProfileQuery,
            variables: { id: userId } // Query by 'id', which should match the userId (Cognito sub)
        });

        // Check for GraphQL level errors first
        if ('errors' in result && result.errors) {
             // Handle "Not Found" specifically if possible (often appears as null data with specific error messages)
             if (result.errors.some((e: { message?: string }) => e.message?.includes("Cannot return null for non-nullable type"))) {
                 console.log(`PROFILE_SERVICE: Profile not found for user ${userId} (GraphQL null error).`);
                 return null;
             }
             // Log and throw other GraphQL errors
             console.error("PROFILE_SERVICE: GraphQL Errors on GetProfile:", result.errors);
             throw result.errors[0];
        }

        // Check if data and the specific field exist and are not marked deleted
        const profile = 'data' in result ? result.data?.getUserProfile : null;
        if (!profile || profile._deleted) {
            console.log(`PROFILE_SERVICE: Profile for ${userId} is null or marked deleted in DB.`);
            return null;
        }

        console.log(`✅ PROFILE_SERVICE: Profile found for user ${userId}.`);
        // Map the fetched APIUserProfile to our local UserProfile type if needed
        // For now, the structures are similar enough for a basic cast
        return profile as UserProfile;

    } catch (error: any) {
        console.error(`PROFILE_SERVICE: Error fetching profile for ${userId}:`, error);
         // Don't log GraphQL errors twice if already thrown above
         // if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
        return null; // Return null on any processing error
    }
};

/**
 * Creates a new UserProfile.
 * Assumes profileData is the object parsed from the AI response.
 * Uses userId (Cognito sub) as the record ID.
 */
const saveUserProfile = async (
    profileData: any, // Data structure from parsed AI JSON
    userId: string,
    username: string // Cognito username (email)
    ) : Promise<UserProfile | null> => {

    if (!userId || !username) {
        console.error("PROFILE_SERVICE: Cannot save profile without userId and username.");
        throw new Error("User identity missing.");
    }
    console.log(`PROFILE_SERVICE: Attempting to save profile for ${userId} with RAW AI data:`, profileData);

    // Coerce availableDays into proper format
    const days = profileData.availableDays;
    const availableDaysArr = Array.isArray(days) ? days : typeof days === 'string' ? [days] : null;

    // --- number-ify timePerSessionMinutes ------------------
    let minutes = profileData.timePerSessionMinutes;
    if (typeof minutes === 'string') {
      const m = minutes.match(/\d+/);            // grabs first number
      minutes = m ? parseInt(m[0], 10) : null;   // null if unparsable
    }

    // --- Map data from AI JSON to GraphQL CreateUserProfileInput ---
    // Ensure keys here match the fields defined in type UserProfile @model in schema.graphql
    // and the expected CreateUserProfileInput type in API.ts
    const input: CreateUserProfileInput = {
        id: userId,             // Use Cognito Sub as the table ID
        username: username,       // Store Cognito username (email)
        ...(username.includes('@') ? { email: username } : {}), // Only include email if it looks like one
        name: profileData.name || null, // Use parsed name or null
        onboardingLevel: profileData.onboardingLevel || null,
        heightCm: profileData.heightCm, // Should be number | null
        weightKg: profileData.weightKg, // Should be number | null
        age: profileData.age,           // Should be number | null
        gender: profileData.gender,     // Should be string | null
        experienceLevel: profileData.experienceLevel, // Should be string | null
        primaryGoal: profileData.primaryGoal,         // Should be string | null
        secondaryGoal: profileData.secondaryGoal,     // Should be string | null
        injuriesOrLimitations: profileData.injuriesOrLimitations, // Should be string | null
        performanceNotes: profileData.performanceNotes,     // Should be string | null
        preferredSplit: profileData.preferredSplit,         // Should be string | null
        likedExercises: profileData.likedExercises,       // Should be string[] | null
        dislikedExercises: profileData.dislikedExercises,   // Should be string[] | null
        availableDays: availableDaysArr, // Use coerced array or null
        timePerSessionMinutes: minutes, // Use parsed number or null
        // Let backend handle: owner (implicit via @auth id field), createdAt, updatedAt, _version
    };
    // --- End Mapping ---

    console.log("PROFILE_SERVICE: Calling createUserProfile with MAPPED input:", input);

    try {
        const result = await client.graphql<GraphQLResult<{ createUserProfile: APIUserProfile | null }>>({
            query: createUserProfile, // Ensure mutation exists/is imported
            variables: { input: input }
            // Add condition: { id: { ne: userId } } to prevent overwrite? Or handle error.
        });

         if ('errors' in result && result.errors) { throw result.errors[0]; }
         const savedProfile = 'data' in result ? result.data?.createUserProfile : null;
         if (!savedProfile) { throw new Error("Save profile mutation succeeded but returned no data."); }

        console.log(`✅ PROFILE_SERVICE: Profile saved successfully for ${userId}`);
        return savedProfile as UserProfile; // Cast result to local type

    } catch (error: any) {
         // Handle specific error if profile already exists (ConditionalCheckFailedException)
         if (error.message?.includes('ConditionalCheckFailedException') || error.errorType?.includes('ConditionalCheckFailed')) {
             console.warn(`PROFILE_SERVICE: Profile for ${userId} already exists. Cannot create again.`);
             // Optionally, call an update function here instead or just return null/existing profile
             // For now, let's just indicate failure to create
             throw new Error("Profile already exists for this user.");
         } else {
             console.error(`PROFILE_SERVICE: Error saving profile mutation for ${userId}:`, error);
             if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
             throw error; // Re-throw other errors
         }
    }
};

// TODO: Implement update function if needed later
// const updateUserProfile = async (updateInput: UpdateUserProfileInput): Promise<UserProfile | null> => { ... }


// --- Export Service ---
const profileService = {
    getUserProfile,
    saveUserProfile,
    // updateUserProfile // Export update function when implemented
};

export default profileService;