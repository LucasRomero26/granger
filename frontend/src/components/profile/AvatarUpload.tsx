import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Camera, Loader2 } from 'lucide-react'
import type { User } from '@/types'
import { useT } from '@/hooks/useT'
import {
  getAvatarSignature,
  uploadAvatarToCloudinary,
  confirmAvatarUpload,
} from '@/api/AvatarAPI'

type AvatarUploadProps = {
  user: User
}

const MAX_SIZE = 1.5 * 1024 * 1024 // 1.5 MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

export default function AvatarUpload({ user }: AvatarUploadProps) {
  const t = useT()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const sig = await getAvatarSignature()
      const uploaded = await uploadAvatarToCloudinary(file, sig)
      await confirmAvatarUpload(uploaded)
      return uploaded
    },
    onSuccess: () => {
      toast.success(t('avatar.updated'))
      queryClient.invalidateQueries({ queryKey: ['user'] })
      setPreview(null)
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const handleFile = (file?: File) => {
    if (!file) return
    if (!ALLOWED.includes(file.type)) {
      toast.error(t('avatar.invalidType'))
      return
    }
    if (file.size > MAX_SIZE) {
      toast.error(t('avatar.tooBig'))
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    uploadMutation.mutate(file)
  }

  const currentAvatar = preview ?? user.avatar ?? ''

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="group relative h-20 w-20 overflow-hidden rounded-2xl border border-glass-border bg-glass transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={t('avatar.changeAria')}
        >
          {currentAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentAvatar}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-accent-soft text-2xl font-bold text-accent">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
            {uploadMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <Camera className="h-5 w-5 text-white" />
            )}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED.join(',')}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">{user.name}</h2>
        <p className="text-sm text-muted">{user.email}</p>
        <p className="mt-1 text-xs text-muted">{t('avatar.hint')}</p>
      </div>
    </div>
  )
}
