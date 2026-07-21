import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { isDemoMode, handleDemoRequest } from '@/lib/demo'

/*
 * Auth strategy (cookie-based):
 * - The backend sets `access_token` (15 min) and `refresh_token` (7 days) in httpOnly cookies.
 * - Since access_token is httpOnly, the frontend cannot read it from the cookie.
 *   The /auth/login endpoint also returns `accessToken` in the JSON body, which
 *   we keep in module memory to send it in the Authorization header.
 * - When a request receives a 401, the interceptor calls /auth/refresh, which
 *   rotates the httpOnly cookie and returns a new `accessToken` in the body. We
 *   retry the original request a single time.
 * - withCredentials: true is required so the browser sends the cookies.
 */

let inMemoryAccessToken: string | null = null

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (inMemoryAccessToken) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`
  }
  return config
})

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }
  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const { data } = await axios.post<{ accessToken: string }>(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      )
      const token = data?.accessToken
      if (token) {
        setAccessToken(token)
        return token
      }
      setAccessToken(null)
      return null
    } catch {
      setAccessToken(null)
      return null
    } finally {
      isRefreshing = false
    }
  })()
  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retried &&
      !(originalRequest.url ?? '').includes('/auth/refresh') &&
      !(originalRequest.url ?? '').includes('/auth/login')
    ) {
      originalRequest._retried = true
      const newToken = await refreshAccessToken()
      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      }
    }
    return Promise.reject(error)
  },
)

if (isDemoMode) {
  setAccessToken('demo-jwt-token')

  api.defaults.adapter = async (
    config: InternalAxiosRequestConfig,
  ): Promise<AxiosResponse> => {
    const method = (config.method ?? 'get').toUpperCase()
    const base = (config.baseURL ?? '').replace(/\/$/, '')
    const rawUrl = config.url ?? ''
    const full = rawUrl.startsWith('http')
      ? rawUrl
      : `${base}/${rawUrl.replace(/^\//, '')}`
    const apiRoot = (import.meta.env.VITE_API_URL as string).replace(/\/$/, '')
    const path =
      full.replace(apiRoot, '').replace(/^\//, '') || rawUrl.replace(/^\//, '')

    const result = handleDemoRequest(
      method,
      path,
      config.data
        ? JSON.parse(
            typeof config.data === 'string'
              ? config.data
              : JSON.stringify(config.data),
          )
        : undefined,
    )

    if (!result || result.status >= 400) {
      const err: AxiosError = {
        message:
          (result?.data as { error?: string })?.error ??
          'Demo request failed',
        response: {
          status: result?.status ?? 404,
          data: result?.data ?? { error: 'Not found' },
          headers: {},
          config,
          statusText: 'Error',
        },
        isAxiosError: true,
        config,
        toJSON: () => ({}),
        name: 'AxiosError',
      } as AxiosError
      return Promise.reject(err)
    }

    return {
      data: result.data,
      status: result.status,
      statusText: 'OK',
      headers: {},
      config,
    }
  }
}

export default api
