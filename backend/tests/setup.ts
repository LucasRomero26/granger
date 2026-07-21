import 'dotenv/config'

// Load environment variables for testing
process.env.NODE_ENV = 'test'

// If DATABASE_URL is not set, provide a placeholder. Integration tests use
// mongodb-memory-server, so the value here only needs to exist so that the
// env schema validation passes.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'mongodb://localhost:27017/granger-test'
}
if (!process.env.JWT_ACCESS_SECRET) {
  process.env.JWT_ACCESS_SECRET = 'test-access-secret-at-least-32-characters-long-for-testing-purposes'
}
if (!process.env.JWT_REFRESH_SECRET) {
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-characters-long-for-testing-purposes'
}
if (!process.env.RESEND_API_KEY) {
  process.env.RESEND_API_KEY = 're_test_dummy_key_for_testing_only'
}
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud'
}
if (!process.env.CLOUDINARY_API_KEY) {
  process.env.CLOUDINARY_API_KEY = 'test-key'
}
if (!process.env.CLOUDINARY_API_SECRET) {
  process.env.CLOUDINARY_API_SECRET = 'test-secret'
}
if (!process.env.GOOGLE_CLIENT_ID) {
  process.env.GOOGLE_CLIENT_ID = 'test-google-client-id'
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret'
}
if (!process.env.GITHUB_OAUTH_CLIENT_ID) {
  process.env.GITHUB_OAUTH_CLIENT_ID = 'test-github-client-id'
}
if (!process.env.GITHUB_OAUTH_CLIENT_SECRET) {
  process.env.GITHUB_OAUTH_CLIENT_SECRET = 'test-github-client-secret'
}
