import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { NewPasswordForm } from '@/types'
import { updatePasswordWithToken, validateToken } from '@/api/AuthAPI'
import OTPInput from '@/components/ui/OTPInput'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PageTransition from '@/components/ui/PageTransition'
import { useT } from '@/hooks/useT'

export default function NewPasswordView() {
  const [isValidToken, setIsValidToken] = useState(false)
  const [token, setToken] = useState('')
  const navigate = useNavigate()
  const t = useT()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewPasswordForm>({
    defaultValues: { password: '', password_confirmation: '' },
  })

  const password = watch('password')

  const validateMutation = useMutation({
    mutationFn: validateToken,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data ?? t('newPassword.subtitle'))
      setIsValidToken(true)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updatePasswordWithToken,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data ?? t('newPassword.submit'))
      navigate('/auth/login')
    },
  })

  return (
    <PageTransition>
      <h1 className="font-display text-2xl font-semibold text-ink">{t('newPassword.title')}</h1>
      <p className="mt-2 text-sm text-muted">
        {isValidToken ? t('newPassword.subtitle') : t('newPassword.subtitleCode')}
      </p>

      <div className="mt-6">
        {!isValidToken ? (
          <>
            <OTPInput
              value={token}
              onChange={setToken}
              onComplete={(value) => {
                setToken(value)
                validateMutation.mutate({ token: value })
              }}
            />
            <nav className="mt-5 text-center text-sm text-muted">
              <Link to="/auth/forgot-password" className="hover:text-accent">
                {t('newPassword.requestNew')}
              </Link>
            </nav>
          </>
        ) : (
          <form
            className="space-y-4"
            onSubmit={handleSubmit((formData) =>
              updateMutation.mutate({ formData, token }),
            )}
            noValidate
          >
            <Input
              label={t('newPassword.new')}
              type="password"
              autoComplete="new-password"
              placeholder={t('newPassword.newPlaceholder')}
              error={errors.password?.message}
              {...register('password', {
                required: t('validation.password'),
                minLength: { value: 8, message: t('validation.passwordMin') },
              })}
            />
            <Input
              label={t('newPassword.confirm')}
              type="password"
              autoComplete="new-password"
              placeholder={t('newPassword.confirmPlaceholder')}
              error={errors.password_confirmation?.message}
              {...register('password_confirmation', {
                required: t('validation.confirm'),
                validate: (value) => value === password || t('validation.match'),
              })}
            />
            <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? t('newPassword.submitting') : t('newPassword.submit')}
            </Button>
          </form>
        )}
      </div>
    </PageTransition>
  )
}
