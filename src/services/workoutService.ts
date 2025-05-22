// src/services/workoutService.ts
// V1.5.5 Update: Ensuring specific GraphQLResult import and explicit types

import { generateClient, type GraphQLResult } from 'aws-amplify/api'; // Only GraphQLResult needed for these guards now
import {
    // Mutations
    createWorkoutTemplate, createExercise, deleteWorkoutTemplate, deleteExercise,
    createWorkoutSession, updateScheduledWorkout,
    deleteWorkoutSession, // Added missing import
    updateWorkoutTemplate, // Added missing import
    updateWorkoutSession, // Added missing import
} from '../graphql/mutations';
import {
    // Queries
    getWorkoutTemplate,
    getScheduledWorkout,
    sessionsByUserId,
    // Added missing imports for custom queries if they exist, or ensure they are defined inline
} from '../graphql/queries';
import {
    // API Types
    CreateWorkoutTemplateInput, CreateExerciseInput, DeleteWorkoutTemplateInput, DeleteExerciseInput,
    WorkoutTemplate as APIWorkoutTemplate, Exercise as APIExercise, WorkoutSession as APIWorkoutSession,
    ScheduledWorkout as APIScheduledWorkout,
    CreateWorkoutSessionInput, UpdateScheduledWorkoutInput,
    SessionExerciseInput, PerformedSetInput,
    GetWorkoutTemplateQuery, GetScheduledWorkoutQuery,
    CreateWorkoutTemplateMutation, CreateExerciseMutation, DeleteWorkoutTemplateMutation, DeleteExerciseMutation, CreateWorkoutSessionMutation, UpdateScheduledWorkoutMutation,
    DeleteWorkoutSessionMutation, UpdateWorkoutTemplateMutation, // Added missing types
    UpdateWorkoutSessionInput, UpdateWorkoutSessionMutation, // Added missing types
    ModelSortDirection, SessionsByUserIdQuery,
} from '../API';
// Local TS types (assumed to be correct now from src/types/workout.ts)
import { WorkoutTemplate, Exercise, WorkoutSession, SessionExercise, PerformedSet, LogExercise, WorkoutStatus, WorkoutStatusValues } from '../types/workout';

const client = generateClient();

// Custom Queries defined inline
const listTemplatesByUserIdWithExercises = /* GraphQL */ `
  query TemplatesByUserId($userId: ID!, $filter: ModelWorkoutTemplateFilterInput, $limit: Int, $nextToken: String) {
    templatesByUserId(userId: $userId, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items { id userId name description isAIPlan createdAt updatedAt owner _version _deleted _lastChangedAt __typename
        exercises(limit: 100) { items { id name sets reps weight restPeriod note createdAt _version __typename } nextToken __typename }
      } nextToken __typename
    }
  }`;

// UPDATED: Removed $completedAt and its usage, GSI now sorts by updatedAt by default
const listSessionsByUserIdWithDetails = /* GraphQL */ `
  query SessionsByUserId($userId: ID!, $filter: ModelWorkoutSessionFilterInput, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
    sessionsByUserId(userId: $userId, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
      items { id userId templateId scheduledWorkoutId name duration completedAt owner createdAt updatedAt _version _deleted _lastChangedAt __typename
        exercises { id name note __typename performedSets { id reps weight rpe notes __typename } }
      } nextToken __typename
    }
  }`;

// Type for GraphQL query result for listTemplatesByUserIdWithExercises
type CustomTemplatesQueryResult = {
    templatesByUserId?: {
        __typename: "ModelWorkoutTemplateConnection";
        items: (APIWorkoutTemplate & { exercises?: { items: (APIExercise | null)[] | null } | null })[];
        nextToken?: string | null;
    } | null;
};

// For Observable type, typically from 'zen-observable-ts' or similar if used by Amplify subscriptions
// However, the error messages suggest 'Observable' might be an implicit type from Amplify's GraphQL client for subscriptions.
// Let's assume 'GraphqlSubscriptionMessage' is a type we might need if we were to inspect subscription messages.

// Helper Type Guard - Pragmatic version for non-subscription GQL results
function hasGraphQLErrors<TData>(
    obj: any // More lenient input type
): obj is { errors: NonNullable<GraphQLResult<TData>['errors']> } { // Narrows to an object with an errors array
    return !!obj && typeof obj === 'object' && 
           'errors' in obj && Array.isArray(obj.errors) && obj.errors.length > 0;
}

