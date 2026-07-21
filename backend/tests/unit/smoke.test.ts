import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/server'

describe('Smoke test - server responds', () => {
  it('GET /health returns 200 with status ok', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status', 'ok')
    expect(response.body).toHaveProperty('timestamp')
  })

  it('GET /api/auth/user without authentication returns 401', async () => {
    const response = await request(app).get('/api/auth/user')
    expect(response.status).toBe(401)
  })

  it('POST /api/auth/login without body returns 400 (zod validation)', async () => {
    const response = await request(app).post('/api/auth/login').send({})
    expect(response.status).toBe(400)
  })

  it('GET /nonexistent-path returns a 404 JSON', async () => {
    const response = await request(app).get('/nonexistent-path')
    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Route not found' })
  })
})
