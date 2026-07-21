import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { messages as en } from '@/locales/en'
import { messages as es } from '@/locales/es'
import { LanguageContext, type Language } from '@/hooks/useLanguage'

type Props = {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

type State = {
  error: Error | null
}

type Dict = Record<string, string>
const dictionaries: Record<Language, Dict> = {
  en: en as unknown as Dict,
  es: es as unknown as Dict,
}

export default class ErrorBoundary extends Component<Props, State> {
  static contextType = LanguageContext
  declare context: Language | null

  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] caught render error:', error, info)
    }
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    if (this.props.fallback) {
      return this.props.fallback(error, this.reset)
    }

    const lang: Language = this.context ?? 'en'
    const t = (key: string) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key

    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-semibold text-ink">{t('error.title')}</h2>
        <p className="text-sm text-muted">{t('error.body')}</p>
        {import.meta.env.DEV && (
          <pre className="max-w-full overflow-auto rounded-xl bg-mist/40 p-3 text-left text-[11px] text-muted">
            {error.message}
          </pre>
        )}
        <button
          type="button"
          onClick={this.reset}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-strong"
        >
          <RefreshCw className="h-4 w-4" />
          {t('error.retry')}
        </button>
      </div>
    )
  }
}
