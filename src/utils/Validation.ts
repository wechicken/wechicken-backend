import { validate, ValidationError } from 'class-validator'
import { Request } from 'express'

export const ValidationType = {
  Body: 'body',
  Query: 'query',
  Params: 'params',
}

interface validateOption {
  type: string
  skip?: boolean
}

export const validateFields = <T extends object>(
  input: T,
  req: Request,
  validateOption: validateOption
): Promise<ValidationError[]> => {
  const typeMapper = {
    body: req.body,
    query: req.query,
    params: req.params,
  }

  for (const [key, value] of Object.entries(typeMapper[validateOption.type])) {
    input[key] = value
  }

  return validate(input, { skipMissingProperties: validateOption.skip || false })
}

export default {
  ValidationType,
  validateFields,
}
