// src/services/workoutService.ts
// V1.5.5 Update: Ensuring specific GraphQLResult import and explicit types

import { generateClient, type GraphQLResult, type GraphqlSubscriptionResult, type GraphqlSubscriptionMessage } from 'aws-amplify/api'; // Ensure correct imports
import {
    // Mutations
    createWorkoutTemplate, createExercise, deleteWorkoutTemplate, deleteExercise,
    createWorkoutSession, updateScheduledWorkout,
    deleteWorkoutSession, // Added missing import
    updateWorkoutTemplate, // Added missing import
} from '../graphql/mutations';
import {
    // Queries
    getWorkoutTemplate,
    getScheduledWorkout,
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
} from '../API';
// Local TS types (assumed to be correct now from src/types/workout.ts)
import { WorkoutTemplate, Exercise, WorkoutSession, SessionExercise, PerformedSet, LogExercise } from '../types/workout';

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
const listSessionsByUserIdWithDetails = /* GraphQL */ `
  query SessionsByUserId($userId: ID!, $completedAt: ModelStringKeyConditionInput, $filter: ModelWorkoutSessionFilterInput, $limit: Int, $nextToken: String) {
    sessionsByUserId(userId: $userId, completedAt: $completedAt, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: DESC) {
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

// Helper Type Guard - Reverted to previous, more robust version
function hasGraphQLErrors<TData>(obj: GraphQLResult<TData> | GraphqlSubscriptionResult<TData>): obj is GraphQLResult<TData> & { errors: NonNullable<GraphQLResult<TData>['errors']> } | GraphqlSubscriptionResult<TData> & { errors: NonNullable<GraphqlSubscriptionResult<TData>['errors']> } {
    return !!obj && typeof obj === 'object' && 'errors' in obj && Array.isArray(obj.errors) && obj.errors.length > 0;
}
function hasGraphQLData<TData>(obj: GraphQLResult<TData> | GraphqlSubscriptionResult<TData>): obj is GraphQLResult<TData> & { data: NonNullable<GraphQLResult<TData>['data']> } {
    return !!obj && typeof obj === 'object' && 'data' in obj && obj.data !== null && obj.data !== undefined && !hasGraphQLErrors(obj);
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

type SaveSessionData = {
    userId: string; owner: string; templateId?: string | null;
    scheduledWorkoutId?: string | null; name: string;
    exercises: LogExercise[]; duration?: number | null; completedAt: string;
};

const saveSession = async (sessionData: SaveSessionData): Promise<WorkoutSession> => {
    if (!sessionData.userId || !sessionData.owner) throw new Error("User identity required");

    const exercisesForInput: SessionExerciseInput[] = (sessionData.exercises ?? [])
        .filter((ex): ex is LogExercise => !!ex && !!ex.id)
        .map((ex: LogExercise): SessionExerciseInput => ({
            id: ex.id, name: ex.name, note: ex.note,
            performedSets: (ex.performedSets ?? [])
                .filter((set): set is PerformedSet => !!set && !!set.id)
                .map((set: PerformedSet): PerformedSetInput => ({
                     id: set.id, reps: set.reps ?? null, weight: set.weight ?? null,
                     rpe: set.rpe ?? null, notes: set.notes ?? null,
                }))
        }));

    const input: CreateWorkoutSessionInput = {
        userId: sessionData.userId, templateId: sessionData.templateId,
        scheduledWorkoutId: sessionData.scheduledWorkoutId, name: sessionData.name,
        exercises: exercisesForInput, duration: sessionData.duration,
        completedAt: sessionData.completedAt, owner: sessionData.owner
    };
    let savedSession: APIWorkoutSession;

    try {
        const result = await client.graphql<CreateWorkoutSessionMutation>({ query: createWorkoutSession, variables: { input } });
        if (hasGraphQLErrors(result)) throw new Error(result.errors[0].message || "Error saving session");
        if (!hasGraphQLData(result) || !result.data.createWorkoutSession) throw new Error("Save session failed: No data returned");
        savedSession = result.data.createWorkoutSession;
        console.log('✅ Workout session saved:', savedSession.name, savedSession.id);

        if (sessionData.scheduledWorkoutId && savedSession) {
            console.log(`Updating status for ScheduledWorkout ID: ${sessionData.scheduledWorkoutId}`);
            try {
                const getSchedResult = await client.graphql<GetScheduledWorkoutQuery>({ query: getScheduledWorkout, variables: { id: sessionData.scheduledWorkoutId } });
                if (hasGraphQLErrors(getSchedResult)) throw new Error(getSchedResult.errors[0].message || "Error fetching scheduled workout for update");
                const currentSched = getSchedResult.data?.getScheduledWorkout;

                if (!currentSched || currentSched._deleted) {
                    console.warn(`ScheduledWorkout ${sessionData.scheduledWorkoutId} not found/deleted.`);
                } else if (typeof currentSched._version === 'number') {
                     const updateInput: UpdateScheduledWorkoutInput = {
                        id: sessionData.scheduledWorkoutId, status: 'Completed',
                        workoutSessionId: savedSession.id, _version: currentSched._version
                    };
                    const updateResult = await client.graphql<UpdateScheduledWorkoutMutation>({ query: updateScheduledWorkout, variables: { input: updateInput } });
                     if (hasGraphQLErrors(updateResult)) throw new Error(updateResult.errors[0].message || "Error updating schedule status");
                     if (!hasGraphQLData(updateResult) || !updateResult.data.updateScheduledWorkout) throw new Error("Update schedule status failed: No data returned");
                     console.log(`✅ Updated ScheduledWorkout ${sessionData.scheduledWorkoutId} status.`);
                } else { console.error(`Invalid version for ScheduledWorkout ${sessionData.scheduledWorkoutId}`); }
            } catch (scheduleUpdateError: any) { console.error(`❌ Error updating ScheduledWorkout status:`, scheduleUpdateError); }
        }

        type APISessionExercise = NonNullable<typeof savedSession.exercises>[0];
        type APIPerformedSet = NonNullable<NonNullable<APISessionExercise>['performedSets']>[0];

        return {
            id: savedSession.id, userId: savedSession.userId, templateId: savedSession.templateId,
            scheduledWorkoutId: savedSession.scheduledWorkoutId, name: savedSession.name,
            duration: savedSession.duration, completedAt: savedSession.completedAt,
            exercises: (savedSession.exercises ?? [])
                .filter((ex): ex is APISessionExercise & { id: string; name: string; } => !!ex && !!ex.id && !!ex.name)
                .map((ex: APISessionExercise & { id: string; name: string; } ): SessionExercise => ({
                    id: ex.id, name: ex.name, note: ex.note,
                    performedSets: (ex.performedSets ?? [])
                        .filter((set): set is APIPerformedSet & { id: string; } => !!set && !!set.id)
                        .map((set: APIPerformedSet & { id: string; }): PerformedSet => ({
                            id: set.id, reps: set.reps ?? null, weight: set.weight ?? null,
                            rpe: set.rpe ?? undefined, notes: set.notes ?? undefined
                        }))
                })),
            createdAt: savedSession.createdAt, updatedAt: savedSession.updatedAt, owner: savedSession.owner,
        };
    } catch (error: any) { console.error('❌ Error saving session:', error); if (error?.errors) { console.error("GraphQL Errors:", error.errors); } throw error; }
};

const getSessionsByUserId = async (userId: string): Promise<WorkoutSession[]> => {
     if (!userId) return [];
     console.log(`Workspaceing sessions for user ${userId}...`);

     type CustomPerformedSet = Partial<PerformedSetInput> & { id?: string | null; __typename?: string };
     type CustomSessionExercise = { id?: string | null; name?: string | null; note?: string | null; __typename?: string; performedSets?: (CustomPerformedSet | null)[] | null };
     type CustomSessionItem = Partial<APIWorkoutSession> & { __typename?: string; exercises?: (CustomSessionExercise | null)[] | null };
     type CustomSessionsQueryResult = { sessionsByUserId?: { items?: (CustomSessionItem | null)[] | null, __typename?: string } | null };

     try {
         const variables = { userId: userId, filter: { _deleted: { ne: true } } };
         const result = await client.graphql<CustomSessionsQueryResult>({ query: listSessionsByUserIdWithDetails, variables: variables });

         if (hasGraphQLErrors(result)) { throw new Error(result.errors[0].message || "Error fetching sessions"); }
         const items = result.data?.sessionsByUserId?.items ?? [];
         const validItems = items.filter((item): item is APIWorkoutSession & { exercises?: (CustomSessionExercise | null)[] | null } =>
             !!item && !item._deleted && !!item.id && !!item.userId && !!item.name && !!item.completedAt && !!item.createdAt && !!item.updatedAt
         );
         console.log(`Workspaceed ${validItems.length} non-deleted sessions`);

         return validItems.map((item: APIWorkoutSession & { exercises?: (CustomSessionExercise | null)[] | null }): WorkoutSession => ({
             id: item.id, userId: item.userId, templateId: item.templateId, scheduledWorkoutId: item.scheduledWorkoutId,
             name: item.name, duration: item.duration, completedAt: item.completedAt,
             exercises: (item.exercises ?? [])
                 .filter((ex): ex is CustomSessionExercise & { id: string; name: string; } => !!ex && !!ex.id && !!ex.name)
                 .map((ex: CustomSessionExercise & { id: string; name: string; }): SessionExercise => ({
                     id: ex.id, name: ex.name, note: ex.note,
                     performedSets: (ex.performedSets ?? [])
                         .filter((set): set is CustomPerformedSet & { id: string; } => !!set && !!set.id)
                         .map((set: CustomPerformedSet & { id: string; }): PerformedSet => ({
                             id: set.id, reps: set.reps ?? null, weight: set.weight ?? null,
                             rpe: set.rpe ?? undefined, notes: set.notes ?? undefined
                         }))
                 })),
             createdAt: item.createdAt, updatedAt: item.updatedAt, owner: item.owner,
         }));
     } catch (error: any) { console.error('Error getting sessions:', error); if (error?.errors) { console.error("GraphQL Errors:", error.errors); } return []; }
};

const saveWorkoutPlan = async (plan: any, userId: string): Promise<any> => Promise.reject("Not implemented");
const getCurrentPlan = async (userId: string): Promise<any | null> => Promise.resolve(null);

const workoutService = { saveTemplate, getTemplates, deleteTemplate, saveSession, getSessionsByUserId, saveWorkoutPlan, getCurrentPlan };
export default workoutService;