// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { UserProfile, TrainerNote, Exercise, WorkoutTemplate, WorkoutSession, PerformedSet, SessionExercise } = initSchema(schema);

export {
  UserProfile,
  TrainerNote,
  Exercise,
  WorkoutTemplate,
  WorkoutSession,
  PerformedSet,
  SessionExercise
};