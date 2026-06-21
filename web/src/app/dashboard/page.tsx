import WeightChart from '@/app/components/WeightChart'
import { computeDashboard, computeWeightTrend, type Stat } from '@/lib/dashboard'
import { fetchDailyLogs } from '@/lib/server-api'
import { monthsShort, type MessageKey, type Translator } from '@/i18n/messages'
import { getLocale, getT } from '@/i18n/server'

export default async function DashboardPage() {
  const t = await getT()
  const locale = await getLocale()
  const logs = await fetchDailyLogs()
  const data = computeDashboard(logs)
  const weightTrend = computeWeightTrend(logs, monthsShort[locale])

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="mt-2 text-[var(--color-muted)]">{t('dashboard.subtitle')}</p>
      </header>

      <Section title={t('dashboard.quickStatus')}>
        <CardGrid cards={data.quickStatus} t={t} cols="sm:grid-cols-3 lg:grid-cols-6" />
      </Section>

      <Section title={t('dashboard.weightTrend')}>
        <div className="rounded-xl border border-[var(--color-border)] p-6">
          <p className="mb-4 text-sm text-[var(--color-muted)]">
            {t('dashboard.last12Weeks')}
          </p>
          {weightTrend.length > 0 ? (
            <WeightChart data={weightTrend} />
          ) : (
            <p className="py-12 text-center text-sm text-[var(--color-muted)]">
              {t('dashboard.noWeight')}
            </p>
          )}
        </div>
      </Section>

      <Section title={t('dashboard.behaviorScorecard')}>
        <CardGrid cards={data.behavior} t={t} cols="sm:grid-cols-3 lg:grid-cols-5" />
      </Section>

      <Section title={t('dashboard.mentalState')}>
        <CardGrid cards={data.mentalState} t={t} cols="sm:grid-cols-4" />
      </Section>

      <Section title={t('dashboard.triggerAnalysis')}>
        {data.triggers.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">
            {t('dashboard.noTriggers')}
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            <CardGrid
              cards={[
                {
                  labelKey: 'dashboard.triggerTotalEvents',
                  value: String(data.triggerSummary.totalEvents),
                },
                {
                  labelKey: 'dashboard.triggerCravingsResisted',
                  value: `${data.triggerSummary.resisted} / ${data.triggerSummary.totalEvents}`,
                },
                {
                  labelKey: 'dashboard.triggerResistanceRate',
                  value: `${data.triggerSummary.rate}%`,
                },
                {
                  labelKey: 'dashboard.triggerMostCommon',
                  value: data.triggerSummary.mostCommon
                    ? t(`trigger.${data.triggerSummary.mostCommon}` as MessageKey)
                    : '—',
                },
              ]}
              t={t}
              cols="sm:grid-cols-4"
            />

            <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
                    <th className="p-3 font-medium">
                      {t('dashboard.triggerColTrigger')}
                    </th>
                    <th className="p-3 font-medium">
                      {t('dashboard.triggerColEvents')}
                    </th>
                    <th className="p-3 font-medium">
                      {t('dashboard.triggerColResisted')}
                    </th>
                    <th className="p-3 font-medium">
                      {t('dashboard.triggerColRate')}
                    </th>
                    <th className="p-3 font-medium">
                      {t('dashboard.triggerColAvgCraving')}
                    </th>
                    <th className="p-3 font-medium">
                      {t('dashboard.triggerColFood')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.triggers.map((trigger) => (
                    <tr
                      key={trigger.type}
                      className="border-b border-[var(--color-border)] last:border-0"
                    >
                      <td className="p-3 font-medium">
                        {t(`trigger.${trigger.type}` as MessageKey)}
                      </td>
                      <td className="p-3">{trigger.events}</td>
                      <td className="p-3">
                        {trigger.resisted}/{trigger.events}
                      </td>
                      <td className="p-3">{trigger.rate}%</td>
                      <td className="p-3">
                        {trigger.avgCraving != null
                          ? trigger.avgCraving.toFixed(1)
                          : '—'}
                      </td>
                      <td className="p-3">{trigger.food ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Section>
    </main>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function CardGrid({
  cards,
  t,
  cols,
}: {
  cards: Stat[]
  t: Translator
  cols: string
}) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${cols}`}>
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
    </div>
  )
}
