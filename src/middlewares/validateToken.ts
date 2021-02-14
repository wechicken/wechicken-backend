import jwt from 'jsonwebtoken'
import { errorGenerator, errorWrapper } from '../errors'
import { UserService } from '../services'
import { Request, Response, NextFunction } from 'express'
import { batches, users, batch_types } from '@prisma/client'

const { AUTH_TOKEN_SALT } = process.env

export interface Token {
  id: number
}

declare global {
  module Express {
    export interface Request {
      foundUser: users & {
        batches: batches & {
          batch_types: batch_types
        }
      }
    }
  }
}

const validateToken = errorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  if (!authorization && req.baseUrl === '/blogs' && req.method === 'GET') return next()
  if (!authorization) errorGenerator({ statusCode: 401, message: '유효하지 않은 토큰' })

  const [bearer, token] = authorization.split(' ')
  const { id } = jwt.verify(token, AUTH_TOKEN_SALT) as Token

  const foundUser = await UserService.findUser({ id })
  if (!foundUser) errorGenerator({ statusCode: 401, message: '유효하지 않은 토큰' })

  req.foundUser = foundUser
  return next()
})

export default validateToken
