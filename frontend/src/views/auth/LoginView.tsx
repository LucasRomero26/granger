import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import type { UserLoginForm } from '@/types'
import { authenticateUser } from '@/api/AuthAPI'
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

const oauthErrorKeys: Record<string, string> = {
  oauth_incomplete: 'login.oauthMissingData',
  oauth_state_mismatch: 'login.oauthInvalid',
  oauth_failed: 'login.oauthFailed',
}

export default function LoginView() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [params] = useSearchParams()
  const t = useT()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginForm>({
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    const reason = params.get('oauth_error')
    if (reason && oauthErrorKeys[reason]) {
      toast.error(t(oauthErrorKeys[reason]))
      navigate('/auth/login', { replace: true })
    }
  }, [params, navigate, t])

  const { mutate, isPending } = useMutation({
    mutationFn: authenticateUser,
    onError: (error: Error) => toast.error(error.message),
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
        <Button type="submit" className="w-full" disabled={isPending} data-testid="login-submit">
          {isPending ? t('login.submitting') : t('login.submit')}
        </Button>
      </form>

      <div className="mt-5 space-y-4">
        <Divider>{t('common.or')}</Divider>
        <OAuthButtons next="/" />
      </div>

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
