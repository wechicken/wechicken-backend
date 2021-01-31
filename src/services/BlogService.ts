import prisma from '../prisma'
import { blogsSearchOption, createBlogInput, updateBlogInput } from '../interfaces/Blog'
import { Blog } from '../utils'

const getBlogs = (query: blogsSearchOption) => {
  const { where, offset, limit } = Blog.makeBlogQueryOption(query)

  return prisma.blogs.findMany({
    where,
    skip: offset,
    take: limit,
    include: {
      users: {
        select: {
          name: true,
          batches: {
            select: {
              nth: true,
              batch_types: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { written_date: 'desc' },
  })
}

const getBlogById = (id: number) => {
  return prisma.blogs.findUnique({ where: { id }, include: { users: { select: { id: true } } } })
}

const createBlog = (data: createBlogInput) => {
  return prisma.blogs.create({ data: { ...data, written_date: new Date(data.written_date) } })
}

const updateBlog = (data: updateBlogInput) => {
  const { id, ...requestedFields } = data
  return prisma.blogs.update({
    where: { id: data.id },
    data: { ...requestedFields, written_date: new Date(requestedFields.written_date) },
  })
}

const deleteBlog = (id: number) => {
  return prisma.blogs.update({ where: { id }, data: { deleted_at: new Date() } })
}

const handleLikes = async (blog_id: number, user_id: number) => {
  const found = await prisma.likes.findFirst({
    where: { user_id, blog_id },
  })

  if (!found)
    return prisma.likes.create({
      data: { blog_id, user_id, status: true },
    })

  const { id, status } = found

  return prisma.likes.update({
    where: { id },
    data: { status: !status },
  })
}

const handleBookmarks = async (blog_id: number, user_id: number) => {
  const found = await prisma.bookmarks.findFirst({
    where: { user_id, blog_id },
  })

  if (!found)
    return prisma.bookmarks.create({
      data: { blog_id, user_id, status: true },
    })

  const { id, status } = found

  return prisma.bookmarks.update({
    where: { id },
    data: { status: !status },
  })
}

export default {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  handleLikes,
  handleBookmarks,
}
