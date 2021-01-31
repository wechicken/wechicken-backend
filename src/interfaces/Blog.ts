export interface blogsSearchOption {
  offset?: number
  limit?: number
  title?: string
}

export interface createBlogInput {
  user_id: number
  title: string
  link: string
  written_date: Date
}

export const CREATE_BLOG_INPUT = ['title', 'link', 'written_date']
