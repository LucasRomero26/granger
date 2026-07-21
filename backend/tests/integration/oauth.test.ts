import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/server'

describe('OAuth - redirect and callback routes (no DB)', () => {
  it('GET /api/auth/google redirects 302 to accounts.google.com and sets the oauth_state cookie', async () => {
    const res = await request(app)
      .get('/api/auth/google')
      .expect(302)

    const location = res.headers.location ?? ''
    expect(location).toContain('https://accounts.google.com/o/oauth2/v2/auth')
    expect(location).toContain('response_type=code')
    expect(location).toContain('state=')

    const setCookie = res.headers['set-cookie']?.[0] ?? ''
    expect(setCookie).toContain('oauth_state=')
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('SameSite=Lax')
  })

  it('GET /api/auth/github redirects 302 to github.com/login/oauth/authorize and sets the oauth_state cookie', async () => {
    const res = await request(app)
      .get('/api/auth/github')
      .expect(302)

    const location = res.headers.location ?? ''
    expect(location).toContain('https://github.com/login/oauth/authorize')
    expect(location).toContain('client_id=')
    expect(location).toContain('state=')
  })

  it('GET /api/auth/google/callback without code/state redirects to the frontend with oauth_error=oauth_incomplete', async () => {
    const res = await request(app)
      .get('/api/auth/google/callback')
      .expect(302)

    expect(res.headers.location).toContain('/auth/login?oauth_error=oauth_incomplete')
  })

  it('GET /api/auth/github/callback with a wrong state redirects with oauth_error=oauth_state_mismatch', async () => {
    const res = await request(app)
      .get('/api/auth/github/callback?code=fake&state=another-state')
      .expect(302)

    expect(res.headers.location).toContain('oauth_error=oauth_state_mismatch')
  })

  it('GET /api/auth/google preserves the next parameter in the oauth_state cookie (base64url)', async () => {
    const res = await request(app)
      .get('/api/auth/google?next=/dashboard')
      .expect(302)

    const setCookie = res.headers['set-cookie']?.[0] ?? ''
    const match = setCookie.match(/oauth_state=([^;]+)/)
    expect(match).not.toBeNull()
    const decoded = JSON.parse(
      Buffer.from(match![1], 'base64url').toString('utf8'),
    ) as { state: string; next?: string }
    expect(decoded.state).toEqual(expect.any(String))
    expect(decoded.next).toBe('/dashboard')
  })
})
