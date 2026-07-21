import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { UserRegistrationForm } from '@/types'
import { createAccount } from '@/api/AuthAPI'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PageTransition from '@/components/ui/PageTransition'
import OAuthButtons from '@/components/auth/OAuthButtons'
import { useT } from '@/hooks/useT'

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-1 flex items-center gap-3 text-xs text-muted">
      <span className="h-px flex-1 bg-glass-border" aria-hidden />
      <span className="uppercase tracking-wider">{children}</span>
      <span className="h-px flex-1 bg-glass-border" aria-hidden />
    </div>
  )
}

export default function RegisterView() {
  const t = useT()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserRegistrationForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  const password = watch('password')

  const { mutate, isPending } = useMutation({
    mutationFn: createAccount,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data ?? t('register.title'))
      reset()
    },
  })

  return (
    <PageTransition>
      <h1 className="font-display text-2xl font-semibold text-ink">{t('register.title')}</h1>
      <p className="mt-1.5 text-sm text-muted">{t('register.subtitle')}</p>

      <form
        className="mt-6 space-y-3.5 sm:space-y-4"
        onSubmit={handleSubmit((data) => mutate(data))}
        noValidate
      >
        <Input
          label={t('register.email')}
          type="email"
          autoComplete="email"
          placeholder={t('register.emailPlaceholder')}
          error={errors.email?.message}
          compact
          {...register('email', {
            required: t('validation.email'),
            pattern: { value: /\S+@\S+\.\S+/, message: t('validation.emailInvalid') },
          })}
        />
        <Input
          label={t('register.name')}
          type="text"
          autoComplete="name"
          placeholder={t('register.namePlaceholder')}
          error={errors.name?.message}
          compact
          {...register('name', { required: t('validation.name') })}
        />
        <Input
          label={t('register.password')}
          type="password"
          autoComplete="new-password"
          placeholder={t('register.passwordPlaceholder')}
          error={errors.password?.message}
          compact
          {...register('password', {
            required: t('validation.password'),
            minLength: { value: 8, message: t('validation.passwordMin') },
          })}
        />
        <Input
          label={t('register.confirm')}
          type="password"
          autoComplete="new-password"
          placeholder={t('register.confirmPlaceholder')}
          error={errors.password_confirmation?.message}
          compact
          {...register('password_confirmation', {
            required: t('validation.confirm'),
            validate: (value) => value === password || t('validation.match'),
          })}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t('register.submitting') : t('register.submit')}
        </Button>
      </form>

      <div className="mt-5 space-y-4">
        <Divider>{t('common.or')}</Divider>
        <OAuthButtons next="/" />
      </div>

      <nav className="mt-5 flex flex-col gap-1.5 text-center text-sm text-muted">
        <Link to="/auth/login" className="hover:text-accent">
          {t('register.signIn')}
        </Link>
        <Link to="/auth/forgot-password" className="hover:text-accent">
          {t('login.forgotPassword')}
        </Link>
      </nav>
    </PageTransition>
  )
}
