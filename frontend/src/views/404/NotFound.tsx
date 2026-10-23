import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'
import LanguageToggle from '@/components/ui/LanguageToggle'
import PageTransition from '@/components/ui/PageTransition'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useT } from '@/hooks/useT'

export default function NotFound() {
  const t = useT()
  usePageMeta('notFound')

  return (
    <div className="flex min-h-dvh flex-col bg-mist">
      <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link to="/" className="transition hover:opacity-80">
          <Logo size="sm" />
        </Link>
        <LanguageToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <PageTransition className="w-full max-w-lg rounded-2xl border border-glass-border bg-frost p-8 text-center shadow-lift sm:p-12">
          <p className="font-display text-7xl font-bold tracking-[-0.04em] text-accent sm:text-8xl" aria-hidden="true">
            404
          </p>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">
            {t('notFound.title')}
          </h1>
          <p className="mt-3 text-muted">{t('notFound.body')}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-navy-fg shadow-soft transition hover:bg-navy-soft"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('notFound.home')}
            </Link>
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center rounded-xl border border-glass-border bg-frost px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-glass"
            >
              {t('notFound.login')}
            </Link>
          </div>
        </PageTransition>
      </main>

      <footer className="pb-6 text-center text-sm text-muted">
        {t('nav.footer', { year: new Date().getFullYear() })}
      </footer>
    </div>
  )
}
