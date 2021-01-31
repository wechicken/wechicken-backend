import { Router } from 'express'
import { validateToken } from '../middlewares'
import { BlogController } from '../controllers'

const router = Router()

router.get('/', BlogController.getBlogs)
router.post('/', validateToken, BlogController.createBlog)
router.post('/:blogId/likes', validateToken, BlogController.handleLikes)
router.post('/:blogId/bookmarks', validateToken, BlogController.handleBookmarks)
router.put('/:blogId', validateToken, BlogController.updateBlog)
router.delete('/:blogId', validateToken, BlogController.deleteBlog)

export default router
