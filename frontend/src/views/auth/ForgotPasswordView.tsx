import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { ForgotPasswordForm } from '@/types'
import { forgotPassword } from '@/api/AuthAPI'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PageTransition from '@/components/ui/PageTransition'
import { useT } from '@/hooks/useT'

export default function ForgotPasswordView() {
  const t = useT()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({ defaultValues: { email: '' } })

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => toast.success(data ?? t('forgot.submit')),
  })

  return (
    <PageTransition>
      <h1 className="font-display text-2xl font-semibold text-ink">{t('forgot.title')}</h1>
      <p className="mt-2 text-sm text-muted">{t('forgot.subtitle')}</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((data) => mutate(data))}
        noValidate
      >
        <Input
          label={t('login.email')}
          type="email"
          autoComplete="email"
          placeholder={t('login.emailPlaceholder')}
          error={errors.email?.message}
          {...register('email', {
            required: t('validation.email'),
            pattern: { value: /\S+@\S+\.\S+/, message: t('validation.emailInvalid') },
          })}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t('forgot.submitting') : t('forgot.submit')}
        </Button>
      </form>

      <nav className="mt-5 flex flex-col gap-1.5 text-center text-sm text-muted">
        <Link to="/auth/login" className="hover:text-accent">
          {t('forgot.signIn')}
        </Link>
        <Link to="/auth/register" className="hover:text-accent">
          {t('forgot.createOne')}
        </Link>
      </nav>
    </PageTransition>
  )
}
