import jwt from 'jsonwebtoken'
import { UserService } from '../services'
import { errorWrapper, errorGenerator } from '../errors'
import { ValidationType, validateFields } from '../utils/validation'
import { Request, Response } from 'express'
import {
  createUserInput,
  CreateUserInput,
  userUniqueSearchInput,
  UserUniqueSearchInput,
} from '../interfaces/User'
import { ValidationError } from 'class-validator'
const { AUTH_TOKEN_SALT } = process.env

const signUp = errorWrapper(async (req: Request, res: Response) => {
  const user = new CreateUserInput()
  const validationErrors: ValidationError[] = await validateFields(user, req, {
    type: ValidationType.Body,
  })
  if (validationErrors.length) errorGenerator({ statusCode: 400, validationErrors })

  const { gmail }: createUserInput = req.body
  const foundUser = await UserService.findUser({ gmail })
  if (foundUser) errorGenerator({ statusCode: 409 })

  const { id, name, batches } = await UserService.createUser(req.body)
  res.status(201).json({
    user: { id, name, batch: { nth: batches.nth, batch_type: batches.batch_types.name } },
  })
})

const logIn = errorWrapper(async (req: Request, res: Response) => {
  const userUniqueSearchInput = new UserUniqueSearchInput()
  const validationErrors: ValidationError[] = await validateFields(userUniqueSearchInput, req, {
    type: ValidationType.Body,
  })
  if (validationErrors.length) errorGenerator({ statusCode: 400, validationErrors })

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
