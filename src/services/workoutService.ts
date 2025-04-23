// src/services/workoutService.ts
// V1.5.2 Update: Includes TS fixes after codegen and local type updates

import { generateClient, type GraphQLResult, type GraphqlSubscriptionResult } from 'aws-amplify/api';
import {
    // Mutations
    createWorkoutTemplate, createExercise, deleteWorkoutTemplate, deleteExercise,
    createWorkoutSession, updateScheduledWorkout // Should exist now
} from '../graphql/mutations';
import {
    // Queries
    getWorkoutTemplate, // Needed for delete version check
    exercisesByWorkoutTemplateId, // Needed for relational delete (though maybe unused if custom query used)
    getScheduledWorkout // Should exist now
    // sessionsByUserId // Using custom query below
} from '../graphql/queries';
import {
    // API Types
    CreateWorkoutTemplateInput, CreateExerciseInput, DeleteWorkoutTemplateInput, DeleteExerciseInput,
    WorkoutTemplate as APIWorkoutTemplate, Exercise as APIExercise, WorkoutSession as APIWorkoutSession,
    ScheduledWorkout as APIScheduledWorkout, // Should exist now
    CreateWorkoutSessionInput, UpdateScheduledWorkoutInput, // Should exist now
    SessionExerciseInput, PerformedSetInput, // Should now include rpe/notes
    GetWorkoutTemplateQuery, GetScheduledWorkoutQuery // Should exist now
} from '../API';
// Import local TS types
import { WorkoutTemplate, Exercise, WorkoutSession, SessionExercise, PerformedSet, LogExercise } from '../types/workout'; // Local types should be updated now

const client = generateClient();

// Custom Queries defined inline
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
    ) {
      items {
        id userId name description isAIPlan createdAt updatedAt owner _version _deleted _lastChangedAt __typename
        exercises(limit: 100) {
          items {
            id name sets reps weight restPeriod note createdAt _version __typename
          }
          nextToken __typename
        }
      }
      nextToken __typename
    }
  }
`;

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
      # Add sortDirection: DESC here if you want newest first and index supports it
    ) {
      items {
        id userId templateId scheduledWorkoutId name duration completedAt owner createdAt updatedAt _version _deleted _lastChangedAt __typename
        exercises { # Assuming SessionExercise is still embedded like this
          id name note __typename
          performedSets { id reps weight rpe notes __typename } # Added rpe and notes
        }
      }
      nextToken __typename
    }
  }
`;

// Helper Type Guard - Stricter check
function hasGraphQLErrors<T>(obj: GraphQLResult<T>): obj is GraphQLResult<T> & { errors: any[] } {
    return obj && typeof obj === 'object' && 'errors' in obj && Array.isArray(obj.errors) && obj.errors.length > 0;
}


// Input Type Helper for saveTemplate - Added isAIPlan
type CreateWorkoutTemplateData = {
    userId: string;
    name: string;
    description?: string | null;
    exercises: Exercise[]; // Using local Exercise type
    owner: string;
    isAIPlan?: boolean | null; // Added
};

// --- Template Functions ---

