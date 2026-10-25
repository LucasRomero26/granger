import type { Request, Response, NextFunction } from 'express'
import User, { type IUser } from '../models/User'
import { verifyAccessToken } from '../utils/jwt'
import { AuthenticationError } from './error'
import { env, isProduction } from '../config/env'

/**
 * Cookie SameSite policy for auth cookies.
 *
 * In production the frontend proxies /api to the backend (vercel.json), so
 * BACKEND_URL is the frontend origin and the cookies are first-party: 'lax'
 * keeps them on same-site requests and on top-level navigations.
 * If the API is reached on another registrable domain, the browser treats it
 * as cross-site and only 'none' + Secure lets the cookies through.
 */
function sameSitePolicy(): 'lax' | 'none' {
  if (!isProduction) return 'lax'

  const frontendHost = safeHostname(env.FRONTEND_URL)
  const backendHost = safeHostname(env.BACKEND_URL)
  if (!frontendHost || !backendHost) return 'none'
  if (frontendHost === backendHost) return 'lax'
  if (sameRegistrableDomain(frontendHost, backendHost)) return 'lax'
  return 'none'
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

function sameRegistrableDomain(a: string, b: string): boolean {
  const partsA = a.split('.').slice(-2).join('.')
  const partsB = b.split('.').slice(-2).join('.')
  return partsA !== '' && partsA === partsB
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

function extractToken(req: Request): string | null {
  // 1) Authorization: Bearer xxx
  const bearer = req.headers.authorization
  if (bearer && bearer.startsWith('Bearer ')) {
    return bearer.slice(7).trim()
  }
  // 2) Cookie: access_token (httpOnly)
  if (req.cookies?.access_token) {
    return req.cookies.access_token as string
  }
  return null
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req)
  if (!token) {
    return next(new AuthenticationError('Unauthorized'))
  }

  try {
    const decoded = verifyAccessToken(token)
    if (!decoded.id) {
      return next(new AuthenticationError('Invalid token'))
    }

    const user = await User.findById(decoded.id).select('_id name email avatar confirmed')
    if (!user) {
      return next(new AuthenticationError('Invalid token'))
    }

    req.user = user
    next()
  } catch {
    // Token verification or DB lookup failed. Reject the request with a
    // generic authentication error so we never leak the underlying reason
    // (e.g. malformed JWT vs. expired signature vs. unexpected DB error).
    next(new AuthenticationError('Invalid token'))
  }
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken?: string): void {
  const sameSite = sameSitePolicy()
  // For cross-site cookies ('sameSite: none') 'secure: true' is mandatory.
  // We already set secure=true in production; ensure it stays true when
  // sameSite=none regardless of NODE_ENV quirks (e.g. preview deploys).
  const secure = isProduction || sameSite === 'none'
  const baseOptions = {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    // Don't pin a domain: when cross-site, pinning the backend host prevents
    // the browser from sending the cookie to the API (since the request
    // originates from the frontend host). Leaving `domain` unset lets the
    // browser default to the exact host of the Set-Cookie response, which is
    // what we want for the API cookies.
    domain: undefined as string | undefined,
  }

  res.cookie('access_token', accessToken, {
    ...baseOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  })

  if (refreshToken) {
    res.cookie('refresh_token', refreshToken, {
      ...baseOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
  }
}

export function clearAuthCookies(res: Response): void {
  const sameSite = sameSitePolicy()
  const secure = isProduction || sameSite === 'none'
  const cookieOptions = {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
  }
  res.clearCookie('access_token', cookieOptions)
  res.clearCookie('refresh_token', cookieOptions)
}
