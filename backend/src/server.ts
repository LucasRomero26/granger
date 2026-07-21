import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import morgan from 'morgan'
import mongoose from 'mongoose'
import type { Express } from 'express'
import { corsConfig } from './config/cors'
import { securityHeaders, sanitizeData, preventParamPollution, performanceHeaders } from './middleware/security'
import { apiRateLimiter } from './middleware/rateLimit'
import { errorHandler, notFoundHandler } from './middleware/error'
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'
import { isTest } from './config/env'
import { initSentry } from './config/sentry'

initSentry()

// Build the Express application synchronously so the module can be imported and
// re-used from both the production server entry point (index.ts) and the test
// suite (which uses supertest's agent against `app`). Database connection is
// deferred to an async bootstrap function invoked from index.ts in production,
// while tests run against an in-memory MongoDB so they skip connectDB entirely.
function createApp(): Express {
  const app = express()

  app.disable('x-powered-by')

  // Trust proxy: required for accurate rate limiting behind Render
  app.set('trust proxy', 1)
  // Gzip compression
  app.use(compression())

  // CORS
  app.use(cors(corsConfig))

  // Security headers (Helmet + custom)
  app.use(securityHeaders)

  // Cookies (for httpOnly refresh tokens)
  app.use(cookieParser())

  // Body parsers with a size limit
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true, limit: '1mb' }))

  // Prevent HTTP parameter pollution
  app.use(preventParamPollution)

  // Sanitize MongoDB data (prevents NoSQL injection)
  app.use(sanitizeData)

  // Extra performance headers
  app.use(performanceHeaders)

  // HTTP request logging
  if (!isTest) {
    app.use(
      morgan('dev', {
        skip: (req) => req.url === '/health' || req.url === '/favicon.ico',
      }),
    )
  }

  // Global rate limiting
  app.use('/api/', apiRateLimiter)

  // Health check (liveness): the process is alive and accepting requests.
  // Used by Render's liveness probe so the container restarts on crash.
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // Readiness check: returns 200 only when the DB is connected, so a load
  // balancer can avoid routing traffic to this instance until it can serve
  // real requests. mongoose readyState: 0=disconnected, 1=connected,
  // 2=connecting, 3=disconnecting.
  app.get('/ready', (_req, res) => {
    const dbReady = mongoose.connection.readyState === 1
    res.status(dbReady ? 200 : 503).json({
      status: dbReady ? 'ready' : 'not_ready',
      db: mongoose.STATES[mongoose.connection.readyState],
      timestamp: new Date().toISOString(),
    })
  })

  // API routes
  app.use('/api/auth', authRoutes)
  app.use('/api/projects', projectRoutes)

  // 404 handler
  app.use(notFoundHandler)

  // Error handler (must be the last middleware, after all routes)
  app.use(errorHandler)

  return app
}

const app = createApp()

// Bootstrap asynchronous resources. In production this is invoked from
// index.ts after the HTTP server is bound, so the process starts accepting
// requests only once the broker/DB are ready. Tests use the synchronous
// `app` export and manage their own database fixture, so they skip this.
export async function bootstrap(): Promise<void> {
  if (isTest) {
    return
  }
  await connectDB()
}

export default app
