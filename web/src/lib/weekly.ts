import type { DailyLogResponse } from '@/lib/api'

export type WeeklySummary = {
  index: number // 1 = earliest week with data
  weekStart: string // ISO Monday
  weekEnd: string // ISO Sunday
  label: string // formatted range, e.g. "Jun 16 – Jun 22"
  avgWeight: number | null
  change: number | null // vs previous week's avg weight
  avgSleep: number | null
  avgSteps: number | null
  trainingsDone: number
  daysWithoutOvereating: number
  avgEnergy: number | null
  avgStress: number | null
}

const round1 = (n: number) => Math.round(n * 10) / 10
const pad = (n: number) => String(n).padStart(2, '0')

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toISO(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Monday (start) of the week containing the given date.
export function weekStartOf(iso: string): string {
  const date = parseISO(iso)
  const daysSinceMonday = (date.getDay() + 6) % 7 // Mon=0 … Sun=6
  date.setDate(date.getDate() - daysSinceMonday)
  return toISO(date)
}

function addDaysISO(iso: string, days: number): string {
  const date = parseISO(iso)
  date.setDate(date.getDate() + days)
  return toISO(date)
}

function formatRange(startISO: string, endISO: string, months: string[]): string {
  const s = parseISO(startISO)
  const e = parseISO(endISO)
  return `${months[s.getMonth()]} ${s.getDate()} – ${months[e.getMonth()]} ${e.getDate()}`
}

function average(values: (number | null | undefined)[]): number | null {
  const nums = values.filter((v): v is number => v != null)
  if (nums.length === 0) return null
  return round1(nums.reduce((sum, v) => sum + v, 0) / nums.length)
}

// Groups daily logs into Monday–Sunday weeks and computes per-week metrics.
// `change` is this week's average weight minus the previous calendar week's.
export function computeWeeklySummaries(
  logs: DailyLogResponse[],
  months: string[],
): WeeklySummary[] {
  const groups = new Map<string, DailyLogResponse[]>()
  for (const log of logs) {
    const key = weekStartOf(log.logDate)
    const bucket = groups.get(key)
    if (bucket) bucket.push(log)
    else groups.set(key, [log])
  }

  const byWeek = new Map<string, WeeklySummary>()
  for (const [weekStart, weekLogs] of groups) {
    const weekEnd = addDaysISO(weekStart, 6)
    byWeek.set(weekStart, {
      index: 0, // assigned after sorting
      weekStart,
      weekEnd,
      label: formatRange(weekStart, weekEnd, months),
      avgWeight: average(weekLogs.map((l) => l.weight)),
      change: null, // resolved below once all weeks exist
      avgSleep: average(weekLogs.map((l) => l.sleepingHours)),
      avgSteps: average(weekLogs.map((l) => l.steps)),
      trainingsDone: weekLogs.filter((l) => l.trainingCompleted === true).length,
      daysWithoutOvereating: weekLogs.filter((l) => l.overeating === false).length,
      avgEnergy: average(weekLogs.map((l) => l.energyLevel)),
      avgStress: average(weekLogs.map((l) => l.stressLevel)),
    })
  }

  // Change vs the immediately preceding week. No previous week (or no weight
  // recorded then) leaves it null, which the UI renders as "—".
  for (const summary of byWeek.values()) {
    const previous = byWeek.get(addDaysISO(summary.weekStart, -7))
    if (summary.avgWeight != null && previous?.avgWeight != null) {
      summary.change = round1(summary.avgWeight - previous.avgWeight)
    }
  }

  // Oldest week first; index counts from the earliest week (= 1).
  const sorted = [...byWeek.values()].sort((a, b) =>
    a.weekStart.localeCompare(b.weekStart),
  )
  return sorted.map((summary, i) => ({ ...summary, index: i + 1 }))
}
