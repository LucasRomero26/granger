import { cn } from '@/utils/utils'
import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  tone?: 'default' | 'manager' | 'collaborator' | 'success' | 'danger' | 'accent'
  className?: string
}

const tones = {
  default: 'bg-glass text-muted border-glass-border',
  manager: 'bg-accent-soft text-accent border-accent/20',
  collaborator: 'bg-pink/15 text-pink border-pink/25',
  success: 'bg-success/12 text-success border-success/25',
  danger: 'bg-danger/12 text-danger border-danger/25',
  accent: 'bg-brass/15 text-brass border-brass/30',
}

export default function Badge({ children, tone = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
