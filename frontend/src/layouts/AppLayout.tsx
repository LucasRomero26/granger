import { Link, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import NavMenu from '@/components/NavMenu'
import Sidebar from '@/components/Sidebar'
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
    <div className="min-h-screen bg-mist">
      {/* Compact header for small screens; the sidebar takes over on lg+. */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-sticky border-b border-glass-border bg-frost/95 backdrop-blur lg:hidden"
      >
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-2.5">
          <Link to="/" className="shrink-0 transition hover:opacity-80">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <NavMenu name={data.name} avatar={data.avatar ?? undefined} />
          </div>
        </div>
      </motion.header>

      <div className="mx-auto flex max-w-screen-2xl gap-6 px-4 py-4 md:px-6 lg:px-6">
        <Sidebar name={data.name} email={data.email} avatar={data.avatar ?? undefined} />

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 py-2 md:py-4">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>

          <footer className="pb-4 pt-8 text-center text-sm text-muted">
            {t('nav.footer', { year: new Date().getFullYear() })}
          </footer>
        </div>
      </div>

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
