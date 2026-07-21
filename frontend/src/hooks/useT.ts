import { useLanguage, type Language } from '@/hooks/useLanguage'
import { messages as en } from '@/locales/en'
import { messages as es } from '@/locales/es'
import type { TaskStatus } from '@/types'

type Messages = Record<string, string>

const dictionaries: Record<Language, Messages> = {
  en,
  es,
}

export type TFunc = (key: string, vars?: Record<string, string | number>) => string

export function useT(): TFunc {
  const { lang } = useLanguage()
  return (key: string, vars?: Record<string, string | number>) => {
    const dict = dictionaries[lang]
    const fallback = dictionaries.en
    let str = dict[key] ?? fallback[key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      }
    }
    return str
  }
}

/** Status label keys in the dictionaries (matches `statusTranslations` legacy export). */
const STATUS_KEY: Record<TaskStatus, string> = {
  pending: 'status.pending',
  onHold: 'status.onHold',
  inProgress: 'status.inProgress',
  underReview: 'status.underReview',
  completed: 'status.completed',
}

/**
 * Reactive status label dictionary — locale-aware replacement for the static
 * `statusTranslations` export from `@/locales/en`. Returns a `Record<TaskStatus,
 * string>` that updates when the active language changes.
 */
export function useStatusLabels(): Record<TaskStatus, string> {
  const t = useT()
  return {
    pending: t(STATUS_KEY.pending),
    onHold: t(STATUS_KEY.onHold),
    inProgress: t(STATUS_KEY.inProgress),
    underReview: t(STATUS_KEY.underReview),
    completed: t(STATUS_KEY.completed),
  }
}

/** Devuelve el locale activo ('en' o 'es') para Intl.DateTimeFormat etc. */
export function useLocale(): string {
  const { lang } = useLanguage()
  return lang === 'es' ? 'es-ES' : 'en-US'
}
