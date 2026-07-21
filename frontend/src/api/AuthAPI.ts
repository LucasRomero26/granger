import api, { setAccessToken } from '@/lib/axios'
import { isAxiosError } from 'axios'
import type {
  CheckPasswordForm,
  ConfirmToken,
  ForgotPasswordForm,
  NewPasswordForm,
  RequestConfirmationCodeForm,
  UserLoginForm,
  UserRegistrationForm,
} from '@/types'
import { userSchema } from '@/types'
import { extractMessage } from '@/lib/apiResponse'

function errorMsg(error: unknown, fallback = 'An error occurred'): string {
  if (isAxiosError(error) && error.response) {
    const data = error.response.data as { error?: string; message?: string }
    return data?.error ?? data?.message ?? fallback
  }
  return fallback
}

export async function createAccount(formData: UserRegistrationForm) {
  try {
    const { data } = await api.post('/auth/create-account', formData)
    return extractMessage(data, 'Account created')
  } catch (error) {
    throw new Error(errorMsg(error, 'Could not create the account'))
  }
}

export async function confirmAccount(formData: ConfirmToken) {
  try {
    const { data } = await api.post('/auth/confirm-account', formData)
    return extractMessage(data, 'Account confirmed')
  } catch (error) {
    throw new Error(errorMsg(error, 'Could not confirm the account'))
  }
}

export async function requestConfirmationCode(
  formData: RequestConfirmationCodeForm,
) {
  try {
    const { data } = await api.post('/auth/request-code', formData)
    return extractMessage(data, 'Code sent')
  } catch (error) {
    throw new Error(errorMsg(error, 'Could not request the code'))
  }
}

type LoginResponse = {
  user: { _id: string; name: string; email: string; avatar?: string }
  accessToken: string
}

export async function authenticateUser(formData: UserLoginForm) {
  try {
    const { data } = await api.post<LoginResponse>('/auth/login', formData)
    setAccessToken(data.accessToken)
    return data
  } catch (error) {
    throw new Error(errorMsg(error, 'Could not sign in'))
  }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
  try {
    const { data } = await api.post('/auth/forgot-password', formData)
    return extractMessage(data, 'Instructions sent')
  } catch (error) {
    throw new Error(errorMsg(error, 'Could not send the email'))
  }
}

export async function validateToken(formData: ConfirmToken) {
  try {
    const { data } = await api.post('/auth/validate-token', formData)
    return extractMessage(data, 'Valid token')
  } catch (error) {
    throw new Error(errorMsg(error, 'Invalid token'))
  }
}

export async function updatePasswordWithToken({
  formData,
  token,
}: {
  formData: NewPasswordForm
  token: ConfirmToken['token']
}) {
  try {
    const { data } = await api.post(
      `/auth/update-password/${token}`,
      formData,
    )
    return extractMessage(data, 'Password updated')
  } catch (error) {
    throw new Error(errorMsg(error, 'Could not update the password'))
  }
}

type CurrentUser = { _id: string; name: string; email: string }

export async function getUser() {
  const { data } = await api.get<CurrentUser>('/auth/user')
  const response = userSchema.safeParse(data)
  if (response.success) {
    return response.data
  }
  // Reject so useAuth's query sees isError=true and AppLayout can redirect
  // to /auth/login. Otherwise the app would render an empty shell forever.
  throw new Error('Invalid user payload')
}

export async function logoutUser() {
  try {
    const { data } = await api.post<{ message: string }>('/auth/logout')
    setAccessToken(null)
    return data
  } catch (error) {
    setAccessToken(null)
    throw new Error(errorMsg(error, 'Could not log out'))
  }
}

export async function checkPassword(formData: CheckPasswordForm) {
  try {
    const { data } = await api.post('/auth/check-password', formData)
    return extractMessage(data, 'Password correct')
  } catch (error) {
    throw new Error(errorMsg(error, 'Incorrect password'))
  }
}

type OAuthProvider = 'google' | 'github'

export function getOAuthRedirectUrl(provider: OAuthProvider, next = '/'): string {
  const base = (import.meta.env.VITE_API_URL as string).replace(/\/$/, '')
  const nextParam = next.startsWith('/') && !next.startsWith('//') ? next : '/'
  return `${base}/auth/${provider}?next=${encodeURIComponent(nextParam)}`
}
