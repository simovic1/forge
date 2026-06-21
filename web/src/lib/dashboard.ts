import type { DailyLogResponse } from '@/lib/api'
import type { WeightPoint } from '@/app/components/WeightChart'
import type { MessageKey } from '@/i18n/messages'
import { weekStartOf } from '@/lib/weekly'

// `labelKey` is a translation key; the page resolves it to the user's language.
export type Stat = { labelKey: MessageKey; value: string; sub?: string }

export type TriggerStat = {
  type: string
  events: number
  resisted: number // craving resisted on that trigger
  rate: number // percent resisted
  avgCraving: number | null
  food: string | null // most-craved food for this trigger
}

export type TriggerSummary = {
  totalEvents: number
  resisted: number
  rate: number // percent
  mostCommon: string | null // trigger type
}

export type DashboardData = {
  quickStatus: Stat[]
  behavior: Stat[]
  mentalState: Stat[]
  triggers: TriggerStat[]
  triggerSummary: TriggerSummary
}

const round1 = (n: number) => Math.round(n * 10) / 10

// Formats a number with an explicit sign, e.g. 1.9 -> "+1.9", -0.4 -> "-0.4".
const signed = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)}`

const pad = (n: number) => String(n).padStart(2, '0')

// "2026-06-20" -> "Jun 20" using the supplied (localized) month names.
function formatDayLabel(iso: string, months: string[]): string {
  const [, month, day] = iso.split('-')
  return `${months[Number(month) - 1]} ${Number(day)}`
}

function isoDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// True average of the present (non-null) values, rounded to one decimal.
function avgPresent(values: (number | null | undefined)[]): number | null {
  const nums = values.filter((v): v is number => v != null)
  if (nums.length === 0) return null
  return round1(nums.reduce((sum, v) => sum + v, 0) / nums.length)
}

// Logs from the last `n` calendar days (inclusive of today).
function lastNDays(logs: DailyLogResponse[], n: number): DailyLogResponse[] {
  const cutoff = isoDaysAgo(n - 1)
  return logs.filter((l) => l.logDate >= cutoff)
}

// With fewer than 4 weeks of recorded weight, plot individual daily weights
// from the last 4 weeks; with 4 or more weeks, plot weekly average weight over
// the last 12 weeks. Oldest -> newest for the chart.
export function computeWeightTrend(
  logs: DailyLogResponse[],
  months: string[],
): WeightPoint[] {
  const weeksWithWeight = new Set<string>()
  for (const log of logs) {
    if (log.weight != null) weeksWithWeight.add(weekStartOf(log.logDate))
  }

  // Not enough weekly data yet → raw daily points from the last 4 weeks.
  if (weeksWithWeight.size < 4) {
    const cutoff = isoDaysAgo(27) // 4 weeks = 28 days, inclusive of today
    return logs
      .filter((l) => l.weight != null && l.logDate >= cutoff)
      .sort((a, b) => a.logDate.localeCompare(b.logDate))
      .map((l) => ({
        date: formatDayLabel(l.logDate, months),
        weight: l.weight as number,
      }))
  }

  // Enough weekly data → weekly averages over the last 12 weeks.
  const cutoffWeek = weekStartOf(isoDaysAgo(7 * 11)) // start of the week 11 weeks ago
  const byWeek = new Map<string, number[]>()
  for (const log of logs) {
    if (log.weight == null) continue
    const week = weekStartOf(log.logDate)
    if (week < cutoffWeek) continue
    const bucket = byWeek.get(week)
    if (bucket) bucket.push(log.weight)
    else byWeek.set(week, [log.weight])
  }

  return [...byWeek.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, weights]) => ({
      date: formatDayLabel(week, months),
      weight: round1(weights.reduce((sum, w) => sum + w, 0) / weights.length),
    }))
}

function fmt(value: number | null, suffix = '', digits = 1): string {
  return value != null ? `${value.toFixed(digits)}${suffix}` : '—'
}

export function computeDashboard(logs: DailyLogResponse[]): DashboardData {
  const withWeight = [...logs]
    .filter((l) => l.weight != null)
    .sort((a, b) => b.logDate.localeCompare(a.logDate))

  // Current weight: the most recent log that recorded a weight.
  const newestWeight = withWeight[0]?.weight ?? null

  // 7-day change: current weight minus the weight 7 days ago (or the oldest
  // recorded weight if there is no log for that date), in kg and as a percentage.
  let changeValue: string | null = null
  let changeSub: string | undefined
  if (newestWeight != null) {
    const target = isoDaysAgo(7)
    const reference =
      withWeight.find((l) => l.logDate === target) ?? withWeight[withWeight.length - 1]
    if (reference?.weight != null) {
      const diff = newestWeight - reference.weight
      changeValue = `${signed(round1(diff))} kg`
      if (reference.weight !== 0) {
        changeSub = `${signed(round1((diff / reference.weight) * 100))}%`
      }
    }
  }

  // Current week (Monday–Sunday containing today).
  const currentWeekStart = weekStartOf(isoDaysAgo(0))
  const currentWeekLogs = logs.filter((l) => weekStartOf(l.logDate) === currentWeekStart)
  const daysWithoutOvereating = currentWeekLogs.filter(
    (l) => l.overeating === false,
  ).length
  const trainingSessions = currentWeekLogs.filter(
    (l) => l.trainingCompleted === true,
  ).length

  // Averages over the last 7 days.
  const last7 = lastNDays(logs, 7)
  const avgSleep = avgPresent(last7.map((l) => l.sleepingHours))
  const avgSteps = avgPresent(last7.map((l) => l.steps))
  const avgProtein = avgPresent(last7.map((l) => l.proteinGrams))
  const avgEnergy = avgPresent(last7.map((l) => l.energyLevel))
  const avgStress = avgPresent(last7.map((l) => l.stressLevel))
  const avgMood = avgPresent(last7.map((l) => l.moodLevel))
  const avgCraving = avgPresent(last7.map((l) => l.cravingLevel))

  const quickStatus: Stat[] = [
    {
      labelKey: 'stats.currentWeight',
      value: newestWeight != null ? `${newestWeight} kg` : '—',
    },
    { labelKey: 'stats.change7d', value: changeValue ?? '—', sub: changeSub },
    { labelKey: 'stats.daysNoOvereating', value: `${daysWithoutOvereating} / 7` },
    { labelKey: 'stats.trainingsDone', value: String(trainingSessions) },
    { labelKey: 'stats.avgEnergy', value: fmt(avgEnergy) },
    { labelKey: 'stats.avgStress', value: fmt(avgStress) },
  ]

  const behavior: Stat[] = [
    { labelKey: 'stats.avgSleep', value: fmt(avgSleep, ' h') },
    { labelKey: 'stats.avgSteps', value: fmt(avgSteps, '', 0) },
    { labelKey: 'stats.avgProtein', value: fmt(avgProtein, ' g', 0) },
    { labelKey: 'stats.trainingsDone', value: String(trainingSessions) },
    { labelKey: 'stats.daysNoOvereating', value: `${daysWithoutOvereating} / 7` },
  ]

  const mentalState: Stat[] = [
    { labelKey: 'stats.avgEnergy', value: fmt(avgEnergy) },
    { labelKey: 'stats.avgStress', value: fmt(avgStress) },
    { labelKey: 'stats.avgMood', value: fmt(avgMood) },
    { labelKey: 'stats.avgCraving', value: fmt(avgCraving) },
  ]

  const { triggers, triggerSummary } = computeTriggers(logs)

  return { quickStatus, behavior, mentalState, triggers, triggerSummary }
}

// Order: most events first; ties broken by higher average craving, then lower
// resistance rate.
function compareTriggers(a: TriggerStat, b: TriggerStat): number {
  if (b.events !== a.events) return b.events - a.events
  const ca = a.avgCraving ?? -1
  const cb = b.avgCraving ?? -1
  if (cb !== ca) return cb - ca
  return a.rate - b.rate
}

// Most frequently craved food among the logs (ties go to the most recent).
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

// Per-trigger craving analysis for the current calendar month (NONE excluded).
function computeTriggers(logs: DailyLogResponse[]): {
  triggers: TriggerStat[]
  triggerSummary: TriggerSummary
} {
  const now = new Date()
  const monthPrefix = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`

  const groups = new Map<string, DailyLogResponse[]>()
  for (const log of logs) {
    const type = log.triggerType
    if (!type || type === 'NONE') continue
    if (!log.logDate.startsWith(monthPrefix)) continue
    const bucket = groups.get(type)
    if (bucket) bucket.push(log)
    else groups.set(type, [log])
  }

  const triggers: TriggerStat[] = [...groups.entries()]
    .map(([type, group]) => {
      const events = group.length
      const resisted = group.filter((l) => l.resistedCraving === true).length
      return {
        type,
        events,
        resisted,
        rate: events ? Math.round((resisted / events) * 100) : 0,
        avgCraving: avgPresent(group.map((l) => l.cravingLevel)),
        food: mostCommonFood(group),
      }
    })
    .sort(compareTriggers)

  const totalEvents = triggers.reduce((sum, t) => sum + t.events, 0)
  const totalResisted = triggers.reduce((sum, t) => sum + t.resisted, 0)

  return {
    triggers,
    triggerSummary: {
      totalEvents,
      resisted: totalResisted,
      rate: totalEvents ? Math.round((totalResisted / totalEvents) * 100) : 0,
      mostCommon: triggers[0]?.type ?? null,
    },
  }
}
