import api from '@/lib/axios'
import { isAxiosError } from 'axios'

export type AvatarSignature = {
  timestamp: number
  signature: string
  cloudName: string
  apiKey: string
  uploadPreset: string
  folder: string
}

export type UploadAvatarResult = {
  publicId: string
  url: string
  width?: number
  height?: number
  format?: string
  resourceType?: string
}

export async function getAvatarSignature(): Promise<AvatarSignature> {
  const { data } = await api.get<AvatarSignature>('/auth/avatar-signature')
  return data
}

export async function uploadAvatarToCloudinary(
  file: File,
  sig: AvatarSignature,
): Promise<UploadAvatarResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', sig.uploadPreset)
  formData.append('folder', sig.folder)
  formData.append('timestamp', String(sig.timestamp))
  formData.append('signature', sig.signature)
  formData.append('api_key', sig.apiKey)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  )

  if (!res.ok) {
    let message = 'Cloudinary upload failed'
    try {
      const errBody = (await res.json()) as { error?: { message?: string } }
      message = errBody?.error?.message ?? message
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }

  const body = (await res.json()) as {
    public_id: string
    secure_url: string
    width?: number
    height?: number
    format?: string
    resource_type?: string
  }

  return {
    publicId: body.public_id,
    url: body.secure_url,
    width: body.width,
    height: body.height,
    format: body.format,
    resourceType: body.resource_type,
  }
}

export async function confirmAvatarUpload(result: UploadAvatarResult): Promise<void> {
  try {
    await api.post('/auth/avatar', { publicId: result.publicId, url: result.url })
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const data = error.response.data as { error?: string; message?: string }
      throw new Error(data?.error ?? data?.message ?? 'No se pudo confirmar el avatar')
    }
    throw error
  }
}
