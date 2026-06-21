import type { DailyLogResponse, MonthlyReportResponse } from '@/lib/api'

export const PERIOD_DAYS = 28

const round1 = (n: number) => Math.round(n * 10) / 10
const pad = (n: number) => String(n).padStart(2, '0')

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
function addDaysISO(iso: string, days: number): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() + days)
  return toISO(d)
}
function todayISO(): string {
  return toISO(new Date())
}

export function formatMonthDay(iso: string, months: string[]): string {
  const [, month, day] = iso.split('-')
  return `${months[Number(month) - 1]} ${Number(day)}`
}

export function periodEndOf(start: string): string {
  return addDaysISO(start, PERIOD_DAYS - 1)
}

// Start date of the period the "Create / Edit monthly review" button targets:
// the latest report's window while it is still ongoing, otherwise the next one.
export function currentPeriodStart(
  reports: { periodStartDate: string; periodEndDate: string }[],
): string {
  if (reports.length === 0) return todayISO()
  const sorted = [...reports].sort((a, b) =>
    a.periodStartDate.localeCompare(b.periodStartDate),
  )
  const latest = sorted[sorted.length - 1]
  const today = todayISO()
  return today <= latest.periodEndDate
    ? latest.periodStartDate
    : addDaysISO(latest.periodEndDate, 1)
}

function avgPresent(values: (number | null | undefined)[]): number | null {
  const nums = values.filter((v): v is number => v != null)
  if (nums.length === 0) return null
  return round1(nums.reduce((sum, v) => sum + v, 0) / nums.length)
}

const pct = (part: number, whole: number) =>
  whole ? Math.round((part / whole) * 100) : 0

// Most frequently craved food among the logs (ties go to the most recent day).
function mostCommonFood(logs: DailyLogResponse[]): string | null {
  const counts = new Map<string, { n: number; last: string }>()
  for (const log of logs) {
    const food = log.cravedFood?.trim()
    if (!food) continue
    const entry = counts.get(food) ?? { n: 0, last: '' }
    entry.n += 1
    if (log.logDate > entry.last) entry.last = log.logDate
    counts.set(food, entry)
  }
  let best: string | null = null
  let bestN = 0
  let bestLast = ''
  for (const [food, entry] of counts) {
    if (entry.n > bestN || (entry.n === bestN && entry.last > bestLast)) {
      best = food
      bestN = entry.n
      bestLast = entry.last
    }
  }
  return best
}

export type TriggerRow = {
  type: string
  events: number
  resisted: number
  rate: number // percent resisted
  avgCraving: number | null
  food: string | null
}

export type MonthlyDetail = {
  // Progress summary
  avgWeight: number | null
  weightChange: number | null
  measuredWeight: number | null
  waistChange: number | null
  trainingSessions: number
  daysWithoutOvereating: number
  // Behavior summary
  avgSleep: number | null
  avgSteps: number | null
  avgProtein: number | null
  avgCalories: number | null
  avgCraving: number | null
  cravingsResisted: number
  cravingEvents: number
  resistanceRate: number // percent
  // Trigger analysis
  totalTriggerEvents: number
  mostCommonTrigger: string | null
  mostProblematicTrigger: string | null
  mostCommonFood: string | null
  triggers: TriggerRow[]
}

