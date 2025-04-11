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