import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { OAuthController } from '../controllers/OAuthController'
import { authenticate } from '../middleware/auth'
import { asyncHandler } from '../middleware/asyncHandler'
import {
  validateBody,
} from '../middleware/validateHelpers'
import {
  createAccountSchema,
  confirmAccountSchema,
  loginSchema,
  requestCodeSchema,
  forgotPasswordSchema,
  validateTokenSchema,
  updatePasswordWithTokenSchema,
  updateProfileSchema,
  updateAvatarSchema,
  updateCurrentUserPasswordSchema,
  checkPasswordSchema,
} from '../schemas/authSchema'
import {
  apiRateLimiter,
  authRateLimiter,
  passwordResetRateLimiter,
  registerRateLimiter,
  oauthCallbackRateLimiter,
  confirmAccountRateLimiter,
} from '../middleware/rateLimit'

const router = Router()

router.use(apiRateLimiter)

// Public auth routes
router.post('/create-account', registerRateLimiter, validateBody(createAccountSchema), asyncHandler(AuthController.createAccount))
router.post('/confirm-account', confirmAccountRateLimiter, validateBody(confirmAccountSchema), asyncHandler(AuthController.confirmAccount))
router.post('/login', authRateLimiter, validateBody(loginSchema), asyncHandler(AuthController.login))
router.post('/request-code', validateBody(requestCodeSchema), asyncHandler(AuthController.requestConfirmationCode))
router.post('/forgot-password', passwordResetRateLimiter, validateBody(forgotPasswordSchema), asyncHandler(AuthController.forgotPassword))
router.post('/validate-token', validateBody(validateTokenSchema), asyncHandler(AuthController.validateToken))
router.post('/update-password/:token', validateBody(updatePasswordWithTokenSchema), asyncHandler(AuthController.updatePasswordWithToken))
router.post('/refresh', asyncHandler(AuthController.refresh))

// OAuth (Google + GitHub)
router.get('/google', asyncHandler(OAuthController.googleRedirect))
router.get('/google/callback', oauthCallbackRateLimiter, asyncHandler(OAuthController.googleCallback))
router.get('/github', asyncHandler(OAuthController.githubRedirect))
router.get('/github/callback', oauthCallbackRateLimiter, asyncHandler(OAuthController.githubCallback))

// Protected routes (require an access token)
router.get('/user', authenticate, asyncHandler(AuthController.user))
router.put('/profile', authenticate, validateBody(updateProfileSchema), asyncHandler(AuthController.updateProfile))
router.post('/avatar', authenticate, validateBody(updateAvatarSchema), asyncHandler(AuthController.uploadAvatar))
router.get('/avatar-signature', authenticate, asyncHandler(AuthController.getAvatarSignature))
router.post('/update-password', authenticate, validateBody(updateCurrentUserPasswordSchema), asyncHandler(AuthController.updateCurrentUserPassword))
router.post('/check-password', authenticate, validateBody(checkPasswordSchema), asyncHandler(AuthController.checkPassword))
router.post('/logout', authenticate, asyncHandler(AuthController.logout))

export default router
