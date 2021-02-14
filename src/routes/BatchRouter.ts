import { Router } from 'express'
import { validateToken } from '../middlewares'
import { BatchController } from '../controllers'

const router = Router()

router.get('/blogs', validateToken, BatchController.getWeekBlogs)
// router.post('/', validateToken, BatchController.createBatch)
router.put('/', validateToken, BatchController.updateBatch)

export default router
