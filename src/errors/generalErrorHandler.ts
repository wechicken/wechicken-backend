import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import { ErrorWithStatusCode } from './errorGenerator'

const generalErrorHandler: ErrorRequestHandler = (
  err: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, statusCode, validationErrors } = err
  const errorResponse = Object.assign(
    {
      message,
    },
    statusCode === 400 &&
      validationErrors.length && {
        validationErrors: validationErrors.map(({ property, constraints }) => ({
          [property]: constraints,
        })),
      }
  )
  console.error(err)
  res.status(statusCode || 500).json(errorResponse)
}

export default generalErrorHandler
