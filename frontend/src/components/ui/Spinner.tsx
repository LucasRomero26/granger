import { cn } from '@/utils/utils'

export default function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-20', className)}>
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent"
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}

/** Small spinner that inherits the text color, for buttons and inline status. */
export function InlineSpinner({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent', className)}
      aria-hidden
    />
  )
}
