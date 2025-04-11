// src/services/workoutService.ts
// FINAL MANUAL VERSION - Relational Schema - API Category + TS Fixes

import { generateClient, type GraphQLResult } from 'aws-amplify/api';
// Import necessary generated mutations & queries
import {
    createWorkoutTemplate, createExercise, deleteWorkoutTemplate, deleteExercise,
    createWorkoutSession // Placeholder usage
} from '../graphql/mutations';
import {
    getWorkoutTemplate, // Needed for delete version check
    exercisesByWorkoutTemplateId // Needed for relational delete
    // sessionsByUserId // Placeholder usage
} from '../graphql/queries'; // Import only needed generated queries
// Import necessary generated types from API.ts
import {
    CreateWorkoutTemplateInput, CreateExerciseInput, DeleteWorkoutTemplateInput, DeleteExerciseInput,
    TemplatesByUserIdQueryVariables, TemplatesByUserIdQuery, // Used in custom query type check
    WorkoutTemplate as APIWorkoutTemplate, Exercise as APIExercise, WorkoutSession as APIWorkoutSession,
    CreateWorkoutSessionInput, SessionExerciseInput, PerformedSetInput, // Added SessionExerciseInput and PerformedSetInput
    // SessionsByUserIdQuery, SessionsByUserIdQueryVariables // Placeholder usage
} from '../API';
// Import local TS types
import { WorkoutTemplate, Exercise, WorkoutSession, SessionExercise, PerformedSet, LogExercise } from '../types/workout';

const client = generateClient();

// Helper Type Guard
function isGraphQLResultFor<T>(obj: any): obj is GraphQLResult<T> {
    return obj && typeof obj === 'object' && ('data' in obj || 'errors' in obj);
}

// Input Type Helper for saveTemplate function argument
type CreateWorkoutTemplateData = {
    userId: string; name: string; description?: string | null; exercises: Exercise[]; owner: string;
};

// --- Template Functions ---

const saveTemplate = async (templateData: CreateWorkoutTemplateData): Promise<WorkoutTemplate> => {
    if (!templateData.owner || !templateData.userId) throw new Error("User identity required to save template.");
    if (!templateData.exercises || templateData.exercises.length === 0) throw new Error("At least one exercise is required to save template.");

    // 1. Prepare input for WorkoutTemplate metadata ONLY (NO exercises field)
    const templateInput: CreateWorkoutTemplateInput = {
        userId: templateData.userId,
        name: templateData.name,
        description: templateData.description,
        owner: templateData.owner
        // Let Amplify/AppSync handle ID, timestamps, _version, _deleted etc.
    };

    let savedTemplate: APIWorkoutTemplate | null = null;

    try {
        // STEP 1: Save the WorkoutTemplate metadata
        console.log("Saving WorkoutTemplate metadata via API:", templateInput);
        const templateResult = await client.graphql<GraphQLResult<{ createWorkoutTemplate: APIWorkoutTemplate | null }>>({
            query: createWorkoutTemplate,
            variables: { input: templateInput }
        });

        // Check for GraphQL errors returned in the response body first
        if (templateResult.errors) {
            console.error("GraphQL Errors during createWorkoutTemplate:", templateResult.errors);
            throw new Error(templateResult.errors[0].message || "GraphQL error during saveTemplate metadata");
        }
        savedTemplate = templateResult.data?.createWorkoutTemplate;
        if (!savedTemplate) { throw new Error("Save template metadata failed, response data missing or null."); }
        console.log(`✅ SERVICE: STEP 1 SUCCESS - Saved Template Metadata: ${savedTemplate.name} (ID: ${savedTemplate.id})`);

        // STEP 2: Save each Exercise linked to the saved template's ID
        const exerciseInputPromises = templateData.exercises.map(exercise => {
            const exerciseInput: CreateExerciseInput = {
                workoutTemplateId: savedTemplate!.id, // Link to parent
                name: exercise.name,
                sets: exercise.sets?.toString(),
                reps: exercise.reps?.toString(),
                weight: exercise.weight?.toString(),
                restPeriod: exercise.restPeriod,
                note: exercise.note,
                owner: templateData.owner,
            };
            // console.log("Saving Exercise via API with input:", exerciseInput); // Optional log
            return client.graphql<GraphQLResult<{ createExercise: APIExercise | null }>>({
                 query: createExercise, // Assumes 'createExercise' was correctly generated and imported
                 variables: { input: exerciseInput }
            });
        });
        const exerciseResults = await Promise.all(exerciseInputPromises);

        // Check results of saving exercises
        const savedExercises: APIExercise[] = [];
        for (const result of exerciseResults) {
             // Check for errors on each exercise save result
             if (result.errors) {
                 console.error("GraphQL Errors during createExercise:", result.errors);
                 throw new Error(result.errors[0].message || "GraphQL error saving an exercise");
             }
             if (!result.data?.createExercise) { throw new Error("An exercise failed to save (response data missing)."); }
             savedExercises.push(result.data.createExercise);
        }
        console.log(`✅ SERVICE: STEP 2 SUCCESS - Saved ${savedExercises.length} exercises linked to template ${savedTemplate.id}`);

        // STEP 3: Return the complete structure mapped to local type
        return {
            id: savedTemplate.id,
            userId: savedTemplate.userId,
            name: savedTemplate.name,
            description: savedTemplate.description ?? undefined,
            exercises: savedExercises.map(ex => ({ // Map the successfully saved exercises
                id: ex.id, name: ex.name, sets: ex.sets || '', reps: ex.reps || '',
                weight: ex.weight, restPeriod: ex.restPeriod, note: ex.note,
            })),
            createdAt: savedTemplate.createdAt,
            updatedAt: savedTemplate.updatedAt,
            owner: savedTemplate.owner,
        } as WorkoutTemplate; // Cast to local type

    } catch (error: any) {
         console.error('Error during saveTemplate process:', error);
         throw error; // Re-throw error for UI handling
     }
};

