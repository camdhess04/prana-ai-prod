/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateWorkoutTemplate = /* GraphQL */ `subscription OnCreateWorkoutTemplate(
  $filter: ModelSubscriptionWorkoutTemplateFilterInput
  $owner: String
) {
  onCreateWorkoutTemplate(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateWorkoutTemplateSubscriptionVariables,
  APITypes.OnCreateWorkoutTemplateSubscription
>;
export const onUpdateWorkoutTemplate = /* GraphQL */ `subscription OnUpdateWorkoutTemplate(
  $filter: ModelSubscriptionWorkoutTemplateFilterInput
  $owner: String
) {
  onUpdateWorkoutTemplate(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateWorkoutTemplateSubscriptionVariables,
  APITypes.OnUpdateWorkoutTemplateSubscription
>;
export const onDeleteWorkoutTemplate = /* GraphQL */ `subscription OnDeleteWorkoutTemplate(
  $filter: ModelSubscriptionWorkoutTemplateFilterInput
  $owner: String
) {
  onDeleteWorkoutTemplate(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteWorkoutTemplateSubscriptionVariables,
  APITypes.OnDeleteWorkoutTemplateSubscription
>;
export const onCreateWorkoutSession = /* GraphQL */ `subscription OnCreateWorkoutSession(
  $filter: ModelSubscriptionWorkoutSessionFilterInput
  $owner: String
) {
  onCreateWorkoutSession(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateWorkoutSessionSubscriptionVariables,
  APITypes.OnCreateWorkoutSessionSubscription
>;
export const onUpdateWorkoutSession = /* GraphQL */ `subscription OnUpdateWorkoutSession(
  $filter: ModelSubscriptionWorkoutSessionFilterInput
  $owner: String
) {
  onUpdateWorkoutSession(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateWorkoutSessionSubscriptionVariables,
  APITypes.OnUpdateWorkoutSessionSubscription
>;
export const onDeleteWorkoutSession = /* GraphQL */ `subscription OnDeleteWorkoutSession(
  $filter: ModelSubscriptionWorkoutSessionFilterInput
  $owner: String
) {
  onDeleteWorkoutSession(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteWorkoutSessionSubscriptionVariables,
  APITypes.OnDeleteWorkoutSessionSubscription
>;
