import Link from 'next/link'
import { fetchDailyLogs, fetchMonthlyReports } from '@/lib/server-api'
import { computeMonthlyOverview, formatMonthDay } from '@/lib/monthly'
import { monthsShort, type MessageKey, type Translator } from '@/i18n/messages'
import { getLocale, getT } from '@/i18n/server'
import MonthlyEmptyState from './MonthlyEmptyState'

const DASH = '—'

export default async function MonthlyReportPage() {
  const t = await getT()
  const locale = await getLocale()
  const reports = await fetchMonthlyReports()

  if (reports.length === 0) {
    return <MonthlyEmptyState />
  }

  const logs = await fetchDailyLogs()
  const { currentPeriod, progress, rows } = computeMonthlyOverview(reports, logs)
  const months = monthsShort[locale]
  const day = (iso: string) => formatMonthDay(iso, months)

  const num = (v: number | null, suffix = '') => (v != null ? `${v}${suffix}` : DASH)
  const signed = (v: number | null, suffix = '') =>
    v != null ? `${v > 0 ? '+' : ''}${v}${suffix}` : DASH

  const progressCards: { labelKey: MessageKey; value: string }[] = [
    { labelKey: 'monthly.cardAvgWeight', value: num(progress.avgWeight, ' kg') },
    { labelKey: 'monthly.cardWeightChange', value: signed(progress.weightChange, ' kg') },
    { labelKey: 'monthly.cardWaistChange', value: signed(progress.waistChange, ' cm') },
    {
      labelKey: 'monthly.cardDaysNoOvereating',
      value: `${progress.daysWithoutOvereating} / ${progress.totalDays}`,
    },
    {
      labelKey: 'monthly.cardTrainingSessions',
      value: String(progress.trainingSessions),
    },
    {
      labelKey: 'monthly.cardCravingResistance',
      value: `${progress.cravingResisted} / ${progress.cravingEvents}`,
    },
  ]

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t('monthly.title')}</h1>

      {/* 1. Current period status */}
      <section className="mb-10 rounded-xl border border-[var(--color-border)] p-6">
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
          {t('monthly.currentPeriod')}
        </p>
        <p className="mt-1 text-xl font-semibold">
          {day(currentPeriod.start)} – {day(currentPeriod.end)}
        </p>
        <div className="mt-4 flex flex-col gap-1 text-sm">
          <p>
            <span className="text-[var(--color-muted)]">
              {t('monthly.dailyLogsCompleted')}:{' '}
            </span>
            {currentPeriod.daysLogged} / {currentPeriod.totalDays}
          </p>
          <p>
            <span className="text-[var(--color-muted)]">
              {t('monthly.nextReviewDue')}:{' '}
            </span>
            {day(currentPeriod.nextReviewDue)}
          </p>
        </div>
        <Link
          href="/dashboard/monthly-report/new"
          className="mt-5 inline-block rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t('monthly.createEditReview')}
        </Link>
      </section>

      {/* 2. Monthly progress cards */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">{t('monthly.progressTitle')}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {progressCards.map((card) => (
            <Card key={card.labelKey} labelKey={card.labelKey} value={card.value} t={t} />
          ))}
        </div>
      </section>

      {/* 3. Monthly reports table */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">{t('monthly.reportsTitle')}</h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
                <th className="p-3 font-medium">{t('monthly.colPeriod')}</th>
                <th className="p-3 font-medium">{t('monthly.colAvgWeight')}</th>
                <th className="p-3 font-medium">{t('monthly.colWeightChange')}</th>
                <th className="p-3 font-medium">{t('monthly.colWaist')}</th>
                <th className="p-3 font-medium">{t('monthly.colWaistChange')}</th>
                <th className="p-3 font-medium">{t('monthly.colNoOvereating')}</th>
                <th className="p-3 font-medium">{t('monthly.colCravingResisted')}</th>
                <th className="p-3 font-medium">{t('monthly.colAvgEnergy')}</th>
                <th className="p-3 font-medium">{t('monthly.colAvgStress')}</th>
                <th className="p-3 font-medium">{t('monthly.colStatus')}</th>
                <th className="p-3 font-medium">{t('monthly.colDetails')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[var(--color-border)] last:border-0"
                >
                  <td className="whitespace-nowrap p-3 font-medium">
                    {t('monthly.periodLabel', { n: row.index })}
                  </td>
                  <td className="p-3">{num(row.avgWeight, ' kg')}</td>
                  <td className="p-3">{signed(row.weightChange, ' kg')}</td>
                  <td className="p-3">{num(row.waistCm, ' cm')}</td>
                  <td className="p-3">{signed(row.waistChange, ' cm')}</td>
                  <td className="p-3">
                    {row.daysWithoutOvereating}/{row.totalDays}
                  </td>
                  <td className="p-3">
                    {row.cravingResisted}/{row.cravingEvents}
                  </td>
                  <td className="p-3">{num(row.avgEnergy)}</td>
                  <td className="p-3">{num(row.avgStress)}</td>
                  <td className="p-3">
                    {row.completed
                      ? t('monthly.statusCompleted')
                      : t('monthly.statusDraft')}
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/dashboard/monthly-report/${row.id}`}
                      className="font-medium text-[var(--color-accent)] hover:underline"
                    >
                      {t('monthly.view')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

function Card({
  labelKey,
  value,
  t,
}: {
  labelKey: MessageKey
  value: string
  t: Translator
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
        {t(labelKey)}
      </p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  )
}