/**
 * Retrieves non-deleted workout templates AND their related exercises for a given user.
 * Uses a CUSTOM query string with filtering to bypass codegen list query bug.
 */
const getTemplates = async (userId: string): Promise<WorkoutTemplate[]> => {
    if (!userId) return [];
    console.log(`Workspaceing templates for user ${userId} via Custom API Query (Relational, Filtered)...`);

    // CUSTOM QUERY including nested exercises AND filter for _deleted
    const listTemplatesByUserIdWithExercises = /* GraphQL */ `
      query TemplatesByUserId(
        $userId: ID!
        $filter: ModelWorkoutTemplateFilterInput
        $limit: Int
        $nextToken: String
      ) {
        templatesByUserId(
          userId: $userId
          filter: $filter
          limit: $limit
          nextToken: $nextToken
          # sortDirection: DESC # Can add later if index has sort key
        ) {
          items {
            id userId name description createdAt updatedAt owner _version _deleted _lastChangedAt __typename
            exercises(limit: 100) { # Fetch exercises via connection
              items {
                id name sets reps weight restPeriod note createdAt _version __typename # Exercise fields
              }
              nextToken __typename
            }
          }
          nextToken __typename
        }
      }
    `;

    try {
        const variables = { userId: userId, filter: { _deleted: { ne: true } } };
        const result = await client.graphql<GraphQLResult<any>>({ query: listTemplatesByUserIdWithExercises, variables: variables });

        if (!isGraphQLResultFor<any>(result)) { throw new Error("Unexpected GraphQL response structure"); }
        if (result.errors) { throw result.errors[0]; }

        const items = result.data?.templatesByUserId?.items ?? [];
        const validItems = items.filter((item): item is APIWorkoutTemplate & { _deleted?: boolean | null, exercises?: { items: (APIExercise | null)[] | null } | null } => item !== null && !item._deleted);
        console.log(`Workspaceed ${validItems.length} non-deleted templates via Custom API Query`);

        return validItems.map((item): WorkoutTemplate => { // Map to local type
            const mappedExercises = item.exercises?.items
                ?.filter((ex): ex is APIExercise => ex !== null)
                .map((ex): Exercise => ({ // Map to local Exercise type
                    id: ex.id, name: ex.name, sets: ex.sets || '', reps: ex.reps || '',
                    weight: ex.weight, restPeriod: ex.restPeriod, note: ex.note,
                })) ?? [];
            return {
                id: item.id, userId: item.userId, name: item.name,
                description: item.description ?? undefined,
                exercises: mappedExercises,
                createdAt: item.createdAt, updatedAt: item.updatedAt, owner: item.owner,
            };
        });

    } catch (error: any) {
         console.error('Error getting workout templates via Custom API Query:', error);
         if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
         return [];
     }
};

/**
 * Deletes a WorkoutTemplate and its associated Exercises. Includes _version checks.
 */