export function computeMonthlyDetail(
  report: MonthlyReportResponse,
  periodLogs: DailyLogResponse[],
  prevPeriodLogs: DailyLogResponse[],
  prevReport: MonthlyReportResponse | null,
): MonthlyDetail {
  const avgWeight = avgPresent(periodLogs.map((l) => l.weight))
  const prevAvgWeight = avgPresent(prevPeriodLogs.map((l) => l.weight))
  const prevWaist = prevReport?.waistCm ?? null

  const cravingLogs = periodLogs.filter((l) => l.cravingLevel != null)
  const cravingEvents = cravingLogs.length
  const cravingsResisted = cravingLogs.filter(
    (l) => l.resistedCraving === true,
  ).length

  // Group by trigger (NONE / unset excluded).
  const groups = new Map<string, DailyLogResponse[]>()
  for (const log of periodLogs) {
    const type = log.triggerType
    if (!type || type === 'NONE') continue
    const bucket = groups.get(type)
    if (bucket) bucket.push(log)
    else groups.set(type, [log])
  }

  const triggers: TriggerRow[] = [...groups.entries()]
    .map(([type, group]) => {
      const events = group.length
      const resisted = group.filter((l) => l.resistedCraving === true).length
      return {
        type,
        events,
        resisted,
        rate: pct(resisted, events),
        avgCraving: avgPresent(group.map((l) => l.cravingLevel)),
        food: mostCommonFood(group),
      }
    })
    // Most events first; ties by higher average craving.
    .sort((a, b) =>
      b.events !== a.events
        ? b.events - a.events
        : (b.avgCraving ?? -1) - (a.avgCraving ?? -1),
    )

  // Most problematic: lowest resistance rate, ties broken by higher avg craving.
  const mostProblematic = [...triggers].sort((a, b) =>
    a.rate !== b.rate ? a.rate - b.rate : (b.avgCraving ?? -1) - (a.avgCraving ?? -1),
  )[0]

  return {
    avgWeight,
    weightChange:
      avgWeight != null && prevAvgWeight != null
        ? round1(avgWeight - prevAvgWeight)
        : null,
    measuredWeight: report.measuredWeightKg ?? null,
    waistChange:
      report.waistCm != null && prevWaist != null
        ? round1(report.waistCm - prevWaist)
        : null,
    trainingSessions: periodLogs.filter((l) => l.trainingCompleted === true).length,
    daysWithoutOvereating: periodLogs.filter((l) => l.overeating === false).length,
    avgSleep: avgPresent(periodLogs.map((l) => l.sleepingHours)),
    avgSteps: avgPresent(periodLogs.map((l) => l.steps)),
    avgProtein: avgPresent(periodLogs.map((l) => l.proteinGrams)),
    avgCalories: avgPresent(periodLogs.map((l) => l.calories)),
    avgCraving: avgPresent(cravingLogs.map((l) => l.cravingLevel)),
    cravingsResisted,
    cravingEvents,
    resistanceRate: pct(cravingsResisted, cravingEvents),
    totalTriggerEvents: triggers.reduce((sum, t) => sum + t.events, 0),
    mostCommonTrigger: triggers[0]?.type ?? null,
    mostProblematicTrigger: mostProblematic?.type ?? null,
    mostCommonFood: mostCommonFood(periodLogs),
    triggers,
  }
}

type PeriodAggregate = {
  avgWeight: number | null
  daysWithoutOvereating: number
  trainingSessions: number
  cravingEvents: number
  cravingResisted: number
  avgEnergy: number | null
  avgStress: number | null
  daysLogged: number
}

function aggregatePeriod(
  logs: DailyLogResponse[],
  start: string,
  end: string,
): PeriodAggregate {
  const inRange = logs.filter((l) => l.logDate >= start && l.logDate <= end)
  const cravingLogs = inRange.filter((l) => l.cravingLevel != null)
  return {
    avgWeight: avgPresent(inRange.map((l) => l.weight)),
    daysWithoutOvereating: inRange.filter((l) => l.overeating === false).length,
    trainingSessions: inRange.filter((l) => l.trainingCompleted === true).length,
    cravingEvents: cravingLogs.length,
    cravingResisted: cravingLogs.filter((l) => l.resistedCraving === true).length,
    avgEnergy: avgPresent(inRange.map((l) => l.energyLevel)),
    avgStress: avgPresent(inRange.map((l) => l.stressLevel)),
    daysLogged: inRange.length,
  }
}

export type MonthlyRow = {
  id: number
  index: number
  periodStart: string
  periodEnd: string
  avgWeight: number | null
  weightChange: number | null
  waistCm: number | null
  waistChange: number | null
  daysWithoutOvereating: number
  totalDays: number
  cravingResisted: number
  cravingEvents: number
  avgEnergy: number | null
  avgStress: number | null
  completed: boolean
}

