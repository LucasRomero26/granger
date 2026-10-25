import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { UserLoginForm } from '@/types'
import { authenticateUser } from '@/api/AuthAPI'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PageTransition from '@/components/ui/PageTransition'
import { useT } from '@/hooks/useT'
import { usePageMeta } from '@/hooks/usePageMeta'

// Match the ForbiddenError message from AuthService.login when the account
// has not been confirmed. We trigger redirection to /auth/confirm-account
// instead of just showing the toast.
const NOTConfirmed_MARKER = 'The account has not been confirmed'

export default function LoginView() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const t = useT()
  usePageMeta('login')
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<UserLoginForm>({
    defaultValues: { email: '', password: '' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: authenticateUser,
    onError: (error: Error) => {
      if (error.message.includes(NOTConfirmed_MARKER)) {
        const email = getValues('email')
        toast.error(t('login.notConfirmedRedirect') ?? error.message)
        navigate('/auth/confirm-account', { replace: true, state: { email } })
        return
      }
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success(t('login.welcomeBack'))
      queryClient.invalidateQueries({ queryKey: ['user'] })
      navigate('/')
    },
  })

  return (
    <PageTransition>
      <h1 className="font-display text-2xl font-semibold text-ink">{t('login.title')}</h1>
      <p className="mt-2 text-sm text-muted">{t('login.subtitle')}</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((data) => mutate(data))}
        noValidate
        data-testid="login-form"
      >
        <Input
          label={t('login.email')}
          type="email"
          autoComplete="email"
          placeholder={t('login.emailPlaceholder')}
          error={errors.email?.message}
          data-testid="login-email"
          {...register('email', {
            required: t('validation.email'),
            pattern: { value: /\S+@\S+\.\S+/, message: t('validation.emailInvalid') },
          })}
        />
        <Input
          label={t('login.password')}
          type="password"
          autoComplete="current-password"
          placeholder={t('login.passwordPlaceholder')}
          error={errors.password?.message}
          data-testid="login-password"
          {...register('password', { required: t('validation.password') })}
        />
        <Button type="submit" className="w-full" loading={isPending} data-testid="login-submit">
          {isPending ? t('login.submitting') : t('login.submit')}
        </Button>
      </form>

      <nav className="mt-5 flex flex-col gap-1.5 text-center text-sm text-muted">
        <Link to="/auth/register" className="hover:text-accent">
          {t('login.createAccount')}
        </Link>
        <Link to="/auth/forgot-password" className="hover:text-accent">
          {t('login.forgotPassword')}
        </Link>
      </nav>
    </PageTransition>
  )
}
