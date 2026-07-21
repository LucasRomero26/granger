import { z } from 'zod'

/**
 * El backend responde las mutaciones con `{ message: string, ... }`.
 * Este schema valida esa forma y expone solo el `message` para evitar
 * pasar objetos al `toast.success()` (que rompe React con
 * "Objects are not valid as a React child").
 *
 * Ver: https://tanstack.com/query/latest/docs/framework/react/guides/queries
 *      https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export const messageResponseSchema = z.object({
  message: z.string(),
}).passthrough()

export type MessageResponse = z.infer<typeof messageResponseSchema>

/**
 * Extrae un `message` string de la respuesta del backend.
 * - Si data es string, lo devuelve tal cual (compat backwards).
 * - Si data es `{ message, ... }`, valida y devuelve `message`.
 * - Si no, devuelve el `fallback`.
 */
export function extractMessage(data: unknown, fallback: string): string {
  if (typeof data === 'string' && data.length > 0) return data
  if (data && typeof data === 'object') {
    const parsed = messageResponseSchema.safeParse(data)
    if (parsed.success && parsed.data.message) return parsed.data.message
  }
  return fallback
}