function hasGraphQLData<TData>(
    obj: any // More lenient input type
): obj is { data: NonNullable<GraphQLResult<TData>['data']> } { // Narrows to an object with a data property
    return !!obj && typeof obj === 'object' && 
           'data' in obj && obj.data !== null && obj.data !== undefined && 
           !hasGraphQLErrors(obj); // Call the refined hasGraphQLErrors
}

export type CreateWorkoutTemplateData = {
    userId: string; name: string; description?: string | null;
    exercises: Exercise[]; owner: string; isAIPlan?: boolean | null;
};

const saveTemplate = async (templateData: CreateWorkoutTemplateData): Promise<WorkoutTemplate> => {
    if (!templateData.owner || !templateData.userId) throw new Error("User identity required");
    if (!templateData.exercises?.length) throw new Error("Exercises required");

    const templateInput: CreateWorkoutTemplateInput = {
        userId: templateData.userId, name: templateData.name, description: templateData.description,
        owner: templateData.owner, isAIPlan: templateData.isAIPlan ?? false
    };
    let savedTemplate: APIWorkoutTemplate;

    try {
        const templateResult = await client.graphql<CreateWorkoutTemplateMutation>({ query: createWorkoutTemplate, variables: { input: templateInput } });
        if (hasGraphQLErrors(templateResult)) throw new Error(templateResult.errors[0].message || "GraphQL error in saveTemplate metadata");
        if (!hasGraphQLData(templateResult) || !templateResult.data.createWorkoutTemplate) throw new Error("Save template metadata failed: No data returned");
        savedTemplate = templateResult.data.createWorkoutTemplate;
        console.log(`✅ Saved Template Metadata: ${savedTemplate.name} (ID: ${savedTemplate.id})`);

        const exerciseInputPromises = templateData.exercises.map((exercise: Exercise) => {
            const input: CreateExerciseInput = {
                workoutTemplateId: savedTemplate.id, name: exercise.name,
                sets: exercise.sets ?? null, reps: exercise.reps ?? null, weight: exercise.weight ?? null,
                restPeriod: exercise.restPeriod ?? null, note: exercise.note ?? null, owner: templateData.owner,
            };
            return client.graphql<CreateExerciseMutation>({ query: createExercise, variables: { input } });
        });
        const exerciseResults = await Promise.all(exerciseInputPromises);

        const savedExercises: APIExercise[] = [];
        for (const result of exerciseResults) {
            if (hasGraphQLErrors(result)) throw new Error(result.errors[0].message || "GraphQL error saving an exercise");
            if (!hasGraphQLData(result) || !result.data.createExercise) throw new Error("An exercise failed to save: No data returned");
            savedExercises.push(result.data.createExercise);
        }
        console.log(`✅ Saved ${savedExercises.length} exercises for template ${savedTemplate.id}`);

        return {
            id: savedTemplate.id, userId: savedTemplate.userId, name: savedTemplate.name,
            description: savedTemplate.description ?? undefined, isAIPlan: savedTemplate.isAIPlan ?? false,
            exercises: savedExercises.map((ex: APIExercise): Exercise => ({
                id: ex.id, name: ex.name, sets: ex.sets ?? null, reps: ex.reps ?? null, weight: ex.weight ?? null,
                restPeriod: ex.restPeriod ?? undefined, note: ex.note ?? undefined,
            })),
            createdAt: savedTemplate.createdAt, updatedAt: savedTemplate.updatedAt, owner: savedTemplate.owner,
        };
    } catch (error: any) { console.error('Error during saveTemplate:', error); if (error?.errors) { console.error("GraphQL Errors:", error.errors); } throw error; }
};

