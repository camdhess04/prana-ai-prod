// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { WorkoutTemplate, WorkoutSession, Exercise } = initSchema(schema);

export {
  WorkoutTemplate,
  WorkoutSession,
  Exercise
};