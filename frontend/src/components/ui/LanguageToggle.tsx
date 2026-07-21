import { Languages } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useT } from '@/hooks/useT'
import Button from './Button'

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage()
  const t = useT()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLang}
      aria-label={t('nav.toggleLang')}
      className="!rounded-full !p-2.5 !text-xs !font-semibold"
    >
      <Languages className="h-4 w-4" />
      <span className="ml-1 uppercase">{lang}</span>
    </Button>
  )
}