const deleteTemplate = async (templateId: string, userId: string): Promise<string | null> => {
    if (!userId) throw new Error("User ID required for delete");
    if (!templateId) throw new Error("Template ID required for delete");
    console.log(`DELETE: Attempting relational delete for template ${templateId}`);

    let templateVersion: number | null | undefined = null;

    try {
        // STEP 1: Get Template Version using standard query
        console.log(`DELETE STEP 1: Fetching template ${templateId} to get version...`);
        const getTemplateResult = await client.graphql<GraphQLResult<{ getWorkoutTemplate: Pick<APIWorkoutTemplate, 'id' | '_version' | '_deleted'> | null }>>({
            query: getWorkoutTemplate, // Use standard query, just need version
            variables: { id: templateId }
        });
        console.log(`DELETE STEP 1: Raw getTemplateResult:`, JSON.stringify(getTemplateResult, null, 2));
        if (getTemplateResult.errors) { throw getTemplateResult.errors[0]; }
        const currentTemplate = getTemplateResult.data?.getWorkoutTemplate;
        if (!currentTemplate || currentTemplate._deleted) { console.log(`DELETE STEP 1: Template ${templateId} not found or already deleted.`); return null; }
        templateVersion = currentTemplate._version;
        if (typeof templateVersion !== 'number') { throw new Error(`Could not get valid _version for template ${templateId}`); }
        console.log(`DELETE STEP 1 SUCCESS: Found template version: ${templateVersion}`);

        // STEP 2: Find and Delete Linked Exercises
        console.log(`DELETE STEP 2: Querying exercises for template ${templateId}`);
        // Use generated query if available AND includes _version, otherwise custom
        const listExercisesByTemplateIdQuery = /* GraphQL */ `query ExercisesByWorkoutTemplateId($workoutTemplateId: ID!, $limit: Int, $nextToken: String) { exercisesByWorkoutTemplateId(workoutTemplateId: $workoutTemplateId, limit: $limit, nextToken: $nextToken) { items { id _version } nextToken } }`;
        const exerciseResult = await client.graphql<GraphQLResult<any>>({ query: listExercisesByTemplateIdQuery, variables: { workoutTemplateId: templateId } });
        if (exerciseResult.errors) { throw exerciseResult.errors[0]; }
        const exercisesToDelete = exerciseResult.data?.exercisesByWorkoutTemplateId?.items ?? [];
        console.log(`DELETE STEP 2: Found ${exercisesToDelete.length} exercises to delete.`);
        if (exercisesToDelete.length > 0) {
            const deleteExercisePromises = exercisesToDelete
                .filter((ex): ex is { id: string, _version: number } => ex !== null && typeof ex._version === 'number')
                .map(ex => {
                    console.log(`DELETE STEP 2: Deleting exercise ${ex.id} (version: ${ex._version})`);
                    const input: DeleteExerciseInput = { id: ex.id, _version: ex._version };
                    return client.graphql<GraphQLResult<any>>({ query: deleteExercise, variables: { input: input } });
                });
            await Promise.all(deleteExercisePromises).then(results => { results.forEach(result => { if (result.errors) throw result.errors[0]; }); });
            console.log(`DELETE STEP 2 SUCCESS: Deleted ${exercisesToDelete.length} exercises.`);
        }

        // STEP 3: Delete the WorkoutTemplate itself
        console.log(`DELETE STEP 3: Deleting WorkoutTemplate ${templateId} (version: ${templateVersion})`);
        const input: DeleteWorkoutTemplateInput = { id: templateId, _version: templateVersion };
        const templateDeleteResult = await client.graphql<GraphQLResult<{ deleteWorkoutTemplate: { id: string } | null }>>({ query: deleteWorkoutTemplate, variables: { input: input } });
        if (templateDeleteResult.errors) { throw templateDeleteResult.errors[0]; }
        const deletedId = templateDeleteResult.data?.deleteWorkoutTemplate?.id;
        if (deletedId) { console.log('DELETE STEP 3 SUCCESS: Workout template deleted via API:', deletedId); return deletedId; }
        else { console.warn("Delete template response missing ID"); return null; }

    } catch (error: any) { console.error('SERVICE ERROR: Error during relational deleteTemplate:', error); throw error; }
};

