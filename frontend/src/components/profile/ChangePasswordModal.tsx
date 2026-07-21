import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { UpdateCurrentUserPasswordForm } from '@/types'
import { changePassword } from '@/api/ProfileAPI'
import Modal from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useT } from '@/hooks/useT'

type ChangePasswordModalProps = {
  open: boolean
  onClose: () => void
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const t = useT()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateCurrentUserPasswordForm>({
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  })

  const password = watch('password')

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data ?? t('changePassword.changed'))
      reset()
      onClose()
    },
  })

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  return (
    <Modal open={open} onClose={onClose} title={t('changePassword.title')} size="md">
      <p className="text-sm text-muted">{t('changePassword.subtitle')}</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((data) => mutate(data))}
        noValidate
      >
        <Input
          label={t('changePassword.current')}
          type="password"
          autoComplete="current-password"
          placeholder={t('changePassword.currentPlaceholder')}
          error={errors.current_password?.message}
          {...register('current_password', { required: t('changePassword.current.required') })}
        />
        <Input
          label={t('changePassword.new')}
          type="password"
          autoComplete="new-password"
          placeholder={t('changePassword.newPlaceholder')}
          error={errors.password?.message}
          {...register('password', {
            required: t('changePassword.password.required'),
            minLength: { value: 8, message: t('changePassword.passwordMin') },
          })}
        />
        <Input
          label={t('changePassword.confirm')}
          type="password"
          autoComplete="new-password"
          placeholder={t('changePassword.confirmPlaceholder')}
          error={errors.password_confirmation?.message}
          {...register('password_confirmation', {
            required: t('changePassword.confirm.required'),
            validate: (value) => value === password || t('validation.match'),
          })}
        />
        <div className="flex flex-col gap-2 sm:flex-row-reverse sm:justify-start">
          <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
            {isPending ? t('changePassword.submitting') : t('changePassword.submit')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
