import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'
import { ValidationError } from './error'

type ValidationTarget = 'body' | 'query' | 'params'

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const data = req[target]
    const result = schema.safeParse(data)
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))
      return next(new ValidationError(errors))
    }
    req[target] = result.data
    next()
  }
}
