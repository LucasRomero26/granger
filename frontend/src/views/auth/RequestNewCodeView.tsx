import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { RequestConfirmationCodeForm } from '@/types'
import { requestConfirmationCode } from '@/api/AuthAPI'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PageTransition from '@/components/ui/PageTransition'
import { useT } from '@/hooks/useT'

export default function RequestNewCodeView() {
  const t = useT()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestConfirmationCodeForm>({ defaultValues: { email: '' } })

  const { mutate, isPending } = useMutation({
    mutationFn: requestConfirmationCode,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => toast.success(data ?? t('requestCode.submit')),
  })

  return (
    <PageTransition>
      <h1 className="font-display text-2xl font-semibold text-ink">{t('requestCode.title')}</h1>
      <p className="mt-2 text-sm text-muted">{t('requestCode.subtitle')}</p>

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
          {isPending ? t('requestCode.submitting') : t('requestCode.submit')}
        </Button>
      </form>

      <nav className="mt-5 flex flex-col gap-1.5 text-center text-sm text-muted">
        <Link to="/auth/login" className="hover:text-accent">
          {t('requestCode.signIn')}
        </Link>
        <Link to="/auth/forgot-password" className="hover:text-accent">
          {t('requestCode.forgot')}
        </Link>
      </nav>
    </PageTransition>
  )
}