const saveTemplate = async (templateData: CreateWorkoutTemplateData): Promise<WorkoutTemplate> => {
    if (!templateData.owner || !templateData.userId) throw new Error("User identity required to save template.");
    if (!templateData.exercises || templateData.exercises.length === 0) throw new Error("At least one exercise is required to save template.");

    const templateInput: CreateWorkoutTemplateInput = {
        userId: templateData.userId,
        name: templateData.name,
        description: templateData.description,
        owner: templateData.owner,
        isAIPlan: templateData.isAIPlan ?? false // Use nullish coalescing
    };

    let savedTemplate: APIWorkoutTemplate | null = null;

    try {
        console.log("Saving WorkoutTemplate metadata via API:", templateInput);
        // Use specific result type from API.ts
        type CreateTemplateResult = { createWorkoutTemplate: APIWorkoutTemplate };
        const templateResult = await client.graphql<CreateTemplateResult>({
            query: createWorkoutTemplate,
            variables: { input: templateInput }
        }) as GraphQLResult<CreateTemplateResult>;

        if (hasGraphQLErrors<CreateTemplateResult>(templateResult)) {
            console.error("GraphQL Errors during createWorkoutTemplate:", templateResult.errors);
            throw new Error(templateResult.errors[0].message || "GraphQL error during saveTemplate metadata");
        }
        // Check data exists more safely
        savedTemplate = templateResult.data?.createWorkoutTemplate ?? null;
        if (!savedTemplate) {
            throw new Error("Save template metadata failed, response data missing or null.");
        }
        console.log(`✅ SERVICE: STEP 1 SUCCESS - Saved Template Metadata: ${savedTemplate.name} (ID: ${savedTemplate.id})`);

        type CreateExerciseResult = { createExercise: APIExercise };
        const exerciseInputPromises = templateData.exercises.map((exercise: Exercise) => { // Added type for exercise
            const exerciseInput: CreateExerciseInput = {
                workoutTemplateId: savedTemplate!.id, name: exercise.name,
                sets: exercise.sets?.toString() || '', // Default to empty string instead of null
                reps: exercise.reps?.toString() || '', // Default to empty string instead of null
                weight: exercise.weight?.toString(), // Keep as undefined if not present
                restPeriod: exercise.restPeriod,
                note: exercise.note, owner: templateData.owner,
            };
            return client.graphql<CreateExerciseResult>({
                 query: createExercise, variables: { input: exerciseInput }
            });
        });
        const exerciseResults = await Promise.all(exerciseInputPromises);

        const savedExercises: APIExercise[] = [];
        for (const result of exerciseResults) {
             if (hasGraphQLErrors(result)) {
                 console.error("GraphQL Errors during createExercise:", result.errors);
                 throw new Error(result.errors[0].message || "GraphQL error saving an exercise");
             }
             const createdExercise = result.data?.createExercise;
             if (!createdExercise) {
                 throw new Error("An exercise failed to save (response data missing).");
             }
             savedExercises.push(createdExercise);
        }
        console.log(`✅ SERVICE: STEP 2 SUCCESS - Saved ${savedExercises.length} exercises linked to template ${savedTemplate.id}`);

        // Map back to local types
        return {
            id: savedTemplate.id, userId: savedTemplate.userId, name: savedTemplate.name,
            description: savedTemplate.description ?? undefined,
            isAIPlan: savedTemplate.isAIPlan ?? false, // Map isAIPlan
            exercises: savedExercises.map((ex: APIExercise): Exercise => ({ // Added types
                id: ex.id, name: ex.name, sets: ex.sets || '', reps: ex.reps || '', // Default to empty string
                weight: ex.weight ?? undefined, restPeriod: ex.restPeriod ?? undefined, note: ex.note ?? undefined, // Align with local type
            })),
            createdAt: savedTemplate.createdAt, updatedAt: savedTemplate.updatedAt, owner: savedTemplate.owner,
        } as WorkoutTemplate; // Still might need cast if types aren't perfectly aligned

    } catch (error: any) {
         console.error('Error during saveTemplate process:', error);
         if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
         throw new Error(`Failed to save template: ${error.message || 'Unknown error'}`);
     }
};


