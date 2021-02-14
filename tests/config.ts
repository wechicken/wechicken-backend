import supertest from 'supertest'
import app from '../src/app'
import prisma from '../src/prisma'
process.env.DATABASE_URL_DEV = process.env.DATABASE_URL_TEST

const request = supertest(app)

export const BATCHES_COUNT = 3
export const USERS_COUNT = 20
export const BLOGS_COUNT = 100

export { request, prisma }
