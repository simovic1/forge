import WeightChart from '@/app/components/WeightChart'
import { computeDashboardStats, computeWeightTrend } from '@/lib/dashboard'
import { fetchDailyLogs } from '@/lib/server-api'
import { monthsShort } from '@/i18n/messages'
import { getLocale, getT } from '@/i18n/server'

export default async function DashboardPage() {
  const t = await getT()
  const locale = await getLocale()
  const logs = await fetchDailyLogs()
  const { cards, wellbeing } = computeDashboardStats(logs)
  const weightTrend = computeWeightTrend(logs, monthsShort[locale])

  const wellbeingItems = [
    { labelKey: 'stats.avgEnergy' as const, value: wellbeing.energy },
    { labelKey: 'stats.avgStress' as const, value: wellbeing.stress },
    { labelKey: 'stats.avgMood' as const, value: wellbeing.mood },
  ]

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="mt-2 text-[var(--color-muted)]">{t('dashboard.subtitle')}</p>
      </header>

      <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((stat) => (
          <div
            key={stat.labelKey}
            className="rounded-xl border border-[var(--color-border)] p-4"
          >
            <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
              {t(stat.labelKey)}
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
        <h2 className="mb-1 text-lg font-semibold">{t('dashboard.weightTrend')}</h2>
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          {t('dashboard.last7Days')}
        </p>
        {weightTrend.length > 0 ? (
          <WeightChart data={weightTrend} />
        ) : (
          <p className="py-12 text-center text-sm text-[var(--color-muted)]">
            {t('dashboard.noWeight')}
          </p>
        )}

        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[var(--color-border)] pt-4">
          {wellbeingItems.map((item) => (
            <div key={item.labelKey}>
              <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
                {t(item.labelKey)}
              </p>
              <p className="mt-1 text-lg font-semibold">
                {item.value != null ? item.value.toFixed(1) : '—'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
