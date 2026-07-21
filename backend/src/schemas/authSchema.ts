import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password cannot exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const createAccountSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long').trim(),
    email: z.string().email('Invalid email').toLowerCase(),
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

export const loginSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
})

export const confirmAccountSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

export const requestCodeSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
})

export const validateTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

export const updatePasswordWithTokenSchema = z
  .object({
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').trim(),
  email: z.string().email('Invalid email').toLowerCase(),
  avatar: z.string().url('Avatar must be a valid URL').optional().nullable(),
  avatarPublicId: z.string().max(200, 'publicId is too long').optional().nullable(),
})

export const updateAvatarSchema = z.object({
  publicId: z.string().max(200, 'publicId is too long'),
  url: z.string().url('Avatar URL is not valid'),
})

export const updateCurrentUserPasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

export const checkPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export type CreateAccountInput = z.infer<typeof createAccountSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ConfirmAccountInput = z.infer<typeof confirmAccountSchema>
export type RequestCodeInput = z.infer<typeof requestCodeSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ValidateTokenInput = z.infer<typeof validateTokenSchema>
export type UpdatePasswordWithTokenInput = z.infer<typeof updatePasswordWithTokenSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>
export type UpdateCurrentUserPasswordInput = z.infer<typeof updateCurrentUserPasswordSchema>
export type CheckPasswordInput = z.infer<typeof checkPasswordSchema>
