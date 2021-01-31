import { Router, Request, Response } from 'express'
import UserRouter from './UserRouter'
import BlogRouter from './BlogRouter'
import BatchRouter from './BatchRouter'

const router = Router()

router.use('/users', UserRouter)
router.use('/blogs', BlogRouter)
router.use('/batches', BatchRouter)

export default router