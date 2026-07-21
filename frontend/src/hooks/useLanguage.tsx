import { useContext, useEffect, useState, type ReactNode } from 'react'
import { LanguageContext, type Language } from './LanguageContext'

export type { Language } from './LanguageContext'
export { LanguageContext } from './LanguageContext'

const STORAGE_KEY = 'GRANGER_LANG'

function getInitialLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null
  if (stored === 'en' || stored === 'es') return stored
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('es')
    ? 'es'
    : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() =>
    typeof window === 'undefined' ? 'en' : getInitialLanguage(),
  )

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const setLang = (next: Language) => setLangState(next)
  const toggleLang = () => setLangState((l) => (l === 'en' ? 'es' : 'en'))

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
