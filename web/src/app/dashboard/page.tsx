import { cookies } from 'next/headers'
import WeightChart from '@/app/components/WeightChart'
import type { DailyLogResponse } from '@/lib/api'
import { TOKEN_COOKIE } from '@/lib/auth'
import { computeDashboardStats, computeWeightTrend } from '@/lib/dashboard'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

async function fetchLogs(): Promise<DailyLogResponse[]> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value
  if (!token) return []

  try {
    const res = await fetch(`${BACKEND_URL}/api/daily-logs`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function DashboardPage() {
  const logs = await fetchLogs()
  const stats = computeDashboardStats(logs)
  const weightTrend = computeWeightTrend(logs)

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-[var(--color-muted)]">
        Behavior-based fitness tracking application focused on long-term weight loss, habit building, and self-awareness.
        </p>
      </header>

      <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--color-border)] p-4"
          >
            <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
              {stat.label}
            </p>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <span className="text-xl font-semibold">{stat.value}</span>
              {stat.sub && (
                <span className="text-sm font-normal text-[var(--color-muted)]">
                  {stat.sub}
                </span>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="mb-1 text-lg font-semibold">Weight trend</h2>
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          Last 7 logged days
        </p>
        {weightTrend.length > 0 ? (
          <WeightChart data={weightTrend} />
        ) : (
          <p className="py-12 text-center text-sm text-[var(--color-muted)]">
            No weight logged yet.
          </p>
        )}
      </section>
    </main>
  )
}
