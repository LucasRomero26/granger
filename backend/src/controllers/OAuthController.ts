import type { Request, Response } from 'express'
import { OAuthService } from '../services/OAuthService'
import { setAuthCookies, clearAuthCookies } from '../middleware/auth'
import { env } from '../config/env'
import { generateOauthState } from '../utils/token'

type OAuthStateCookie = {
  state: string
  next?: string
}

const STATE_COOKIE_NAME = 'oauth_state'
const STATE_COOKIE_TTL = 10 * 60 * 1000 // 10 minutes

function setStateCookie(res: Response, payload: OAuthStateCookie): void {
  const value = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  res.cookie(STATE_COOKIE_NAME, value, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax', // 'lax' allows sending the cookie on the top-level redirect back from Google/GitHub
    path: '/',
    maxAge: STATE_COOKIE_TTL,
  })
}

function readStateCookie(req: Request): OAuthStateCookie | null {
  const raw = req.cookies?.[STATE_COOKIE_NAME]
  if (!raw || typeof raw !== 'string') return null
  try {
    const json = Buffer.from(raw, 'base64url').toString('utf8')
    return JSON.parse(json) as OAuthStateCookie
  } catch {
    return null
  }
}

function clearStateCookie(res: Response): void {
  res.clearCookie(STATE_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

function safeNextPath(next?: unknown): string {
  if (typeof next !== 'string') return '/'
  if (!next.startsWith('/')) return '/'
  if (next.startsWith('//')) return '/'
  return next
}

export class OAuthController {
  static googleRedirect = (req: Request, res: Response) => {
    const state = generateOauthState()
    const next = safeNextPath(req.query.next)
    setStateCookie(res, { state, next })
    const url = OAuthService.getGoogleRedirectUrl(state)
    res.redirect(url)
  }

  static githubRedirect = (req: Request, res: Response) => {
    const state = generateOauthState()
    const next = safeNextPath(req.query.next)
    setStateCookie(res, { state, next })
    const url = OAuthService.getGithubRedirectUrl(state)
    res.redirect(url)
  }

  static googleCallback = async (req: Request, res: Response) => {
    const code = typeof req.query.code === 'string' ? req.query.code : ''
    const incomingState = typeof req.query.state === 'string' ? req.query.state : ''
    await OAuthController.handleCallback({
      req,
      res,
      code,
      incomingState,
      provider: 'google',
      exchange: () => OAuthService.exchangeGoogleCode(code),
    })
  }

  static githubCallback = async (req: Request, res: Response) => {
    const code = typeof req.query.code === 'string' ? req.query.code : ''
    const incomingState = typeof req.query.state === 'string' ? req.query.state : ''
    await OAuthController.handleCallback({
      req,
      res,
      code,
      incomingState,
      provider: 'github',
      exchange: () => OAuthService.exchangeGithubCode(code),
    })
  }

  private static async handleCallback(args: {
    req: Request
    res: Response
    code: string
    incomingState: string
    provider: 'google' | 'github'
    exchange: () => ReturnType<
      typeof OAuthService.exchangeGoogleCode | typeof OAuthService.exchangeGithubCode
    >
  }) {
    const { req, res, code, incomingState, provider, exchange } = args
    const stored = readStateCookie(req)
    clearStateCookie(res)

    if (!code || !incomingState) {
      return OAuthController.redirectWithError(res, 'oauth_incomplete')
    }
    if (!stored || stored.state !== incomingState) {
      return OAuthController.redirectWithError(res, 'oauth_state_mismatch')
    }

    try {
      const profile = await exchange()
      const { accessToken, refreshToken } = await OAuthService.authorizeOAuth(
        profile,
        provider,
      )
      setAuthCookies(res, accessToken, refreshToken)

      const next = safeNextPath(stored.next)
      const params = new URLSearchParams({ accessToken })
      res.redirect(`${env.FRONTEND_URL}/auth/oauth-success?${params.toString()}&next=${encodeURIComponent(next)}`)
    } catch {
      return OAuthController.redirectWithError(res, 'oauth_failed')
    }
  }

  private static redirectWithError(res: Response, reason: string): void {
    clearAuthCookies(res)
    res.redirect(`${env.FRONTEND_URL}/auth/login?oauth_error=${reason}`)
  }
}
