import { Link } from 'react-router-dom'
import PageTransition from '@/components/ui/PageTransition'
import { useT } from '@/hooks/useT'

export default function NotFound() {
  const t = useT()
  return (
    <PageTransition className="text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">{t('notFound.title')}</h1>
      <p className="mt-3 text-muted">
        {t('notFound.body')}{' '}
        <Link to="/" className="font-semibold text-accent hover:underline">
          {t('notFound.link')}
        </Link>
      </p>
    </PageTransition>
  )
}
