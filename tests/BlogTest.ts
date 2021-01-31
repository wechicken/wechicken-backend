import { request, prisma, BATCHES_COUNT, USERS_COUNT, BLOGS_COUNT } from './config'
import mockData from './data/data.json'

const BlogTest = () =>
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

    describe('GET /blogs 테스트', () => {
      test.each`
        offset | limit  | expected_blogs_count
        ${0}   | ${100} | ${100}
        ${10}  | ${30}  | ${30}
        ${50}  | ${50}  | ${50}
      `('페이지네이션 테스트', async ({ offset, limit, expected_blogs_count }) => {
        const response = await request.get('/blogs').query({ offset, limit })
        const { blogs } = response.body

        expect(blogs.length).toBe(expected_blogs_count)
      })

      test.each`
        batch
        ${1}
        ${2}
        ${3}
      `('기수 검색 테스트', async ({ batch }) => {
        const response = await request.get('/blogs').query({ batch, limit: 100 })
        const { blogs } = response.body

        const filteredBlogs = mockData.blogs.filter((blog) => {
          const user = mockData.users[blog.user_id - 1]
          const batch_id = user.batch_id - 1
          const nth = mockData.batches[batch_id].nth

          return nth === batch
        })

        expect(blogs.length).toBe(filteredBlogs.length)
      })

      test.each`
        keyword
        ${'bre'}
        ${'computer'}
        ${'a'}
      `('키워드(이름, 글 제목) 검색 테스트', async ({ keyword }) => {
        const response = await request.get('/blogs').query({ keyword, limit: 100 })
        const { blogs } = response.body

        const filteredBlogs = mockData.blogs.filter((blog) => {
          const regExp = new RegExp(keyword, 'gi')
          const userName = mockData.users[blog.user_id - 1].name
          return blog.title.match(regExp) || userName.match(regExp)
        })

        expect(blogs.length).toBe(filteredBlogs.length)
      })

      test.each`
        batch | keyword
        ${1}  | ${'computer'}
        ${2}  | ${'computer'}
        ${3}  | ${'computer'}
        ${1}  | ${'Kari'}
        ${2}  | ${'Kari'}
        ${3}  | ${'Kari'}
      `('기수, 키워드 동시 검색 테스트', async ({ batch, keyword }) => {
        const response = await request.get('/blogs').query({ batch, keyword, limit: 100 })
        const { blogs } = response.body

        const filteredBlogs = mockData.blogs.filter((blog) => {
          const user = mockData.users[blog.user_id - 1]
          const batch_id = user.batch_id - 1
          const nth = mockData.batches[batch_id].nth

          const regExp = new RegExp(keyword, 'gi')
          const userName = user.name

          return nth === batch && (blog.title.match(regExp) || userName.match(regExp))
        })

        expect(blogs.length).toBe(filteredBlogs.length)
      })

      test.each`
        batch | keyword       | offset | limit
        ${1}  | ${''}         | ${30}  | ${30}
        ${1}  | ${'computer'} | ${0}   | ${15}
        ${2}  | ${'computer'} | ${10}  | ${30}
        ${2}  | ${'computer'} | ${5}   | ${5}
        ${3}  | ${'computer'} | ${5}   | ${10}
      `('검색 통합 테스트', async ({ batch, keyword, offset, limit }) => {
        const response = await request.get('/blogs').query({ batch, keyword, offset, limit })
        const { blogs } = response.body

        const filteredBlogs = mockData.blogs
          .filter((blog) => {
            const user = mockData.users[blog.user_id - 1]
            const batch_id = user.batch_id - 1
            const nth = mockData.batches[batch_id].nth

            const regExp = new RegExp(keyword, 'gi')
            const userName = user.name

            return nth === batch && (blog.title.match(regExp) || userName.match(regExp))
          })
          .slice(offset, offset + limit)

        expect(blogs.length).toBe(filteredBlogs.length)
      })
    })

    describe('POST /blogs 테스트', () => {
      test.each`
        title        | link              | written_date    | user_gmail
        ${'테스트1'} | ${'http://link1'} | ${'2021-02-06'} | ${mockData.users[0].gmail}
        ${'테스트2'} | ${'http://link2'} | ${'2021-02-07'} | ${mockData.users[1].gmail}
        ${'테스트3'} | ${'http://link3'} | ${'2021-02-08'} | ${mockData.users[2].gmail}
      `('블로그 생성 성공 테스트', async ({ title, link, written_date, user_gmail }) => {
        const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
        const { token } = loginResponse.body

        const blogResponse = await request
          .post('/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send({ title, link, written_date })
        const { createdBlog } = blogResponse.body

        expect(createdBlog).toHaveProperty('title', title)
        expect(createdBlog).toHaveProperty('link', link)
        expect(createdBlog.written_date).toBeTruthy()
      })

      test.each`
        input                                                                       | user_gmail
        ${{ title: '블로그 생성 키 값 에러 테스트1' }}                              | ${mockData.users[0].gmail}
        ${{ link: '블로그 생성 키 값 에러 테스트2' }}                               | ${mockData.users[0].gmail}
        ${{ written_date: '블로그 생성 키 값 에러 테스트3' }}                       | ${mockData.users[0].gmail}
        ${{ title: '블로그 생성 키 값 에러 테스트4', link: 'http://에러 테스트2' }} | ${mockData.users[0].gmail}
      `('블로그 생성 키 값 에러 테스트', async ({ input, user_gmail }) => {
        const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
        const { token } = loginResponse.body

        try {
          const blogResponse = await request
            .post('/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(input)
        } catch (e) {
          expect(e.statusCode).toBe(400)
          expect(e.message).toBe('블로그 생성 키 값 에러')
        }
      })
    })

    describe('PUT /blogs/:blogId 테스트', () => {
      test.each`
        blog_id | title           | link                  | written_date    | user_gmail
        ${101}  | ${'수정 성공1'} | ${'http://수정링크1'} | ${'2021-03-01'} | ${mockData.users[0].gmail}
        ${102}  | ${'수정 성공2'} | ${'http://수정링크2'} | ${'2021-03-02'} | ${mockData.users[1].gmail}
        ${103}  | ${'수정 성공3'} | ${'http://수정링크3'} | ${'2021-03-03'} | ${mockData.users[2].gmail}
      `('블로그 수정 성공 테스트', async ({ blog_id, title, link, written_date, user_gmail }) => {
        const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
        const { token } = loginResponse.body

        const blogResponse = await request
          .put(`/blogs/${blog_id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ title, link, written_date })

        const { updatedBlog } = blogResponse.body
        expect(updatedBlog).toHaveProperty('title', title)
        expect(updatedBlog).toHaveProperty('link', link)
        expect(updatedBlog.written_date).toBeTruthy()
        expect(updatedBlog.updated_at).toBeTruthy()
      })

      test.each`
        blog_id | input                                                   | user_gmail
        ${101}  | ${{ title: '키 값 에러 1' }}                            | ${mockData.users[0].gmail}
        ${102}  | ${{ link: '키 값 에러 2' }}                             | ${mockData.users[1].gmail}
        ${103}  | ${{ link: '키 값 에러 3', written_date: '2020-02-01' }} | ${mockData.users[2].gmail}
      `('블로그 수정 키 값 에러 테스트', async ({ blog_id, input, user_gmail }) => {
        const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
        const { token } = loginResponse.body

        try {
          const blogResponse = await request
            .put(`/blogs/${blog_id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(input)

          const { updatedBlog } = blogResponse.body
        } catch (e) {
          expect(e.statusCode).toBe(400)
          expect(e.message).toBe('블로그 수정 키 값 에러')
        }
      })

      test.each`
        blog_id | title           | link                  | written_date    | user_gmail
        ${104}  | ${'수정 에러1'} | ${'http://수정링크1'} | ${'2021-03-01'} | ${mockData.users[1].gmail}
        ${105}  | ${'수정 에러2'} | ${'http://수정링크2'} | ${'2021-03-02'} | ${mockData.users[2].gmail}
        ${106}  | ${'수정 에러3'} | ${'http://수정링크3'} | ${'2021-03-03'} | ${mockData.users[3].gmail}
      `(
        '없는 블로그 수정 에러 테스트',
        async ({ blog_id, title, link, written_date, user_gmail }) => {
          const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
          const { token } = loginResponse.body

          try {
            const blogResponse = await request
              .put(`/blogs/${blog_id}`)
              .set('Authorization', `Bearer ${token}`)
              .send({ title, link, written_date })

            const { updatedBlog } = blogResponse.body
          } catch (e) {
            expect(e.statusCode).toBe(404)
            expect(e.message).toBe('블로그 없음')
          }
        }
      )

      test.each`
        blog_id | title           | link                  | written_date    | user_gmail
        ${101}  | ${'수정 에러1'} | ${'http://수정링크1'} | ${'2021-03-01'} | ${mockData.users[1].gmail}
        ${102}  | ${'수정 에러2'} | ${'http://수정링크2'} | ${'2021-03-02'} | ${mockData.users[2].gmail}
        ${103}  | ${'수정 에러3'} | ${'http://수정링크3'} | ${'2021-03-03'} | ${mockData.users[3].gmail}
      `(
        '블로그 수정 유저 권한 에러 테스트',
        async ({ blog_id, title, link, written_date, user_gmail }) => {
          const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
          const { token } = loginResponse.body

          try {
            const blogResponse = await request
              .put(`/blogs/${blog_id}`)
              .set('Authorization', `Bearer ${token}`)
              .send({ title, link, written_date })

            const { updatedBlog } = blogResponse.body
          } catch (e) {
            expect(e.statusCode).toBe(403)
            expect(e.message).toBe('블로그 유저 일치하지 않음')
          }
        }
      )
    })

    describe('POST /blogs/:blogId/likes 테스트', () => {
      test.each`
        blog_id | user_gmail                 | expected_liked_status
        ${101}  | ${mockData.users[1].gmail} | ${true}
        ${102}  | ${mockData.users[2].gmail} | ${true}
        ${103}  | ${mockData.users[3].gmail} | ${true}
        ${101}  | ${mockData.users[4].gmail} | ${true}
        ${102}  | ${mockData.users[5].gmail} | ${true}
        ${103}  | ${mockData.users[6].gmail} | ${true}
        ${101}  | ${mockData.users[4].gmail} | ${false}
        ${102}  | ${mockData.users[5].gmail} | ${false}
        ${103}  | ${mockData.users[6].gmail} | ${false}
      `('좋아요 기능 성공 테스트', async ({ blog_id, user_gmail, expected_liked_status }) => {
        const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
        const { token } = loginResponse.body

        const blogResponse = await request
          .post(`/blogs/${blog_id}/likes`)
          .set('Authorization', `Bearer ${token}`)

        const { likedResult } = blogResponse.body
        expect(likedResult).toHaveProperty('status', expected_liked_status)
      })

      test.each`
        blog_id | user_gmail
        ${104}  | ${mockData.users[1].gmail}
        ${105}  | ${mockData.users[2].gmail}
        ${106}  | ${mockData.users[3].gmail}
      `('없는 블로그 좋아요 에러 테스트', async ({ blog_id, user_gmail }) => {
        const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
        const { token } = loginResponse.body

        try {
          const blogResponse = await request
            .post(`/blogs/${blog_id}/likes`)
            .set('Authorization', `Bearer ${token}`)

          const { likedResult } = blogResponse.body
        } catch (e) {
          expect(e.statusCode).toBe(404)
          expect(e.message).toBe('블로그 없음')
        }
      })
    })

    describe('POST /blogs/:blogId/bookmarks 테스트', () => {
      test.each`
        blog_id | user_gmail                 | expected_bookmarked_status
        ${101}  | ${mockData.users[1].gmail} | ${true}
        ${102}  | ${mockData.users[2].gmail} | ${true}
        ${103}  | ${mockData.users[3].gmail} | ${true}
        ${101}  | ${mockData.users[4].gmail} | ${true}
        ${102}  | ${mockData.users[5].gmail} | ${true}
        ${103}  | ${mockData.users[6].gmail} | ${true}
        ${101}  | ${mockData.users[4].gmail} | ${false}
        ${102}  | ${mockData.users[5].gmail} | ${false}
        ${103}  | ${mockData.users[6].gmail} | ${false}
      `('북마크 기능 성공 테스트', async ({ blog_id, user_gmail, expected_bookmarked_status }) => {
        const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
        const { token } = loginResponse.body

        const blogResponse = await request
          .post(`/blogs/${blog_id}/bookmarks`)
          .set('Authorization', `Bearer ${token}`)

        const { bookmarkedResult } = blogResponse.body
        expect(bookmarkedResult).toHaveProperty('status', expected_bookmarked_status)
      })

      test.each`
        blog_id | user_gmail
        ${104}  | ${mockData.users[1].gmail}
        ${105}  | ${mockData.users[2].gmail}
        ${106}  | ${mockData.users[3].gmail}
      `('없는 블로그 북마크 에러 테스트', async ({ blog_id, user_gmail }) => {
        const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
        const { token } = loginResponse.body

        try {
          const blogResponse = await request
            .post(`/blogs/${blog_id}/bookmarks`)
            .set('Authorization', `Bearer ${token}`)

          const { bookmarkedResult } = blogResponse.body
        } catch (e) {
          expect(e.statusCode).toBe(404)
          expect(e.message).toBe('블로그 없음')
        }
      })
    })

    describe('DELETE /blogs/:blogId 테스트', () => {
      test.each`
        blog_id | user_gmail
        ${101}  | ${mockData.users[0].gmail}
        ${102}  | ${mockData.users[1].gmail}
        ${103}  | ${mockData.users[2].gmail}
      `('블고그 삭제 성공 테스트', async ({ blog_id, user_gmail }) => {
        const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
        const { token } = loginResponse.body

        const blogResponse = await request
          .delete(`/blogs/${blog_id}`)
          .set('Authorization', `Bearer ${token}`)

        const { deletedBlog } = blogResponse.body
        expect(deletedBlog).toHaveProperty('id', blog_id)
      })

      test.each`
        blog_id | user_gmail
        ${104}  | ${mockData.users[0].gmail}
        ${105}  | ${mockData.users[1].gmail}
        ${106}  | ${mockData.users[2].gmail}
      `('없는 블로그 삭제 에러 테스트', async ({ blog_id, user_gmail }) => {
        const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
        const { token } = loginResponse.body

        try {
          const blogResponse = await request
            .delete(`/blogs/${blog_id}`)
            .set('Authorization', `Bearer ${token}`)

          const { deletedBlog } = blogResponse.body
        } catch (e) {
          expect(e.statusCode).toBe(404)
          expect(e.message).toBe('블로그 없음')
        }
      })

      test.each`
        blog_id | user_gmail
        ${101}  | ${mockData.users[0].gmail}
        ${102}  | ${mockData.users[1].gmail}
        ${103}  | ${mockData.users[2].gmail}
      `('블고그 삭제 유저 권한 에러 테스트', async ({ blog_id, user_gmail }) => {
        const loginResponse = await request.post('/users/login').send({ gmail: user_gmail })
        const { token } = loginResponse.body

        try {
          const blogResponse = await request
            .delete(`/blogs/${blog_id}`)
            .set('Authorization', `Bearer ${token}`)

          const { deletedBlog } = blogResponse.body
        } catch (e) {
          expect(e.statusCode).toBe(403)
          expect(e.message).toBe('블로그 유저 일치하지 않음')
        }
      })
    })
  })

export default BlogTest
