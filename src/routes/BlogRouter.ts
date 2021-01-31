import { Router } from 'express'
import { validateToken } from '../middlewares'
import { BlogController } from '../controllers'

const router = Router()

router.get('/', BlogController.getBlogs)
router.post('/', validateToken, BlogController.createBlog)
// router.post('/:blogId/likes')
// router.post('/:blogId/bookmarks')
router.put('/:blogId', validateToken, BlogController.updateBlog)
router.delete('/:blogId', validateToken, BlogController.deleteBlog)

export default router
