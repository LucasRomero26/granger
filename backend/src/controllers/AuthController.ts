import type { Request, Response } from 'express'
import { AuthService } from '../services/AuthService'
import { setAuthCookies, clearAuthCookies } from '../middleware/auth'
import { AppError } from '../middleware/error'

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    const result = await AuthService.createAccount(req.body)
    res.status(201).json(result)
  }

  static confirmAccount = async (req: Request, res: Response) => {
    const result = await AuthService.confirmAccount(req.body.token)
    res.json(result)
  }

  static login = async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await AuthService.login(req.body)
    setAuthCookies(res, accessToken, refreshToken)
    res.json({ user, accessToken })
  }

  static requestConfirmationCode = async (req: Request, res: Response) => {
    const result = await AuthService.requestConfirmationCode(req.body.email)
    res.json(result)
  }

  static forgotPassword = async (req: Request, res: Response) => {
    const result = await AuthService.forgotPassword(req.body.email)
    res.json(result)
  }

  static validateToken = async (req: Request, res: Response) => {
    const result = await AuthService.validateToken(req.body.token)
    res.json(result)
  }

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    const result = await AuthService.updatePasswordWithToken(req.params.token ?? '', req.body.password)
    res.json(result)
  }

  static user = async (req: Request, res: Response) => {
    if (!req.user) throw new AppError(401, 'Unauthorized')
    res.json(req.user)
  }

  static updateProfile = async (req: Request, res: Response) => {
    const { name, email, avatar, avatarPublicId } = req.body
    const user = req.user!

    if (email && email !== user.email) {
      const userExists = await (await import('../models/User')).default.findOne({ email })
      if (userExists && userExists._id.toString() !== user._id.toString()) {
        throw new AppError(409, 'That email is already registered')
      }
      user.email = email
    }

    user.name = name ?? user.name

    // If a new avatar is provided, store it and delete the previous one from Cloudinary
    if (typeof avatar === 'string' && avatar !== user.avatar) {
      const previousPublicId = user.avatarPublicId
      user.avatar = avatar
      user.avatarPublicId = avatarPublicId ?? null

      // Delete the previous avatar non-blockingly
      if (previousPublicId) {
        import('../config/cloudinary')
          .then(({ cloudinary }) => cloudinary.uploader.destroy(previousPublicId))
          .catch(() => {
            /* non-blocking; will be retried on the next upload */
          })
      }
    }

    await user.save()
    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? '',
      },
    })
  }

  static uploadAvatar = async (req: Request, res: Response) => {
    const { publicId, url } = req.body
    const user = req.user!

    const previousPublicId = user.avatarPublicId
    user.avatar = url
    user.avatarPublicId = publicId
    await user.save()

    if (previousPublicId && previousPublicId !== publicId) {
      import('../config/cloudinary')
        .then(({ cloudinary }) => cloudinary.uploader.destroy(previousPublicId))
        .catch(() => {
          /* non-blocking */
        })
    }

    res.json({
      message: 'Avatar updated',
      avatar: user.avatar,
      avatarPublicId: user.avatarPublicId,
    })
  }

  static getAvatarSignature = async (_req: Request, res: Response) => {
    const timestamp = Math.round(Date.now() / 1000)
    const { cloudinary } = await import('../config/cloudinary')
    const { env } = await import('../config/env')

    const paramsToSign = {
      timestamp,
      upload_preset: env.CLOUDINARY_UPLOAD_PRESET,
      folder: 'granger/avatars',
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      env.CLOUDINARY_API_SECRET,
    )

    res.json({
      timestamp,
      signature,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      uploadPreset: env.CLOUDINARY_UPLOAD_PRESET,
      folder: 'granger/avatars',
    })
  }

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body
    const User = (await import('../models/User')).default
    const { checkPassword } = await import('../utils/auth')
    const { hashPassword } = await import('../utils/auth')

    const user = await User.findById(req.user!._id).select('+password')
    if (!user) throw new AppError(404, 'User not found')

    const isPasswordCorrect = await checkPassword(current_password, user.password ?? '')
    if (!isPasswordCorrect) {
      throw new AppError(401, 'Current password is incorrect')
    }

    user.password = await hashPassword(password)
    await user.save()
    res.json({ message: 'Password updated successfully' })
  }

  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body
    const User = (await import('../models/User')).default
    const { checkPassword } = await import('../utils/auth')

    const user = await User.findById(req.user!._id).select('+password')
    if (!user) throw new AppError(404, 'User not found')

    const isPasswordCorrect = await checkPassword(password, user.password ?? '')
    if (!isPasswordCorrect) {
      throw new AppError(401, 'Incorrect password')
    }
    res.json({ message: 'Password correct' })
  }

  static refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refresh_token
    if (!refreshToken) throw new AppError(401, 'No refresh token provided')
    const { accessToken, refreshToken: newRefreshToken } = await AuthService.refreshAccessToken(refreshToken)
    setAuthCookies(res, accessToken, newRefreshToken)
    res.json({ accessToken })
  }

  static logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refresh_token
    await AuthService.logout(refreshToken)
    clearAuthCookies(res)
    res.json({ message: 'Logged out successfully' })
  }
}
