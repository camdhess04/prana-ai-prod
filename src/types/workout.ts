// src/types/workout.ts

// Basic Exercise structure (used in WorkoutTemplate)
export interface Exercise {
  id: string;
  name: string;
  sets: string | number; // Target sets
  reps: string | number; // Target reps
  weight?: string | number; // Suggested weight?
  restPeriod?: Int;
  note?: string;
}

// Type for logging individual performed sets (used in LogSessionScreen state & SessionExercise)
export interface PerformedSet {
  id: string;
  reps: string;
  weight: string;
}

// Type for Exercise WITHIN a logged Session (includes performed sets)
// This matches the SessionExercise type in schema.graphql
export interface SessionExercise {
  id: string;          // ID linking back to original Exercise definition
  name: string;
  note?: string | null;
  performedSets?: PerformedSet[] | null; // Array of sets performed
  restPeriod?: Int | null;
}

// Type matching the WorkoutTemplate model from schema
export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  exercises?: (Exercise | null)[] | null; // Array of the basic Exercise type
  createdAt?: string | null; // Provided by backend
  updatedAt?: string | null; // Provided by backend
  owner?: string | null; // Provided by backend/auth rule
}

// Type matching the WorkoutSession model from schema
export interface WorkoutSession {
  id: string;
  userId: string;
  templateId?: string | null;
  name: string;
  exercises?: (SessionExercise | null)[] | null; // Array of the SessionExercise type
  duration?: number | null;
  completedAt: string; // This is required in schema
  createdAt?: string | null;
  updatedAt?: string | null;
  owner?: string | null;
}

// Type used internally in LogSessionScreen state (combines target + performed)
export interface LogExercise extends Exercise {
  targetSets?: string | number;
  targetReps?: string | number;
  performedSets: PerformedSet[];
}