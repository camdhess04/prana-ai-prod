import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";



type EagerPerformedSet = {
  readonly id: string;
  readonly reps?: string | null;
  readonly weight?: string | null;
}

type LazyPerformedSet = {
  readonly id: string;
  readonly reps?: string | null;
  readonly weight?: string | null;
}

export declare type PerformedSet = LazyLoading extends LazyLoadingDisabled ? EagerPerformedSet : LazyPerformedSet

export declare const PerformedSet: (new (init: ModelInit<PerformedSet>) => PerformedSet)

type EagerSessionExercise = {
  readonly id: string;
  readonly name: string;
  readonly note?: string | null;
  readonly performedSets?: (PerformedSet | null)[] | null;
}

type LazySessionExercise = {
  readonly id: string;
  readonly name: string;
  readonly note?: string | null;
  readonly performedSets?: (PerformedSet | null)[] | null;
}

export declare type SessionExercise = LazyLoading extends LazyLoadingDisabled ? EagerSessionExercise : LazySessionExercise

export declare const SessionExercise: (new (init: ModelInit<SessionExercise>) => SessionExercise)

type EagerUserProfile = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserProfile, 'id'>;
  };
  readonly id: string;
  readonly username: string;
  readonly name?: string | null;
  readonly email?: string | null;
  readonly onboardingLevel?: string | null;
  readonly heightCm?: number | null;
  readonly weightKg?: number | null;
  readonly age?: number | null;
  readonly gender?: string | null;
  readonly experienceLevel?: string | null;
  readonly primaryGoal?: string | null;
  readonly secondaryGoal?: string | null;
  readonly injuriesOrLimitations?: string | null;
  readonly performanceNotes?: string | null;
  readonly preferredSplit?: string | null;
  readonly likedExercises?: (string | null)[] | null;
  readonly dislikedExercises?: (string | null)[] | null;
  readonly availableDays?: (string | null)[] | null;
  readonly timePerSessionMinutes?: number | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyUserProfile = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserProfile, 'id'>;
  };
  readonly id: string;
  readonly username: string;
  readonly name?: string | null;
  readonly email?: string | null;
  readonly onboardingLevel?: string | null;
  readonly heightCm?: number | null;
  readonly weightKg?: number | null;
  readonly age?: number | null;
  readonly gender?: string | null;
  readonly experienceLevel?: string | null;
  readonly primaryGoal?: string | null;
  readonly secondaryGoal?: string | null;
  readonly injuriesOrLimitations?: string | null;
  readonly performanceNotes?: string | null;
  readonly preferredSplit?: string | null;
  readonly likedExercises?: (string | null)[] | null;
  readonly dislikedExercises?: (string | null)[] | null;
  readonly availableDays?: (string | null)[] | null;
  readonly timePerSessionMinutes?: number | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type UserProfile = LazyLoading extends LazyLoadingDisabled ? EagerUserProfile : LazyUserProfile

export declare const UserProfile: (new (init: ModelInit<UserProfile>) => UserProfile) & {
  copyOf(source: UserProfile, mutator: (draft: MutableModel<UserProfile>) => MutableModel<UserProfile> | void): UserProfile;
}

type EagerTrainerNote = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TrainerNote, 'id'>;
  };
  readonly id: string;
  readonly userId: string;
  readonly note: string;
  readonly owner?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyTrainerNote = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TrainerNote, 'id'>;
  };
  readonly id: string;
  readonly userId: string;
  readonly note: string;
  readonly owner?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type TrainerNote = LazyLoading extends LazyLoadingDisabled ? EagerTrainerNote : LazyTrainerNote

export declare const TrainerNote: (new (init: ModelInit<TrainerNote>) => TrainerNote) & {
  copyOf(source: TrainerNote, mutator: (draft: MutableModel<TrainerNote>) => MutableModel<TrainerNote> | void): TrainerNote;
}

type EagerExercise = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Exercise, 'id'>;
  };
  readonly id: string;
  readonly workoutTemplateId: string;
  readonly name: string;
  readonly sets?: string | null;
  readonly reps?: string | null;
  readonly weight?: string | null;
  readonly restPeriod?: number | null;
  readonly note?: string | null;
  readonly owner?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyExercise = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Exercise, 'id'>;
  };
  readonly id: string;
  readonly workoutTemplateId: string;
  readonly name: string;
  readonly sets?: string | null;
  readonly reps?: string | null;
  readonly weight?: string | null;
  readonly restPeriod?: number | null;
  readonly note?: string | null;
  readonly owner?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type Exercise = LazyLoading extends LazyLoadingDisabled ? EagerExercise : LazyExercise

export declare const Exercise: (new (init: ModelInit<Exercise>) => Exercise) & {
  copyOf(source: Exercise, mutator: (draft: MutableModel<Exercise>) => MutableModel<Exercise> | void): Exercise;
}

type EagerWorkoutTemplate = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WorkoutTemplate, 'id'>;
  };
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly description?: string | null;
  readonly exercises?: (Exercise | null)[] | null;
  readonly isAIPlan?: boolean | null;
  readonly owner?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyWorkoutTemplate = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WorkoutTemplate, 'id'>;
  };
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly description?: string | null;
  readonly exercises: AsyncCollection<Exercise>;
  readonly isAIPlan?: boolean | null;
  readonly owner?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type WorkoutTemplate = LazyLoading extends LazyLoadingDisabled ? EagerWorkoutTemplate : LazyWorkoutTemplate

export declare const WorkoutTemplate: (new (init: ModelInit<WorkoutTemplate>) => WorkoutTemplate) & {
  copyOf(source: WorkoutTemplate, mutator: (draft: MutableModel<WorkoutTemplate>) => MutableModel<WorkoutTemplate> | void): WorkoutTemplate;
}

type EagerWorkoutSession = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WorkoutSession, 'id'>;
  };
  readonly id: string;
  readonly userId: string;
  readonly templateId?: string | null;
  readonly name: string;
  readonly exercises?: (SessionExercise | null)[] | null;
  readonly duration?: number | null;
  readonly completedAt: string;
  readonly owner?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyWorkoutSession = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WorkoutSession, 'id'>;
  };
  readonly id: string;
  readonly userId: string;
  readonly templateId?: string | null;
  readonly name: string;
  readonly exercises?: (SessionExercise | null)[] | null;
  readonly duration?: number | null;
  readonly completedAt: string;
  readonly owner?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type WorkoutSession = LazyLoading extends LazyLoadingDisabled ? EagerWorkoutSession : LazyWorkoutSession

export declare const WorkoutSession: (new (init: ModelInit<WorkoutSession>) => WorkoutSession) & {
  copyOf(source: WorkoutSession, mutator: (draft: MutableModel<WorkoutSession>) => MutableModel<WorkoutSession> | void): WorkoutSession;
}