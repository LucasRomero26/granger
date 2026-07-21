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
