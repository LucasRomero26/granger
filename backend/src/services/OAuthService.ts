import User from '../models/User'
import RefreshToken from '../models/RefreshToken'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import { generateRandomString } from '../utils/token'
import { AuthenticationError } from '../middleware/error'
import { env } from '../config/env'
import type { AuthProvider, IUser } from '../models/User'

type OAuthProfile = {
  providerId: string
  email: string
  name: string
  avatar?: string | null
}

type AuthResult = {
  accessToken: string
  refreshToken: string
  user: Pick<IUser, '_id' | 'name' | 'email' | 'avatar'>
}

async function issueAuthTokens(user: IUser): Promise<AuthResult> {
  const jti = generateRandomString(16)
  const accessToken = generateAccessToken(user._id)
  const refreshToken = generateRefreshToken(user._id, jti)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
  })

  user.loginAttempts = 0
  user.lockUntil = null
  user.lastLoginAt = new Date()
  await user.save({ validateBeforeSave: false })

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? '',
    },
  }
}

export class OAuthService {
  static getGoogleRedirectUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: `${env.BACKEND_URL}/api/auth/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      prompt: 'select_account',
    })
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  static getGithubRedirectUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: env.GITHUB_OAUTH_CLIENT_ID,
      redirect_uri: `${env.BACKEND_URL}/api/auth/github/callback`,
      scope: 'read:user user:email',
      state,
    })
    return `https://github.com/login/oauth/authorize?${params.toString()}`
  }

  static async exchangeGoogleCode(code: string): Promise<OAuthProfile> {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${env.BACKEND_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      throw new AuthenticationError('Failed to obtain the Google token')
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string }
    const accessToken = tokenData.access_token
    if (!accessToken) {
      throw new AuthenticationError('Empty Google token')
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!userRes.ok) {
      throw new AuthenticationError('Failed to fetch the Google profile')
    }

    const profile = (await userRes.json()) as {
      sub: string
      email: string
      name?: string
      picture?: string
      email_verified?: boolean
    }

    if (!profile.email) {
      throw new AuthenticationError('The Google account has no email')
    }

    return {
      providerId: profile.sub,
      email: profile.email.toLowerCase(),
      name: profile.name ?? profile.email.split('@')[0] ?? 'User',
      avatar: profile.picture ?? null,
    }
  }

  static async exchangeGithubCode(code: string): Promise<OAuthProfile> {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_OAUTH_CLIENT_ID,
        client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
        code,
        redirect_uri: `${env.BACKEND_URL}/api/auth/github/callback`,
      }),
    })

    if (!tokenRes.ok) {
      throw new AuthenticationError('Failed to obtain the GitHub token')
    }

    const tokenData = (await tokenRes.json()) as {
      access_token?: string
      error?: string
    }
    const accessToken = tokenData.access_token
    if (!accessToken) {
      throw new AuthenticationError(
        tokenData.error ?? 'Empty GitHub token',
      )
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    })
    if (!userRes.ok) {
      throw new AuthenticationError('Failed to fetch the GitHub profile')
    }

    const profile = (await userRes.json()) as {
      id: number
      login: string
      name?: string | null
      avatar_url?: string | null
      email?: string | null
    }

    let email = profile.email
    if (!email) {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      })
      if (emailRes.ok) {
        const emails = (await emailRes.json()) as Array<{
          email: string
          primary: boolean
          verified: boolean
        }>
        email =
          emails.find((e) => e.primary && e.verified)?.email ??
          emails.find((e) => e.primary)?.email ??
          emails[0]?.email
      }
    }

    if (!email) {
      throw new AuthenticationError(
        'The GitHub account has no accessible email',
      )
    }

    return {
      providerId: String(profile.id),
      email: email.toLowerCase(),
      name: profile.name ?? profile.login ?? email.split('@')[0] ?? 'User',
      avatar: profile.avatar_url ?? null,
    }
  }

  static async upsertOAuthUser(
    profile: OAuthProfile,
    provider: AuthProvider,
  ): Promise<IUser> {
    // 1) Does a user already exist with this provider+providerId?
    const existingByProvider = await User.findOne({
      provider,
      providerId: profile.providerId,
    })
    if (existingByProvider) {
      if (profile.avatar && existingByProvider.avatar !== profile.avatar) {
        existingByProvider.avatar = profile.avatar
        await existingByProvider.save({ validateBeforeSave: false })
      }
      return existingByProvider
    }

    // 2) Does a local user already exist with that email? Link the OAuth provider.
    const existingByEmail = await User.findOne({ email: profile.email })
    if (existingByEmail) {
      existingByEmail.provider = provider
      existingByEmail.providerId = profile.providerId
      if (!existingByEmail.avatar && profile.avatar) {
        existingByEmail.avatar = profile.avatar
      }
      existingByEmail.confirmed = true
      await existingByEmail.save({ validateBeforeSave: false })
      return existingByEmail
    }

    // 3) Create a new user
    const user = new User({
      email: profile.email,
      name: profile.name,
      provider,
      providerId: profile.providerId,
      avatar: profile.avatar ?? null,
      confirmed: true,
    })
    await user.save()
    return user
  }

  static async authorizeOAuth(profile: OAuthProfile, provider: AuthProvider): Promise<AuthResult> {
    const user = await this.upsertOAuthUser(profile, provider)
    return issueAuthTokens(user)
  }
}

export default OAuthService
