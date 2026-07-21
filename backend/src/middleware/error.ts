import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '../config/logger'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class ValidationError extends AppError {
  constructor(public errors: { field: string; message: string }[]) {
    super(400, 'Validation error')
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message)
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message)
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message)
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message)
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'Route not found' })
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  logger.error({ err }, 'Request error')

  // Known operational errors (returned with their status code)
  if (err instanceof AppError) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json({ error: err.message, errors: err.errors })
    }
    return res.status(err.statusCode).json({ error: err.message })
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))
    return res.status(400).json({ error: 'Validation error', errors })
  }

  // JWT errors
  if (err instanceof Error) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    if (err.name === 'NotBeforeError') {
      return res.status(401).json({ error: 'Token not active yet' })
    }
  }

  // Generic 500 error
  const message = err instanceof Error ? err.message : 'Internal server error'
  res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Internal server error' : message })
}
