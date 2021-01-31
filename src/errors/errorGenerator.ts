const DEFAULT_HTTP_STATUS_MESSAGES = {
  400: 'Bad Requests',
  401: 'Unauthorized',
  403: 'Foribdden',
  404: 'Not Found',
  409: 'duplicate',
  500: 'Internal Server Error',
  503: 'Temporary Unavailable',
}

export interface ErrorWithStatusCode extends Error {
  statusCode?: number
}

const errorGenerator = ({ message = '', statusCode = 500 }: { message?: string, statusCode: number}): void => {
  const err: ErrorWithStatusCode = new Error(message || DEFAULT_HTTP_STATUS_MESSAGES[statusCode])
  err.statusCode = statusCode
  throw err
}

export default errorGenerator
