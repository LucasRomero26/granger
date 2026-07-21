import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { confirmAccount } from '@/api/AuthAPI'
import OTPInput from '@/components/ui/OTPInput'
import PageTransition from '@/components/ui/PageTransition'
import { useT } from '@/hooks/useT'

export default function ConfirmAccountView() {
  const [token, setToken] = useState('')
  const t = useT()
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email ?? ''

  const { mutate, isPending } = useMutation({
    mutationFn: confirmAccount,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data ?? t('confirm.title'))
      navigate('/auth/login', { replace: true })
    },
  })

  return (
    <PageTransition>
      <h1 className="font-display text-2xl font-semibold text-ink">{t('confirm.title')}</h1>
      <p className="mt-2 text-sm text-muted">{t('confirm.subtitle')}</p>

      {email && (
        <p className="mt-1 text-sm font-medium text-ink/80">{email}</p>
      )}

      <div className="mt-6">
        <OTPInput
          value={token}
          onChange={setToken}
          onComplete={(value) => mutate({ token: value })}
          length={8}
          disabled={isPending}
        />
      </div>

      <nav className="mt-5 text-center text-sm text-muted">
        <Link to="/auth/request-code" className="hover:text-accent">
          {t('confirm.requestNew')}
        </Link>
      </nav>
    </PageTransition>
  )
}
