import type { ZodSchema } from 'zod'
import { validate } from './validate'

export const validateBody = (schema: ZodSchema) => validate(schema, 'body')
export const validateParams = (schema: ZodSchema) => validate(schema, 'params')
export const validateQuery = (schema: ZodSchema) => validate(schema, 'query')
