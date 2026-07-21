import jwt, { type SignOptions } from 'jsonwebtoken'
import type { Types } from 'mongoose'
import { env } from '../config/env'

type AccessPayload = { id: string }
type RefreshPayload = { id: string; jti: string }

const ACCESS_EXPIRES_IN = env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn']
const REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn']

const signOptions: SignOptions = { algorithm: 'HS256' }

export function generateAccessToken(id: Types.ObjectId | string): string {
  return jwt.sign({ id: id.toString() } satisfies AccessPayload, env.JWT_ACCESS_SECRET, {
    ...signOptions,
    expiresIn: ACCESS_EXPIRES_IN ?? '15m',
  })
}

export function generateRefreshToken(id: Types.ObjectId | string, jti: string): string {
  return jwt.sign({ id: id.toString(), jti } satisfies RefreshPayload, env.JWT_REFRESH_SECRET, {
    ...signOptions,
    expiresIn: REFRESH_EXPIRES_IN ?? '7d',
  })
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload
}

export function verifyRefreshToken(token: string): RefreshPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload
}
