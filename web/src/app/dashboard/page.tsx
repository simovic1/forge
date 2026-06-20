import WeightChart, { type WeightPoint } from '@/app/components/WeightChart'
import LogoutButton from '@/app/components/LogoutButton'

// Placeholder data — replace with data from the FORGE backend API once wired up.
const weightTrend: WeightPoint[] = [
  { date: 'Mar 1', weight: 92.4 },
  { date: 'Mar 8', weight: 91.7 },
  { date: 'Mar 15', weight: 91.9 },
  { date: 'Mar 22', weight: 90.8 },
  { date: 'Mar 29', weight: 90.1 },
  { date: 'Apr 5', weight: 89.6 },
  { date: 'Apr 12', weight: 89.8 },
  { date: 'Apr 19', weight: 88.7 },
]

const stats = [
  { label: 'Current weight', value: '88.7 kg' },
  { label: '7-week change', value: '-3.7 kg' },
  { label: 'Avg. sleep', value: '7.1 h' },
  { label: 'Logging streak', value: '23 days' },
]

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            FORGE
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Behavior-based fitness tracking — built with Next.js, TypeScript,
            Tailwind CSS, and Recharts.
          </p>
        </div>
        <LogoutButton />
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
            <p className="mt-1 text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="mb-1 text-lg font-semibold">Weight trend</h2>
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          Weekly average over the last 7 weeks
        </p>
        <WeightChart data={weightTrend} />
      </section>
    </main>
  )
}
