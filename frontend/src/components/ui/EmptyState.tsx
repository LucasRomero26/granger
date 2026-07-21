import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/utils/utils'

type EmptyStateProps = {
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
  className?: string
  children?: ReactNode
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  className,
  children,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('glass-panel px-8 py-16 text-center', className)}
    >
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 text-muted">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-6 inline-flex rounded-2xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition hover:brightness-110"
        >
          {actionLabel}
        </Link>
      )}
      {children}
    </motion.div>
  )
}
