export interface createUserInput {
  nth: number
  batch_type_id: number
  gmail: string
  gmail_id: string
  is_admin: boolean
  is_group_joined: boolean
  name: string
  blog_address: string
}

export const CREATE_USER_INPUT = [
  'nth',
  'batch_type_id',
  'gmail',
  'gmail_id',
  'is_admin',
  'is_group_joined',
  'name',
  'blog_address',
]

export interface userUniqueSearchInput {
  id?: number
  gmail_id?: string
  gmail?: string
}

export const USER_UNIQUE_SEARCH_INPUT = ['id', 'gmail_id', 'gmail']
