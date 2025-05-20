// src/types/workout.ts
// Corrected local type definitions for the Prana AI app

// Base exercise structure, used in templates
export type Exercise = {
    id: string;
    name: string;
    sets?: string | null;         // e.g., "3", "3-4"
    reps?: string | null;         // e.g., "8-12", "AMRAP"
    weight?: string | null;       // e.g., "135 lbs", "Bodyweight", ""
    restPeriod?: number | null;   // In seconds
    note?: string | null;
  };
  
  // Represents a single set performed by the user during a session
  export type PerformedSet = {
    id: string;                 // Unique ID for this specific performed set instance
    reps?: string | null;        // Actual reps performed (string for flexibility, can be parsed to number)
    weight?: string | null;      // Actual weight used (string for flexibility)
    rpe?: number | null;         // Rate of Perceived Exertion (optional)
    notes?: string | null;       // User notes for this specific set (optional)
  };
  
  // Represents an exercise within a logged workout session, including sets performed
  export type SessionExercise = {
    id: string;                 // Corresponds to the Exercise definition ID from the template
    name: string;
    note?: string | null;        // Original note from the template exercise
    performedSets: PerformedSet[]; // Array of sets the user actually performed
  };
  
  // Represents the state of an exercise on the LogSessionScreen
  export type LogExercise = {
    id: string;                 // Exercise Definition ID from template
    name: string;
    targetSets?: string | null;  // Original or suggested target from template/progression
    targetReps?: string | null;  // Original or suggested target
    targetWeight?: string | null;// Original or suggested target
    targetRest?: number | null;  // Original target from template
    note?: string | null;        // Original note from template exercise
    suggestionNote?: string | null; // Note explaining progression suggestion
    performedSets: PerformedSet[]; // Logged sets for this session
  };
  
  // Represents a workout template (can be AI-generated or user-created)
  export type WorkoutTemplate = {
    id: string;
    userId: string;
    name: string;
    description?: string | null;
    exercises: Exercise[];        // Uses the base Exercise type
    isAIPlan?: boolean;
    owner?: string | null;
    createdAt?: string;           // ISO date string
    updatedAt?: string;           // ISO date string
  };
  
  // Represents a completed workout session logged by the user
  export type WorkoutSession = {
    id: string;
    userId: string;
    templateId?: string | null;         // ID of the WorkoutTemplate used, if any
    scheduledWorkoutId?: string | null; // ID of the ScheduledWorkout item, if started from schedule
    name: string;                     // Name of the workout (e.g., "AI Upper Body A" or "Morning Run")
    exercises: SessionExercise[];     // Uses the SessionExercise type
    duration?: number | null;          // Duration in seconds
    completedAt: string;              // ISO date string when the session was completed/saved
    owner?: string | null;
    createdAt?: string;               // ISO date string
    updatedAt?: string;               // ISO date string
  };
  
  // Represents a user's profile information
  export type UserProfile = {
    id: string; // Cognito sub
    username: string; // Cognito username (usually email)
    name?: string | null;
    email?: string | null;
    onboardingLevel?: string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    age?: number | null;
    gender?: string | null;
    experienceLevel?: string | null;
    primaryGoal?: string | null;
    secondaryGoal?: string | null;
    injuriesOrLimitations?: string | null;
    performanceNotes?: string | null;
    preferredSplit?: string | null;
    likedExercises?: string[] | null;
    dislikedExercises?: string[] | null;
    availableDays?: string[] | null; // Array of lowercase day names e.g., ["monday", "wednesday"]
    timePerSessionMinutes?: number | null;
    createdAt?: string;
    updatedAt?: string;
  };
  
  // You might also have types related to Chat if needed elsewhere
  export type MessageSender = 'user' | 'ai';
  export type ChatMessage = {
    id: string;
    text: string;
    sender: MessageSender;
    timestamp: Date;
    isFinalData?: boolean; // Flag if this AI message contains the final profile JSON
    parsedData?: UserProfile | any | null; // To hold parsed profile or plan
  };