export interface getWeekBlogsInput {
  selected_date: string | undefined
  batch_id: number
}

export interface createBatchInput {
  batch_type_id: number
  manager_id?: number
  nth: number
  title?: string
  penalty?: number
  count?: number
}

export const CREATE_BATCH_INPUT = [
  'batch_type_id',
  'manager_id',
  'nth',
  'title',
  'penalty',
  'count',
]

export interface updateBatchInput {
  id: number
  batch_type_id?: number
  manager_id?: number
  title?: string
  penalty?: number
  count?: number
}

export const UPDATE_BATCH_INPUT = ['batch_type_id', 'manager_id', 'title', 'penalty', 'count']
