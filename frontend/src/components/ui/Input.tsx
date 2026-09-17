import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/utils'

const fieldClass = 'field'
const fieldCompactClass = 'field-compact'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  compact?: boolean
}

export function Input({ label, error, className, id, compact, autoComplete = 'off', ...props }: InputProps) {
  const inputId = id ?? props.name
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <input
        id={inputId}
        autoComplete={autoComplete}
        className={cn(compact ? fieldCompactClass : fieldClass, className)}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  )
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, id, autoComplete = 'off', ...props }: TextareaProps) {
  const inputId = id ?? props.name
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        autoComplete={autoComplete}
        className={cn(fieldClass, 'min-h-[120px] resize-y', className)}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  )
}

export function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm font-medium text-danger" role="alert">
      {children}
    </p>
  )
}
