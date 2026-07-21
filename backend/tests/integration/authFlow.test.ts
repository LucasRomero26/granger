import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import app from '../../src/server'
import Token from '../../src/models/Token'

// Avoid sending real emails during tests
vi.mock('../../src/emails/AuthEmail', () => ({
  AuthEmail: {
    sendConfirmationEmail: vi.fn().mockResolvedValue(undefined),
    sendPasswordResetToken: vi.fn().mockResolvedValue(undefined),
  },
}))

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

beforeEach(async () => {
  const collections = mongoose.connection.collections
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({})
  }
})

const PASSWORD = 'TestPass123'

describe('Full authentication flow with httpOnly cookies', () => {
  it('register -> confirm -> login -> /auth/user -> refresh -> logout', async () => {
    // 1) Register
    const regRes = await request(app)
      .post('/api/auth/create-account')
      .send({
        name: 'Test User',
        email: 'test@granger.test',
        password: PASSWORD,
        password_confirmation: PASSWORD,
      })
      .expect(201)
    expect(regRes.body).toHaveProperty('message')

    // 2) Confirm the account with the token stored in the DB
    const tokenDoc = await Token.findOne({ type: 'email_confirmation' })
    expect(tokenDoc).not.toBeNull()
    const confirmRes = await request(app)
      .post('/api/auth/confirm-account')
      .send({ token: tokenDoc!.token })
      .expect(200)
    expect(confirmRes.body).toHaveProperty('message')

    // 3) Login: must set httpOnly cookies and return { user, accessToken }
    const loginAgent = request.agent(app)
    const loginRes = await loginAgent
      .post('/api/auth/login')
      .send({ email: 'test@granger.test', password: PASSWORD })
      .expect(200)

    expect(loginRes.body).toHaveProperty('accessToken')
    expect(loginRes.body).toHaveProperty('user')
    expect(loginRes.body.user.email).toBe('test@granger.test')

    const setCookies = loginRes.headers['set-cookie'] ?? []
    const allCookies = Array.isArray(setCookies) ? setCookies.join('\n') : setCookies
    expect(allCookies).toContain('access_token=')
    expect(allCookies).toContain('refresh_token=')
    expect(allCookies).toContain('HttpOnly')

    // 4) GET /auth/user with an httpOnly cookie -> must respond with the user
    const userRes = await loginAgent
      .get('/api/auth/user')
      .expect(200)
    expect(userRes.body.email).toBe('test@granger.test')

    // 5) Refresh: returns a new accessToken and rotates the refresh_token cookie
    const refreshRes = await loginAgent
      .post('/api/auth/refresh')
      .expect(200)
    expect(refreshRes.body).toHaveProperty('accessToken')

    // 6) Logout: revokes the refresh token and clears the cookies
    const logoutRes = await loginAgent
      .post('/api/auth/logout')
      .expect(200)
    expect(logoutRes.body).toHaveProperty('message')

    const logoutCookies = logoutRes.headers['set-cookie'] ?? []
    const logoutCookiesStr = Array.isArray(logoutCookies)
      ? logoutCookies.join('\n')
      : logoutCookies
    expect(logoutCookiesStr).toContain('access_token=;')
    expect(logoutCookiesStr).toContain('refresh_token=;')

    // 7) GET /auth/user after logout -> 401
    await loginAgent.get('/api/auth/user').expect(401)
  })
})
