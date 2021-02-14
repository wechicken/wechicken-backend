import { request, prisma, BATCHES_COUNT, USERS_COUNT, BLOGS_COUNT } from './config'
import mockData from './data/data.json'

const BatchTest = () =>
  describe('Batch API Test', () => {
    describe('Blog API Test', () => {
      beforeAll(async () => {
        console.log('테스트 데이터베이스 초기화')

        await prisma.$queryRaw('SET FOREIGN_KEY_CHECKS=0')
        await prisma.$queryRaw('TRUNCATE users')
        await prisma.$queryRaw('TRUNCATE blogs')
        await prisma.$queryRaw('TRUNCATE batches')
        await prisma.$queryRaw('TRUNCATE likes')
        await prisma.$queryRaw('TRUNCATE follows')
        await prisma.$queryRaw('TRUNCATE bookmarks')
        await prisma.$queryRaw('SET FOREIGN_KEY_CHECKS=1')
        await prisma.$queryRaw('ALTER TABLE users AUTO_INCREMENT=1')
        await prisma.$queryRaw('ALTER TABLE blogs AUTO_INCREMENT=1')
        await prisma.$queryRaw('ALTER TABLE batches AUTO_INCREMENT=1')
        await prisma.$queryRaw('ALTER TABLE likes AUTO_INCREMENT=1')
        await prisma.$queryRaw('ALTER TABLE follows AUTO_INCREMENT=1')
        await prisma.$queryRaw('ALTER TABLE bookmarks AUTO_INCREMENT=1')

        const batches = await prisma.batches.createMany({ data: mockData.batches })
        const users = await prisma.users.createMany({ data: mockData.users })
        const blogs = await prisma.blogs.createMany({ data: mockData.blogs })

        const isEveryMockDataWritten = [
          batches.count === BATCHES_COUNT,
          users.count === USERS_COUNT,
          blogs.count === BLOGS_COUNT,
        ].every((bool) => bool)

        if (isEveryMockDataWritten) console.log('목 데이터 쓰기 완료')
      })

      afterAll(async () => {
        console.log('테스트 데이터베이스 연결 종료')
        await prisma.$disconnect()
      })

      test('내 기수 페이지 API', async () => {
        const loginResponse = await request
          .post('/users/login')
          .send({ gmail: mockData.users[0].gmail })
        const { token } = loginResponse.body

        const batchResponse = await request
          .get('/batches/blogs')
          .set('Authorization', `Bearer ${token}`)
        const { blogs } = batchResponse.body

        console.log(blogs)
        expect(blogs.length).toBe(0)
      })
    })
  })

export default BatchTest
