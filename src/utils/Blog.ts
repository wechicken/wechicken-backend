import { blogsSearchOption } from '../interfaces/Blog'

const DEFAULT_SEARCH_OPTION = {
  offset: 0,
  limit: 30,
}

const DEFAULT_QUERY_OPTION = {
  deleted_at: null,
}

const getBlogQueryOption = <T>(key: string, value: T): object => {
  const prismaQueryMapper = {
    keyword: {
      OR: [{ title: { contains: value } }, { users: { name: { contains: value } } }],
    },
    batch: { users: { batches: { nth: Number(value) } } },
  }

  return prismaQueryMapper[key]
}

const makeBlogQueryOption = (searchOption: blogsSearchOption) => {
  const { offset, limit, ...restOptions } = searchOption

  const where = Object.assign(
    Object.entries(restOptions).reduce(
      (where, [key, value]) => Object.assign(where, getBlogQueryOption(key, value)),
      {}
    ),
    DEFAULT_QUERY_OPTION
  )

  return {
    offset: Number(offset) || DEFAULT_SEARCH_OPTION.offset,
    limit: Number(limit) || DEFAULT_SEARCH_OPTION.limit,
    where,
  }
}

export default {
  makeBlogQueryOption,
}
