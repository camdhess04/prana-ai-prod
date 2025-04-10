// src/types/workout.ts

// Type for logging a single performed set
export interface PerformedSet {
  id: string; // Unique ID for this specific set entry
  reps: string; // Reps performed (string for input flexibility)
  weight: string; // Weight used (string for input flexibility)
}

// Updated Exercise type for use within LogSessionScreen state
// Includes targets from template and array for performed sets
export interface LogExercise extends Exercise { // Extends the basic Exercise type
  targetSets?: string | number; // Target sets from template
  targetReps?: string | number; // Target reps from template
  performedSets: PerformedSet[]; // Array to store logged sets for this exercise
}

// Basic Exercise structure (used for embedding in Template on save)
// Kept separate to potentially avoid saving empty performedSets to template
export interface Exercise {
  id: string;
  name: string;
  sets: string | number; // This now represents the TARGET sets in a template
  reps: string | number; // This now represents the TARGET reps in a template
  weight?: string | number; // Initial suggested weight? Or just for logging? Keep optional.
  restPeriod?: number;
  note?: string;
}

// Mirroring GraphQL model (excluding Amplify internal fields)
export interface WorkoutTemplate {
  id: string; // This will be added by DataStore/backend
  userId: string;
  name: string;
  description?: string;
  exercises: Exercise[]; // Uses the basic Exercise type
  createdAt: string;
  owner?: string | null; // Added by @auth if explicit
  updatedAt?: string; // Added by @model
}

// WorkoutSession now needs to store the detailed performed sets
export interface WorkoutSession {
  id: string;
  userId: string;
  templateId?: string;
  name: string;
  // Use LogExercise structure OR have separate fields
  // Let's keep it simple for now and assume exercises array holds final performed state
  exercises: LogExercise[]; // Store the detailed log including performedSets
  duration?: number;
  completedAt: string; // ISO date string
  owner?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Type for messages (if needed later for Trainer)
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
} 