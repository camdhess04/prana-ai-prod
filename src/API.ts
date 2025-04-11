/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

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
  owner?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type ModelWorkoutTemplateConditionInput = {
  userId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
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

export type UpdateWorkoutTemplateInput = {
  id: string,
  userId?: string | null,
  name?: string | null,
  description?: string | null,
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
  name: string,
  exercises?: Array< SessionExerciseInput | null > | null,
  duration?: number | null,
  completedAt: string,
  owner?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type SessionExerciseInput = {
  id: string,
  name: string,
  note?: string | null,
  performedSets?: Array< PerformedSetInput | null > | null,
};

export type PerformedSetInput = {
  id: string,
  reps?: string | null,
  weight?: string | null,
};

export type ModelWorkoutSessionConditionInput = {
  userId?: ModelIDInput | null,
  templateId?: ModelIDInput | null,
  name?: ModelStringInput | null,
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
  name: string,
  exercises?:  Array<SessionExercise | null > | null,
  duration?: number | null,
  completedAt: string,
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
  performedSets?:  Array<PerformedSet | null > | null,
};

export type PerformedSet = {
  __typename: "PerformedSet",
  id: string,
  reps?: string | null,
  weight?: string | null,
};

export type UpdateWorkoutSessionInput = {
  id: string,
  userId?: string | null,
  templateId?: string | null,
  name?: string | null,
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
  name?: ModelStringInput | null,
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

export type ModelSubscriptionWorkoutTemplateFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionWorkoutTemplateFilterInput | null > | null,
  or?: Array< ModelSubscriptionWorkoutTemplateFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionWorkoutSessionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  templateId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  duration?: ModelSubscriptionIntInput | null,
  completedAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionWorkoutSessionFilterInput | null > | null,
  or?: Array< ModelSubscriptionWorkoutSessionFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
  owner?: ModelStringInput | null,
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
    name: string,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
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
    name: string,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
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
    name: string,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
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
    name: string,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
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
      name: string,
      duration?: number | null,
      completedAt: string,
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
      name: string,
      duration?: number | null,
      completedAt: string,
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
  completedAt?: ModelStringKeyConditionInput | null,
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
      name: string,
      duration?: number | null,
      completedAt: string,
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
    name: string,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
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
    name: string,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
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
    name: string,
    exercises?:  Array< {
      __typename: "SessionExercise",
      id: string,
      name: string,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};
