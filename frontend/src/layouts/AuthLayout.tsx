import { Link, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ui/ThemeToggle'
import LanguageToggle from '@/components/ui/LanguageToggle'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center overflow-y-auto px-4 pb-6 pt-14 sm:py-10">
      <div className="absolute right-4 top-4 z-toast flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="my-auto w-full max-w-md"
      >
        <Link to="/auth/login" className="mb-5 flex justify-center md:mb-7">
          <Logo size="lg" stacked />
        </Link>

        <div className="glass-panel-strong p-5 sm:p-6 md:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </motion.div>

      <Toaster
        position="top-center"
        toastOptions={{
          className: 'glass-panel-strong !text-ink !shadow-lift',
        }}
      />
    </div>
  )
}
