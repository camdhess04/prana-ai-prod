/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const _ = /* GraphQL */ `query _ {
  _
}
` as GeneratedQuery<APITypes._QueryVariables, APITypes._Query>;
export const getWorkoutTemplate = /* GraphQL */ `query GetWorkoutTemplate($id: ID!) {
  getWorkoutTemplate(id: $id) {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
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
  $sortDirection: ModelSortDirection
  $filter: ModelWorkoutSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  sessionsByUserId(
    userId: $userId
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
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
