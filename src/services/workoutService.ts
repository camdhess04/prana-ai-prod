// src/services/workoutService.ts
// Uses Amplify API (GraphQL) category

import { generateClient } from 'aws-amplify/api';
// Import generated operations (VERIFY PATH!)
import {
    createWorkoutTemplate,
    updateWorkoutTemplate, // Add if update functionality is needed
    deleteWorkoutTemplate,
    createWorkoutSession
} from '../graphql/mutations';
import {
    getWorkoutTemplate,
    listWorkoutTemplates, // Default list query
    templatesByUserId, // Query using the @index
    getWorkoutSession
} from '../graphql/queries';
// Import generated types (VERIFY PATH!)
import {
    // Input types
    CreateWorkoutTemplateInput,
    UpdateWorkoutTemplateInput,
    DeleteWorkoutTemplateInput,
    // Query types / Variables
    TemplatesByUserIdQueryVariables,
    TemplatesByUserIdQuery,
    // Model types (Alias if needed)
    WorkoutTemplate as APIWorkoutTemplate,
    ModelSortDirection,
    // Add types for WorkoutSession if implementing those functions
    CreateWorkoutSessionInput,
    WorkoutSession as APIWorkoutSession
} from '../API';
// Import local TS types for consistent function signatures/return types
import { WorkoutTemplate, Exercise, WorkoutSession, LogExercise, PerformedSet } from '../types/workout';
import uuid from 'react-native-uuid';

// Create the API client instance
const client = generateClient();

// Type helper for data coming from NewWorkoutScreen
type CreateWorkoutTemplateData = {
    userId: string;
    name: string;
    description?: string | null;
    exercises?: Exercise[] | null;
    owner: string; // Expect owner (username/sub) passed from component
};

// --- Template Functions ---

/**
 * Saves a new workout template using the API category.
 */
const saveTemplate = async (templateData: CreateWorkoutTemplateData): Promise<WorkoutTemplate> => {
    if (!templateData.owner || !templateData.userId) throw new Error("User identity (owner/userId) is required.");

    // Map local Exercise type to GraphQL Exercise input type if they differ structurally
    // Using deep copy via JSON is safest for nested non-model types
    const exercisesForInput = templateData.exercises ? JSON.parse(JSON.stringify(templateData.exercises)) : null;

    // Prepare input matching the generated CreateWorkoutTemplateInput type
    const input: CreateWorkoutTemplateInput = {
        userId: templateData.userId,
        name: templateData.name,
        description: templateData.description,
        exercises: exercisesForInput,
        // owner is handled by the @auth directive in the schema
    };

    try {
        console.log("Saving Template via API with input:", input);
        const result = await client.graphql({
            query: createWorkoutTemplate,
            variables: { input: input }
            // Auth mode automatically uses Cognito User Pools (default)
        });

        const savedTemplate = result.data?.createWorkoutTemplate;
        if (!savedTemplate) { throw new Error("Failed to save template, response data missing."); }

        console.log('Workout template saved via API:', savedTemplate.name, savedTemplate.id);
        // Map the result (APIWorkoutTemplate) back to local WorkoutTemplate type
        return {
            id: savedTemplate.id,
            userId: savedTemplate.userId,
            name: savedTemplate.name,
            description: savedTemplate.description ?? undefined,
            // Ensure exercises array is correctly formed and typed
            exercises: savedTemplate.exercises ? JSON.parse(JSON.stringify(savedTemplate.exercises)) : [],
            createdAt: savedTemplate.createdAt, // Use backend generated timestamp
        } as WorkoutTemplate;

    } catch (error: any) {
        console.error('Error saving workout template via API:', error);
        if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
        throw error; // Re-throw for UI to handle
    }
};

/**
 * Retrieves all workout templates for a given user using the API category.
 */
const getTemplates = async (userId: string): Promise<WorkoutTemplate[]> => {
    if (!userId) return [];
    try {
        console.log(`Workspaceing templates for user ${userId} via API...`);
        const variables: TemplatesByUserIdQueryVariables = {
            userId: userId,
            // Add filters, limits, nextToken here if needed
        };

        // Use the templatesByUserId query which leverages the @index
        const result = await client.graphql<TemplatesByUserIdQuery>({
            query: templatesByUserId,
            variables: variables
        });

        const items = (result as { data?: TemplatesByUserIdQuery })?.data?.templatesByUserId?.items ?? [];
        const validItems = items.filter((item: APIWorkoutTemplate | null): item is APIWorkoutTemplate => item !== null);

        console.log(`Workspaceed ${validItems.length} templates via API`);
        // Map results to local WorkoutTemplate type
        return validItems.map(item => ({
            id: item.id,
            userId: item.userId,
            name: item.name,
            description: item.description ?? undefined,
            exercises: item.exercises ? JSON.parse(JSON.stringify(item.exercises)) : [],
            createdAt: item.createdAt,
        })) as WorkoutTemplate[];

    } catch (error: any) {
        console.error('Error getting workout templates via API:', error);
        if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
        return [];
    }
};

