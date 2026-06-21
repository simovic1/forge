import { redirect } from 'next/navigation'
import {
  fetchDailyLogs,
  fetchMonthlyReports,
  fetchWeeklyReports,
} from '@/lib/server-api'
import { computeMonthlyDetail, formatMonthDay } from '@/lib/monthly'
import { computeWeeklySummaries, weekStartOf } from '@/lib/weekly'
import { monthsShort } from '@/i18n/messages'
import { getLocale } from '@/i18n/server'
import MonthlyDetail, { type WeeklyEntry } from './MonthlyDetail'
import MonthlyEmptyState from '../MonthlyEmptyState'

export default async function MonthlyReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const locale = await getLocale()
  const months = monthsShort[locale]

  const [reports, logs, weeklyReports] = await Promise.all([
    fetchMonthlyReports(),
    fetchDailyLogs(),
    fetchWeeklyReports(),
  ])

  // No reports yet → show the empty state instead of a 404.
  if (reports.length === 0) return <MonthlyEmptyState />

  const sorted = [...reports].sort((a, b) =>
    a.periodStartDate.localeCompare(b.periodStartDate),
  )
  const idx = sorted.findIndex((r) => String(r.id) === id)
  // Reports exist but this id isn't one of them → back to the overview.
  if (idx === -1) redirect('/dashboard/monthly-report')
  const report = sorted[idx]
  const prevReport = idx > 0 ? sorted[idx - 1] : null

  const inPeriod = (start: string, end: string) =>
    logs.filter((l) => l.logDate >= start && l.logDate <= end)

  const periodLogs = inPeriod(report.periodStartDate, report.periodEndDate)
  const prevPeriodLogs = prevReport
    ? inPeriod(prevReport.periodStartDate, prevReport.periodEndDate)
    : []

  const detail = computeMonthlyDetail(report, periodLogs, prevPeriodLogs, prevReport)

  const weekly: WeeklyEntry[] = computeWeeklySummaries(periodLogs, months).map(
    (week) => ({
      week,
      logs: periodLogs.filter((l) => weekStartOf(l.logDate) === week.weekStart),
      report: weeklyReports.find((r) => r.weekStartDate === week.weekStart) ?? null,
    }),
  )

  const periodLabel = `${formatMonthDay(report.periodStartDate, months)} – ${formatMonthDay(report.periodEndDate, months)}`

  return (
    <MonthlyDetail
      report={report}
      index={idx + 1}
      periodLabel={periodLabel}
      detail={detail}
      weekly={weekly}
    />
  )
}
