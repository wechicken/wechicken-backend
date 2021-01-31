import jwt from 'jsonwebtoken'
import { UserService } from '../services'
import { errorWrapper, errorGenerator } from '../errors'
import { validateFields } from '../utils'
import { Request, Response } from 'express'
import {
  createUserInput,
  CREATE_USER_INPUT,
  userUniqueSearchInput,
  USER_UNIQUE_SEARCH_INPUT,
} from '../interfaces/User'
const { AUTH_TOKEN_SALT } = process.env

const signUp = errorWrapper(async (req: Request, res: Response) => {
  const isAllValidFields = validateFields({
    requested: Object.keys(req.body),
    allowed: CREATE_USER_INPUT,
    option: 'every',
  })

  if (!isAllValidFields)
    errorGenerator({
      statusCode: 400,
      message: '유저 회원가입 키 값 에러',
      allowedKeys: CREATE_USER_INPUT,
    })

  const { gmail }: createUserInput = req.body

  const foundUser = await UserService.findUser({ gmail })
  if (foundUser) errorGenerator({ statusCode: 409 })

  const { id, name, batches } = await UserService.createUser(req.body)
  res.status(201).json({
    user: { id, name, batch: { nth: batches.nth, batch_type: batches.batch_types.name } },
  })
})

const logIn = errorWrapper(async (req: Request, res: Response) => {
  const isValidField = validateFields({
    requested: Object.keys(req.body),
    allowed: USER_UNIQUE_SEARCH_INPUT,
    option: 'some',
  })

  if (!isValidField)
    errorGenerator({
      statusCode: 400,
      message: '유저 로그인 키 값 에러',
      allowedKeys: USER_UNIQUE_SEARCH_INPUT,
    })

  const { gmail }: userUniqueSearchInput = req.body

  const foundUser = await UserService.findUser({ gmail })
  if (!foundUser) errorGenerator({ statusCode: 400, message: '해당 유저 존재하지 않음' })

  const token = jwt.sign({ id: foundUser.id }, AUTH_TOKEN_SALT)
  res.status(200).json({ token })
})

export default {
  signUp,
  logIn,
}
