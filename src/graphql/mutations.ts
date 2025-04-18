/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createUserProfile = /* GraphQL */ `mutation CreateUserProfile(
  $input: CreateUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  createUserProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserProfileMutationVariables,
  APITypes.CreateUserProfileMutation
>;
export const updateUserProfile = /* GraphQL */ `mutation UpdateUserProfile(
  $input: UpdateUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  updateUserProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserProfileMutationVariables,
  APITypes.UpdateUserProfileMutation
>;
export const deleteUserProfile = /* GraphQL */ `mutation DeleteUserProfile(
  $input: DeleteUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  deleteUserProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserProfileMutationVariables,
  APITypes.DeleteUserProfileMutation
>;
export const createTrainerNote = /* GraphQL */ `mutation CreateTrainerNote(
  $input: CreateTrainerNoteInput!
  $condition: ModelTrainerNoteConditionInput
) {
  createTrainerNote(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateTrainerNoteMutationVariables,
  APITypes.CreateTrainerNoteMutation
>;
export const updateTrainerNote = /* GraphQL */ `mutation UpdateTrainerNote(
  $input: UpdateTrainerNoteInput!
  $condition: ModelTrainerNoteConditionInput
) {
  updateTrainerNote(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateTrainerNoteMutationVariables,
  APITypes.UpdateTrainerNoteMutation
>;
export const deleteTrainerNote = /* GraphQL */ `mutation DeleteTrainerNote(
  $input: DeleteTrainerNoteInput!
  $condition: ModelTrainerNoteConditionInput
) {
  deleteTrainerNote(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteTrainerNoteMutationVariables,
  APITypes.DeleteTrainerNoteMutation
>;
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteExerciseMutationVariables,
  APITypes.DeleteExerciseMutation
>;
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
