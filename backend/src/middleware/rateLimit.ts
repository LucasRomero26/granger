import rateLimit from 'express-rate-limit'
import { env } from '../config/env'

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
})

// Auth rate limiter with temporary lockout to mitigate brute-force attacks
export const authRateLimiter = rateLimit({
  windowMs: env.AUTH_BLOCK_DURATION_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Account locked for 15 minutes.' },
  skipSuccessfulRequests: true,
})

export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many password reset requests. Try again in 1 hour.' },
})

export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many accounts created. Try again later.' },
})

export const oauthCallbackRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
})

// Email confirmation code verification: short numeric token (10^8 entropy).
// Keep brute-force infeasible even across multiple IPs.
export const confirmAccountRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many confirmation attempts. Try again later.' },
})
