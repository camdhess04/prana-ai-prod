// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Exercise, WorkoutTemplate, WorkoutSession, PerformedSet, SessionExercise } = initSchema(schema);

export {
  Exercise,
  WorkoutTemplate,
  WorkoutSession,
  PerformedSet,
  SessionExercise
};