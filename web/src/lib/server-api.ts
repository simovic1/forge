import { cookies } from 'next/headers'
import { TOKEN_COOKIE } from '@/lib/auth'
import type {
  DailyLogResponse,
  MonthlyReportResponse,
  WeeklyReportResponse,
} from '@/lib/api'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value
  if (!token) return fallback

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return fallback
    return res.json()
  } catch {
    return fallback
  }
}

// Server-side fetch of the current user's data (reads the auth cookie and
// forwards it as a Bearer token). Returns [] when unauthenticated or on error.
export function fetchDailyLogs(): Promise<DailyLogResponse[]> {
  return fetchJson<DailyLogResponse[]>('/api/daily-logs', [])
}

export function fetchWeeklyReports(): Promise<WeeklyReportResponse[]> {
  return fetchJson<WeeklyReportResponse[]>('/api/weekly-reports', [])
}

export function fetchMonthlyReports(): Promise<MonthlyReportResponse[]> {
  return fetchJson<MonthlyReportResponse[]>('/api/monthly-reports', [])
}
