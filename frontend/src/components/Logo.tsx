import logoDark from '@/assets/logo-dark.webp'
import logoLight from '@/assets/logo-light.webp'
import { cn } from '@/utils/utils'

type LogoSize = 'sm' | 'md' | 'lg' | 'xl'
type LogoTone = 'ink' | 'light'

type LogoProps = {
  className?: string
  showWordmark?: boolean
  size?: LogoSize
  /** `ink` for light surfaces, `light` for the navy sidebar / blue backdrop. */
  tone?: LogoTone
  /** Stack mark above the wordmark (auth hero). */
  stacked?: boolean
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
  tone = 'ink',
  stacked = false,
}: LogoProps) {
  const px = markPx[size]

  return (
    <div
      className={cn(
        'flex items-center',
        tone === 'light' ? 'text-white' : 'text-ink',
        stacked ? 'flex-col gap-3' : 'gap-2.5',
        className,
      )}
    >
      <img
        src={tone === 'light' ? logoLight : logoDark}
        alt="Granger"
        width={px}
        height={px}
        decoding="async"
        className="shrink-0 object-contain"
        style={{ width: px, height: px }}
      />
      {showWordmark && (
        <span className={cn('font-display font-bold tracking-[-0.02em]', wordClass[size])}>
          Granger
        </span>
      )}
    </div>
  )
}