const getTemplates = async (userId: string): Promise<WorkoutTemplate[]> => {
    if (!userId) return [];
    console.log(`Workspaceing templates for user ${userId}...`);
    try {
        type CustomTemplateItem = Partial<APIWorkoutTemplate> & { _deleted?: boolean | null; exercises?: { items?: (Partial<APIExercise> | null)[] | null } | null };
        type CustomTemplatesQueryResult = { templatesByUserId?: { items?: (CustomTemplateItem | null)[] | null } | null };
        const variables = { userId: userId, filter: { _deleted: { ne: true } } };
        const result = await client.graphql<CustomTemplatesQueryResult>({ query: listTemplatesByUserIdWithExercises, variables: variables });

        if (hasGraphQLErrors(result)) { throw new Error(result.errors[0].message || "Error fetching templates"); }
        const items = result.data?.templatesByUserId?.items ?? [];
        const validItems = items.filter((item): item is APIWorkoutTemplate & { exercises?: { items: (APIExercise | null)[] | null } | null } =>
            !!item && !item._deleted && !!item.id && !!item.userId && !!item.name && !!item.createdAt && !!item.updatedAt
        );
        console.log(`Workspaceed ${validItems.length} non-deleted templates`);
        return validItems.map((item: APIWorkoutTemplate & { exercises?: { items: (APIExercise | null)[] | null } | null }): WorkoutTemplate => {
            const mappedExercises = item.exercises?.items
                ?.filter((ex): ex is APIExercise => !!ex && !!ex.id && !!ex.name)
                .map((ex: APIExercise): Exercise => ({
                    id: ex.id, name: ex.name, sets: ex.sets ?? null, reps: ex.reps ?? null, weight: ex.weight ?? null,
                    restPeriod: ex.restPeriod ?? undefined, note: ex.note ?? undefined,
                })) ?? [];
            return {
                id: item.id, userId: item.userId, name: item.name, description: item.description ?? undefined,
                isAIPlan: item.isAIPlan ?? false, exercises: mappedExercises,
                createdAt: item.createdAt, updatedAt: item.updatedAt, owner: item.owner,
            };
        });
    } catch (error: any) { console.error('Error getting templates:', error); if (error?.errors) { console.error("GraphQL Errors:", error.errors); } return []; }
};

const deleteTemplate = async (templateId: string, userId: string): Promise<string | null> => {
    if (!userId || !templateId) throw new Error("User/Template ID required");
    console.log(`DELETE: Attempting delete for template ${templateId}`);
    try {
        const getResult = await client.graphql<GetWorkoutTemplateQuery>({ query: getWorkoutTemplate, variables: { id: templateId } });
        if (hasGraphQLErrors(getResult)) throw new Error(getResult.errors[0].message || "Error fetching template for delete");
        const current = getResult.data?.getWorkoutTemplate;
        if (!current || current._deleted) { console.log(`Template ${templateId} not found or already deleted.`); return null; }
        const version = current._version;
        if (typeof version !== 'number') throw new Error(`Invalid version for template ${templateId}`);

        type ExercisesQueryResult = { exercisesByWorkoutTemplateId?: { items?: ({ id: string, _version: number | null } | null)[] | null } | null };
        const listExQuery = /* GraphQL */ `query ExercisesByWorkoutTemplateId($workoutTemplateId: ID!) { exercisesByWorkoutTemplateId(workoutTemplateId: $workoutTemplateId, limit: 999) { items { id _version } } }`;
        const exerciseResult = await client.graphql<ExercisesQueryResult>({ query: listExQuery, variables: { workoutTemplateId: templateId } });
        if (hasGraphQLErrors(exerciseResult)) throw new Error(exerciseResult.errors[0].message || "Error fetching exercises for delete");

        const exercisesToDelete = exerciseResult.data?.exercisesByWorkoutTemplateId?.items ?? [];
        const validExercises = exercisesToDelete.filter((ex): ex is { id: string, _version: number } => !!ex && typeof ex._version === 'number');

        if (validExercises.length > 0) {
            const deletePromises = validExercises.map((ex: { id: string, _version: number }) => client.graphql<DeleteExerciseMutation>({ query: deleteExercise, variables: { input: { id: ex.id, _version: ex._version } } }));
            const deleteResults = await Promise.all(deletePromises);
            deleteResults.forEach(res => { if (hasGraphQLErrors(res)) throw new Error(res.errors[0].message || "Error deleting an exercise"); });
            console.log(`Deleted ${validExercises.length} exercises.`);
        }

        const deleteInput: DeleteWorkoutTemplateInput = { id: templateId, _version: version };
        const templateDeleteResult = await client.graphql<DeleteWorkoutTemplateMutation>({ query: deleteWorkoutTemplate, variables: { input: deleteInput } });
        if (hasGraphQLErrors(templateDeleteResult)) throw new Error(templateDeleteResult.errors[0].message || "Error deleting template");
        const deletedId = templateDeleteResult.data?.deleteWorkoutTemplate?.id;
        if (deletedId) { console.log('Workout template deleted:', deletedId); return deletedId; }
        else { console.warn("Delete template response missing ID"); return null; }
    } catch (error: any) { console.error('SERVICE ERROR: deleteTemplate:', error); if (error?.errors) { console.error("GraphQL Errors:", error.errors); } throw error; }
};

