'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ApiError,
  updateMonthlyReport,
  type CreateMonthlyReportRequest,
  type DailyLogResponse,
  type MonthlyReportResponse,
  type WeeklyReportResponse,
} from '@/lib/api'
import type { MonthlyDetail as MonthlyDetailData } from '@/lib/monthly'
import type { WeeklySummary } from '@/lib/weekly'
import { useTranslations } from '@/i18n/client'
import type { MessageKey } from '@/i18n/messages'
import WeekDetails from '@/app/dashboard/weekly-report/WeekDetails'

const DASH = '—'
const inputCls =
  'rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]'

const num = (v: number | null, suffix = '') => (v != null ? `${v}${suffix}` : DASH)
const num0 = (v: number | null, suffix = '') =>
  v != null ? `${Math.round(v)}${suffix}` : DASH
const signed = (v: number | null, suffix = '') =>
  v != null ? `${v > 0 ? '+' : ''}${v}${suffix}` : DASH

type FieldKey =
  | 'measuredWeightKg'
  | 'waistCm'
  | 'hipsCm'
  | 'chestCm'
  | 'neckCm'
  | 'bicepsLeftCm'
  | 'bicepsRightCm'
  | 'thighLeftCm'
  | 'thighRightCm'
  | 'confidenceLevel'
  | 'selfSatisfactionLevel'
  | 'foodControlLevel'
  | 'energyLevel'
  | 'stressLevel'
  | 'cravingControlLevel'
  | 'whatImproved'
  | 'biggestObstacle'
  | 'proudestMoment'
  | 'noticedPattern'
  | 'nextMonthFocus'
  | 'notes'

type Fields = Record<FieldKey, string>

const MEASUREMENTS: { key: FieldKey; label: MessageKey }[] = [
  { key: 'measuredWeightKg', label: 'monthly.weight' },
  { key: 'waistCm', label: 'monthly.waist' },
  { key: 'hipsCm', label: 'monthly.hips' },
  { key: 'chestCm', label: 'monthly.chest' },
  { key: 'neckCm', label: 'monthly.neck' },
  { key: 'bicepsLeftCm', label: 'monthly.bicepsLeft' },
  { key: 'bicepsRightCm', label: 'monthly.bicepsRight' },
  { key: 'thighLeftCm', label: 'monthly.thighLeft' },
  { key: 'thighRightCm', label: 'monthly.thighRight' },
]
const SCORES: { key: FieldKey; label: MessageKey }[] = [
  { key: 'confidenceLevel', label: 'monthly.confidence' },
  { key: 'selfSatisfactionLevel', label: 'monthly.selfSatisfaction' },
  { key: 'foodControlLevel', label: 'monthly.foodControl' },
  { key: 'energyLevel', label: 'monthly.energy' },
  { key: 'stressLevel', label: 'monthly.stress' },
  { key: 'cravingControlLevel', label: 'monthly.cravingControl' },
]
const REFLECTION: { key: FieldKey; label: MessageKey }[] = [
  { key: 'whatImproved', label: 'monthly.whatImproved' },
  { key: 'biggestObstacle', label: 'monthly.biggestObstacle' },
  { key: 'proudestMoment', label: 'monthly.proudestMoment' },
  { key: 'noticedPattern', label: 'monthly.noticedPattern' },
  { key: 'nextMonthFocus', label: 'monthly.nextMonthFocus' },
  { key: 'notes', label: 'monthly.notes' },
]

const s = (v: number | string | null | undefined) =>
  v == null ? '' : String(v)

