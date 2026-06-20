// Client-side helpers for the FORGE API.
// Calls are made same-origin to Next.js route handlers under /api/*,
// which proxy to the backend server-side (avoids browser CORS).

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export type RegisterRequest = {
  email: string
  password: string
  name?: string
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json()
    return body?.message ?? body?.error ?? res.statusText
  } catch {
    return res.statusText || `Request failed (${res.status})`
  }
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const res = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new ApiError(res.status, await parseError(res))
  }

  return res.json()
}

export async function register(body: RegisterRequest): Promise<void> {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new ApiError(res.status, await parseError(res))
  }
}
