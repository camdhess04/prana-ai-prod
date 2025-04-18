/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateUserProfile = /* GraphQL */ `subscription OnCreateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $id: String
) {
  onCreateUserProfile(filter: $filter, id: $id) {
    id
    username
    name
    email
    onboardingLevel
    heightCm
    weightKg
    age
    gender
    experienceLevel
    primaryGoal
    secondaryGoal
    injuriesOrLimitations
    performanceNotes
    preferredSplit
    likedExercises
    dislikedExercises
    availableDays
    timePerSessionMinutes
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserProfileSubscriptionVariables,
  APITypes.OnCreateUserProfileSubscription
>;
export const onUpdateUserProfile = /* GraphQL */ `subscription OnUpdateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $id: String
) {
  onUpdateUserProfile(filter: $filter, id: $id) {
    id
    username
    name
    email
    onboardingLevel
    heightCm
    weightKg
    age
    gender
    experienceLevel
    primaryGoal
    secondaryGoal
    injuriesOrLimitations
    performanceNotes
    preferredSplit
    likedExercises
    dislikedExercises
    availableDays
    timePerSessionMinutes
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfileSubscriptionVariables,
  APITypes.OnUpdateUserProfileSubscription
>;
export const onDeleteUserProfile = /* GraphQL */ `subscription OnDeleteUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $id: String
) {
  onDeleteUserProfile(filter: $filter, id: $id) {
    id
    username
    name
    email
    onboardingLevel
    heightCm
    weightKg
    age
    gender
    experienceLevel
    primaryGoal
    secondaryGoal
    injuriesOrLimitations
    performanceNotes
    preferredSplit
    likedExercises
    dislikedExercises
    availableDays
    timePerSessionMinutes
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfileSubscriptionVariables,
  APITypes.OnDeleteUserProfileSubscription
>;
export const onCreateTrainerNote = /* GraphQL */ `subscription OnCreateTrainerNote(
  $filter: ModelSubscriptionTrainerNoteFilterInput
  $owner: String
) {
  onCreateTrainerNote(filter: $filter, owner: $owner) {
    id
    userId
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
` as GeneratedSubscription<
  APITypes.OnCreateTrainerNoteSubscriptionVariables,
  APITypes.OnCreateTrainerNoteSubscription
>;
export const onUpdateTrainerNote = /* GraphQL */ `subscription OnUpdateTrainerNote(
  $filter: ModelSubscriptionTrainerNoteFilterInput
  $owner: String
) {
  onUpdateTrainerNote(filter: $filter, owner: $owner) {
    id
    userId
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
` as GeneratedSubscription<
  APITypes.OnUpdateTrainerNoteSubscriptionVariables,
  APITypes.OnUpdateTrainerNoteSubscription
>;
export const onDeleteTrainerNote = /* GraphQL */ `subscription OnDeleteTrainerNote(
  $filter: ModelSubscriptionTrainerNoteFilterInput
  $owner: String
) {
  onDeleteTrainerNote(filter: $filter, owner: $owner) {
    id
    userId
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
` as GeneratedSubscription<
  APITypes.OnDeleteTrainerNoteSubscriptionVariables,
  APITypes.OnDeleteTrainerNoteSubscription
>;
export const onCreateExercise = /* GraphQL */ `subscription OnCreateExercise(
  $filter: ModelSubscriptionExerciseFilterInput
  $owner: String
) {
  onCreateExercise(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateExerciseSubscriptionVariables,
  APITypes.OnCreateExerciseSubscription
>;
export const onUpdateExercise = /* GraphQL */ `subscription OnUpdateExercise(
  $filter: ModelSubscriptionExerciseFilterInput
  $owner: String
) {
  onUpdateExercise(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateExerciseSubscriptionVariables,
  APITypes.OnUpdateExerciseSubscription
>;
export const onDeleteExercise = /* GraphQL */ `subscription OnDeleteExercise(
  $filter: ModelSubscriptionExerciseFilterInput
  $owner: String
) {
  onDeleteExercise(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteExerciseSubscriptionVariables,
  APITypes.OnDeleteExerciseSubscription
>;
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
      nextToken
      startedAt
      __typename
    }
    isAIPlan
    owner
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
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
      nextToken
      startedAt
      __typename
    }
    isAIPlan
    owner
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
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
      nextToken
      startedAt
      __typename
    }
    isAIPlan
    owner
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
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
` as GeneratedSubscription<
  APITypes.OnDeleteWorkoutSessionSubscriptionVariables,
  APITypes.OnDeleteWorkoutSessionSubscription
>;
