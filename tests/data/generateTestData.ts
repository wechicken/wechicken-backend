import faker from 'faker'
import fs from 'fs'
import { BATCHES_COUNT, USERS_COUNT, BLOGS_COUNT } from '../config'

const getRandomIntInclusive = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const BLOG_TYPES = {
  1: 'velog',
  2: 'medium',
  3: 'tistory',
  4: 'github',
}

const createBatches = (length: number) =>
  [...new Array(length)].map((_, idx) => {
    return {
      nth: idx + 1,
      batch_type_id: idx + 1,
      is_page_opened: false,
    }
  })

const createUsers = (length: number) =>
  [...new Array(length)].map((_, idx) => {
    const blog_type_id = getRandomIntInclusive(1, 4)
    const name = faker.name.firstName() + idx

    return {
      name,
      gmail: `${name}@test.com`,
      gmail_id: faker.random.uuid(),
      is_admin: false,
      is_group_joined: false,
      blog_address: `https://${BLOG_TYPES[blog_type_id]}.com/${name}`,
      blog_type_id,
      batch_id: getRandomIntInclusive(1, 3),
    }
  })

const createBlogs = (length: number) =>
  [...new Array(length)].map((_) => {
    return {
      user_id: getRandomIntInclusive(1, 10),
      title: faker.commerce.productName(),
      link: faker.internet.url(),
      written_date: new Date(
        `${2020}-${getRandomIntInclusive(1, 12)}-${getRandomIntInclusive(1, 30)}`
      ),
    }
  })

const generate = () => {
  const batches = createBatches(BATCHES_COUNT)
  const users = createUsers(USERS_COUNT)
  const blogs = createBlogs(BLOGS_COUNT)

  fs.writeFileSync('./data.json', JSON.stringify({ batches, users, blogs }, null, 2))
}

generate()