// V1.6 - New type for managing session state for pause/resume
export type ManageWorkoutSessionInput = {
    id?: string; 
    _version?: number; 
    userId: string;
    owner: string;
    name: string;
    status: WorkoutStatus; 
    templateId?: string | null;
    scheduledWorkoutId?: string | null;
    currentElapsedTime?: number | null;
    currentExercisesState?: LogExercise[] | null; // Will be stringified before sending to backend
    finalExercises?: SessionExerciseInput[] | null; 
    finalDuration?: number | null;
    finalCompletedAt?: string | null; 
};

// V1.6 - New core function to create or update workout sessions
const upsertWorkoutSession = async (input: ManageWorkoutSessionInput): Promise<APIWorkoutSession> => {
    if (!input.userId || !input.owner) throw new Error("User identity (userId, owner) required for upsertWorkoutSession");
    if (!input.name) throw new Error("Workout name required for upsertWorkoutSession");
    if (!input.status) throw new Error("Workout status required for upsertWorkoutSession");

    if (input.id && input._version !== undefined) { // UPDATE existing session
        const updateDetails: UpdateWorkoutSessionInput = {
            id: input.id,
            _version: input._version,
            name: input.name, 
            status: input.status,
            currentElapsedTime: input.currentElapsedTime,
            currentExercisesState: input.currentExercisesState ? JSON.stringify(input.currentExercisesState) : null,
            exercises: input.status === WorkoutStatusValues.COMPLETED ? input.finalExercises : undefined,
            duration: input.status === WorkoutStatusValues.COMPLETED ? input.finalDuration : undefined,
            completedAt: input.status === WorkoutStatusValues.COMPLETED ? input.finalCompletedAt : undefined,
        };
        Object.keys(updateDetails).forEach(keyStr => { 
            const key = keyStr as keyof UpdateWorkoutSessionInput;
            if (updateDetails[key] === undefined) {
                delete updateDetails[key];
            }
        });

        console.log("Attempting to UPDATE session with ID:", input.id, "Details:", JSON.stringify(updateDetails, null, 2));
        const result = await client.graphql<UpdateWorkoutSessionMutation>({
            query: updateWorkoutSession, 
            variables: { input: updateDetails }
        });

        if (hasGraphQLErrors(result)) { 
            console.error("GraphQL Error on updateWorkoutSession:", result.errors); 
            throw new Error(result.errors[0].message || "Failed to update workout session (GraphQL error)");
        }
        if (!hasGraphQLData(result) || !result.data.updateWorkoutSession) { 
            throw new Error("Failed to update workout session (no data returned or error occurred post-error check)");
        }
        console.log("✅ Session UPDATED:", result.data.updateWorkoutSession.id, "Status:", result.data.updateWorkoutSession.status);
        return result.data.updateWorkoutSession as APIWorkoutSession;

    } else { // CREATE new session
        if (input.status !== WorkoutStatusValues.IN_PROGRESS) {
            throw new Error("New session must start with IN_PROGRESS status.");
        }
        const createDetails: CreateWorkoutSessionInput = {
            userId: input.userId,
            owner: input.owner,
            name: input.name,
            status: input.status, 
            templateId: input.templateId,
            scheduledWorkoutId: input.scheduledWorkoutId,
            currentElapsedTime: input.currentElapsedTime ?? 0,
            currentExercisesState: input.currentExercisesState ? JSON.stringify(input.currentExercisesState) : null,
        };
        Object.keys(createDetails).forEach(keyStr => {
            const key = keyStr as keyof CreateWorkoutSessionInput;
            if (createDetails[key] === undefined) {
                delete createDetails[key];
            }
        });

        console.log("Attempting to CREATE session:", JSON.stringify(createDetails, null, 2));
        const result = await client.graphql<CreateWorkoutSessionMutation>({
            query: createWorkoutSession, 
            variables: { input: createDetails }
        });

        if (hasGraphQLErrors(result)) {
            console.error("GraphQL Error on createWorkoutSession:", result.errors);
            throw new Error(result.errors[0].message || "Failed to create workout session (GraphQL error)");
        }
        if (!hasGraphQLData(result) || !result.data.createWorkoutSession) {
            throw new Error("Failed to create workout session (no data returned or error occurred post-error check)");
        }
        console.log("✅ Session CREATED:", result.data.createWorkoutSession.id, "Status:", result.data.createWorkoutSession.status);
        return result.data.createWorkoutSession as APIWorkoutSession;
    }
};

