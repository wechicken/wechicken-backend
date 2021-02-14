import { errorGenerator, errorWrapper } from '../errors'
import { Request, Response } from 'express'
import { BatchService } from '../services'
import { updateBatchInput, UPDATE_BATCH_INPUT } from '../interfaces/Batch'
import { validateFields } from '../utils'

const getWeekBlogs = errorWrapper(async (req: Request, res: Response) => {
  const { batch_id } = req.foundUser
  const { selected_date } = req.query

  const { usersWithPenalty, blogsByDays } = await BatchService.getWeekBlogs({
    selected_date: selected_date as string,
    batch_id,
  })

  res.status(200).json({ usersWithPenalty, blogsByDays })
})

// const createBatch = errorWrapper(async (req: Request, res: Response) => {
//   const { batches } = req.foundUser
//   const foundBatch = await BatchService.findBatchById(batches.id)
// })

const updateBatch = errorWrapper(async (req: Request, res: Response) => {
  const { is_admin, batch_id, id: userIdFromToken } = req.foundUser
  if (!is_admin) errorGenerator({ statusCode: 403, message: '기수정보 수정 권한 없음' })

  const isAllValidKeys = validateFields({
    requested: Object.keys(req.body),
    allowed: UPDATE_BATCH_INPUT,
    option: 'some',
  })

  if (!isAllValidKeys)
    errorGenerator({
      statusCode: 400,
      message: '기수 정보 업데이트 키 값 에러',
      allowedKeys: UPDATE_BATCH_INPUT,
    })

  const foundBatch = await BatchService.findBatchById(batch_id)

  if (userIdFromToken !== foundBatch.manager_id)
    errorGenerator({ statusCode: 403, message: '기수정보 수정권한 없음' })

  const updatedBatch = await BatchService.updateBatch({ id: batch_id, ...req.body })

  res.status(201).json({ updatedBatch })
})

export default {
  getWeekBlogs,
  // createBatch,
  updateBatch,
}
