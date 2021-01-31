import { errorGenerator, errorWrapper } from '../errors'
import { Request, Response } from 'express'
import { BlogService } from '../services'
import { blogsSearchOption, createBlogInput, CREATE_BLOG_INPUT } from '../interfaces/Blog'
import { validateFields } from '../utils'

const getBlogs = errorWrapper(async (req: Request, res: Response) => {
  const { offset, limit, title }: blogsSearchOption = req.query

  const blogs = await BlogService.getBlogs({ offset: Number(offset), limit: Number(limit), title })
  res.status(200).json({ blogs })
})

const createBlog = errorWrapper(async (req: Request, res: Response) => {
  const isAllValidFields = validateFields({
    requested: Object.keys(req.body),
    allowed: CREATE_BLOG_INPUT,
    option: 'every',
  })

  if (!isAllValidFields) errorGenerator({ statusCode: 400, message: '블로그 생성 키 값 에러' })

  const { foundUser } = req
  const { title, link, written_date }: createBlogInput = req.body

  const createdBlog = await BlogService.createBlog({
    user_id: foundUser.id,
    title,
    link,
    written_date,
  })

  res.status(201).json({ createdBlog })
})

const updateBlog = errorWrapper(async (req: Request, res: Response) => {})

const deleteBlog = errorWrapper(async (req: Request, res: Response) => {})

export default {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
}
