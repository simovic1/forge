import type { DailyLogResponse } from '@/lib/api'
import type { WeightPoint } from '@/app/components/WeightChart'
import type { MessageKey } from '@/i18n/messages'

// `labelKey` is a translation key; the page resolves it to the user's language.
export type Stat = { labelKey: MessageKey; value: string; sub?: string }

const round1 = (n: number) => Math.round(n * 10) / 10

// Formats a number with an explicit sign, e.g. 1.9 -> "+1.9", -0.4 -> "-0.4".
const signed = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)}`

const pad = (n: number) => String(n).padStart(2, '0')

// "2026-06-20" -> "Jun 20" using the supplied (localized) month names.
function formatDayLabel(iso: string, months: string[]): string {
  const [, month, day] = iso.split('-')
  return `${months[Number(month) - 1]} ${Number(day)}`
}

// The last (up to) 7 logs that recorded a weight, oldest -> newest for the chart.
export function computeWeightTrend(
  logs: DailyLogResponse[],
  months: string[],
): WeightPoint[] {
  return logs
    .filter((l) => l.weight != null)
    .sort((a, b) => a.logDate.localeCompare(b.logDate))
    .slice(-7)
    .map((l) => ({ date: formatDayLabel(l.logDate, months), weight: l.weight as number }))
}

function isoDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Sum of the present values divided by the number of fetched logs (`count`),
// rounded to one decimal. Blank days don't add to the sum but still count
// toward the divisor. Returns null only when no day in the window has a value.
function average(values: (number | null | undefined)[], count: number): number | null {
  const present = values.filter((v): v is number => v != null)
  if (count === 0 || present.length === 0) return null
  return round1(present.reduce((sum, v) => sum + v, 0) / count)
}

export function computeDashboardStats(logs: DailyLogResponse[]): Stat[] {
  // Newest first by log date.
  const byDateDesc = [...logs].sort((a, b) => b.logDate.localeCompare(a.logDate))
  const withWeight = byDateDesc.filter((l) => l.weight != null)

  // Current weight: the most recent log that recorded a weight.
  const newestWeight = withWeight[0]?.weight ?? null

  // 7-day change: current weight minus the weight 7 days ago (or the oldest
  // recorded weight if there is no log for that exact date), shown in kg and as
  // a percentage of that reference weight.
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

  // Averages over the last (up to) 7 logs.
  const last7 = byDateDesc.slice(0, 7)
  const avgSleep = average(last7.map((l) => l.sleepingHours), last7.length)
  const avgSteps = average(last7.map((l) => l.steps), last7.length)

  return [
    {
      labelKey: 'stats.currentWeight',
      value: newestWeight != null ? `${newestWeight} kg` : '—',
    },
    {
      labelKey: 'stats.change7d',
      value: changeValue ?? '—',
      sub: changeSub,
    },
    {
      labelKey: 'stats.avgSleep',
      value: avgSleep != null ? `${avgSleep.toFixed(1)} h` : '—',
    },
    {
      labelKey: 'stats.avgSteps',
      value: avgSteps != null ? avgSteps.toFixed(1) : '—',
    },
  ]
}
