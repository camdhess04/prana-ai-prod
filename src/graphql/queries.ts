/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../../amplify/backend/api/pranaaiprodv3/src/API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const _ = /* GraphQL */ `query _ {
  _
}
` as GeneratedQuery<APITypes._QueryVariables, APITypes._Query>;
export const getExercise = /* GraphQL */ `query GetExercise($id: ID!) {
  getExercise(id: $id) {
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
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetExerciseQueryVariables,
  APITypes.GetExerciseQuery
>;
export const listExercises = /* GraphQL */ `query ListExercises(
  $filter: ModelExerciseFilterInput
  $limit: Int
  $nextToken: String
) {
  listExercises(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListExercisesQueryVariables,
  APITypes.ListExercisesQuery
>;
export const syncExercises = /* GraphQL */ `query SyncExercises(
  $filter: ModelExerciseFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncExercises(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncExercisesQueryVariables,
  APITypes.SyncExercisesQuery
>;
export const getWorkoutTemplate = /* GraphQL */ `query GetWorkoutTemplate($id: ID!) {
  getWorkoutTemplate(id: $id) {
    id
    userId
    name
    description
    exercises {
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
` as GeneratedQuery<
  APITypes.GetWorkoutTemplateQueryVariables,
  APITypes.GetWorkoutTemplateQuery
>;
export const listWorkoutTemplates = /* GraphQL */ `query ListWorkoutTemplates(
  $filter: ModelWorkoutTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  listWorkoutTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      name
      description
      owner
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWorkoutTemplatesQueryVariables,
  APITypes.ListWorkoutTemplatesQuery
>;
export const syncWorkoutTemplates = /* GraphQL */ `query SyncWorkoutTemplates(
  $filter: ModelWorkoutTemplateFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncWorkoutTemplates(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      userId
      name
      description
      owner
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncWorkoutTemplatesQueryVariables,
  APITypes.SyncWorkoutTemplatesQuery
>;
export const getWorkoutSession = /* GraphQL */ `query GetWorkoutSession($id: ID!) {
  getWorkoutSession(id: $id) {
    id
    userId
    templateId
    name
    exercises {
      id
      name
      note
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
` as GeneratedQuery<
  APITypes.GetWorkoutSessionQueryVariables,
  APITypes.GetWorkoutSessionQuery
>;
export const listWorkoutSessions = /* GraphQL */ `query ListWorkoutSessions(
  $filter: ModelWorkoutSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  listWorkoutSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      templateId
      name
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWorkoutSessionsQueryVariables,
  APITypes.ListWorkoutSessionsQuery
>;
export const syncWorkoutSessions = /* GraphQL */ `query SyncWorkoutSessions(
  $filter: ModelWorkoutSessionFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncWorkoutSessions(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      userId
      templateId
      name
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncWorkoutSessionsQueryVariables,
  APITypes.SyncWorkoutSessionsQuery
>;
export const exercisesByWorkoutTemplateId = /* GraphQL */ `query ExercisesByWorkoutTemplateId(
  $workoutTemplateId: ID!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelExerciseFilterInput
  $limit: Int
  $nextToken: String
) {
  exercisesByWorkoutTemplateId(
    workoutTemplateId: $workoutTemplateId
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ExercisesByWorkoutTemplateIdQueryVariables,
  APITypes.ExercisesByWorkoutTemplateIdQuery
>;
export const templatesByUserId = /* GraphQL */ `query TemplatesByUserId(
  $userId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelWorkoutTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  templatesByUserId(
    userId: $userId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      name
      description
      owner
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.TemplatesByUserIdQueryVariables,
  APITypes.TemplatesByUserIdQuery
>;
export const sessionsByUserId = /* GraphQL */ `query SessionsByUserId(
  $userId: ID!
  $completedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelWorkoutSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  sessionsByUserId(
    userId: $userId
    completedAt: $completedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      templateId
      name
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SessionsByUserIdQueryVariables,
  APITypes.SessionsByUserIdQuery
>;
