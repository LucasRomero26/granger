import { useRef, type KeyboardEvent } from 'react'
import { cn } from '@/utils/utils'
import { useT } from '@/hooks/useT'

type OTPInputProps = {
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  length?: number
  label?: string
}

export default function OTPInput({
  value,
  onChange,
  onComplete,
  length = 6,
  label,
}: OTPInputProps) {
  const t = useT()
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const completedRef = useRef('')
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')
  const effectiveLabel = label ?? t('otp.label')

  const emitComplete = (next: string) => {
    if (next.length === length && next !== completedRef.current) {
      completedRef.current = next
      onComplete?.(next)
    }
    if (next.length < length) {
      completedRef.current = ''
    }
  }

  const setDigit = (index: number, char: string) => {
    const next = digits.map((d, i) => (i === index ? char : d)).join('').slice(0, length)
    onChange(next)
    emitComplete(next)
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium text-ink">{effectiveLabel}</p>
      <div className="flex justify-center gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            aria-label={t('otp.digit', { n: index + 1 })}
            onChange={(e) => {
              const char = e.target.value.replace(/\D/g, '').slice(-1)
              setDigit(index, char)
              if (char && index < length - 1) {
                inputsRef.current[index + 1]?.focus()
              }
            }}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => {
              e.preventDefault()
              const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
              onChange(pasted)
              emitComplete(pasted)
              inputsRef.current[Math.min(pasted.length, length - 1)]?.focus()
            }}
            className={cn(
              'field h-12 w-10 rounded-xl border border-glass-border bg-frost/70 text-center text-lg font-semibold text-ink backdrop-blur-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 dark:border-glass-border/50 dark:bg-frost dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),inset_0_-1px_0_0_rgba(0,0,0,0.15)]',
            )}
          />
        ))}
      </div>
    </div>
  )
}