// Mapper from APIWorkoutSession to local WorkoutSession type
// This should be defined before it's used by functions returning LocalWorkoutSession
const mapApiSessionToLocal = (apiSession: APIWorkoutSession): WorkoutSession => {
    let parsedLogExercises: LogExercise[] | undefined = undefined;
    if (apiSession.currentExercisesState) {
        try {
            parsedLogExercises = JSON.parse(apiSession.currentExercisesState) as LogExercise[];
        } catch (e) {
            console.error("Failed to parse currentExercisesState JSON from API session:", apiSession.id, e);
        }
    }

    // The API's 'exercises' field (SessionExercise[]) is for completed sessions.
    // The local 'WorkoutSession' type should reflect this structure for its 'exercises' field.
    const mappedFinalExercises: SessionExercise[] | undefined = apiSession.exercises?.map(ex => ({
        id: ex.id, // Ensure your local SessionExercise matches API's structure or map accordingly
        name: ex.name,
        note: ex.note ?? undefined,
        performedSets: ex.performedSets?.map(ps => ({
            id: ps.id,
            reps: ps.reps ?? undefined,
            weight: ps.weight ?? undefined,
            rpe: ps.rpe ?? undefined,
            notes: ps.notes ?? undefined,
        })) || [],
    })) || undefined;

    return {
        id: apiSession.id,
        userId: apiSession.userId,
        owner: apiSession.owner ?? undefined,
        name: apiSession.name,
        status: apiSession.status as WorkoutStatus, // Assuming status from API matches local type
        templateId: apiSession.templateId ?? undefined,
        scheduledWorkoutId: apiSession.scheduledWorkoutId ?? undefined,
        
        currentElapsedTime: apiSession.currentElapsedTime ?? undefined,
        currentExercisesState: apiSession.currentExercisesState ?? undefined, // Keeping as string for now, UI layer can parse

        exercises: mappedFinalExercises, // This is for the final completed exercises
        duration: apiSession.duration ?? undefined,
        completedAt: apiSession.completedAt ?? undefined,
        createdAt: apiSession.createdAt,
        updatedAt: apiSession.updatedAt,
        _version: apiSession._version, // Ensure _version is mapped
    };
};

// Type for input when marking a session as complete (replaces old SaveSessionData)
export type SaveCompletedSessionData = {
    id: string; 
    _version: number; 
    userId: string;
    owner: string;
    name: string; 
    templateId?: string | null;
    scheduledWorkoutId?: string | null;
    finalLoggedExercises: LogExercise[]; 
    finalDuration: number;          
    finalCompletedAt: string;       
};

// Refactored saveSession to mark a session as COMPLETED using upsertWorkoutSession
const saveSession = async (sessionData: SaveCompletedSessionData): Promise<WorkoutSession> => {
    if (!sessionData.id || sessionData._version === undefined) {
        throw new Error("Session ID and version are required to complete a session.");
    }

    // Map LogExercise[] to SessionExerciseInput[] for the 'finalExercises' field
    const finalExercisesInput: SessionExerciseInput[] = (sessionData.finalLoggedExercises || [])
        .filter(ex => !!ex && !!ex.id) // Basic validation
        .map((ex: LogExercise): SessionExerciseInput => ({
            id: ex.id, // This should be the exercise definition ID
            name: ex.name,
            note: ex.note,
            performedSets: (ex.performedSets || []).map((ps: PerformedSet): PerformedSetInput => ({
                id: ps.id, // ID of the performed set instance
                reps: ps.reps,
                weight: ps.weight,
                rpe: ps.rpe,
                notes: ps.notes,
            })),
        }));

    const upsertInput: ManageWorkoutSessionInput = {
        id: sessionData.id,
        _version: sessionData._version,
        userId: sessionData.userId,
        owner: sessionData.owner,
        name: sessionData.name, // Pass name, templateId etc. in case they need to be part of the record
        templateId: sessionData.templateId,
        scheduledWorkoutId: sessionData.scheduledWorkoutId,
        status: WorkoutStatusValues.COMPLETED,
        currentElapsedTime: null, // Clear in-progress timer state
        currentExercisesState: null, // Clear in-progress exercise state string
        finalExercises: finalExercisesInput,
        finalDuration: sessionData.finalDuration,
        finalCompletedAt: sessionData.finalCompletedAt,
    };

    const savedApiSession = await upsertWorkoutSession(upsertInput);
    return mapApiSessionToLocal(savedApiSession);
};