/**
 * Deletes a workout template by its ID using the API category.
 */
const deleteTemplate = async (templateId: string): Promise<string | null> => {
     try {
        console.log(`Deleting template ${templateId} via API...`);
        const input: DeleteWorkoutTemplateInput = { id: templateId };
        // Add _version if using conflict detection with version strategy
        // const templateToDelete = await DataStore.query(WorkoutTemplate, templateId);
        // if (!templateToDelete) throw new Error("Template not found locally for deletion");
        // input._version = templateToDelete._version; // Pass version for conditional delete

        const result = await client.graphql({
            query: deleteWorkoutTemplate,
            variables: { input: input }
        });
        const deletedId = result.data?.deleteWorkoutTemplate?.id;
        if (deletedId) {
            console.log('Workout template deleted via API:', deletedId);
            return deletedId;
        } else {
            console.warn('Delete template response did not contain ID:', result);
            // Check for specific errors if needed
             if (result.errors) { throw result.errors[0];}
            return null;
        }
    } catch (error: any) {
        console.error('Error deleting workout template via API:', error);
         if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
        throw error;
    }
};


// --- Session & Plan Functions (Placeholders - Require Schema Models + Generated Ops) ---

const saveSession = async (sessionData: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt' | '_version' | '_lastChangedAt' | '_deleted'>): Promise<WorkoutSession> => {
    if (!sessionData.userId || !sessionData.owner) throw new Error("User ID and Owner are required to save session");

    // Prepare input matching the generated CreateWorkoutSessionInput type
    // Need to ensure the embedded SessionExercise type matches the input expectation
    const exercisesForInput = sessionData.exercises?.map(ex => ({
        // Map fields from LogExercise/PerformedSet to SessionExercise structure in schema
        id: ex.id, // Or generate new if needed
        name: ex.name,
        sets: String(ex.targetSets || ex.sets || ''), // Send target sets or logged sets? Schema uses String. Let's send target.
        reps: String(ex.targetReps || ex.reps || ''), // Send target reps
        weight: String(ex.weight || ''), // Send suggested weight? Or maybe avg/max performed? Let's skip top-level weight for SessionExercise
        restPeriod: ex.restPeriod,
        note: ex.note, // Send template note? Or session note? Add session note field maybe?
        // CRUCIAL: Does the generated Input type expect performedSets?
        // Our schema embedded 'SessionExercise' which DOES NOT have performedSets.
        // We need to decide HOW to save performance data.
        // Option A: Save ONLY the template structure + duration/completion (simplest now).
        // Option B: Modify schema for WorkoutSession to embed PerformedSet array, push, codegen.
        // Option C: Create PerformedSet @model, link to Session, push, codegen. (Most complex)

        // --- Let's go with Option A for now to get saving working ---
        // We save the structure but not the detailed set-by-set performance yet.
        // We'll need to add performance saving later (likely Option B or C).

    })) || null; // If SessionExercise expects null, use null, else empty array []

     const input: CreateWorkoutSessionInput = {
        userId: sessionData.userId,
        templateId: sessionData.templateId,
        name: sessionData.name,
        // Pass the simplified exercise structure (matching SessionExercise in schema)
        exercises: exercisesForInput,
         duration: sessionData.duration,
        completedAt: sessionData.completedAt
     };

    try {
        console.log("Saving Session via API with input:", input);
        const result = await client.graphql({
            query: createWorkoutSession, // Use generated mutation
            variables: { input: input }
        });

        const savedSession = result.data?.createWorkoutSession;
        if (!savedSession) { throw new Error("Failed to save session, response data missing."); }

        console.log('Workout session saved via API:', savedSession.name, savedSession.id);
        // Map result back to local WorkoutSession type
        return { /* ... map fields ... */ } as WorkoutSession; // Placeholder for mapping

    } catch (error: any) {
        console.error('Error saving workout session via API:', error);
        if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
        throw error;
    }
};

const getSessionsByUserId = async (userId: string): Promise<any[]> => {
    console.warn("getSessionsByUserId requires WorkoutSession model in schema.graphql & generated queries");
    return Promise.resolve([]);
};

const saveWorkoutPlan = async (plan: any, userId: string): Promise<any> => {
    console.warn("saveWorkoutPlan not implemented for API yet.");
    return Promise.reject("saveWorkoutPlan not implemented for API");
};
const getCurrentPlan = async (userId: string): Promise<any | null> => {
    console.warn("getCurrentPlan not implemented for API yet.");
    return Promise.resolve(null);
};


// --- Export Service ---
const workoutService = {
    saveTemplate,
    getTemplates,
    deleteTemplate,
    saveSession,
    getSessionsByUserId,
    saveWorkoutPlan,
    getCurrentPlan,
};

export default workoutService; 