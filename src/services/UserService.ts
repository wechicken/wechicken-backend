import prisma from '../prisma'
import { createUserInput, userUniqueSearchInput } from '../interfaces/User'

const createUser = (data: createUserInput) => {
  const { nth, batch_type_id, ...userInput } = data

  return prisma.users.create({
    data: {
      batches: {
        connectOrCreate: {
          where: { nth },
          create: { nth, batch_type_id, is_page_opened: false },
        },
      },
      ...userInput,
    },
    include: { batches: { include: { batch_types: true } } },
  })
}

const findUser = (data: userUniqueSearchInput) => {
  const [uniqueKey] = Object.keys(data)

  return prisma.users.findUnique({
    where: { [uniqueKey]: data[uniqueKey] },
    include: { batches: { include: { batch_types: true } } },
  })
}

export default {
  createUser,
  findUser,
}
