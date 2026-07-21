import mongoose from 'mongoose'
import { env } from './env'

export const connectDB = async (): Promise<void> => {
  // Let the caller decide what to do on failure. We throw (rather than
  // calling process.exit) so that the bootstrap path in index.ts can log
  // the error with the configured logger and shut down gracefully, and
  // tests can assert on the rejection without the test runner being
  // terminated.
  const connection = await mongoose.connect(env.DATABASE_URL)
  console.log(`MongoDB connected at ${connection.connection.host}:${connection.connection.port}`)
}

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect()
}
