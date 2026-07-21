import logoDark from '@/assets/logo-dark.webp'
import logoLight from '@/assets/logo-light.webp'
import { cn } from '@/utils/utils'

type LogoSize = 'sm' | 'md' | 'lg' | 'xl'

type LogoProps = {
  className?: string
  showWordmark?: boolean
  size?: LogoSize
  /** Stack mark above the wordmark (auth hero). */
  stacked?: boolean
}

const markClass: Record<LogoSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-24 w-24 md:h-28 md:w-28',
  xl: 'h-32 w-32 md:h-40 md:w-40',
}

const markPx: Record<LogoSize, number> = {
  sm: 36,
  md: 44,
  lg: 112,
  xl: 160,
}

const wordClass: Record<LogoSize, string> = {
  sm: 'text-[1.2rem]',
  md: 'text-[1.35rem]',
  lg: 'text-2xl md:text-3xl',
  xl: 'text-3xl md:text-4xl',
}

export default function Logo({
  className,
  showWordmark = true,
  size = 'md',
  stacked = false,
}: LogoProps) {
  const px = markPx[size]

  return (
    <div
      className={cn(
        'flex items-center text-ink',
        stacked ? 'flex-col gap-3' : 'gap-2.5',
        className,
      )}
    >
      {/* Both marks share one box so theme toggle crossfades without layout jump */}
      <span
        className={cn('relative inline-block shrink-0', markClass[size])}
        style={{ width: px, height: px }}
      >
        <img
          src={logoDark}
          alt=""
          width={px}
          height={px}
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain opacity-100 transition-opacity duration-300 ease-out dark:opacity-0"
        />
        <img
          src={logoLight}
          alt=""
          width={px}
          height={px}
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 ease-out dark:opacity-100"
        />
        <span className="sr-only">Granger</span>
      </span>
      {showWordmark && (
        <span
          className={cn(
            'font-display font-semibold tracking-[-0.03em]',
            wordClass[size],
          )}
        >
          Granger
        </span>
      )}
    </div>
  )
}
