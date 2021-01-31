import prisma from '../prisma'
import { blogsSearchOption, createBlogInput } from '../interfaces/Blog'

const DEFAULT_SEARCH_OPTION = {
  offset: 0,
  limit: 30,
}

const getBlogs = ({ offset, limit, title }: blogsSearchOption) => {
  const where = title ? { title: { contains: title } } : {}

  return prisma.blogs.findMany({
    where,
    skip: offset || DEFAULT_SEARCH_OPTION.offset,
    take: limit || DEFAULT_SEARCH_OPTION.limit,
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

const createBlog = (data: createBlogInput) => {
  return prisma.blogs.create({ data: { ...data, written_date: new Date(data.written_date) } })
}

const updateBlog = () => {}

const deleteBlog = () => {}

export default {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
}
