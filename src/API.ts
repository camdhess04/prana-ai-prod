/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateWorkoutTemplateInput = {
  id?: string | null,
  userId: string,
  name: string,
  description?: string | null,
  exercises?: Array< ExerciseInput | null > | null,
  _version?: number | null,
};

export type ExerciseInput = {
  id: string,
  name: string,
  sets?: string | null,
  reps?: string | null,
  weight?: string | null,
  restPeriod?: number | null,
  note?: string | null,
};

export type ModelWorkoutTemplateConditionInput = {
  userId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelWorkoutTemplateConditionInput | null > | null,
  or?: Array< ModelWorkoutTemplateConditionInput | null > | null,
  not?: ModelWorkoutTemplateConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
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

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type WorkoutTemplate = {
  __typename: "WorkoutTemplate",
  id: string,
  userId: string,
  name: string,
  description?: string | null,
  exercises?:  Array<Exercise | null > | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  owner?: string | null,
};

export type Exercise = {
  __typename: "Exercise",
  id: string,
  name: string,
  sets?: string | null,
  reps?: string | null,
  weight?: string | null,
  restPeriod?: number | null,
  note?: string | null,
};

export type UpdateWorkoutTemplateInput = {
  id: string,
  userId?: string | null,
  name?: string | null,
  description?: string | null,
  exercises?: Array< ExerciseInput | null > | null,
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
  exercises?: Array< ExerciseInput | null > | null,
  duration?: number | null,
  completedAt: string,
  _version?: number | null,
};

export type ModelWorkoutSessionConditionInput = {
  userId?: ModelIDInput | null,
  templateId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  duration?: ModelIntInput | null,
  completedAt?: ModelStringInput | null,
  and?: Array< ModelWorkoutSessionConditionInput | null > | null,
  or?: Array< ModelWorkoutSessionConditionInput | null > | null,
  not?: ModelWorkoutSessionConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
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

export type WorkoutSession = {
  __typename: "WorkoutSession",
  id: string,
  userId: string,
  templateId?: string | null,
  name: string,
  exercises?:  Array<Exercise | null > | null,
  duration?: number | null,
  completedAt: string,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  owner?: string | null,
};

export type UpdateWorkoutSessionInput = {
  id: string,
  userId?: string | null,
  templateId?: string | null,
  name?: string | null,
  exercises?: Array< ExerciseInput | null > | null,
  duration?: number | null,
  completedAt?: string | null,
  _version?: number | null,
};

export type DeleteWorkoutSessionInput = {
  id: string,
  _version?: number | null,
};

export type ModelWorkoutTemplateFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelWorkoutTemplateFilterInput | null > | null,
  or?: Array< ModelWorkoutTemplateFilterInput | null > | null,
  not?: ModelWorkoutTemplateFilterInput | null,
  _deleted?: ModelBooleanInput | null,
  owner?: ModelStringInput | null,
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
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelWorkoutSessionFilterInput | null > | null,
  or?: Array< ModelWorkoutSessionFilterInput | null > | null,
  not?: ModelWorkoutSessionFilterInput | null,
  _deleted?: ModelBooleanInput | null,
  owner?: ModelStringInput | null,
};

export type ModelWorkoutSessionConnection = {
  __typename: "ModelWorkoutSessionConnection",
  items:  Array<WorkoutSession | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


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
    exercises?:  Array< {
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
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
    exercises?:  Array< {
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
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
    exercises?:  Array< {
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
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
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
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
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
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
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type _QueryVariables = {
};

export type _Query = {
  _?: string | null,
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
    exercises?:  Array< {
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
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
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
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
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
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
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
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
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
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
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
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
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SessionsByUserIdQueryVariables = {
  userId: string,
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
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
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
    exercises?:  Array< {
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
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
    exercises?:  Array< {
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
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
    exercises?:  Array< {
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
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
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
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
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
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
      __typename: "Exercise",
      id: string,
      name: string,
      sets?: string | null,
      reps?: string | null,
      weight?: string | null,
      restPeriod?: number | null,
      note?: string | null,
    } | null > | null,
    duration?: number | null,
    completedAt: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};
