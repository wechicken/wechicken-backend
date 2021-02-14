import { IsEmail, IsInt, IsString, IsBoolean, Length, IsUrl } from 'class-validator'

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

export class CreateUserInput {
  @IsInt()
  nth: number

  @IsInt()
  batch_type_id: number

  @IsEmail()
  gmail: string

  @IsString()
  @Length(5)
  gmail_id: string

  @IsBoolean()
  is_admin: boolean

  @IsBoolean()
  is_group_joined: boolean

  @IsString()
  @Length(2)
  name: string

  @IsUrl()
  @Length(5)
  blog_address: string
}

export interface userUniqueSearchInput {
  id?: number
  gmail_id?: string
  gmail?: string
}

export class UserUniqueSearchInput {
  @IsEmail()
  gmail: string
}
