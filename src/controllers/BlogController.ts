import { errorGenerator, errorWrapper } from '../errors'
import { Request, Response } from 'express'
import { BlogService } from '../services'
import { createBlogInput, CREATE_BLOG_INPUT, UPDATE_BLOG_INPUT } from '../interfaces/Blog'
import { validateFields } from '../utils'

const getBlogs = errorWrapper(async (req: Request, res: Response) => {
  const blogs = await BlogService.getBlogs(req.query)
  res.status(200).json({ blogs })
})

const createBlog = errorWrapper(async (req: Request, res: Response) => {
  const isAllValidFields = validateFields({
    requested: Object.keys(req.body),
    allowed: CREATE_BLOG_INPUT,
    option: 'every',
  })

  if (!isAllValidFields)
    errorGenerator({
      statusCode: 400,
      message: '블로그 생성 키 값 에러',
      allowedKeys: CREATE_BLOG_INPUT,
    })

  const { id: user_id } = req.foundUser
  const { title, link, written_date }: createBlogInput = req.body

  const createdBlog = await BlogService.createBlog({
    user_id,
    title,
    link,
    written_date,
  })

  res.status(201).json({ createdBlog })
})

const updateBlog = errorWrapper(async (req: Request, res: Response) => {
  const isAllValidFields = validateFields({
    requested: Object.keys(req.body),
    allowed: UPDATE_BLOG_INPUT,
    option: 'every',
  })

  if (!isAllValidFields)
    errorGenerator({
      statusCode: 400,
      message: '블로그 수정 키 값 에러',
      allowedKeys: UPDATE_BLOG_INPUT,
    })

  const { blogId } = req.params

  const foundBlog = await BlogService.getBlogById(Number(blogId))
  if (!foundBlog) errorGenerator({ statusCode: 404, message: '블로그 없음' })

  const { id: user_id } = req.foundUser
  if (foundBlog.user_id !== user_id)
    errorGenerator({ statusCode: 403, message: '블로그 유저 일치하지 않음' })

  const updatedBlog = await BlogService.updateBlog({ id: Number(blogId), ...req.body })

  res.status(201).json({ updatedBlog })
})

const deleteBlog = errorWrapper(async (req: Request, res: Response) => {
  const { blogId } = req.params

  const foundBlog = await BlogService.getBlogById(Number(blogId))
  if (!foundBlog) errorGenerator({ statusCode: 404, message: '블로그 없음' })

  const { id: user_id } = req.foundUser
  if (foundBlog.user_id !== user_id)
    errorGenerator({ statusCode: 403, message: '블로그 유저 일치하지 않음' })

  const deletedBlog = await BlogService.deleteBlog(Number(blogId))

  res.status(201).json({ deletedBlog })
})

const handleLikes = errorWrapper(async (req: Request, res: Response) => {
  const { blogId } = req.params

  const foundBlog = await BlogService.getBlogById(Number(blogId))
  if (!foundBlog) errorGenerator({ statusCode: 404, message: '블로그 없음' })

  const { id: user_id } = req.foundUser
  const likedResult = await BlogService.handleLikes(Number(blogId), user_id)

  res.status(201).json({ likedResult })
})

const handleBookmarks = errorWrapper(async (req: Request, res: Response) => {
  const { blogId } = req.params

  const foundBlog = await BlogService.getBlogById(Number(blogId))
  if (!foundBlog) errorGenerator({ statusCode: 404, message: '블로그 없음' })

  const { id: user_id } = req.foundUser
  const bookmarkedResult = await BlogService.handleBookmarks(Number(blogId), user_id)

  res.status(201).json({ bookmarkedResult })
})

export default {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  handleLikes,
  handleBookmarks,
}