const getSessionsByUserId = async (userId: string): Promise<WorkoutSession[]> => {
     if (!userId) return [];
     console.log(`Fetching COMPLETED sessions for user history ${userId}...`);

     type CustomPerformedSet = Partial<PerformedSetInput> & { id?: string | null; __typename?: string };
     type CustomSessionExercise = { id?: string | null; name?: string | null; note?: string | null; __typename?: string; performedSets?: (CustomPerformedSet | null)[] | null };
     type CustomSessionItem = Partial<APIWorkoutSession> & { __typename?: string; exercises?: (CustomSessionExercise | null)[] | null; completedAt?: string | null; }; 
     type CustomSessionsQueryResult = { sessionsByUserId?: { items?: (CustomSessionItem | null)[] | null, __typename?: string } | null };

     try {
         const variables = {
            userId: userId,
            filter: { _deleted: { ne: true } }, 
            sortDirection: ModelSortDirection.DESC // Use ModelSortDirection enum
         };
         // Using listSessionsByUserIdWithDetails custom query string for now, ensure its type matches CustomSessionsQueryResult
         const result = await client.graphql<CustomSessionsQueryResult>({ query: listSessionsByUserIdWithDetails, variables: variables });

         if (hasGraphQLErrors(result)) { throw new Error(result.errors[0].message || "Error fetching sessions for history"); }
         const items = result.data?.sessionsByUserId?.items ?? [];
         
         // --- Option A (Temporary Debugging & Verification) for Issue 2 --- 
         console.log("Fetched items statuses for history:", items.map(item => item?.status)); 
         console.log(`Total items fetched for history (before any filtering): ${items.length}`);

         const validItems = items.filter((item): item is APIWorkoutSession & { exercises?: (CustomSessionExercise | null)[] | null; completedAt: string; } => {
            const isGenerallyValid = 
                !!item && 
                !item._deleted && 
                !!item.id && 
                !!item.userId && 
                !!item.name && 
                // !!item.completedAt && // Defer this check until after status or for display only
                !!item.createdAt && 
                !!item.updatedAt;

            // Log detailed info for each item before status check
            // console.log(`Item ID: ${item?.id}, Status: ${item?.status}, CompletedAt: ${item?.completedAt}, IsGenerallyValid: ${isGenerallyValid}`);

            // Original filter causing issues:
            // const isCompletedStatus = item.status === WorkoutStatusValues.COMPLETED;
            // if (isGenerallyValid && !isCompletedStatus && item.status !== undefined && item.status !== null) {
            //     console.log(`Item ID: ${item?.id} has status '${item.status}' - not 'COMPLETED'`);
            // }

            // For Option C (Flexible Filter - if enabling later):
            const isConsideredComplete = item.status === WorkoutStatusValues.COMPLETED || item.status === null || item.status === undefined;
            if (isGenerallyValid && !isConsideredComplete) {
                 console.log(`Item ID: ${item?.id} has status '${item.status}' - not considered complete and will be filtered out.`);
            }
            
            // Applying Option C logic for now as a more robust immediate step
            // Ensure completedAt is present if it's truly a completed session by status
            // If status is null/undefined (old record), completedAt check is still important for data integrity if it was logged
            const completedAtCheck = (item.status === WorkoutStatusValues.COMPLETED || item.status === null || item.status === undefined) ? !!item.completedAt : true;

            return isGenerallyValid && isConsideredComplete && completedAtCheck;
         });
         console.log(`Total items after filtering for history (valid, considered complete, non-deleted): ${validItems.length}`);

         return validItems.map((item) => mapApiSessionToLocal(item as APIWorkoutSession)); // Use mapApiSessionToLocal

     } catch (error: any) { console.error('Error getting sessions for history:', error); if (error?.errors) { console.error("GraphQL Errors:", error.errors); } return []; }
};

