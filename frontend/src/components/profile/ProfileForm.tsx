import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Fingerprint } from 'lucide-react'
import type { User, UserProfileForm } from '@/types'
import { updateProfile } from '@/api/ProfileAPI'
import AvatarUpload from '@/components/profile/AvatarUpload'
import ChangePasswordModal from '@/components/profile/ChangePasswordModal'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PageTransition from '@/components/ui/PageTransition'
import { useT } from '@/hooks/useT'

type ProfileFormProps = {
  data: User
}

export default function ProfileForm({ data }: ProfileFormProps) {
  const t = useT()
  const [pwdOpen, setPwdOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileForm>({
    defaultValues: { name: data.name, email: data.email },
  })

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (message) => {
      toast.success(message ?? t('profile.updated'))
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  return (
    <PageTransition>
      <h1 className="page-title">{t('profile.title')}</h1>
      <p className="page-subtitle">{t('profile.subtitle')}</p>

      <section className="glass-panel mt-8 p-6 md:p-8">
        <AvatarUpload user={data} />
      </section>

      <form
        className="glass-panel mt-6 space-y-5 p-6 md:p-10"
        onSubmit={handleSubmit((formData) => mutate(formData))}
        noValidate
      >
        <Input
          label={t('profile.name')}
          autoComplete="name"
          placeholder={t('profile.namePlaceholder')}
          error={errors.name?.message}
          {...register('name', { required: t('validation.name') })}
        />
        <Input
          label={t('profile.email')}
          type="email"
          autoComplete="email"
          placeholder={t('profile.emailPlaceholder')}
          error={errors.email?.message}
          {...register('email', {
            required: t('validation.email'),
            pattern: { value: /\S+@\S+\.\S+/, message: t('validation.emailInvalid') },
          })}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t('profile.saving') : t('profile.save')}
        </Button>
      </form>

      <section className="glass-panel mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Fingerprint className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">{t('profile.passwordSection')}</h2>
            <p className="text-sm text-muted">{t('profile.passwordHelp')}</p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => setPwdOpen(true)} className="sm:shrink-0">
          {t('profile.changePassword')}
        </Button>
      </section>

      <ChangePasswordModal open={pwdOpen} onClose={() => setPwdOpen(false)} />
    </PageTransition>
  )
}
