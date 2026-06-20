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

// Only logDate is required; every metric is optional.
// energyLevel/stressLevel/moodLevel use a 1-5 scale (1 = low, 5 = high).
export type CreateDailyLogRequest = {
  logDate: string
  weight?: number
  sleepingHours?: number
  steps?: number
  trainingCompleted?: boolean
  proteinGrams?: number
  calories?: number
  waterLiters?: number
  overeating?: boolean
  triggerType?: string
  resistedTrigger?: boolean
  energyLevel?: number
  stressLevel?: number
  moodLevel?: number
  notes?: string
}

export type DailyLogResponse = CreateDailyLogRequest & {
  id: number
  userId: number
}

export async function createDailyLog(
  body: CreateDailyLogRequest,
): Promise<DailyLogResponse> {
  const res = await fetch('/api/daily-logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new ApiError(res.status, await parseError(res))
  }

  return res.json()
}

/** Returns the user's log for a given date, or null if none exists yet. */
export async function getDailyLogByDate(
  date: string,
): Promise<DailyLogResponse | null> {
  const res = await fetch(`/api/daily-logs?from=${date}&to=${date}`)

  if (!res.ok) {
    throw new ApiError(res.status, await parseError(res))
  }

  const list: DailyLogResponse[] = await res.json()
  return list[0] ?? null
}

export async function updateDailyLog(
  id: number,
  body: CreateDailyLogRequest,
): Promise<DailyLogResponse> {
  const res = await fetch(`/api/daily-logs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new ApiError(res.status, await parseError(res))
  }

  return res.json()
}
