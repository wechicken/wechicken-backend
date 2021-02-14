import { IsString, IsNotEmpty, IsUrl, IsDateString } from 'class-validator'

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

export class CreateBlogInput {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsUrl()
  link: string

  @IsNotEmpty()
  @IsDateString()
  written_date: Date
}

export interface updateBlogInput {
  id: number
  title?: string
  link?: string
  written_date?: Date
}

export class UpdateBlogInput {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsUrl()
  link: string

  @IsNotEmpty()
  @IsDateString()
  written_date: Date
}
