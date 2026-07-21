import { cn } from '@/utils/utils'
import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  tone?: 'default' | 'manager' | 'collaborator' | 'success' | 'danger' | 'accent'
  className?: string
}

const tones = {
  default: 'bg-glass text-muted border-glass-border',
  manager: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
  collaborator: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  success: 'bg-success/15 text-success border-success/30',
  danger: 'bg-danger/15 text-danger border-danger/30',
  accent: 'bg-accent-soft text-accent border-accent/30',
}

export default function Badge({ children, tone = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
