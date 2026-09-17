import { Languages } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useT } from '@/hooks/useT'
import { cn } from '@/utils/utils'
import Button from './Button'

export default function LanguageToggle({ className }: { className?: string }) {
  const { lang, toggleLang } = useLanguage()
  const t = useT()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLang}
      aria-label={t('nav.toggleLang')}
      className={cn('!rounded-full !px-3 !py-2 !text-xs !font-semibold', className)}
    >
      <Languages className="h-4 w-4" />
      <span className="uppercase">{lang}</span>
    </Button>
  )
}
