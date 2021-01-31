export interface blogsSearchOption {
  offset?: number
  limit?: number
  keyword?: string
  batch?: number
}

export interface createBlogInput {
  user_id: number
  title: string
  link: string
  written_date: Date
}

export const CREATE_BLOG_INPUT = ['title', 'link', 'written_date']

export interface updateBlogInput {
  id: number
  title?: string
  link?: string
  written_date?: Date
}

export const UPDATE_BLOG_INPUT = ['title', 'link', 'written_date']
