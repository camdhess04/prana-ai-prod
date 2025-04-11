/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API"; // Make sure API.ts exists and has the correct types
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

// Mutation for Exercise Model (Relational)
export const createExercise = /* GraphQL */ `mutation CreateExercise(
  $input: CreateExerciseInput!
  $condition: ModelExerciseConditionInput
) {
  createExercise(input: $input, condition: $condition) {
    id
    workoutTemplateId
    name
    sets
    reps
    weight
    restPeriod
    note
    owner
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    # Add 'template' field here if you included @belongsTo in Exercise schema
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateExerciseMutationVariables,
  APITypes.CreateExerciseMutation
>;
export const updateExercise = /* GraphQL */ `mutation UpdateExercise(
  $input: UpdateExerciseInput!
  $condition: ModelExerciseConditionInput
) {
  updateExercise(input: $input, condition: $condition) {
    id
    workoutTemplateId
    name
    sets
    reps
    weight
    restPeriod
    note
    owner
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    # Add 'template' field here if you included @belongsTo in Exercise schema
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateExerciseMutationVariables,
  APITypes.UpdateExerciseMutation
>;
export const deleteExercise = /* GraphQL */ `mutation DeleteExercise(
  $input: DeleteExerciseInput!
  $condition: ModelExerciseConditionInput
) {
  deleteExercise(input: $input, condition: $condition) {
    id
    workoutTemplateId
    name
    sets
    reps
    weight
    restPeriod
    note
    owner
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    # Add 'template' field here if you included @belongsTo in Exercise schema
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteExerciseMutationVariables,
  APITypes.DeleteExerciseMutation
>;

// Mutation for WorkoutTemplate Model (Relational - references Exercise Connection)
export const createWorkoutTemplate = /* GraphQL */ `mutation CreateWorkoutTemplate(
  $input: CreateWorkoutTemplateInput!
  $condition: ModelWorkoutTemplateConditionInput
) {
  createWorkoutTemplate(input: $input, condition: $condition) {
    id
    userId
    name
    description
    # The 'exercises' field here returns connection metadata, not the items themselves by default on create/update
    exercises(limit: 10) { # Example limit, adjust if needed
      items { # You might need to add sub-selection here if you need exercises returned immediately
        id
        name
        # Add other exercise fields if needed in response
        __typename
      }
      nextToken
      startedAt # Used by DataStore
      __typename
    }
    owner
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateWorkoutTemplateMutationVariables,
  APITypes.CreateWorkoutTemplateMutation
>;
export const updateWorkoutTemplate = /* GraphQL */ `mutation UpdateWorkoutTemplate(
  $input: UpdateWorkoutTemplateInput!
  $condition: ModelWorkoutTemplateConditionInput
) {
  updateWorkoutTemplate(input: $input, condition: $condition) {
    id
    userId
    name
    description
    exercises(limit: 10) { # Example limit
      items {
        id
        name
        __typename
      }
      nextToken
      startedAt
      __typename
    }
    owner
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateWorkoutTemplateMutationVariables,
  APITypes.UpdateWorkoutTemplateMutation
>;
export const deleteWorkoutTemplate = /* GraphQL */ `mutation DeleteWorkoutTemplate(
  $input: DeleteWorkoutTemplateInput!
  $condition: ModelWorkoutTemplateConditionInput
) {
  deleteWorkoutTemplate(input: $input, condition: $condition) {
    id
    userId
    name
    description
    exercises(limit: 10) { # Example limit
      items {
        id
        name
        __typename
      }
      nextToken
      startedAt
      __typename
    }
    owner
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteWorkoutTemplateMutationVariables,
  APITypes.DeleteWorkoutTemplateMutation
>;

// Mutation for WorkoutSession Model (Uses embedded SessionExercise)
export const createWorkoutSession = /* GraphQL */ `mutation CreateWorkoutSession(
  $input: CreateWorkoutSessionInput!
  $condition: ModelWorkoutSessionConditionInput
) {
  createWorkoutSession(input: $input, condition: $condition) {
    id
    userId
    templateId
    name
    # Select embedded exercises and performedSets directly
    exercises {
      id
      name
      note
      performedSets {
        id
        reps
        weight
        __typename
      }
      __typename
    }
    duration
    completedAt
    owner
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateWorkoutSessionMutationVariables,
  APITypes.CreateWorkoutSessionMutation
>;
export const updateWorkoutSession = /* GraphQL */ `mutation UpdateWorkoutSession(
  $input: UpdateWorkoutSessionInput!
  $condition: ModelWorkoutSessionConditionInput
) {
  updateWorkoutSession(input: $input, condition: $condition) {
    id
    userId
    templateId
    name
    exercises {
      id
      name
      note
      performedSets {
        id
        reps
        weight
        __typename
      }
      __typename
    }
    duration
    completedAt
    owner
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateWorkoutSessionMutationVariables,
  APITypes.UpdateWorkoutSessionMutation
>;
export const deleteWorkoutSession = /* GraphQL */ `mutation DeleteWorkoutSession(
  $input: DeleteWorkoutSessionInput!
  $condition: ModelWorkoutSessionConditionInput
) {
  deleteWorkoutSession(input: $input, condition: $condition) {
    id
    userId
    templateId
    name
    exercises {
      id
      name
      note
      performedSets {
        id
        reps
        weight
        __typename
      }
      __typename
    }
    duration
    completedAt
    owner
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteWorkoutSessionMutationVariables,
  APITypes.DeleteWorkoutSessionMutation
>;