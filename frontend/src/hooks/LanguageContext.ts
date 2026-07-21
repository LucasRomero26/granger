import { createContext } from 'react'

export type Language = 'en' | 'es'

export type LanguageContextValue = {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