export type CurrentPeriod = {
  start: string
  end: string
  daysLogged: number
  totalDays: number
  nextReviewDue: string
  hasReport: boolean
}

export type MonthlyProgress = {
  avgWeight: number | null
  weightChange: number | null
  waistChange: number | null
  daysWithoutOvereating: number
  totalDays: number
  trainingSessions: number
  cravingResisted: number
  cravingEvents: number
}

export type MonthlyOverview = {
  currentPeriod: CurrentPeriod
  progress: MonthlyProgress
  rows: MonthlyRow[]
}

export function computeMonthlyOverview(
  reports: MonthlyReportResponse[],
  logs: DailyLogResponse[],
): MonthlyOverview {
  const sorted = [...reports].sort((a, b) =>
    a.periodStartDate.localeCompare(b.periodStartDate),
  )

  const aggregates = sorted.map((r) =>
    aggregatePeriod(logs, r.periodStartDate, r.periodEndDate),
  )

  const rows: MonthlyRow[] = sorted.map((r, i) => {
    const agg = aggregates[i]
    const prev = i > 0 ? aggregates[i - 1] : null
    const prevWaist = i > 0 ? (sorted[i - 1].waistCm ?? null) : null
    const waist = r.waistCm ?? null
    return {
      id: r.id,
      index: i + 1,
      periodStart: r.periodStartDate,
      periodEnd: r.periodEndDate,
      avgWeight: agg.avgWeight,
      weightChange:
        agg.avgWeight != null && prev?.avgWeight != null
          ? round1(agg.avgWeight - prev.avgWeight)
          : null,
      waistCm: waist,
      waistChange:
        waist != null && prevWaist != null ? round1(waist - prevWaist) : null,
      daysWithoutOvereating: agg.daysWithoutOvereating,
      totalDays: PERIOD_DAYS,
      cravingResisted: agg.cravingResisted,
      cravingEvents: agg.cravingEvents,
      avgEnergy: agg.avgEnergy,
      avgStress: agg.avgStress,
      completed: r.completedAt != null,
    }
  })

  // Current period: the latest report's window if still ongoing, otherwise the
  // next 4-week window (no report yet).
  const today = todayISO()
  const latest = sorted[sorted.length - 1]
  const lastAgg = aggregates[aggregates.length - 1]
  const ongoing = today <= latest.periodEndDate

  const start = ongoing
    ? latest.periodStartDate
    : addDaysISO(latest.periodEndDate, 1)
  const end = ongoing ? latest.periodEndDate : addDaysISO(start, PERIOD_DAYS - 1)
  const currentAgg = aggregatePeriod(logs, start, end)

  // Compare current period to the one before it.
  const prevAvgWeight = ongoing
    ? (aggregates[aggregates.length - 2]?.avgWeight ?? null)
    : lastAgg.avgWeight
  const currentWaist = ongoing ? (latest.waistCm ?? null) : null
  const prevWaistForProgress = ongoing
    ? (sorted[sorted.length - 2]?.waistCm ?? null)
    : (latest.waistCm ?? null)

  return {
    currentPeriod: {
      start,
      end,
      daysLogged: currentAgg.daysLogged,
      totalDays: PERIOD_DAYS,
      nextReviewDue: addDaysISO(end, 1),
      hasReport: ongoing,
    },
    progress: {
      avgWeight: currentAgg.avgWeight,
      weightChange:
        currentAgg.avgWeight != null && prevAvgWeight != null
          ? round1(currentAgg.avgWeight - prevAvgWeight)
          : null,
      waistChange:
        currentWaist != null && prevWaistForProgress != null
          ? round1(currentWaist - prevWaistForProgress)
          : null,
      daysWithoutOvereating: currentAgg.daysWithoutOvereating,
      totalDays: PERIOD_DAYS,
      trainingSessions: currentAgg.trainingSessions,
      cravingResisted: currentAgg.cravingResisted,
      cravingEvents: currentAgg.cravingEvents,
    },
    rows,
  }
}
