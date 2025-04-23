// src/services/scheduleService.ts
// V1.1 Update: Use custom query to fetch nested workoutTemplate data

import { generateClient, type GraphQLResult } from 'aws-amplify/api';
import { ScheduledWorkout as APIScheduledWorkout, WorkoutTemplate as APIWorkoutTemplate, Exercise as APIExercise } from '../API'; // Import generated API types
import { format } from 'date-fns';

// --- Define Custom Query ---
// This query uses the 'scheduledWorkoutsByUserIdAndDate' GSI but explicitly asks for nested data
const getScheduledWorkoutWithTemplate = /* GraphQL */ `
  query ScheduledWorkoutsByUserIdAndDate(
    $userId: ID!
    $date: ModelStringKeyConditionInput
    $filter: ModelScheduledWorkoutFilterInput
    $limit: Int
    $nextToken: String
  ) {
    scheduledWorkoutsByUserIdAndDate(
      userId: $userId
      date: $date
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: ASC # Or DESC, doesn't matter with limit 1
    ) {
      items {
        # ScheduledWorkout Fields
        id
        userId
        date
        status
        workoutTemplateId
        workoutSessionId
        owner
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        # Nested WorkoutTemplate Fields
        workoutTemplate {
          id
          name
          description
          isAIPlan
          owner # Include owner if needed by mapping logic later
          # Nested Exercises within the Template
          exercises(limit: 100) { # Fetch exercises linked to the template
            items {
              id
              name
              sets
              reps
              weight
              restPeriod
              note
              # Add _version only if needed for some operation later
            }
            nextToken
          }
        }
      }
      nextToken
    }
  }
`;
// --- End Custom Query ---


const client = generateClient();

// Helper Type Guards (keep from previous version)
function hasGraphQLErrors<T>(obj: GraphQLResult<T>): obj is GraphQLResult<T> & { errors: NonNullable<GraphQLResult<T>['errors']> } {
    return !!obj && typeof obj === 'object' && 'errors' in obj && Array.isArray(obj.errors) && obj.errors.length > 0;
}
function hasGraphQLData<T>(obj: GraphQLResult<T>): obj is GraphQLResult<T> & { data: NonNullable<GraphQLResult<T>['data']> } {
    return !!obj && typeof obj === 'object' && 'data' in obj && obj.data !== null && obj.data !== undefined && !hasGraphQLErrors(obj);
}

// Define the expected result shape matching the custom query
// We might need to adjust this slightly based on exact API response, but it's a good start
type GetTodaysWorkoutQueryResult = {
    scheduledWorkoutsByUserIdAndDate?: {
        items?: (Partial<APIScheduledWorkout> & { // Use Partial<> for flexibility
             _deleted?: boolean | null;
             workoutTemplate?: Partial<APIWorkoutTemplate> & {
                 exercises?: { items?: (Partial<APIExercise> | null)[] | null } | null
             } | null;
         } | null)[] | null;
        nextToken?: string | null;
    } | null
};

/**
 * Fetches the ScheduledWorkout for a specific user and date (defaults to today).
 * Uses a custom query to include nested WorkoutTemplate and its Exercises.
 * Returns the first matching non-deleted ScheduledWorkout or null.
 */
const getTodaysWorkout = async (userId: string): Promise<APIScheduledWorkout | null> => {
    if (!userId) {
        console.log("getTodaysWorkout: No userId provided.");
        return null;
    }

    const todayDate = format(new Date(), 'yyyy-MM-dd');
    console.log(`SCHEDULE_SERVICE: Fetching scheduled workout for user ${userId} on date ${todayDate} using CUSTOM query...`);

    try {
        const variables = {
            userId: userId,
            date: { eq: todayDate }, // Use 'eq' filter for the date sort key
            limit: 1,
            filter: { _deleted: { ne: true } } // Ensure we don't get deleted items
        };

        // *** Use the CUSTOM query string ***
        const result = await client.graphql<GetTodaysWorkoutQueryResult>({
            query: getScheduledWorkoutWithTemplate, // Use the custom query defined above
            variables: variables
        });

        if (hasGraphQLErrors(result)) {
            console.error("SCHEDULE_SERVICE: GraphQL errors fetching today's workout:", result.errors);
            throw result.errors[0];
        }

        // Check data structure based on custom query result type
        const items = result.data?.scheduledWorkoutsByUserIdAndDate?.items;

        if (!items || items.length === 0) {
            console.log("SCHEDULE_SERVICE: No scheduled workout found for today.");
            return null;
        }

        // Find the first non-null, non-deleted item
        const todaysWorkout = items.find(item => !!item && !item._deleted) ?? null;

        if (!todaysWorkout) {
             console.log("SCHEDULE_SERVICE: No valid scheduled workout found for today after filtering.");
             return null;
        }

        // Now, also check if the nested workoutTemplate data is present
        if (!todaysWorkout.workoutTemplate) {
             console.error("SCHEDULE_SERVICE ERROR: Custom query ran but STILL missing nested workoutTemplate data!", todaysWorkout);
             // This would indicate an issue with the custom query string or the resolver setup
             return null; // Treat as error or rest day? Returning null for now.
        }


        console.log("SCHEDULE_SERVICE: Found today's workout:", todaysWorkout.id, todaysWorkout.status, todaysWorkout.workoutTemplate?.name);
        // Cast needed as we filtered nulls/deleted items
        return todaysWorkout as APIScheduledWorkout;

    } catch (error: any) {
        console.error("SCHEDULE_SERVICE: Error fetching today's workout:", error);
        if (error?.errors) { console.error("GraphQL Errors:", error.errors); }
        return null;
    }
};


// --- Export Service ---
const scheduleService = {
    getTodaysWorkout,
};

export default scheduleService;