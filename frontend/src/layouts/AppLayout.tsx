import { Link, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import NavMenu from '@/components/NavMenu'
import ThemeToggle from '@/components/ui/ThemeToggle'
import LanguageToggle from '@/components/ui/LanguageToggle'
import Spinner from '@/components/ui/Spinner'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { useAuth } from '@/hooks/useAuth'
import { useT } from '@/hooks/useT'

export default function AppLayout() {
  const { data, isError, isLoading } = useAuth()
  const t = useT()

  if (isLoading) return <Spinner />
  if (isError) return <Navigate to="/auth/login" replace />
  if (!data) return null

  return (
    <div className="min-h-screen">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-sticky px-3 pt-3 md:px-4"
      >
        <div className="glass-panel-strong mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-2.5 md:px-5">
          <Link to="/" className="shrink-0 transition duration-300 hover:opacity-80">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <NavMenu name={data.name} avatar={data.avatar ?? undefined} />
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-screen-2xl px-4 py-6 md:px-6 md:py-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      <footer className="pb-8 pt-2 text-center text-sm text-muted">
        {t('nav.footer', { year: new Date().getFullYear() })}
      </footer>

      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-panel-strong !text-ink !shadow-lift',
          duration: 2800,
        }}
      />
    </div>
  )
}
