export interface Exercise {
  id: string; // Unique identifier for the exercise instance in this workout/template
  name: string;
  sets: string | number; // Use string initially based on snippet input, can parse later
  reps: string | number; // Use string initially
  weight?: string | number; // Optional weight
  restPeriod?: number; // Optional rest in seconds
  note?: string; // Optional notes
  // Add other relevant fields from your project overview if needed later
  // e.g., targetMuscleGroup, equipment, variations...
}

// Optional: Define WorkoutTemplate type based on snippet usage
export interface WorkoutTemplate {
    id: string; // Usually assigned on save
    userId: string;
    name: string;
    exercises: Exercise[];
    createdAt: string; // ISO date string
    // Add description, etc. if needed
}

// Optional: Define WorkoutSession type based on snippet usage
export interface WorkoutSession {
    id: string; // Usually assigned on save
    userId: string;
    templateId?: string; // Link back to template if started from one
    name: string;
    exercises: Exercise[]; // Exercises performed in the session
    duration?: number; // Duration in seconds
    completedAt: string; // ISO date string
    // Add overall notes, perceived exertion, etc. if needed
} 