// --- Session & Plan Placeholders ---
const saveSession = async (
    // Expect data matching LogSessionScreen's state + owner passed from component
     sessionData: {
        userId: string; owner: string; templateId?: string | null;
        name: string; exercises: LogExercise[]; duration?: number | null; completedAt: string;
    }
): Promise<WorkoutSession> => { // Return local type
    if (!sessionData.userId || !sessionData.owner) throw new Error("User identity required to save session.");

    // Map LogExercise[] with performedSets to SessionExerciseInput[] expected by mutation
    const exercisesForInput: SessionExerciseInput[] | null = sessionData.exercises
        ?.filter((ex): ex is LogExercise => ex !== null) // Filter null exercises if any
        .map((ex: LogExercise): SessionExerciseInput => ({ // Map to SessionExerciseInput
            id: ex.id, // ID from original Exercise definition
            name: ex.name,
            note: ex.note,
            // Map performedSets array to PerformedSetInput array
            performedSets: ex.performedSets?.map((set: PerformedSet): PerformedSetInput => ({
                 id: set.id, // Unique ID for the logged set instance
                 reps: set.reps,
                 weight: set.weight,
                 // Ensure __typename is NOT included if not expected by input type
            })) ?? null, // Pass null or empty array if no sets logged
        })) || []; // Default to empty array if no exercises logged? Match API Type optionality

    // Prepare the input object for the createWorkoutSession mutation
    const input: CreateWorkoutSessionInput = {
        userId: sessionData.userId,
        templateId: sessionData.templateId,
        name: sessionData.name,
        exercises: exercisesForInput, // The mapped array including performedSets
        duration: sessionData.duration,
        completedAt: sessionData.completedAt,
        owner: sessionData.owner
        // id, createdAt, updatedAt, _version etc. handled by backend
    };

    try {
        console.log("Saving Session via API with input:", JSON.stringify(input, null, 2));
        // Ensure createWorkoutSession mutation was generated and imported
        const result = await client.graphql<GraphQLResult<{ createWorkoutSession: APIWorkoutSession | null }>>({
            query: createWorkoutSession,
            variables: { input: input }
        });

        if (result.errors) { throw result.errors[0]; } // Handle GraphQL errors

        const savedSession = result.data?.createWorkoutSession;
        if (!savedSession) { throw new Error("Save session failed, response data missing."); }

        console.log('✅ Workout session saved via API:', savedSession.name, savedSession.id);
        // Map result back to local WorkoutSession type if needed
        return savedSession as WorkoutSession; // Basic cast for now

    } catch (error: any) {
        console.error('❌ Error saving workout session via API:', error);
        if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
        throw error; // Re-throw for UI handling
    }
};
const getSessionsByUserId = async (userId: string): Promise<WorkoutSession[]> => {
    if (!userId) return [];
    console.log(`Workspaceing sessions for user ${userId} via Custom API Query...`);

    // CUSTOM QUERY - REMOVED sortDirection parameter and argument
    const listSessionsByUserIdWithDetails = /* GraphQL */ `
      query SessionsByUserId(
        $userId: ID!
        $completedAt: ModelStringKeyConditionInput # Sort key condition still available if needed
        $filter: ModelWorkoutSessionFilterInput
        $limit: Int
        $nextToken: String
      ) {
        sessionsByUserId(
          userId: $userId
          completedAt: $completedAt
          filter: $filter
          limit: $limit
          nextToken: $nextToken
        ) {
          items {
            id userId templateId name duration completedAt owner createdAt updatedAt _version _deleted _lastChangedAt __typename
            exercises { id name note __typename
              performedSets { id reps weight __typename }
            }
          }
          nextToken __typename
        }
      }
    `; // End GraphQL string

    try {
        // Variables object WITHOUT sortDirection
        const variables = {
            userId: userId,
            filter: { _deleted: { ne: true } }
        };

        const result = await client.graphql<GraphQLResult<any>>({
            query: listSessionsByUserIdWithDetails,
            variables: variables
        });

        if (isGraphQLResultFor<any>(result)) {
            if (result.errors) { throw result.errors[0]; }
            const items = result.data?.sessionsByUserId?.items ?? [];
            const validItems = items.filter((item): item is APIWorkoutSession & { _deleted?: boolean | null } => 
                item !== null && !item._deleted
            );
            console.log(`Workspaceed ${validItems.length} non-deleted sessions via Custom API Query`);
            return validItems.map(item => ({
                id: item.id,
                userId: item.userId,
                templateId: item.templateId,
                name: item.name,
                duration: item.duration,
                completedAt: item.completedAt,
                exercises: item.exercises?.map(ex => ({
                    id: ex.id,
                    name: ex.name,
                    note: ex.note,
                    performedSets: ex.performedSets?.map(set => ({
                        id: set.id,
                        reps: set.reps,
                        weight: set.weight
                    })) ?? []
                })) ?? [],
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                owner: item.owner
            })) as WorkoutSession[];
        } else { throw new Error("Unexpected GraphQL response structure"); }

    } catch (error: any) {
        console.error('Error getting workout sessions via Custom API Query:', error);
        if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
        return [];
    }
};
const saveWorkoutPlan = async (plan: any, userId: string): Promise<any> => { /* Placeholder */ return Promise.reject("Not implemented"); };
const getCurrentPlan = async (userId: string): Promise<any | null> => { /* Placeholder */ return Promise.resolve(null); };

// --- Export Service ---
const workoutService = { saveTemplate, getTemplates, deleteTemplate, saveSession, getSessionsByUserId, saveWorkoutPlan, getCurrentPlan };
export default workoutService;