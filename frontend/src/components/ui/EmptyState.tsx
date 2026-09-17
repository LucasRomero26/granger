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
      className={cn(
        'rounded-2xl border border-dashed border-glass-border bg-frost/60 px-8 py-16 text-center',
        className,
      )}
    >
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 text-muted">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-6 inline-flex rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-navy-fg shadow-soft transition hover:bg-navy-soft"
        >
          {actionLabel}
        </Link>
      )}
      {children}
    </motion.div>
  )
}
