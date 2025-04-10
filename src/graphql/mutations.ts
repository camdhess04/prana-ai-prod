/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createWorkoutTemplate = /* GraphQL */ `mutation CreateWorkoutTemplate(
  $input: CreateWorkoutTemplateInput!
  $condition: ModelWorkoutTemplateConditionInput
) {
  createWorkoutTemplate(input: $input, condition: $condition) {
    id
    userId
    name
    description
    exercises {
      id
      name
      sets
      reps
      weight
      restPeriod
      note
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    owner
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
    exercises {
      id
      name
      sets
      reps
      weight
      restPeriod
      note
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    owner
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
    exercises {
      id
      name
      sets
      reps
      weight
      restPeriod
      note
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteWorkoutTemplateMutationVariables,
  APITypes.DeleteWorkoutTemplateMutation
>;
export const createWorkoutSession = /* GraphQL */ `mutation CreateWorkoutSession(
  $input: CreateWorkoutSessionInput!
  $condition: ModelWorkoutSessionConditionInput
) {
  createWorkoutSession(input: $input, condition: $condition) {
    id
    userId
    templateId
    name
    exercises {
      id
      name
      sets
      reps
      weight
      restPeriod
      note
      __typename
    }
    duration
    completedAt
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    owner
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
      sets
      reps
      weight
      restPeriod
      note
      __typename
    }
    duration
    completedAt
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    owner
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
      sets
      reps
      weight
      restPeriod
      note
      __typename
    }
    duration
    completedAt
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteWorkoutSessionMutationVariables,
  APITypes.DeleteWorkoutSessionMutation
>;
