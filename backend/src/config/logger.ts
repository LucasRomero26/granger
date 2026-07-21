import pino, { type LoggerOptions } from 'pino'
import { env, isProduction, isTest } from './env'

const baseOptions: LoggerOptions = {
  level: isProduction ? 'info' : 'debug',
  base: { service: 'granger-backend' },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.password_confirmation',
      '*.current_password',
      '*.token',
      '*.refreshToken',
      '*.accessToken',
      '*.jti',
      '*.apiKey',
      '*.apiSecret',
      '*.clientSecret',
    ],
    censor: '[REDACTED]',
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
}

if (isTest) {
  baseOptions.level = 'silent'
}

// In production, ship logs to Better Stack (formerly Logtail) via the official
// @logtail/pino transport. We use a worker thread so shipping does not block
// the request hot path. Falls back to a single stdout stream in development
// and tests.
if (isProduction && env.LOGTAIL_SOURCE_TOKEN) {
  baseOptions.transport = {
    targets: [
      { target: 'pino/file', level: 'info', options: { destination: 1 } },
      {
        target: '@logtail/pino',
        level: 'info',
        options: { sourceToken: env.LOGTAIL_SOURCE_TOKEN },
      },
    ],
  }
}

export const logger = pino(baseOptions)

export default logger
