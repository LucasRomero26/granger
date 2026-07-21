import type { CorsOptions } from 'cors'
import { env, isDevelopment } from './env'

const whitelist = [env.FRONTEND_URL, env.BACKEND_URL, 'http://localhost:5173', 'http://localhost:4173']

if (isDevelopment) {
  whitelist.push('http://localhost:5173')
}

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an origin (mobile apps, curl, server-to-server)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin not allowed: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400,
}
