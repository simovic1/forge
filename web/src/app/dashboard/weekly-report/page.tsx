import { fetchDailyLogs, fetchWeeklyReports } from '@/lib/server-api'
import { computeWeeklySummaries } from '@/lib/weekly'
import { monthsShort } from '@/i18n/messages'
import { getLocale, getT } from '@/i18n/server'
import WeekDetails from './WeekDetails'

const DASH = '—'

export default async function WeeklyReportPage() {
  const t = await getT()
  const locale = await getLocale()
  const [logs, reports] = await Promise.all([fetchDailyLogs(), fetchWeeklyReports()])
  const summaries = computeWeeklySummaries(logs, monthsShort[locale])
  const reportByWeek = new Map(reports.map((r) => [r.weekStartDate, r]))

  const num = (v: number | null, suffix = '') =>
    v != null ? `${v.toFixed(1)}${suffix}` : DASH
  const signedNum = (v: number | null, suffix = '') =>
    v != null ? `${v > 0 ? '+' : ''}${v.toFixed(1)}${suffix}` : DASH

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t('weekly.title')}</h1>

      <section>
        <h2 className="mb-4 text-lg font-semibold">{t('weekly.tableTitle')}</h2>
        {summaries.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">{t('weekly.noData')}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
                  <th className="p-3 font-medium">{t('weekly.col.week')}</th>
                  <th className="p-3 font-medium">{t('weekly.col.avgWeight')}</th>
                  <th className="p-3 font-medium">{t('weekly.col.change')}</th>
                  <th className="p-3 font-medium">{t('weekly.col.avgSleep')}</th>
                  <th className="p-3 font-medium">{t('weekly.col.avgSteps')}</th>
                  <th className="p-3 font-medium">{t('weekly.col.trainings')}</th>
                  <th className="p-3 font-medium">{t('weekly.col.daysNoOvereating')}</th>
                  <th className="p-3 font-medium">{t('weekly.col.cravingsResisted')}</th>
                  <th className="p-3 font-medium">{t('weekly.col.avgEnergy')}</th>
                  <th className="p-3 font-medium">{t('weekly.col.avgStress')}</th>
                  <th className="p-3 font-medium">{t('weekly.col.avgCraving')}</th>
                  <th className="p-3 font-medium">{t('weekly.col.details')}</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((w) => (
                  <tr
                    key={w.weekStart}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="whitespace-nowrap p-3 font-medium">{w.index}</td>
                    <td className="p-3">{num(w.avgWeight, ' kg')}</td>
                    <td className="p-3">{signedNum(w.change, ' kg')}</td>
                    <td className="p-3">{num(w.avgSleep, ' h')}</td>
                    <td className="p-3">
                      {w.avgSteps != null ? Math.round(w.avgSteps) : DASH}
                    </td>
                    <td className="p-3">{w.trainingsDone}</td>
                    <td className="p-3">{w.daysWithoutOvereating}</td>
                    <td className="p-3">{w.cravingsResisted}</td>
                    <td className="p-3">{num(w.avgEnergy)}</td>
                    <td className="p-3">{num(w.avgStress)}</td>
                    <td className="p-3">{num(w.avgCraving)}</td>
                    <td className="p-3">
                      <WeekDetails
                        week={w}
                        report={reportByWeek.get(w.weekStart) ?? null}
                        logs={logs
                          .filter(
                            (l) =>
                              l.logDate >= w.weekStart && l.logDate <= w.weekEnd,
                          )
                          .sort((a, b) => a.logDate.localeCompare(b.logDate))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