const saveWorkoutPlan = async (plan: any, userId: string): Promise<any> => Promise.reject("Not implemented");
const getCurrentPlan = async (userId: string): Promise<any | null> => Promise.resolve(null);

// Function to get an IN_PROGRESS or PAUSED session for a user
const getResumableSession = async (userId: string): Promise<WorkoutSession | null> => {
    console.log(`Attempting to fetch resumable session for userId: ${userId}`);
    try {
        const variables = {
            userId: userId,
            sortDirection: ModelSortDirection.DESC, // Sort by updatedAt (GSI sort key) descending
            filter: { 
                or: [
                    { status: { eq: WorkoutStatusValues.IN_PROGRESS } },
                    { status: { eq: WorkoutStatusValues.PAUSED } }
                ],
                _deleted: { ne: true }
            },
            limit: 1 // We only want the most recent resumable session
        };
        console.log("Variables for getResumableSession query:", JSON.stringify(variables, null, 2));

        // Use the specific generated query type for better type safety
        const result = await client.graphql<SessionsByUserIdQuery>({
            query: sessionsByUserId, // Ensure this is the correct imported query from graphql/queries
            variables: variables
        });

        console.log("Raw result from getResumableSession query:", JSON.stringify(result, null, 2)); // Log raw result

        if (hasGraphQLErrors(result)) {
            console.error("GraphQL errors fetching resumable sessions:", result.errors);
            throw new Error(result.errors.map(e => e.message).join('\n'));
        }

        // Ensure correct data path as confirmed by AppSync console (assuming sessionsByUserId is top-level)
        if (!hasGraphQLData(result) || !result.data?.sessionsByUserId || !result.data.sessionsByUserId.items) {
            console.log("No sessions found for user or data structure is unexpected for resumable session.");
            return null;
        }

        const sessions = result.data.sessionsByUserId.items.filter(
            (item): item is APIWorkoutSession => item !== null && item !== undefined && !item._deleted // Already filtered by _deleted: {ne: true} in query
        );

        // The query filter should ideally only return IN_PROGRESS or PAUSED, but double check if needed.
        // If multiple are returned (e.g. limit > 1 and filter was broad), the sortDirection handles picking the latest.
        if (sessions.length === 0) {
            console.log("No IN_PROGRESS or PAUSED session found after filtering query results.");
            return null;
        }
        
        const sessionToResume = sessions[0]; // Should be the most recent due to sort and limit
        console.log("Resumable session found and selected:", sessionToResume.id, sessionToResume.status);
        return mapApiSessionToLocal(sessionToResume);

    } catch (error: any) {
        console.error("Error in getResumableSession:", error);
        if (error.errors) { 
            console.error("GraphQL Detailed Errors from getResumableSession:", error.errors);
        }
        throw error; 
    }
};

// --- Types for Pause/Resume/Start Wrapper Functions ---
export type StartWorkoutData = {
    userId: string;
    owner: string;
    name: string; // Name for the new session (e.g., "Morning Run", "Chest Day")
    initialExercises: LogExercise[]; // Could be from a template, or empty for a quick start
    templateId?: string | null;
    scheduledWorkoutId?: string | null;
};

export type PauseWorkoutData = {
    sessionId: string;
    _version: number;
    userId: string; 
    owner: string;  
    name: string;   
    currentElapsedTime: number;
    currentExercisesState: LogExercise[];
};

export type ResumeWorkoutData = {
    sessionId: string;
    _version: number;
    userId: string; 
    owner: string;  
    name: string;   
};

// --- Wrapper Functions for Workout Lifecycle ---

const startWorkout = async (data: StartWorkoutData): Promise<WorkoutSession> => {
    console.log("Attempting to start workout:", data.name);
    const upsertInput: ManageWorkoutSessionInput = {
        userId: data.userId,
        owner: data.owner,
        name: data.name,
        status: WorkoutStatusValues.IN_PROGRESS,
        templateId: data.templateId,
        scheduledWorkoutId: data.scheduledWorkoutId,
        currentElapsedTime: 0,
        currentExercisesState: data.initialExercises, // Will be stringified by upsertWorkoutSession
        // final fields are null/undefined for a new session
    };
    const newApiSession = await upsertWorkoutSession(upsertInput);
    return mapApiSessionToLocal(newApiSession);
};

