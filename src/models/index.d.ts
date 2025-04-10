import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";



type EagerExercise = {
  readonly id: string;
  readonly name: string;
  readonly sets?: string | null;
  readonly reps?: string | null;
  readonly weight?: string | null;
  readonly restPeriod?: number | null;
  readonly note?: string | null;
}

type LazyExercise = {
  readonly id: string;
  readonly name: string;
  readonly sets?: string | null;
  readonly reps?: string | null;
  readonly weight?: string | null;
  readonly restPeriod?: number | null;
  readonly note?: string | null;
}

export declare type Exercise = LazyLoading extends LazyLoadingDisabled ? EagerExercise : LazyExercise

export declare const Exercise: (new (init: ModelInit<Exercise>) => Exercise)

type EagerWorkoutTemplate = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WorkoutTemplate, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly description?: string | null;
  readonly exercises?: (Exercise | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyWorkoutTemplate = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WorkoutTemplate, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly description?: string | null;
  readonly exercises?: (Exercise | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type WorkoutTemplate = LazyLoading extends LazyLoadingDisabled ? EagerWorkoutTemplate : LazyWorkoutTemplate

export declare const WorkoutTemplate: (new (init: ModelInit<WorkoutTemplate>) => WorkoutTemplate) & {
  copyOf(source: WorkoutTemplate, mutator: (draft: MutableModel<WorkoutTemplate>) => MutableModel<WorkoutTemplate> | void): WorkoutTemplate;
}

type EagerWorkoutSession = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WorkoutSession, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly templateId?: string | null;
  readonly name: string;
  readonly exercises?: (Exercise | null)[] | null;
  readonly duration?: number | null;
  readonly completedAt: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyWorkoutSession = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WorkoutSession, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly templateId?: string | null;
  readonly name: string;
  readonly exercises?: (Exercise | null)[] | null;
  readonly duration?: number | null;
  readonly completedAt: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type WorkoutSession = LazyLoading extends LazyLoadingDisabled ? EagerWorkoutSession : LazyWorkoutSession

export declare const WorkoutSession: (new (init: ModelInit<WorkoutSession>) => WorkoutSession) & {
  copyOf(source: WorkoutSession, mutator: (draft: MutableModel<WorkoutSession>) => MutableModel<WorkoutSession> | void): WorkoutSession;
}