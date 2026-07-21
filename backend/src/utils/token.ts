import crypto from 'node:crypto'

export function generateNumericToken(length = 8): string {
  const min = 10 ** (length - 1)
  const max = 10 ** length - 1
  const token = crypto.randomInt(min, max + 1)
  return token.toString()
}

export function generateRandomString(length: number): string {
  return crypto.randomBytes(length).toString('hex')
}

export function generateOauthState(): string {
  return crypto.randomBytes(32).toString('hex')
}
