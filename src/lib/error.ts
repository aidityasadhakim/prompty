export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export function handleError(error: unknown): {
  error: { code: string; message: string }
} {
  if (error instanceof AppError) {
    return {
      error: {
        code: error.code,
        message: error.message,
      },
    }
  }

  if (error instanceof Error) {
    console.error('Unexpected error:', error)
    return {
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'An unexpected error occurred',
      },
    }
  }

  console.error('Unknown error:', error)
  return {
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
    },
  }
}

export function createValidationError(message: string): AppError {
  return new AppError(message, ERROR_CODES.VALIDATION_ERROR, 400)
}

export function createNotFoundError(message: string): AppError {
  return new AppError(message, ERROR_CODES.NOT_FOUND, 404)
}

export function createUnauthorizedError(message: string): AppError {
  return new AppError(message, ERROR_CODES.UNAUTHORIZED, 401)
}

export function createForbiddenError(message: string): AppError {
  return new AppError(message, ERROR_CODES.FORBIDDEN, 403)
}
