import app, { bootstrap } from './server'
import { env } from './config/env'

const port = env.PORT

const server = app.listen(port, async () => {
  console.log(`Granger API listening on http://localhost:${port}`)
  console.log(`Environment: ${env.NODE_ENV}`)
  console.log(`CORS origin: ${env.FRONTEND_URL}`)
  console.log('')

  // Connect to MongoDB after the server starts listening so the HTTP health
  // check (/health) can answer Render's liveness probe before the DB is
  // ready. Connection failures are logged and exit the process; the
  // supervisor (Render) will restart it.
  try {
    await bootstrap()
  } catch (err) {
    console.error('Bootstrap failed:', err instanceof Error ? err.message : err)
    process.exit(1)
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down the server...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down the server...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

// Capture unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

export default server
