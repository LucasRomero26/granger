import * as Sentry from '@sentry/node'
import { env, isProduction } from './env'

export function initSentry(): void {
  const dsn = env.SENTRY_DSN_BACKEND ?? env.SENTRY_DSN
  if (!isProduction || !dsn) {
    return
  }

  Sentry.init({
    dsn,
    environment: env.NODE_ENV,
    tracesSampleRate: 0.2,
    profilesSampleRate: 0.1,
  })
}

export { Sentry }