const getTemplates = async (userId: string): Promise<WorkoutTemplate[]> => {
    if (!userId) return [];
    console.log(`Workspaceing templates for user ${userId} via Custom API Query (Relational, Filtered)...`);

    try {
        // Define expected shape from custom query more explicitly
        type CustomTemplatesQueryResult = {
            templatesByUserId?: {
                items?: (Partial<APIWorkoutTemplate> & {
                    _deleted?: boolean | null;
                    exercises?: { items?: (Partial<APIExercise> | null)[] | null } | null
                })[] | null
            } | null
        };

        const variables = { userId: userId, filter: { _deleted: { ne: true } } };
        const result = await client.graphql<CustomTemplatesQueryResult>({ query: listTemplatesByUserIdWithExercises, variables: variables });

        if (hasGraphQLErrors(result)) { throw result.errors[0]; }

        const items = result.data?.templatesByUserId?.items ?? [];
        // Type guard with required fields check
        const validItems = items.filter((item: Partial<APIWorkoutTemplate>): item is APIWorkoutTemplate & { exercises?: { items: (APIExercise | null)[] | null } | null } =>
            !!item && !item._deleted && !!item.id && !!item.userId && !!item.name && !!item.createdAt && !!item.updatedAt
        );
        console.log(`Workspaceed ${validItems.length} non-deleted templates via Custom API Query`);

        return validItems.map((item: APIWorkoutTemplate & { exercises?: { items: (APIExercise | null)[] | null } | null }): WorkoutTemplate => {
            const mappedExercises = item.exercises?.items
                ?.filter((ex: APIExercise | null): ex is APIExercise => !!ex && !!ex.id && !!ex.name)
                .map((ex: APIExercise): Exercise => ({
                    id: ex.id, name: ex.name, sets: ex.sets || '', reps: ex.reps || '', // Default to empty string
                    weight: ex.weight ?? undefined, restPeriod: ex.restPeriod ?? undefined, note: ex.note ?? undefined,
                })) ?? [];
            return {
                id: item.id, userId: item.userId, name: item.name,
                description: item.description ?? undefined,
                isAIPlan: item.isAIPlan ?? false, // Map isAIPlan
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


const deleteTemplate = async (templateId: string, userId: string): Promise<string | null> => {
    if (!userId) throw new Error("User ID required for delete");
    if (!templateId) throw new Error("Template ID required for delete");
    console.log(`DELETE: Attempting relational delete for template ${templateId}`);

    let templateVersion: number | null | undefined = null;

    try {
        // STEP 1: Get Template Version
        console.log(`DELETE STEP 1: Fetching template ${templateId} to get version...`);
        const getTemplateResult = await client.graphql<GetWorkoutTemplateQuery>({
            query: getWorkoutTemplate,
            variables: { id: templateId }
        });
        if (hasGraphQLErrors(getTemplateResult)) { throw getTemplateResult.errors[0]; }
        const currentTemplate = getTemplateResult.data?.getWorkoutTemplate;
        if (!currentTemplate || currentTemplate._deleted) { console.log(`DELETE STEP 1: Template ${templateId} not found or already deleted.`); return null; }
        templateVersion = currentTemplate._version;
        if (typeof templateVersion !== 'number') { throw new Error(`Could not get valid _version for template ${templateId}`); }
        console.log(`DELETE STEP 1 SUCCESS: Found template version: ${templateVersion}`);

        // STEP 2: Find and Delete Linked Exercises
        console.log(`DELETE STEP 2: Querying exercises for template ${templateId}`);
        // Using a simplified query string as assuming generated one might be complex/missing version
        const listExercisesByTemplateIdQuery = /* GraphQL */ `query ExercisesByWorkoutTemplateId($workoutTemplateId: ID!, $limit: Int, $nextToken: String) { exercisesByWorkoutTemplateId(workoutTemplateId: $workoutTemplateId, limit: $limit, nextToken: $nextToken) { items { id _version } nextToken } }`;
        type ExercisesQueryResult = { exercisesByWorkoutTemplateId?: { items?: ({ id: string, _version: number | null } | null)[] | null } | null };
        const exerciseResult = await client.graphql<ExercisesQueryResult>({ query: listExercisesByTemplateIdQuery, variables: { workoutTemplateId: templateId } });
        if (hasGraphQLErrors(exerciseResult)) { throw exerciseResult.errors[0]; }

        const exercisesToDelete = exerciseResult.data?.exercisesByWorkoutTemplateId?.items ?? [];
        console.log(`DELETE STEP 2: Found ${exercisesToDelete.length} exercises to delete.`);
        const validExercisesToDelete = exercisesToDelete
            .filter((ex: any): ex is { id: string, _version: number } => !!ex && typeof ex._version === 'number');

        if (validExercisesToDelete.length > 0) {
            const deleteExercisePromises = validExercisesToDelete.map((ex: { id: string, _version: number }) => {
                console.log(`DELETE STEP 2: Deleting exercise ${ex.id} (version: ${ex._version})`);
                const input: DeleteExerciseInput = { id: ex.id, _version: ex._version };
                return client.graphql({ query: deleteExercise, variables: { input: input } });
            });
            const deleteResults = await Promise.all(deleteExercisePromises);
            // Check results for errors
            for (const result of deleteResults) {
                 if (hasGraphQLErrors(result)) throw result.errors[0];
             }
            console.log(`DELETE STEP 2 SUCCESS: Deleted ${validExercisesToDelete.length} exercises.`);
        }

        // STEP 3: Delete the WorkoutTemplate itself
        console.log(`DELETE STEP 3: Deleting WorkoutTemplate ${templateId} (version: ${templateVersion})`);
        const input: DeleteWorkoutTemplateInput = { id: templateId, _version: templateVersion };
        type DeleteTemplateResult = { deleteWorkoutTemplate: { id: string } | null };
        const templateDeleteResult = await client.graphql<DeleteTemplateResult>({ query: deleteWorkoutTemplate, variables: { input: input } });
        if (hasGraphQLErrors(templateDeleteResult)) { throw templateDeleteResult.errors[0]; }
        const deletedId = templateDeleteResult.data?.deleteWorkoutTemplate?.id;
        if (deletedId) { console.log('DELETE STEP 3 SUCCESS: Workout template deleted via API:', deletedId); return deletedId; }
        else { console.warn("Delete template response missing ID"); return null; }

    } catch (error: any) { console.error('SERVICE ERROR: Error during relational deleteTemplate:', error); throw error; }
};


// --- Session Functions ---

// Input type for saveSession
type SaveSessionData = {
    userId: string;
    owner: string;
    templateId?: string | null;
    scheduledWorkoutId?: string | null;
    name: string;
    exercises: LogExercise[]; // Assumes LogExercise's PerformedSet now aligns with local PerformedSet type
    duration?: number | null;
    completedAt: string;
};

const saveSession = async (sessionData: SaveSessionData): Promise<WorkoutSession> => {
    if (!sessionData.userId || !sessionData.owner) throw new Error("User identity required to save session.");

    const exercisesForInput: SessionExerciseInput[] = (sessionData.exercises ?? [])
        .filter((ex): ex is LogExercise => !!ex) // Ensure ex is not null/undefined
        .map((ex: LogExercise): SessionExerciseInput => ({
            id: ex.id,
            name: ex.name,
            note: ex.note,
            performedSets: (ex.performedSets ?? []) // Ensure performedSets is array
                .filter((set): set is PerformedSet => !!set) // Ensure set is not null/undefined
                .map((set: PerformedSet): PerformedSetInput => ({
                     id: set.id,
                     reps: set.reps ?? null,     // Map from local type (string | null)
                     weight: set.weight ?? null, // Map from local type (string | null)
                     rpe: set.rpe ?? null,       // Map from local type (number | null)
                     notes: set.notes ?? null,   // Map from local type (string | null)
                }))
        }));

    const input: CreateWorkoutSessionInput = {
        userId: sessionData.userId,
        templateId: sessionData.templateId,
        scheduledWorkoutId: sessionData.scheduledWorkoutId, // Map scheduledWorkoutId
        name: sessionData.name,
        exercises: exercisesForInput,
        duration: sessionData.duration,
        completedAt: sessionData.completedAt,
        owner: sessionData.owner
    };

    let savedSession: APIWorkoutSession | null = null;

    try {
        console.log("Saving Session via API with input:", JSON.stringify(input, null, 2));
        type CreateSessionResult = { createWorkoutSession: APIWorkoutSession };
        const result = await client.graphql<CreateSessionResult>({
            query: createWorkoutSession,
            variables: { input: input }
        });

        if (hasGraphQLErrors(result)) { throw result.errors[0]; }
        savedSession = result.data?.createWorkoutSession ?? null;
        if (!savedSession) { throw new Error("Save session failed, response data missing."); }
        console.log('✅ Workout session saved via API:', savedSession.name, savedSession.id);

        // Update ScheduledWorkout status
        if (sessionData.scheduledWorkoutId && savedSession) {
            console.log(`Updating status for ScheduledWorkout ID: ${sessionData.scheduledWorkoutId}`);
            try {
                const getScheduledResult = await client.graphql<GetScheduledWorkoutQuery>({
                    query: getScheduledWorkout,
                    variables: { id: sessionData.scheduledWorkoutId }
                });

                if (hasGraphQLErrors(getScheduledResult)) throw getScheduledResult.errors[0];
                const currentScheduledWorkout = getScheduledResult.data?.getScheduledWorkout;

                if (!currentScheduledWorkout || currentScheduledWorkout._deleted) {
                    console.warn(`ScheduledWorkout ${sessionData.scheduledWorkoutId} not found or deleted, cannot update status.`);
                } else if (typeof currentScheduledWorkout._version === 'number') {
                     const updateInput: UpdateScheduledWorkoutInput = {
                        id: sessionData.scheduledWorkoutId,
                        status: 'Completed',
                        workoutSessionId: savedSession.id,
                        _version: currentScheduledWorkout._version
                    };
                    console.log("Updating ScheduledWorkout via API with input:", JSON.stringify(updateInput, null, 2));
                    type UpdateScheduleResult = { updateScheduledWorkout: APIScheduledWorkout };
                    const updateResult = await client.graphql<UpdateScheduleResult>({
                        query: updateScheduledWorkout,
                        variables: { input: updateInput }
                    });
                     if (hasGraphQLErrors(updateResult)) throw updateResult.errors[0];
                     if (!updateResult.data?.updateScheduledWorkout) throw new Error("Update scheduled workout status failed, response data missing.");
                     console.log(`✅ Successfully updated ScheduledWorkout ${sessionData.scheduledWorkoutId} status to Completed.`);
                } else {
                    console.error(`Could not get valid _version for ScheduledWorkout ${sessionData.scheduledWorkoutId}`);
                }
            } catch (scheduleUpdateError: any) {
                 console.error(`❌ Error updating ScheduledWorkout status for ID ${sessionData.scheduledWorkoutId}:`, scheduleUpdateError);
                 if (scheduleUpdateError?.errors) { console.error("GraphQL Errors:", scheduleUpdateError.errors); }
            }
        }

        // Map result back to local WorkoutSession type
        return {
            id: savedSession.id,
            userId: savedSession.userId,
            templateId: savedSession.templateId,
            scheduledWorkoutId: savedSession.scheduledWorkoutId, // Map new field
            name: savedSession.name,
            duration: savedSession.duration,
            completedAt: savedSession.completedAt,
            exercises: (savedSession.exercises ?? []) // Add null check
                .filter((ex): ex is NonNullable<typeof ex> => !!ex)
                .map((ex): SessionExercise => ({ // Add explicit type
                    id: ex.id,
                    name: ex.name,
                    note: ex.note,
                    performedSets: (ex.performedSets ?? []) // Add null check
                        .filter((set): set is NonNullable<typeof set> & { id: string } => !!set && !!set.id) // Filter nulls + check required
                        .map((set): PerformedSet => ({ // Add explicit type and map new fields
                            id: set.id,
                            reps: set.reps ?? null,      // Map from API type
                            weight: set.weight ?? null,  // Map from API type
                            rpe: set.rpe ?? undefined,   // Map from API type
                            notes: set.notes ?? undefined // Map from API type
                        }))
                })),
            createdAt: savedSession.createdAt,
            updatedAt: savedSession.updatedAt,
            owner: savedSession.owner
        } as WorkoutSession; // Cast might still be needed if local types slightly differ

    } catch (error: any) {
        console.error('❌ Error saving workout session via API:', error);
        if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
        throw error;
    }
};


const getSessionsByUserId = async (userId: string): Promise<WorkoutSession[]> => {
    if (!userId) return [];
    console.log(`Workspaceing sessions for user ${userId} via Custom API Query...`);

    type CustomSessionsQueryResult = { // Define expected shape from query
         sessionsByUserId?: {
             items?: (Partial<APIWorkoutSession> & { // Use Partial for flexibility
                 exercises?: ({
                     id?: string | null;
                     name?: string | null;
                     note?: string | null;
                     performedSets?: (Partial<PerformedSetInput> | null)[] | null // Use Partial
                 } | null)[] | null
             } | null)[] | null
         } | null
     };

    try {
        const variables = { userId: userId, filter: { _deleted: { ne: true } } };
        const result = await client.graphql<CustomSessionsQueryResult>({
            query: listSessionsByUserIdWithDetails, // Ensure query selects rpe/notes
            variables: variables
        });

        if (hasGraphQLErrors(result)) { throw result.errors[0]; }

        const items = result.data?.sessionsByUserId?.items ?? [];
        // Add more robust filtering
        const validItems = items.filter((item): item is APIWorkoutSession & { exercises?: ({ performedSets?: (PerformedSetInput | null)[] | null } | null)[] | null } =>
            !!item && !item._deleted && !!item.id && !!item.userId && !!item.name && !!item.completedAt && !!item.createdAt && !!item.updatedAt
        );
        console.log(`Workspaceed ${validItems.length} non-deleted sessions via Custom API Query`);

        // Map result including new PerformedSet fields
        return validItems.map((item): WorkoutSession => ({ // Explicit return type
            id: item.id,
            userId: item.userId,
            templateId: item.templateId,
            scheduledWorkoutId: item.scheduledWorkoutId,
            name: item.name,
            duration: item.duration,
            completedAt: item.completedAt,
            exercises: (item.exercises ?? []) // Add null check
                .filter((ex): ex is NonNullable<typeof ex> & { id: string, name: string } => !!ex && !!ex.id && !!ex.name) // Filter nulls + check required
                .map((ex): SessionExercise => ({ // Add explicit type
                    id: ex.id,
                    name: ex.name,
                    note: ex.note,
                    performedSets: (ex.performedSets ?? []) // Add null check
                        .filter((set): set is NonNullable<typeof set> & { id: string } => !!set && !!set.id) // Filter nulls + check required
                        .map((set): PerformedSet => ({ // Add explicit type and map new fields
                            id: set.id,
                            reps: set.reps ?? null,   // Map from API type
                            weight: set.weight ?? null, // Map from API type
                            rpe: set.rpe ?? undefined,   // Map from API type
                            notes: set.notes ?? undefined // Map from API type
                        }))
                })),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            owner: item.owner
        })); // Removed 'as WorkoutSession[]' - return type is inferred correctly

    } catch (error: any) {
        console.error('Error getting workout sessions via Custom API Query:', error);
        if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
        return [];
    }
};

// --- Placeholder/Unused Functions ---
const saveWorkoutPlan = async (plan: any, userId: string): Promise<any> => { /* Placeholder */ return Promise.reject("Not implemented"); };
const getCurrentPlan = async (userId: string): Promise<any | null> => { /* Placeholder */ return Promise.resolve(null); };

// --- Export Service ---
const workoutService = { saveTemplate, getTemplates, deleteTemplate, saveSession, getSessionsByUserId, saveWorkoutPlan, getCurrentPlan };
export default workoutService;