import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/utils/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  'aria-label'?: string
  'data-testid'?: string
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:brightness-110 shadow-sm',
  secondary: 'bg-glass-strong border border-glass-border text-ink hover:bg-frost',
  ghost: 'bg-transparent text-muted hover:bg-glass hover:text-ink',
  danger: 'bg-danger/15 text-danger hover:bg-danger/25',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-4 py-2.5 text-sm rounded-2xl',
  lg: 'px-6 py-3 text-base rounded-2xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { scale: 1.015, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
