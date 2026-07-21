import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { setAccessToken } from '@/lib/axios'
import Spinner from '@/components/ui/Spinner'
import { useT } from '@/hooks/useT'

function safeNextPath(next?: string | null): string {
  if (typeof next !== 'string') return '/'
  if (!next.startsWith('/')) return '/'
  if (next.startsWith('//')) return '/'
  return next
}

export default function OAuthSuccessView() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [params] = useSearchParams()
  const t = useT()

  useEffect(() => {
    const accessToken = params.get('accessToken')
    const next = safeNextPath(params.get('next'))

    if (!accessToken) {
      toast.error(t('oauth.requireLogin'))
      navigate('/auth/login', { replace: true })
      return
    }

    setAccessToken(accessToken)
    queryClient.invalidateQueries({ queryKey: ['user'] })
    toast.success(t('oauth.successWelcome'))
    navigate(next, { replace: true })
  }, [params, navigate, queryClient, t])

  return <Spinner />
}
