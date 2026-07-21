import type { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Wrap an async (or sync) Express route handler so that rejected promises are
 * forwarded to `next()` and reach the centralized error handler.
 *
 * Required for Express 4 (Express 5 forwards rejected promises
 * automatically, but we're on Express 4.21). Without this wrapper,
 * a rejected promise in an async controller results in an
 * "Unhandled Rejection" and the response hangs until the client
 * times out — the error handler is never invoked and no 4xx/5xx is
 * sent to the client.
 *
 * Accepts both async handlers (that return a Promise) and sync
 * handlers (that return void), so it is safe to wrap any controller.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

