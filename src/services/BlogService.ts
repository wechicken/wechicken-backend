import prisma from '../prisma'
import { blogsSearchOption, createBlogInput, updateBlogInput } from '../interfaces/Blog'
import { Blog, time } from '../utils'

const getBlogs = (query: blogsSearchOption, user_id: number) => {
  const { where, offset, limit } = Blog.makeBlogQueryOption(query)

  return prisma.blogs.findMany({
    where,
    skip: offset,
    take: limit,
    select: {
      id: true,
      link: true,
      title: true,
      subtitle: true,
      thumbnail: true,
      written_date: true,
      likes: !!user_id && {
        where: { user_id, status: true },
        select: {
          user_id: true,
          status: true,
        },
      },
      bookmarks: !!user_id && {
        where: { user_id, status: true },
        select: {
          user_id: true,
          status: true,
        },
      },
      users: {
        select: {
          id: true,
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
  return prisma.blogs.create({
    data: {
      ...data,
      written_date: time.convertTimeWithUTC(data.written_date),
      created_at: time.currentTime(),
    },
  })
}

const updateBlog = (data: updateBlogInput) => {
  const { id, ...requestedFields } = data
  return prisma.blogs.update({
    where: { id },
    data: {
      ...requestedFields,
      written_date: time.convertTimeWithUTC(requestedFields.written_date),
    },
  })
}

const deleteBlog = (id: number) => {
  return prisma.blogs.update({ where: { id }, data: { deleted_at: time.currentTime() } })
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
