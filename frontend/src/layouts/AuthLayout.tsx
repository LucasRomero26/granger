import { Link, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import LanguageToggle from '@/components/ui/LanguageToggle'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { useT } from '@/hooks/useT'

export default function AuthLayout() {
  const t = useT()

  return (
    <div className="flex min-h-dvh bg-frost">
      {/* Brand panel: same navy as the app sidebar. Hidden on small screens. */}
      <aside className="hidden w-[42%] max-w-2xl flex-col justify-between bg-navy p-12 text-navy-fg lg:flex">
        <Link to="/auth/login" className="font-display text-xl font-bold tracking-[-0.02em]">
          {t('app.name')}
        </Link>
        <div>
          <h2 className="whitespace-pre-line font-display text-4xl font-bold leading-tight tracking-[-0.02em] xl:text-5xl">
            {t('auth.tagline')}
          </h2>
          <p className="mt-5 max-w-sm text-base text-navy-muted xl:text-lg">{t('auth.taglineSub')}</p>
        </div>
        <p className="text-sm text-navy-muted">
          {t('nav.footer', { year: new Date().getFullYear() })}
        </p>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col items-center overflow-y-auto px-4 pb-8 pt-16 sm:px-8 sm:py-10">
        <div className="absolute right-4 top-4 z-toast">
          <LanguageToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="my-auto w-full max-w-md"
        >
          <span className="mb-8 block font-display text-lg font-bold tracking-[-0.02em] text-ink lg:hidden">
            {t('app.name')}
          </span>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </motion.div>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          className: 'glass-panel-strong !text-ink !shadow-lift',
        }}
      />
    </div>
  )
}