const pauseWorkout = async (data: PauseWorkoutData): Promise<WorkoutSession> => {
    console.log("Attempting to pause workout:", data.sessionId);
    const upsertInput: ManageWorkoutSessionInput = {
        id: data.sessionId,
        _version: data._version,
        userId: data.userId, // Pass through for the update call in upsertWorkoutSession
        owner: data.owner,   // Pass through
        name: data.name,     // Pass through
        status: WorkoutStatusValues.PAUSED,
        currentElapsedTime: data.currentElapsedTime,
        currentExercisesState: data.currentExercisesState, // Will be stringified
    };
    const updatedApiSession = await upsertWorkoutSession(upsertInput);
    return mapApiSessionToLocal(updatedApiSession);
};

const resumeWorkout = async (data: ResumeWorkoutData): Promise<WorkoutSession> => {
    console.log("Attempting to resume workout:", data.sessionId);
    // When resuming, we primarily change the status.
    // currentElapsedTime and currentExercisesState should have been persisted when paused.
    // upsertWorkoutSession will fetch the existing session if id and _version are provided, and update its status.
    // It's crucial that `upsertWorkoutSession`'s update logic doesn't overwrite existing non-provided fields with null unless explicitly told to.
    // Our current `upsertWorkoutSession` with `Object.keys(updateDetails).forEach` removal of undefined keys should handle this correctly.
    const upsertInput: ManageWorkoutSessionInput = {
        id: data.sessionId,
        _version: data._version,
        userId: data.userId, // Pass through
        owner: data.owner,   // Pass through
        name: data.name,     // Pass through
        status: WorkoutStatusValues.IN_PROGRESS,
        // We don't re-specify currentElapsedTime or currentExercisesState here,
        // relying on the backend to keep the previously PAUSED values.
        // UpdateWorkoutSessionInput in upsert will only send fields present in updateDetails.
    };
    const updatedApiSession = await upsertWorkoutSession(upsertInput);
    return mapApiSessionToLocal(updatedApiSession);
};

// Add the new UserWorkoutStats type definition
export type UserWorkoutStats = {
  workoutsThisWeek: number;
  totalWorkouts: number;
};

// V1.6 - New core function to create or update workout sessions
// ... existing code ...
// BEFORE the final export default workoutService;

const getUserWorkoutStats = async (userId: string): Promise<UserWorkoutStats> => {
  if (!userId) {
    console.warn("getUserWorkoutStats: userId is missing.");
    return { workoutsThisWeek: 0, totalWorkouts: 0 };
  }

  console.log(`Fetching workout stats for userId: ${userId}`);
  try {
    // Re-use getSessionsByUserId which already fetches and filters for completed, non-deleted sessions
    // and handles mapping to LocalWorkoutSession (which is actually WorkoutSession type)
    const allCompletedSessions: WorkoutSession[] = await getSessionsByUserId(userId);

    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    const startOfWeek = new Date(today);
    // Adjust to Monday of the current week
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); 
    startOfWeek.setHours(0, 0, 0, 0);

    let workoutsThisWeekCount = 0;
    allCompletedSessions.forEach(session => {
      if (session.completedAt) { // Ensure completedAt is present
        const completedDate = new Date(session.completedAt);
        if (completedDate >= startOfWeek) {
          workoutsThisWeekCount++;
        }
      }
    });

    console.log(`getUserWorkoutStats: Total completed = ${allCompletedSessions.length}, This week = ${workoutsThisWeekCount}`);
    return {
      workoutsThisWeek: workoutsThisWeekCount,
      totalWorkouts: allCompletedSessions.length,
    };
  } catch (error) {
    console.error("Error in getUserWorkoutStats:", error);
    return { workoutsThisWeek: 0, totalWorkouts: 0 }; // Return default on error
  }
};

const workoutService = {
    saveTemplate,
    getTemplates,
    deleteTemplate,
    mapApiSessionToLocal,
    saveSession,
    getSessionsByUserId,
    saveWorkoutPlan,
    getCurrentPlan,
    upsertWorkoutSession,
    getResumableSession,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    getUserWorkoutStats,
};
export default workoutService;