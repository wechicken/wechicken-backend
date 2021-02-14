import prisma from '../prisma'
import { getWeekBlogsInput, createBatchInput, updateBatchInput } from '../interfaces/Batch'
import { time } from '../utils'

const getWeekBlogs = async ({ selected_date, batch_id }: getWeekBlogsInput) => {
  const date = selected_date ? time.convertTimeWithUTC(selected_date) : time.currentTime()
  const firstOfWeek = time.getFirstDateOfWeek(date)
  const lastOfWeek = time.getLastDateOfWeek(date)

  const batch = await prisma.batches.findUnique({ where: { id: batch_id } })
  const users = await prisma.users.findMany({
    where: { batch_id, is_group_joined: true },
    select: {
      id: true,
      name: true,
      thumbnail: true,
      blogs: {
        where: {
          AND: [{ written_date: { gte: firstOfWeek } }, { written_date: { lte: lastOfWeek } }],
        },
        select: {
          written_date: true,
          link: true,
          title: true,
          thumbnail: true,
          users: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { written_date: 'desc' },
      },
    },
  })

  const usersWithPenalty = users.map(({ blogs, ...user }) => {
    const blogsCount = blogs.length

    return {
      penalty: blogsCount >= batch.count ? 0 : (batch.count - blogsCount) * batch.penalty,
      blogsCount,
      ...user,
    }
  })

  const blogsByDays = users
    .flatMap(({ blogs }) => blogs)
    .reduce(
      (byDays, blog) => {
        const day = time.getDayOfDate(blog.written_date)
        byDays[day].push(blog)

        return byDays
      },
      { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] }
    )

  return { usersWithPenalty, blogsByDays }
}

const findBatchById = (batch_id: number) => {
  return prisma.batches.findUnique({ where: { id: batch_id } })
}

// const createBatch = (data: createBatchInput) => {}

const updateBatch = (data: updateBatchInput) => {
  const { id, ...requestedFields } = data
  return prisma.batches.update({
    where: { id },
    data: requestedFields,
  })
}

export default {
  getWeekBlogs,
  findBatchById,
  // createBatch,
  updateBatch,
}