function presetFrom(r: MonthlyReportResponse): Fields {
  return {
    measuredWeightKg: s(r.measuredWeightKg),
    waistCm: s(r.waistCm),
    hipsCm: s(r.hipsCm),
    chestCm: s(r.chestCm),
    neckCm: s(r.neckCm),
    bicepsLeftCm: s(r.bicepsLeftCm),
    bicepsRightCm: s(r.bicepsRightCm),
    thighLeftCm: s(r.thighLeftCm),
    thighRightCm: s(r.thighRightCm),
    confidenceLevel: s(r.confidenceLevel),
    selfSatisfactionLevel: s(r.selfSatisfactionLevel),
    foodControlLevel: s(r.foodControlLevel),
    energyLevel: s(r.energyLevel),
    stressLevel: s(r.stressLevel),
    cravingControlLevel: s(r.cravingControlLevel),
    whatImproved: r.whatImproved ?? '',
    biggestObstacle: r.biggestObstacle ?? '',
    proudestMoment: r.proudestMoment ?? '',
    noticedPattern: r.noticedPattern ?? '',
    nextMonthFocus: r.nextMonthFocus ?? '',
    notes: r.notes ?? '',
  }
}

function toNumber(value: string): number | undefined {
  if (value.trim() === '') return undefined
  const n = Number(value)
  return Number.isNaN(n) ? undefined : n
}

export type WeeklyEntry = {
  week: WeeklySummary
  logs: DailyLogResponse[]
  report: WeeklyReportResponse | null
}

