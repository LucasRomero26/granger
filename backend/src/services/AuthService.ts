import User, { type IUser } from '../models/User'
import Token from '../models/Token'
import RefreshToken from '../models/RefreshToken'
import { hashPassword, checkPassword } from '../utils/auth'
import { generateNumericToken, generateRandomString } from '../utils/token'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { AuthEmail } from '../emails/AuthEmail'
import {
  ConflictError,
  NotFoundError,
  AuthenticationError,
  ForbiddenError,
} from '../middleware/error'
import type { CreateAccountInput, LoginInput } from '../schemas/authSchema'

const MAX_LOGIN_ATTEMPTS = 5
const LOCK_DURATION_MS = 15 * 60 * 1000

export class AuthService {
  static async createAccount(data: CreateAccountInput): Promise<{ message: string }> {
    const { password, email, name } = data

    const userExists = await User.findOne({ email })
    if (userExists) {
      throw new ConflictError('The user is already registered')
    }

    const user = new User({
      name,
      email,
      password: await hashPassword(password),
      provider: 'local',
    })

    const token = new Token({
      token: generateNumericToken(),
      user: user._id,
      type: 'email_confirmation',
    })

    await AuthEmail.sendConfirmationEmail({
      email: user.email,
      name: user.name,
      token: token.token,
    })

    await Promise.allSettled([user.save(), token.save()])
    return { message: 'Account created. Check your email to confirm it.' }
  }

  static async confirmAccount(token: string): Promise<{ message: string }> {
    const tokenExists = await Token.findOne({ token, type: 'email_confirmation' })
    if (!tokenExists) {
      throw new NotFoundError('Invalid or expired token')
    }

    const user = await User.findById(tokenExists.user)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    user.confirmed = true

    await Promise.allSettled([user.save(), tokenExists.deleteOne()])
    return { message: 'Account confirmed successfully' }
  }

  static async login({ email, password }: LoginInput): Promise<{
    accessToken: string
    refreshToken: string
    user: Pick<IUser, '_id' | 'name' | 'email' | 'avatar'>
  }> {
    const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil')
    if (!user) {
      throw new AuthenticationError('Invalid credentials')
    }

    // Verify account lock
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remaining = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000)
      throw new ForbiddenError(`Account locked. Try again in ${remaining} minutes`)
    }

    if (!user.confirmed) {
      const token = new Token({
        token: generateNumericToken(),
        user: user._id,
        type: 'email_confirmation',
      })
      await AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      })
      await token.save()
      throw new ForbiddenError('The account has not been confirmed. A new confirmation email has been sent.')
    }

    const isPasswordCorrect = await checkPassword(password, user.password ?? '')
    if (!isPasswordCorrect) {
      // Increment failed attempts
      user.loginAttempts = (user.loginAttempts ?? 0) + 1
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS)
      }
      await user.save({ validateBeforeSave: false })
      throw new AuthenticationError('Invalid credentials')
    }

    user.loginAttempts = 0
    user.lockUntil = null
    user.lastLoginAt = new Date()
    await user.save({ validateBeforeSave: false })

    const jti = generateRandomString(16)
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id, jti)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt,
    })

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

  static async requestConfirmationCode(email: string): Promise<{ message: string }> {
    const user = await User.findOne({ email })
    if (!user) {
      throw new NotFoundError('The user is not registered')
    }
    if (user.confirmed) {
      throw new ForbiddenError('The user is already confirmed')
    }

    const token = new Token({
      token: generateNumericToken(),
      user: user._id,
      type: 'email_confirmation',
    })
    await AuthEmail.sendConfirmationEmail({
      email: user.email,
      name: user.name,
      token: token.token,
    })
    await token.save()
    return { message: 'A new token has been sent to your email' }
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await User.findOne({ email })
    if (!user) {
      // For security, do not reveal whether the email exists
      return { message: 'If the email is registered, you will receive instructions' }
    }

    await Token.deleteMany({ user: user._id, type: 'password_reset' })

    const token = new Token({
      token: generateNumericToken(),
      user: user._id,
      type: 'password_reset',
    })
    await AuthEmail.sendPasswordResetToken({
      email: user.email,
      name: user.name,
      token: token.token,
    })
    await token.save()
    return { message: 'If the email is registered, you will receive instructions' }
  }

  static async validateToken(token: string): Promise<{ message: string }> {
    const tokenExists = await Token.findOne({ token, type: 'password_reset' })
    if (!tokenExists) {
      throw new NotFoundError('Invalid token')
    }
    return { message: 'Valid token. Set your new password.' }
  }

  static async updatePasswordWithToken(token: string, password: string): Promise<{ message: string }> {
    const tokenExists = await Token.findOne({ token, type: 'password_reset' })
    if (!tokenExists) {
      throw new NotFoundError('Invalid or expired token')
    }

    const user = await User.findById(tokenExists.user)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    user.password = await hashPassword(password)
    user.loginAttempts = 0
    user.lockUntil = null

    await Promise.allSettled([user.save(), tokenExists.deleteOne()])
    return { message: 'Password updated successfully' }
  }

  static async refreshAccessToken(refreshTokenCookie: string): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    let decoded: { id: string; jti: string }
    try {
      decoded = verifyRefreshToken(refreshTokenCookie)
    } catch {
      throw new AuthenticationError('Invalid refresh token')
    }

    const stored = await RefreshToken.findOne({ token: refreshTokenCookie, user: decoded.id })
    if (!stored) {
      throw new AuthenticationError('Refresh token not found')
    }
    if (stored.revoked) {
      // Possible token reuse: revoke the entire chain
      await RefreshToken.updateMany({ user: decoded.id }, { revoked: true, revokedAt: new Date() })
      throw new AuthenticationError('Refresh token revoked')
    }
    if (stored.expiresAt < new Date()) {
      await stored.deleteOne()
      throw new AuthenticationError('Refresh token expired')
    }

    // Refresh token rotation
    const newJti = generateRandomString(16)
    const user = await User.findById(decoded.id)
    if (!user) throw new AuthenticationError('User not found')

    const newAccessToken = generateAccessToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id, newJti)

    // Mark the previous token as revoked and create the new one
    stored.revoked = true
    stored.revokedAt = new Date()
    stored.replacedBy = newRefreshToken
    await stored.save()

    await RefreshToken.create({
      token: newRefreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  static async logout(refreshTokenCookie?: string): Promise<void> {
    if (!refreshTokenCookie) return
    await RefreshToken.updateOne(
      { token: refreshTokenCookie },
      { revoked: true, revokedAt: new Date() },
    )
  }

  static async revokeAllUserTokens(userId: string): Promise<void> {
    await RefreshToken.updateMany(
      { user: userId, revoked: false },
      { revoked: true, revokedAt: new Date() },
    )
  }
}

export default AuthService
