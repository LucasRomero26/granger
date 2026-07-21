import { isAxiosError } from 'axios'
import api from '@/lib/axios'
import type { UpdateCurrentUserPasswordForm, UserProfileForm } from '@/types'
import { extractMessage } from '@/lib/apiResponse'

export async function updateProfile(formData: UserProfileForm) {
  try {
    const { data } = await api.put('/auth/profile', formData)
    return extractMessage(data, 'Profile updated')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export async function changePassword(formData: UpdateCurrentUserPasswordForm) {
  try {
    const { data } = await api.post('/auth/update-password', formData)
    return extractMessage(data, 'Password updated')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}
