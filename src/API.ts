/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserProfileInput = {
  id?: string | null,
  username: string,
  name?: string | null,
  email?: string | null,
  nickname?: string | null,
  onboardingLevel?: string | null,
  heightCm?: number | null,
  weightKg?: number | null,
  age?: number | null,
  gender?: string | null,
  experienceLevel?: string | null,
  primaryGoal?: string | null,
  secondaryGoal?: string | null,
  injuriesOrLimitations?: string | null,
  performanceNotes?: string | null,
  preferredSplit?: string | null,
  likedExercises?: Array< string | null > | null,
  dislikedExercises?: Array< string | null > | null,
  availableDays?: Array< string | null > | null,
  timePerSessionMinutes?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type ModelUserProfileConditionInput = {
  username?: ModelStringInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  nickname?: ModelStringInput | null,
  onboardingLevel?: ModelStringInput | null,
  heightCm?: ModelFloatInput | null,
  weightKg?: ModelFloatInput | null,
  age?: ModelIntInput | null,
  gender?: ModelStringInput | null,
  experienceLevel?: ModelStringInput | null,
  primaryGoal?: ModelStringInput | null,
  secondaryGoal?: ModelStringInput | null,
  injuriesOrLimitations?: ModelStringInput | null,
  performanceNotes?: ModelStringInput | null,
  preferredSplit?: ModelStringInput | null,
  likedExercises?: ModelStringInput | null,
  dislikedExercises?: ModelStringInput | null,
  availableDays?: ModelStringInput | null,
  timePerSessionMinutes?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserProfileConditionInput | null > | null,
  or?: Array< ModelUserProfileConditionInput | null > | null,
  not?: ModelUserProfileConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  id?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UserProfile = {
  __typename: "UserProfile",
  id: string,
  username: string,
  name?: string | null,
  email?: string | null,
  nickname?: string | null,
  onboardingLevel?: string | null,
  heightCm?: number | null,
  weightKg?: number | null,
  age?: number | null,
  gender?: string | null,
  experienceLevel?: string | null,
  primaryGoal?: string | null,
  secondaryGoal?: string | null,
  injuriesOrLimitations?: string | null,
  performanceNotes?: string | null,
  preferredSplit?: string | null,
  likedExercises?: Array< string | null > | null,
  dislikedExercises?: Array< string | null > | null,
  availableDays?: Array< string | null > | null,
  timePerSessionMinutes?: number | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UpdateUserProfileInput = {
  id: string,
  username?: string | null,
  name?: string | null,
  email?: string | null,
  nickname?: string | null,
  onboardingLevel?: string | null,
  heightCm?: number | null,
  weightKg?: number | null,
  age?: number | null,
  gender?: string | null,
  experienceLevel?: string | null,
  primaryGoal?: string | null,
  secondaryGoal?: string | null,
  injuriesOrLimitations?: string | null,
  performanceNotes?: string | null,
  preferredSplit?: string | null,
  likedExercises?: Array< string | null > | null,
  dislikedExercises?: Array< string | null > | null,
  availableDays?: Array< string | null > | null,
  timePerSessionMinutes?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type DeleteUserProfileInput = {
  id: string,
  _version?: number | null,
};

export type CreateTrainerNoteInput = {
  id?: string | null,
  userId: string,
  note: string,
  owner?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type ModelTrainerNoteConditionInput = {
  userId?: ModelIDInput | null,
  note?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelTrainerNoteConditionInput | null > | null,
  or?: Array< ModelTrainerNoteConditionInput | null > | null,
  not?: ModelTrainerNoteConditionInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type TrainerNote = {
  __typename: "TrainerNote",
  id: string,
  userId: string,
  note: string,
  owner?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UpdateTrainerNoteInput = {
  id: string,
  userId?: string | null,
  note?: string | null,
  owner?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type DeleteTrainerNoteInput = {
  id: string,
  _version?: number | null,
};

export type CreateExerciseInput = {
  id?: string | null,
  workoutTemplateId: string,
  name: string,
  sets?: string | null,
  reps?: string | null,
  weight?: string | null,
  restPeriod?: number | null,
  note?: string | null,
  owner?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type ModelExerciseConditionInput = {
  workoutTemplateId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  sets?: ModelStringInput | null,
  reps?: ModelStringInput | null,
  weight?: ModelStringInput | null,
  restPeriod?: ModelIntInput | null,
  note?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelExerciseConditionInput | null > | null,
  or?: Array< ModelExerciseConditionInput | null > | null,
  not?: ModelExerciseConditionInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type Exercise = {
  __typename: "Exercise",
  id: string,
  workoutTemplateId: string,
  name: string,
  sets?: string | null,
  reps?: string | null,
  weight?: string | null,
  restPeriod?: number | null,
  note?: string | null,
  owner?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UpdateExerciseInput = {
  id: string,
  workoutTemplateId?: string | null,
  name?: string | null,
  sets?: string | null,
  reps?: string | null,
  weight?: string | null,
  restPeriod?: number | null,
  note?: string | null,
  owner?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type DeleteExerciseInput = {
  id: string,
  _version?: number | null,
};

export type CreateWorkoutTemplateInput = {
  id?: string | null,
  userId: string,
  name: string,
  description?: string | null,
  isAIPlan?: boolean | null,
  owner?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type ModelWorkoutTemplateConditionInput = {
  userId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  isAIPlan?: ModelBooleanInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelWorkoutTemplateConditionInput | null > | null,
  or?: Array< ModelWorkoutTemplateConditionInput | null > | null,
  not?: ModelWorkoutTemplateConditionInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type WorkoutTemplate = {
  __typename: "WorkoutTemplate",
  id: string,
  userId: string,
  name: string,
  description?: string | null,
  exercises?: ModelExerciseConnection | null,
  scheduledInstances?: ModelScheduledWorkoutConnection | null,
  isAIPlan?: boolean | null,
  owner?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type ModelExerciseConnection = {
  __typename: "ModelExerciseConnection",
  items:  Array<Exercise | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelScheduledWorkoutConnection = {
  __typename: "ModelScheduledWorkoutConnection",
  items:  Array<ScheduledWorkout | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ScheduledWorkout = {
  __typename: "ScheduledWorkout",
  id: string,
  userId: string,
  date: string,
  status: string,
  workoutTemplateId: string,
  workoutTemplate?: WorkoutTemplate | null,
  workoutSessionId?: string | null,
  owner?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UpdateWorkoutTemplateInput = {
  id: string,
  userId?: string | null,
  name?: string | null,
  description?: string | null,
  isAIPlan?: boolean | null,
  owner?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type DeleteWorkoutTemplateInput = {
  id: string,
  _version?: number | null,
};

export type CreateWorkoutSessionInput = {
  id?: string | null,
  userId: string,
  templateId?: string | null,
  scheduledWorkoutId?: string | null,
  name: string,
  status: string,
  currentElapsedTime?: number | null,
  currentExercisesState?: string | null,
  exercises?: Array< SessionExerciseInput | null > | null,
  duration?: number | null,
  completedAt?: string | null,
  owner?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type SessionExerciseInput = {
  id: string,
  name: string,
  note?: string | null,
  performedSets: Array< PerformedSetInput | null >,
};

export type PerformedSetInput = {
  id: string,
  reps?: string | null,
  weight?: string | null,
  rpe?: number | null,
  notes?: string | null,
};

export type ModelWorkoutSessionConditionInput = {
  userId?: ModelIDInput | null,
  templateId?: ModelIDInput | null,
  scheduledWorkoutId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  status?: ModelStringInput | null,
  currentElapsedTime?: ModelIntInput | null,
  currentExercisesState?: ModelStringInput | null,
  duration?: ModelIntInput | null,
  completedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelWorkoutSessionConditionInput | null > | null,
  or?: Array< ModelWorkoutSessionConditionInput | null > | null,
  not?: ModelWorkoutSessionConditionInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type WorkoutSession = {
  __typename: "WorkoutSession",
  id: string,
  userId: string,
  templateId?: string | null,
  scheduledWorkoutId?: string | null,
  name: string,
  status: string,
  currentElapsedTime?: number | null,
  currentExercisesState?: string | null,
  exercises?:  Array<SessionExercise | null > | null,
  duration?: number | null,
  completedAt?: string | null,
  owner?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type SessionExercise = {
  __typename: "SessionExercise",
  id: string,
  name: string,
  note?: string | null,
  performedSets:  Array<PerformedSet | null >,
};

export type PerformedSet = {
  __typename: "PerformedSet",
  id: string,
  reps?: string | null,
  weight?: string | null,
  rpe?: number | null,
  notes?: string | null,
};

export type UpdateWorkoutSessionInput = {
  id: string,
  userId?: string | null,
  templateId?: string | null,
  scheduledWorkoutId?: string | null,
  name?: string | null,
  status?: string | null,
  currentElapsedTime?: number | null,
  currentExercisesState?: string | null,
  exercises?: Array< SessionExerciseInput | null > | null,
  duration?: number | null,
  completedAt?: string | null,
  owner?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type DeleteWorkoutSessionInput = {
  id: string,
  _version?: number | null,
};

export type CreateScheduledWorkoutInput = {
  id?: string | null,
  userId: string,
  date: string,
  status: string,
  workoutTemplateId: string,
  workoutSessionId?: string | null,
  owner?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type ModelScheduledWorkoutConditionInput = {
  userId?: ModelIDInput | null,
  date?: ModelStringInput | null,
  status?: ModelStringInput | null,
  workoutTemplateId?: ModelIDInput | null,
  workoutSessionId?: ModelIDInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelScheduledWorkoutConditionInput | null > | null,
  or?: Array< ModelScheduledWorkoutConditionInput | null > | null,
  not?: ModelScheduledWorkoutConditionInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type UpdateScheduledWorkoutInput = {
  id: string,
  userId?: string | null,
  date?: string | null,
  status?: string | null,
  workoutTemplateId?: string | null,
  workoutSessionId?: string | null,
  owner?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type DeleteScheduledWorkoutInput = {
  id: string,
  _version?: number | null,
};

export type ModelUserProfileFilterInput = {
  id?: ModelIDInput | null,
  username?: ModelStringInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  nickname?: ModelStringInput | null,
  onboardingLevel?: ModelStringInput | null,
  heightCm?: ModelFloatInput | null,
  weightKg?: ModelFloatInput | null,
  age?: ModelIntInput | null,
  gender?: ModelStringInput | null,
  experienceLevel?: ModelStringInput | null,
  primaryGoal?: ModelStringInput | null,
  secondaryGoal?: ModelStringInput | null,
  injuriesOrLimitations?: ModelStringInput | null,
  performanceNotes?: ModelStringInput | null,
  preferredSplit?: ModelStringInput | null,
  likedExercises?: ModelStringInput | null,
  dislikedExercises?: ModelStringInput | null,
  availableDays?: ModelStringInput | null,
  timePerSessionMinutes?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserProfileFilterInput | null > | null,
  or?: Array< ModelUserProfileFilterInput | null > | null,
  not?: ModelUserProfileFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelUserProfileConnection = {
  __typename: "ModelUserProfileConnection",
  items:  Array<UserProfile | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelTrainerNoteFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  note?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelTrainerNoteFilterInput | null > | null,
  or?: Array< ModelTrainerNoteFilterInput | null > | null,
  not?: ModelTrainerNoteFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelTrainerNoteConnection = {
  __typename: "ModelTrainerNoteConnection",
  items:  Array<TrainerNote | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelExerciseFilterInput = {
  id?: ModelIDInput | null,
  workoutTemplateId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  sets?: ModelStringInput | null,
  reps?: ModelStringInput | null,
  weight?: ModelStringInput | null,
  restPeriod?: ModelIntInput | null,
  note?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelExerciseFilterInput | null > | null,
  or?: Array< ModelExerciseFilterInput | null > | null,
  not?: ModelExerciseFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelWorkoutTemplateFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  isAIPlan?: ModelBooleanInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelWorkoutTemplateFilterInput | null > | null,
  or?: Array< ModelWorkoutTemplateFilterInput | null > | null,
  not?: ModelWorkoutTemplateFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelWorkoutTemplateConnection = {
  __typename: "ModelWorkoutTemplateConnection",
  items:  Array<WorkoutTemplate | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelWorkoutSessionFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  templateId?: ModelIDInput | null,
  scheduledWorkoutId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  status?: ModelStringInput | null,
  currentElapsedTime?: ModelIntInput | null,
  currentExercisesState?: ModelStringInput | null,
  duration?: ModelIntInput | null,
  completedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelWorkoutSessionFilterInput | null > | null,
  or?: Array< ModelWorkoutSessionFilterInput | null > | null,
  not?: ModelWorkoutSessionFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelWorkoutSessionConnection = {
  __typename: "ModelWorkoutSessionConnection",
  items:  Array<WorkoutSession | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelScheduledWorkoutFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  date?: ModelStringInput | null,
  status?: ModelStringInput | null,
  workoutTemplateId?: ModelIDInput | null,
  workoutSessionId?: ModelIDInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelScheduledWorkoutFilterInput | null > | null,
  or?: Array< ModelScheduledWorkoutFilterInput | null > | null,
  not?: ModelScheduledWorkoutFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelSubscriptionUserProfileFilterInput = {
  username?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  nickname?: ModelSubscriptionStringInput | null,
  onboardingLevel?: ModelSubscriptionStringInput | null,
  heightCm?: ModelSubscriptionFloatInput | null,
  weightKg?: ModelSubscriptionFloatInput | null,
  age?: ModelSubscriptionIntInput | null,
  gender?: ModelSubscriptionStringInput | null,
  experienceLevel?: ModelSubscriptionStringInput | null,
  primaryGoal?: ModelSubscriptionStringInput | null,
  secondaryGoal?: ModelSubscriptionStringInput | null,
  injuriesOrLimitations?: ModelSubscriptionStringInput | null,
  performanceNotes?: ModelSubscriptionStringInput | null,
  preferredSplit?: ModelSubscriptionStringInput | null,
  likedExercises?: ModelSubscriptionStringInput | null,
  dislikedExercises?: ModelSubscriptionStringInput | null,
  availableDays?: ModelSubscriptionStringInput | null,
  timePerSessionMinutes?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
  id?: ModelStringInput | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionTrainerNoteFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  note?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTrainerNoteFilterInput | null > | null,
  or?: Array< ModelSubscriptionTrainerNoteFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionExerciseFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  workoutTemplateId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  sets?: ModelSubscriptionStringInput | null,
  reps?: ModelSubscriptionStringInput | null,
  weight?: ModelSubscriptionStringInput | null,
  restPeriod?: ModelSubscriptionIntInput | null,
  note?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionExerciseFilterInput | null > | null,
  or?: Array< ModelSubscriptionExerciseFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionWorkoutTemplateFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  isAIPlan?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionWorkoutTemplateFilterInput | null > | null,
  or?: Array< ModelSubscriptionWorkoutTemplateFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionWorkoutSessionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  templateId?: ModelSubscriptionIDInput | null,
  scheduledWorkoutId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  currentElapsedTime?: ModelSubscriptionIntInput | null,
  currentExercisesState?: ModelSubscriptionStringInput | null,
  duration?: ModelSubscriptionIntInput | null,
  completedAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionWorkoutSessionFilterInput | null > | null,
  or?: Array< ModelSubscriptionWorkoutSessionFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionScheduledWorkoutFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  date?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  workoutTemplateId?: ModelSubscriptionIDInput | null,
  workoutSessionId?: ModelSubscriptionIDInput | null,
  owner?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionScheduledWorkoutFilterInput | null > | null,
  or?: Array< ModelSubscriptionScheduledWorkoutFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
  userId?: ModelStringInput | null,
};

export type CreateUserProfileMutationVariables = {
  input: CreateUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    name?: string | null,
    email?: string | null,
    nickname?: string | null,
    onboardingLevel?: string | null,
    heightCm?: number | null,
    weightKg?: number | null,
    age?: number | null,
    gender?: string | null,
    experienceLevel?: string | null,
    primaryGoal?: string | null,
    secondaryGoal?: string | null,
    injuriesOrLimitations?: string | null,
    performanceNotes?: string | null,
    preferredSplit?: string | null,
    likedExercises?: Array< string | null > | null,
    dislikedExercises?: Array< string | null > | null,
    availableDays?: Array< string | null > | null,
    timePerSessionMinutes?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  input: UpdateUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    name?: string | null,
    email?: string | null,
    nickname?: string | null,
    onboardingLevel?: string | null,
    heightCm?: number | null,
    weightKg?: number | null,
    age?: number | null,
    gender?: string | null,
    experienceLevel?: string | null,
    primaryGoal?: string | null,
    secondaryGoal?: string | null,
    injuriesOrLimitations?: string | null,
    performanceNotes?: string | null,
    preferredSplit?: string | null,
    likedExercises?: Array< string | null > | null,
    dislikedExercises?: Array< string | null > | null,
    availableDays?: Array< string | null > | null,
    timePerSessionMinutes?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  input: DeleteUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    name?: string | null,
    email?: string | null,
    nickname?: string | null,
    onboardingLevel?: string | null,
    heightCm?: number | null,
    weightKg?: number | null,
    age?: number | null,
    gender?: string | null,
    experienceLevel?: string | null,
    primaryGoal?: string | null,
    secondaryGoal?: string | null,
    injuriesOrLimitations?: string | null,
    performanceNotes?: string | null,
    preferredSplit?: string | null,
    likedExercises?: Array< string | null > | null,
    dislikedExercises?: Array< string | null > | null,
    availableDays?: Array< string | null > | null,
    timePerSessionMinutes?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateTrainerNoteMutationVariables = {
  input: CreateTrainerNoteInput,
  condition?: ModelTrainerNoteConditionInput | null,
};

export type CreateTrainerNoteMutation = {
  createTrainerNote?:  {
    __typename: "TrainerNote",
    id: string,
    userId: string,
    note: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateTrainerNoteMutationVariables = {
  input: UpdateTrainerNoteInput,
  condition?: ModelTrainerNoteConditionInput | null,
};

export type UpdateTrainerNoteMutation = {
  updateTrainerNote?:  {
    __typename: "TrainerNote",
    id: string,
    userId: string,
    note: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteTrainerNoteMutationVariables = {
  input: DeleteTrainerNoteInput,
  condition?: ModelTrainerNoteConditionInput | null,
};

export type DeleteTrainerNoteMutation = {
  deleteTrainerNote?:  {
    __typename: "TrainerNote",
    id: string,
    userId: string,
    note: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateExerciseMutationVariables = {
  input: CreateExerciseInput,
  condition?: ModelExerciseConditionInput | null,
};

export type CreateExerciseMutation = {
  createExercise?:  {
    __typename: "Exercise",
    id: string,
    workoutTemplateId: string,
    name: string,
    sets?: string | null,
    reps?: string | null,
    weight?: string | null,
    restPeriod?: number | null,
    note?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateExerciseMutationVariables = {
  input: UpdateExerciseInput,
  condition?: ModelExerciseConditionInput | null,
};

export type UpdateExerciseMutation = {
  updateExercise?:  {
    __typename: "Exercise",
    id: string,
    workoutTemplateId: string,
    name: string,
    sets?: string | null,
    reps?: string | null,
    weight?: string | null,
    restPeriod?: number | null,
    note?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteExerciseMutationVariables = {
  input: DeleteExerciseInput,
  condition?: ModelExerciseConditionInput | null,
};

export type DeleteExerciseMutation = {
  deleteExercise?:  {
    __typename: "Exercise",
    id: string,
    workoutTemplateId: string,
    name: string,
    sets?: string | null,
    reps?: string | null,
    weight?: string | null,
    restPeriod?: number | null,
    note?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateWorkoutTemplateMutationVariables = {
  input: CreateWorkoutTemplateInput,
  condition?: ModelWorkoutTemplateConditionInput | null,
};

export type CreateWorkoutTemplateMutation = {
  createWorkoutTemplate?:  {
    __typename: "WorkoutTemplate",
    id: string,
    userId: string,
    name: string,
    description?: string | null,
    exercises?:  {
      __typename: "ModelExerciseConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    scheduledInstances?:  {
      __typename: "ModelScheduledWorkoutConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isAIPlan?: boolean | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateWorkoutTemplateMutationVariables = {
  input: UpdateWorkoutTemplateInput,
  condition?: ModelWorkoutTemplateConditionInput | null,
};

export type UpdateWorkoutTemplateMutation = {
  updateWorkoutTemplate?:  {
    __typename: "WorkoutTemplate",
    id: string,
    userId: string,
    name: string,
    description?: string | null,
    exercises?:  {
      __typename: "ModelExerciseConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    scheduledInstances?:  {
      __typename: "ModelScheduledWorkoutConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isAIPlan?: boolean | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteWorkoutTemplateMutationVariables = {
  input: DeleteWorkoutTemplateInput,
  condition?: ModelWorkoutTemplateConditionInput | null,
};

export type DeleteWorkoutTemplateMutation = {
  deleteWorkoutTemplate?:  {
    __typename: "WorkoutTemplate",
    id: string,
    userId: string,
    name: string,
    description?: string | null,
    exercises?:  {
      __typename: "ModelExerciseConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    scheduledInstances?:  {
      __typename: "ModelScheduledWorkoutConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isAIPlan?: boolean | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateWorkoutSessionMutationVariables = {
  input: CreateWorkoutSessionInput,
  condition?: ModelWorkoutSessionConditionInput | null,
};

export type CreateWorkoutSessionMutation = {
  createWorkoutSession?:  {
    __typename: "WorkoutSession",
    id: string,
    userId: string,
    templateId?: string | null,
    scheduledWorkoutId?: string | null,
    name: string,
    status: string,
    currentElapsedTime?: number | null,
    currentExercisesState?: string | null,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateWorkoutSessionMutationVariables = {
  input: UpdateWorkoutSessionInput,
  condition?: ModelWorkoutSessionConditionInput | null,
};

export type UpdateWorkoutSessionMutation = {
  updateWorkoutSession?:  {
    __typename: "WorkoutSession",
    id: string,
    userId: string,
    templateId?: string | null,
    scheduledWorkoutId?: string | null,
    name: string,
    status: string,
    currentElapsedTime?: number | null,
    currentExercisesState?: string | null,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteWorkoutSessionMutationVariables = {
  input: DeleteWorkoutSessionInput,
  condition?: ModelWorkoutSessionConditionInput | null,
};

export type DeleteWorkoutSessionMutation = {
  deleteWorkoutSession?:  {
    __typename: "WorkoutSession",
    id: string,
    userId: string,
    templateId?: string | null,
    scheduledWorkoutId?: string | null,
    name: string,
    status: string,
    currentElapsedTime?: number | null,
    currentExercisesState?: string | null,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateScheduledWorkoutMutationVariables = {
  input: CreateScheduledWorkoutInput,
  condition?: ModelScheduledWorkoutConditionInput | null,
};

export type CreateScheduledWorkoutMutation = {
  createScheduledWorkout?:  {
    __typename: "ScheduledWorkout",
    id: string,
    userId: string,
    date: string,
    status: string,
    workoutTemplateId: string,
    workoutTemplate?:  {
      __typename: "WorkoutTemplate",
      id: string,
      userId: string,
      name: string,
      description?: string | null,
      isAIPlan?: boolean | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    workoutSessionId?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateScheduledWorkoutMutationVariables = {
  input: UpdateScheduledWorkoutInput,
  condition?: ModelScheduledWorkoutConditionInput | null,
};

export type UpdateScheduledWorkoutMutation = {
  updateScheduledWorkout?:  {
    __typename: "ScheduledWorkout",
    id: string,
    userId: string,
    date: string,
    status: string,
    workoutTemplateId: string,
    workoutTemplate?:  {
      __typename: "WorkoutTemplate",
      id: string,
      userId: string,
      name: string,
      description?: string | null,
      isAIPlan?: boolean | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    workoutSessionId?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteScheduledWorkoutMutationVariables = {
  input: DeleteScheduledWorkoutInput,
  condition?: ModelScheduledWorkoutConditionInput | null,
};

export type DeleteScheduledWorkoutMutation = {
  deleteScheduledWorkout?:  {
    __typename: "ScheduledWorkout",
    id: string,
    userId: string,
    date: string,
    status: string,
    workoutTemplateId: string,
    workoutTemplate?:  {
      __typename: "WorkoutTemplate",
      id: string,
      userId: string,
      name: string,
      description?: string | null,
      isAIPlan?: boolean | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    workoutSessionId?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type _QueryVariables = {
};

export type _Query = {
  _?: string | null,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    name?: string | null,
    email?: string | null,
    nickname?: string | null,
    onboardingLevel?: string | null,
    heightCm?: number | null,
    weightKg?: number | null,
    age?: number | null,
    gender?: string | null,
    experienceLevel?: string | null,
    primaryGoal?: string | null,
    secondaryGoal?: string | null,
    injuriesOrLimitations?: string | null,
    performanceNotes?: string | null,
    preferredSplit?: string | null,
    likedExercises?: Array< string | null > | null,
    dislikedExercises?: Array< string | null > | null,
    availableDays?: Array< string | null > | null,
    timePerSessionMinutes?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      id: string,
      username: string,
      name?: string | null,
      email?: string | null,
      nickname?: string | null,
      onboardingLevel?: string | null,
      heightCm?: number | null,
      weightKg?: number | null,
      age?: number | null,
      gender?: string | null,
      experienceLevel?: string | null,
      primaryGoal?: string | null,
      secondaryGoal?: string | null,
      injuriesOrLimitations?: string | null,
      performanceNotes?: string | null,
      preferredSplit?: string | null,
      likedExercises?: Array< string | null > | null,
      dislikedExercises?: Array< string | null > | null,
      availableDays?: Array< string | null > | null,
      timePerSessionMinutes?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncUserProfilesQuery = {
  syncUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      id: string,
      username: string,
      name?: string | null,
      email?: string | null,
      nickname?: string | null,
      onboardingLevel?: string | null,
      heightCm?: number | null,
      weightKg?: number | null,
      age?: number | null,
      gender?: string | null,
      experienceLevel?: string | null,
      primaryGoal?: string | null,
      secondaryGoal?: string | null,
      injuriesOrLimitations?: string | null,
      performanceNotes?: string | null,
      preferredSplit?: string | null,
      likedExercises?: Array< string | null > | null,
      dislikedExercises?: Array< string | null > | null,
      availableDays?: Array< string | null > | null,
      timePerSessionMinutes?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetTrainerNoteQueryVariables = {
  id: string,
};

export type GetTrainerNoteQuery = {
  getTrainerNote?:  {
    __typename: "TrainerNote",
    id: string,
    userId: string,
    note: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListTrainerNotesQueryVariables = {
  filter?: ModelTrainerNoteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTrainerNotesQuery = {
  listTrainerNotes?:  {
    __typename: "ModelTrainerNoteConnection",
    items:  Array< {
      __typename: "TrainerNote",
      id: string,
      userId: string,
      note: string,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncTrainerNotesQueryVariables = {
  filter?: ModelTrainerNoteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncTrainerNotesQuery = {
  syncTrainerNotes?:  {
    __typename: "ModelTrainerNoteConnection",
    items:  Array< {
      __typename: "TrainerNote",
      id: string,
      userId: string,
      note: string,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetExerciseQueryVariables = {
  id: string,
};

export type GetExerciseQuery = {
  getExercise?:  {
    __typename: "Exercise",
    id: string,
    workoutTemplateId: string,
    name: string,
    sets?: string | null,
    reps?: string | null,
    weight?: string | null,
    restPeriod?: number | null,
    note?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListExercisesQueryVariables = {
  filter?: ModelExerciseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListExercisesQuery = {
  listExercises?:  {
    __typename: "ModelExerciseConnection",
    items:  Array< {
      __typename: "Exercise",
      id: string,
      workoutTemplateId: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncExercisesQueryVariables = {
  filter?: ModelExerciseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncExercisesQuery = {
  syncExercises?:  {
    __typename: "ModelExerciseConnection",
    items:  Array< {
      __typename: "Exercise",
      id: string,
      workoutTemplateId: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetWorkoutTemplateQueryVariables = {
  id: string,
};

export type GetWorkoutTemplateQuery = {
  getWorkoutTemplate?:  {
    __typename: "WorkoutTemplate",
    id: string,
    userId: string,
    name: string,
    description?: string | null,
    exercises?:  {
      __typename: "ModelExerciseConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    scheduledInstances?:  {
      __typename: "ModelScheduledWorkoutConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isAIPlan?: boolean | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListWorkoutTemplatesQueryVariables = {
  filter?: ModelWorkoutTemplateFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWorkoutTemplatesQuery = {
  listWorkoutTemplates?:  {
    __typename: "ModelWorkoutTemplateConnection",
    items:  Array< {
      __typename: "WorkoutTemplate",
      id: string,
      userId: string,
      name: string,
      description?: string | null,
      isAIPlan?: boolean | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncWorkoutTemplatesQueryVariables = {
  filter?: ModelWorkoutTemplateFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncWorkoutTemplatesQuery = {
  syncWorkoutTemplates?:  {
    __typename: "ModelWorkoutTemplateConnection",
    items:  Array< {
      __typename: "WorkoutTemplate",
      id: string,
      userId: string,
      name: string,
      description?: string | null,
      isAIPlan?: boolean | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetWorkoutSessionQueryVariables = {
  id: string,
};

export type GetWorkoutSessionQuery = {
  getWorkoutSession?:  {
    __typename: "WorkoutSession",
    id: string,
    userId: string,
    templateId?: string | null,
    scheduledWorkoutId?: string | null,
    name: string,
    status: string,
    currentElapsedTime?: number | null,
    currentExercisesState?: string | null,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListWorkoutSessionsQueryVariables = {
  filter?: ModelWorkoutSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWorkoutSessionsQuery = {
  listWorkoutSessions?:  {
    __typename: "ModelWorkoutSessionConnection",
    items:  Array< {
      __typename: "WorkoutSession",
      id: string,
      userId: string,
      templateId?: string | null,
      scheduledWorkoutId?: string | null,
      name: string,
      status: string,
      currentElapsedTime?: number | null,
      currentExercisesState?: string | null,
      duration?: number | null,
      completedAt?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncWorkoutSessionsQueryVariables = {
  filter?: ModelWorkoutSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncWorkoutSessionsQuery = {
  syncWorkoutSessions?:  {
    __typename: "ModelWorkoutSessionConnection",
    items:  Array< {
      __typename: "WorkoutSession",
      id: string,
      userId: string,
      templateId?: string | null,
      scheduledWorkoutId?: string | null,
      name: string,
      status: string,
      currentElapsedTime?: number | null,
      currentExercisesState?: string | null,
      duration?: number | null,
      completedAt?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetScheduledWorkoutQueryVariables = {
  id: string,
};

export type GetScheduledWorkoutQuery = {
  getScheduledWorkout?:  {
    __typename: "ScheduledWorkout",
    id: string,
    userId: string,
    date: string,
    status: string,
    workoutTemplateId: string,
    workoutTemplate?:  {
      __typename: "WorkoutTemplate",
      id: string,
      userId: string,
      name: string,
      description?: string | null,
      isAIPlan?: boolean | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    workoutSessionId?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListScheduledWorkoutsQueryVariables = {
  filter?: ModelScheduledWorkoutFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListScheduledWorkoutsQuery = {
  listScheduledWorkouts?:  {
    __typename: "ModelScheduledWorkoutConnection",
    items:  Array< {
      __typename: "ScheduledWorkout",
      id: string,
      userId: string,
      date: string,
      status: string,
      workoutTemplateId: string,
      workoutSessionId?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncScheduledWorkoutsQueryVariables = {
  filter?: ModelScheduledWorkoutFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncScheduledWorkoutsQuery = {
  syncScheduledWorkouts?:  {
    __typename: "ModelScheduledWorkoutConnection",
    items:  Array< {
      __typename: "ScheduledWorkout",
      id: string,
      userId: string,
      date: string,
      status: string,
      workoutTemplateId: string,
      workoutSessionId?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type NotesByUserIdQueryVariables = {
  userId: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTrainerNoteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type NotesByUserIdQuery = {
  notesByUserId?:  {
    __typename: "ModelTrainerNoteConnection",
    items:  Array< {
      __typename: "TrainerNote",
      id: string,
      userId: string,
      note: string,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type ExercisesByWorkoutTemplateIdQueryVariables = {
  workoutTemplateId: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelExerciseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ExercisesByWorkoutTemplateIdQuery = {
  exercisesByWorkoutTemplateId?:  {
    __typename: "ModelExerciseConnection",
    items:  Array< {
      __typename: "Exercise",
      id: string,
      workoutTemplateId: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type TemplatesByUserIdQueryVariables = {
  userId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelWorkoutTemplateFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TemplatesByUserIdQuery = {
  templatesByUserId?:  {
    __typename: "ModelWorkoutTemplateConnection",
    items:  Array< {
      __typename: "WorkoutTemplate",
      id: string,
      userId: string,
      name: string,
      description?: string | null,
      isAIPlan?: boolean | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SessionsByUserIdQueryVariables = {
  userId: string,
  updatedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelWorkoutSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SessionsByUserIdQuery = {
  sessionsByUserId?:  {
    __typename: "ModelWorkoutSessionConnection",
    items:  Array< {
      __typename: "WorkoutSession",
      id: string,
      userId: string,
      templateId?: string | null,
      scheduledWorkoutId?: string | null,
      name: string,
      status: string,
      currentElapsedTime?: number | null,
      currentExercisesState?: string | null,
      duration?: number | null,
      completedAt?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type ScheduledWorkoutsByUserIdAndDateQueryVariables = {
  userId: string,
  date?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelScheduledWorkoutFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ScheduledWorkoutsByUserIdAndDateQuery = {
  scheduledWorkoutsByUserIdAndDate?:  {
    __typename: "ModelScheduledWorkoutConnection",
    items:  Array< {
      __typename: "ScheduledWorkout",
      id: string,
      userId: string,
      date: string,
      status: string,
      workoutTemplateId: string,
      workoutSessionId?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type ScheduledWorkoutsByTemplateIdQueryVariables = {
  workoutTemplateId: string,
  date?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelScheduledWorkoutFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ScheduledWorkoutsByTemplateIdQuery = {
  scheduledWorkoutsByTemplateId?:  {
    __typename: "ModelScheduledWorkoutConnection",
    items:  Array< {
      __typename: "ScheduledWorkout",
      id: string,
      userId: string,
      date: string,
      status: string,
      workoutTemplateId: string,
      workoutSessionId?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type OnCreateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  id?: string | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    name?: string | null,
    email?: string | null,
    nickname?: string | null,
    onboardingLevel?: string | null,
    heightCm?: number | null,
    weightKg?: number | null,
    age?: number | null,
    gender?: string | null,
    experienceLevel?: string | null,
    primaryGoal?: string | null,
    secondaryGoal?: string | null,
    injuriesOrLimitations?: string | null,
    performanceNotes?: string | null,
    preferredSplit?: string | null,
    likedExercises?: Array< string | null > | null,
    dislikedExercises?: Array< string | null > | null,
    availableDays?: Array< string | null > | null,
    timePerSessionMinutes?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  id?: string | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    name?: string | null,
    email?: string | null,
    nickname?: string | null,
    onboardingLevel?: string | null,
    heightCm?: number | null,
    weightKg?: number | null,
    age?: number | null,
    gender?: string | null,
    experienceLevel?: string | null,
    primaryGoal?: string | null,
    secondaryGoal?: string | null,
    injuriesOrLimitations?: string | null,
    performanceNotes?: string | null,
    preferredSplit?: string | null,
    likedExercises?: Array< string | null > | null,
    dislikedExercises?: Array< string | null > | null,
    availableDays?: Array< string | null > | null,
    timePerSessionMinutes?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  id?: string | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    name?: string | null,
    email?: string | null,
    nickname?: string | null,
    onboardingLevel?: string | null,
    heightCm?: number | null,
    weightKg?: number | null,
    age?: number | null,
    gender?: string | null,
    experienceLevel?: string | null,
    primaryGoal?: string | null,
    secondaryGoal?: string | null,
    injuriesOrLimitations?: string | null,
    performanceNotes?: string | null,
    preferredSplit?: string | null,
    likedExercises?: Array< string | null > | null,
    dislikedExercises?: Array< string | null > | null,
    availableDays?: Array< string | null > | null,
    timePerSessionMinutes?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateTrainerNoteSubscriptionVariables = {
  filter?: ModelSubscriptionTrainerNoteFilterInput | null,
  owner?: string | null,
};

export type OnCreateTrainerNoteSubscription = {
  onCreateTrainerNote?:  {
    __typename: "TrainerNote",
    id: string,
    userId: string,
    note: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateTrainerNoteSubscriptionVariables = {
  filter?: ModelSubscriptionTrainerNoteFilterInput | null,
  owner?: string | null,
};

export type OnUpdateTrainerNoteSubscription = {
  onUpdateTrainerNote?:  {
    __typename: "TrainerNote",
    id: string,
    userId: string,
    note: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteTrainerNoteSubscriptionVariables = {
  filter?: ModelSubscriptionTrainerNoteFilterInput | null,
  owner?: string | null,
};

export type OnDeleteTrainerNoteSubscription = {
  onDeleteTrainerNote?:  {
    __typename: "TrainerNote",
    id: string,
    userId: string,
    note: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateExerciseSubscriptionVariables = {
  filter?: ModelSubscriptionExerciseFilterInput | null,
  owner?: string | null,
};

export type OnCreateExerciseSubscription = {
  onCreateExercise?:  {
    __typename: "Exercise",
    id: string,
    workoutTemplateId: string,
    name: string,
    sets?: string | null,
    reps?: string | null,
    weight?: string | null,
    restPeriod?: number | null,
    note?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateExerciseSubscriptionVariables = {
  filter?: ModelSubscriptionExerciseFilterInput | null,
  owner?: string | null,
};

export type OnUpdateExerciseSubscription = {
  onUpdateExercise?:  {
    __typename: "Exercise",
    id: string,
    workoutTemplateId: string,
    name: string,
    sets?: string | null,
    reps?: string | null,
    weight?: string | null,
    restPeriod?: number | null,
    note?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteExerciseSubscriptionVariables = {
  filter?: ModelSubscriptionExerciseFilterInput | null,
  owner?: string | null,
};

export type OnDeleteExerciseSubscription = {
  onDeleteExercise?:  {
    __typename: "Exercise",
    id: string,
    workoutTemplateId: string,
    name: string,
    sets?: string | null,
    reps?: string | null,
    weight?: string | null,
    restPeriod?: number | null,
    note?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateWorkoutTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionWorkoutTemplateFilterInput | null,
  owner?: string | null,
};

export type OnCreateWorkoutTemplateSubscription = {
  onCreateWorkoutTemplate?:  {
    __typename: "WorkoutTemplate",
    id: string,
    userId: string,
    name: string,
    description?: string | null,
    exercises?:  {
      __typename: "ModelExerciseConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    scheduledInstances?:  {
      __typename: "ModelScheduledWorkoutConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isAIPlan?: boolean | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateWorkoutTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionWorkoutTemplateFilterInput | null,
  owner?: string | null,
};

export type OnUpdateWorkoutTemplateSubscription = {
  onUpdateWorkoutTemplate?:  {
    __typename: "WorkoutTemplate",
    id: string,
    userId: string,
    name: string,
    description?: string | null,
    exercises?:  {
      __typename: "ModelExerciseConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    scheduledInstances?:  {
      __typename: "ModelScheduledWorkoutConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isAIPlan?: boolean | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteWorkoutTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionWorkoutTemplateFilterInput | null,
  owner?: string | null,
};

export type OnDeleteWorkoutTemplateSubscription = {
  onDeleteWorkoutTemplate?:  {
    __typename: "WorkoutTemplate",
    id: string,
    userId: string,
    name: string,
    description?: string | null,
    exercises?:  {
      __typename: "ModelExerciseConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    scheduledInstances?:  {
      __typename: "ModelScheduledWorkoutConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isAIPlan?: boolean | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateWorkoutSessionSubscriptionVariables = {
  filter?: ModelSubscriptionWorkoutSessionFilterInput | null,
  owner?: string | null,
};

export type OnCreateWorkoutSessionSubscription = {
  onCreateWorkoutSession?:  {
    __typename: "WorkoutSession",
    id: string,
    userId: string,
    templateId?: string | null,
    scheduledWorkoutId?: string | null,
    name: string,
    status: string,
    currentElapsedTime?: number | null,
    currentExercisesState?: string | null,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateWorkoutSessionSubscriptionVariables = {
  filter?: ModelSubscriptionWorkoutSessionFilterInput | null,
  owner?: string | null,
};

export type OnUpdateWorkoutSessionSubscription = {
  onUpdateWorkoutSession?:  {
    __typename: "WorkoutSession",
    id: string,
    userId: string,
    templateId?: string | null,
    scheduledWorkoutId?: string | null,
    name: string,
    status: string,
    currentElapsedTime?: number | null,
    currentExercisesState?: string | null,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteWorkoutSessionSubscriptionVariables = {
  filter?: ModelSubscriptionWorkoutSessionFilterInput | null,
  owner?: string | null,
};

export type OnDeleteWorkoutSessionSubscription = {
  onDeleteWorkoutSession?:  {
    __typename: "WorkoutSession",
    id: string,
    userId: string,
    templateId?: string | null,
    scheduledWorkoutId?: string | null,
    name: string,
    status: string,
    currentElapsedTime?: number | null,
    currentExercisesState?: string | null,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateScheduledWorkoutSubscriptionVariables = {
  filter?: ModelSubscriptionScheduledWorkoutFilterInput | null,
  userId?: string | null,
};

export type OnCreateScheduledWorkoutSubscription = {
  onCreateScheduledWorkout?:  {
    __typename: "ScheduledWorkout",
    id: string,
    userId: string,
    date: string,
    status: string,
    workoutTemplateId: string,
    workoutTemplate?:  {
      __typename: "WorkoutTemplate",
      id: string,
      userId: string,
      name: string,
      description?: string | null,
      isAIPlan?: boolean | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    workoutSessionId?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateScheduledWorkoutSubscriptionVariables = {
  filter?: ModelSubscriptionScheduledWorkoutFilterInput | null,
  userId?: string | null,
};

export type OnUpdateScheduledWorkoutSubscription = {
  onUpdateScheduledWorkout?:  {
    __typename: "ScheduledWorkout",
    id: string,
    userId: string,
    date: string,
    status: string,
    workoutTemplateId: string,
    workoutTemplate?:  {
      __typename: "WorkoutTemplate",
      id: string,
      userId: string,
      name: string,
      description?: string | null,
      isAIPlan?: boolean | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    workoutSessionId?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteScheduledWorkoutSubscriptionVariables = {
  filter?: ModelSubscriptionScheduledWorkoutFilterInput | null,
  userId?: string | null,
};

export type OnDeleteScheduledWorkoutSubscription = {
  onDeleteScheduledWorkout?:  {
    __typename: "ScheduledWorkout",
    id: string,
    userId: string,
    date: string,
    status: string,
    workoutTemplateId: string,
    workoutTemplate?:  {
      __typename: "WorkoutTemplate",
      id: string,
      userId: string,
      name: string,
      description?: string | null,
      isAIPlan?: boolean | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    workoutSessionId?: string | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};