export default function MonthlyDetail({
  report,
  index,
  periodLabel,
  detail,
  weekly,
}: {
  report: MonthlyReportResponse
  index: number
  periodLabel: string
  detail: MonthlyDetailData
  weekly: WeeklyEntry[]
}) {
  const t = useTranslations()
  const router = useRouter()
  const [fields, setFields] = useState<Fields>(() => presetFrom(report))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const set = (key: FieldKey, value: string) =>
    setFields((f) => ({ ...f, [key]: value }))

  const triggerLabel = (type: string | null) =>
    type ? t(`trigger.${type}` as MessageKey) : DASH

  async function handleSave() {
    setError(null)
    setSaved(false)
    setSubmitting(true)
    const payload: CreateMonthlyReportRequest = {
      periodStartDate: report.periodStartDate,
      measuredWeightKg: toNumber(fields.measuredWeightKg),
      waistCm: toNumber(fields.waistCm),
      hipsCm: toNumber(fields.hipsCm),
      chestCm: toNumber(fields.chestCm),
      neckCm: toNumber(fields.neckCm),
      bicepsLeftCm: toNumber(fields.bicepsLeftCm),
      bicepsRightCm: toNumber(fields.bicepsRightCm),
      thighLeftCm: toNumber(fields.thighLeftCm),
      thighRightCm: toNumber(fields.thighRightCm),
      confidenceLevel: toNumber(fields.confidenceLevel),
      selfSatisfactionLevel: toNumber(fields.selfSatisfactionLevel),
      foodControlLevel: toNumber(fields.foodControlLevel),
      energyLevel: toNumber(fields.energyLevel),
      stressLevel: toNumber(fields.stressLevel),
      cravingControlLevel: toNumber(fields.cravingControlLevel),
      whatImproved: fields.whatImproved.trim() || undefined,
      biggestObstacle: fields.biggestObstacle.trim() || undefined,
      proudestMoment: fields.proudestMoment.trim() || undefined,
      noticedPattern: fields.noticedPattern.trim() || undefined,
      nextMonthFocus: fields.nextMonthFocus.trim() || undefined,
      notes: fields.notes.trim() || undefined,
    }
    try {
      await updateMonthlyReport(report.id, payload)
      setSaved(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('common.errorGeneric'))
    } finally {
      setSubmitting(false)
    }
  }

  const progress: { label: MessageKey; value: string }[] = [
    { label: 'monthly.cardAvgWeight', value: num(detail.avgWeight, ' kg') },
    { label: 'monthly.cardWeightChange', value: signed(detail.weightChange, ' kg') },
    { label: 'monthly.measuredWeight', value: num(detail.measuredWeight, ' kg') },
    { label: 'monthly.cardWaistChange', value: signed(detail.waistChange, ' cm') },
    { label: 'monthly.cardTrainingSessions', value: String(detail.trainingSessions) },
    {
      label: 'monthly.cardDaysNoOvereating',
      value: `${detail.daysWithoutOvereating} / 28`,
    },
    { label: 'monthly.cravingResistanceRate', value: `${detail.resistanceRate}%` },
  ]

  const behavior: { label: MessageKey; value: string }[] = [
    { label: 'monthly.avgSleep', value: num(detail.avgSleep, ' h') },
    { label: 'monthly.avgSteps', value: num0(detail.avgSteps) },
    { label: 'monthly.cardTrainingSessions', value: String(detail.trainingSessions) },
    { label: 'monthly.avgProtein', value: num0(detail.avgProtein, ' g') },
    { label: 'monthly.avgCalories', value: num0(detail.avgCalories) },
    {
      label: 'monthly.cardDaysNoOvereating',
      value: `${detail.daysWithoutOvereating} / 28`,
    },
    { label: 'monthly.avgCraving', value: num(detail.avgCraving) },
    {
      label: 'monthly.cravingsResisted',
      value: `${detail.cravingsResisted} / ${detail.cravingEvents}`,
    },
    { label: 'monthly.resistanceRate', value: `${detail.resistanceRate}%` },
  ]

  const triggerSummary: { label: MessageKey; value: string }[] = [
    { label: 'monthly.totalTriggerEvents', value: String(detail.totalTriggerEvents) },
    { label: 'monthly.mostCommonTrigger', value: triggerLabel(detail.mostCommonTrigger) },
    {
      label: 'monthly.mostProblematicTrigger',
      value: triggerLabel(detail.mostProblematicTrigger),
    },
    { label: 'monthly.avgCraving', value: num(detail.avgCraving) },
    {
      label: 'monthly.cravingsResisted',
      value: `${detail.cravingsResisted} / ${detail.cravingEvents}`,
    },
    { label: 'monthly.resistanceRate', value: `${detail.resistanceRate}%` },
    { label: 'monthly.mostCommonFood', value: detail.mostCommonFood ?? DASH },
  ]

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">
        {t('monthly.periodLabel', { n: index })}
      </h1>
      <p className="mt-1 text-[var(--color-muted)]">{periodLabel}</p>

      {/* 1. Progress summary */}
      <SummarySection title={t('monthly.sectionProgress')}>
        <CardGrid>
          {progress.map((c) => (
            <Card key={c.label} label={t(c.label)} value={c.value} />
          ))}
        </CardGrid>
      </SummarySection>

      {/* 2. Body measurements */}
      <FormSection title={t('monthly.sectionMeasurements')}>
        {MEASUREMENTS.map(({ key, label }) => (
          <Field key={key} label={t(label)} htmlFor={key}>
            <input
              id={key}
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              value={fields[key]}
              onChange={(e) => set(key, e.target.value)}
              className={inputCls}
            />
          </Field>
        ))}
      </FormSection>

      {/* 3. Behavior summary */}
      <SummarySection title={t('monthly.sectionBehavior')}>
        <CardGrid>
          {behavior.map((c) => (
            <Card key={c.label} label={t(c.label)} value={c.value} />
          ))}
        </CardGrid>
      </SummarySection>

      {/* 4. Mental state */}
      <FormSection title={t('monthly.sectionMentalState')}>
        {SCORES.map(({ key, label }) => (
          <Field key={key} label={t(label)} htmlFor={key}>
            <select
              id={key}
              value={fields[key]}
              onChange={(e) => set(key, e.target.value)}
              className={inputCls}
            >
              <option value="">{DASH}</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>
        ))}
      </FormSection>

      {/* 5. Trigger & craving analysis */}
      <SummarySection title={t('monthly.sectionTrigger')}>
        <p className="mb-4 text-xs text-[var(--color-muted)]">
          {t('monthly.denominatorNote')}
        </p>
        <CardGrid>
          {triggerSummary.map((c) => (
            <Card key={c.label} label={t(c.label)} value={c.value} />
          ))}
        </CardGrid>
        {detail.triggers.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
                  <th className="p-3 font-medium">{t('monthly.colTrigger')}</th>
                  <th className="p-3 font-medium">{t('monthly.colEvents')}</th>
                  <th className="p-3 font-medium">{t('monthly.colResisted')}</th>
                  <th className="p-3 font-medium">{t('monthly.colRate')}</th>
                  <th className="p-3 font-medium">{t('monthly.colAvgCraving')}</th>
                  <th className="p-3 font-medium">{t('monthly.colFood')}</th>
                </tr>
              </thead>
              <tbody>
                {detail.triggers.map((tr) => (
                  <tr
                    key={tr.type}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="p-3 font-medium">{triggerLabel(tr.type)}</td>
                    <td className="p-3">{tr.events}</td>
                    <td className="p-3">
                      {tr.resisted}/{tr.events}
                    </td>
                    <td className="p-3">{tr.rate}%</td>
                    <td className="p-3">{num(tr.avgCraving)}</td>
                    <td className="p-3">{tr.food ?? DASH}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {t('monthly.noTriggers')}
          </p>
        )}
      </SummarySection>

      {/* 6. Weekly breakdown */}
      <SummarySection title={t('monthly.sectionWeekly')}>
        {weekly.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">{t('weekly.noData')}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
                  <th className="p-3 font-medium">{t('monthly.wkWeek')}</th>
                  <th className="p-3 font-medium">{t('monthly.colAvgWeight')}</th>
                  <th className="p-3 font-medium">{t('monthly.wkChange')}</th>
                  <th className="p-3 font-medium">{t('monthly.wkSleep')}</th>
                  <th className="p-3 font-medium">{t('monthly.wkSteps')}</th>
                  <th className="p-3 font-medium">{t('monthly.wkTrainings')}</th>
                  <th className="p-3 font-medium">{t('monthly.wkNoOvereating')}</th>
                  <th className="p-3 font-medium">{t('monthly.avgCraving')}</th>
                  <th className="p-3 font-medium">{t('monthly.wkResistance')}</th>
                  <th className="p-3 font-medium">{t('monthly.colDetails')}</th>
                </tr>
              </thead>
              <tbody>
                {weekly.map((entry) => (
                  <tr
                    key={entry.week.weekStart}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="whitespace-nowrap p-3 font-medium">
                      {entry.week.label}
                    </td>
                    <td className="p-3">{num(entry.week.avgWeight, ' kg')}</td>
                    <td className="p-3">{signed(entry.week.change, ' kg')}</td>
                    <td className="p-3">{num(entry.week.avgSleep, ' h')}</td>
                    <td className="p-3">{num0(entry.week.avgSteps)}</td>
                    <td className="p-3">{entry.week.trainingsDone}</td>
                    <td className="p-3">{entry.week.daysWithoutOvereating}</td>
                    <td className="p-3">{num(entry.week.avgCraving)}</td>
                    <td className="p-3">
                      {entry.week.cravingsResisted}/{entry.week.cravingEvents}
                    </td>
                    <td className="p-3">
                      <WeekDetails
                        week={entry.week}
                        logs={entry.logs}
                        report={entry.report}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SummarySection>

      {/* 7. Reflection */}
      <FormSection title={t('monthly.sectionReflection')} single>
        {REFLECTION.map(({ key, label }) => (
          <Field key={key} label={t(label)} htmlFor={key}>
            <textarea
              id={key}
              rows={2}
              value={fields[key]}
              onChange={(e) => set(key, e.target.value)}
              className={`${inputCls} resize-y`}
            />
          </Field>
        ))}
      </FormSection>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)]/5 px-3 py-2 text-sm text-[var(--color-accent)]"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting}
          className="rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? t('monthly.saving') : t('monthly.saveChanges')}
        </button>
        {saved && !error && (
          <span className="text-sm text-[var(--color-muted)]">
            {t('weekly.saved')}
          </span>
        )}
      </div>
    </main>
  )
}

function SummarySection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function FormSection({
  title,
  children,
  single,
}: {
  title: string
  children: React.ReactNode
  single?: boolean
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div
        className={
          single
            ? 'grid grid-cols-1 gap-4'
            : 'grid grid-cols-2 gap-4 sm:grid-cols-3'
        }
      >
        {children}
      </div>
    </section>
  )
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{children}</div>
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}
