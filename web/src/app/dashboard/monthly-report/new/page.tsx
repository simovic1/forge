'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ApiError,
  createMonthlyReport,
  getMonthlyReports,
  updateMonthlyReport,
  type CreateMonthlyReportRequest,
  type MonthlyReportResponse,
} from '@/lib/api'
import { useLocale, useTranslations } from '@/i18n/client'
import { monthsShort, type MessageKey } from '@/i18n/messages'
import { currentPeriodStart, formatMonthDay, periodEndOf } from '@/lib/monthly'

type Fields = {
  measuredWeightKg: string
  waistCm: string
  chestCm: string
  neckCm: string
  hipsCm: string
  bicepsLeftCm: string
  bicepsRightCm: string
  thighLeftCm: string
  thighRightCm: string
  confidenceLevel: string
  selfSatisfactionLevel: string
  foodControlLevel: string
  energyLevel: string
  stressLevel: string
  cravingControlLevel: string
  notes: string
}

const EMPTY: Fields = {
  measuredWeightKg: '',
  waistCm: '',
  chestCm: '',
  neckCm: '',
  hipsCm: '',
  bicepsLeftCm: '',
  bicepsRightCm: '',
  thighLeftCm: '',
  thighRightCm: '',
  confidenceLevel: '',
  selfSatisfactionLevel: '',
  foodControlLevel: '',
  energyLevel: '',
  stressLevel: '',
  cravingControlLevel: '',
  notes: '',
}

const MEASUREMENTS: { key: keyof Fields; label: MessageKey }[] = [
  { key: 'measuredWeightKg', label: 'monthly.weight' },
  { key: 'waistCm', label: 'monthly.waist' },
  { key: 'chestCm', label: 'monthly.chest' },
  { key: 'neckCm', label: 'monthly.neck' },
  { key: 'hipsCm', label: 'monthly.hips' },
  { key: 'bicepsLeftCm', label: 'monthly.bicepsLeft' },
  { key: 'bicepsRightCm', label: 'monthly.bicepsRight' },
  { key: 'thighLeftCm', label: 'monthly.thighLeft' },
  { key: 'thighRightCm', label: 'monthly.thighRight' },
]

const SCORES: { key: keyof Fields; label: MessageKey }[] = [
  { key: 'confidenceLevel', label: 'monthly.confidence' },
  { key: 'selfSatisfactionLevel', label: 'monthly.selfSatisfaction' },
  { key: 'foodControlLevel', label: 'monthly.foodControl' },
  { key: 'energyLevel', label: 'monthly.energy' },
  { key: 'stressLevel', label: 'monthly.stress' },
  { key: 'cravingControlLevel', label: 'monthly.cravingControl' },
]

const inputCls =
  'rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]'

function toNumber(value: string): number | undefined {
  if (value.trim() === '') return undefined
  const n = Number(value)
  return Number.isNaN(n) ? undefined : n
}

const s = (v: number | null | undefined) => (v == null ? '' : String(v))

function presetFrom(r: MonthlyReportResponse): Fields {
  return {
    measuredWeightKg: s(r.measuredWeightKg),
    waistCm: s(r.waistCm),
    chestCm: s(r.chestCm),
    neckCm: s(r.neckCm),
    hipsCm: s(r.hipsCm),
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
    notes: r.notes ?? '',
  }
}

export default function MonthlyReviewFormPage() {
  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()
  const months = monthsShort[locale]

  const [periodStart, setPeriodStart] = useState('')
  const [existingId, setExistingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load the current period's report (if any) and preset the form for editing.
  useEffect(() => {
    let active = true
    async function load() {
      try {
        const reports = await getMonthlyReports()
        if (!active) return
        const start = currentPeriodStart(reports)
        const existing = reports.find((r) => r.periodStartDate === start)
        setPeriodStart(start)
        if (existing) {
          setExistingId(existing.id)
          setFields(presetFrom(existing))
        }
      } catch {
        if (active) setPeriodStart(currentPeriodStart([]))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  function set(key: keyof Fields, value: string) {
    setFields((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload: CreateMonthlyReportRequest = {
      periodStartDate: periodStart,
      measuredWeightKg: toNumber(fields.measuredWeightKg),
      waistCm: toNumber(fields.waistCm),
      chestCm: toNumber(fields.chestCm),
      neckCm: toNumber(fields.neckCm),
      hipsCm: toNumber(fields.hipsCm),
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
      notes: fields.notes.trim() || undefined,
    }

    try {
      if (existingId !== null) {
        await updateMonthlyReport(existingId, payload)
      } else {
        await createMonthlyReport(payload)
      }
      router.push('/dashboard/monthly-report')
      router.refresh()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 409 ? t('monthly.errorDuplicate') : err.message)
      } else {
        setError(t('common.errorGeneric'))
      }
      setSubmitting(false)
    }
  }

  const periodLabel =
    periodStart &&
    `${formatMonthDay(periodStart, months)} – ${formatMonthDay(periodEndOf(periodStart), months)}`

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {existingId !== null
            ? t('monthly.editReviewTitle')
            : t('monthly.newReviewTitle')}
        </h1>
        {periodLabel && (
          <p className="mt-1 text-sm font-medium text-[var(--color-accent)]">
            {periodLabel}
          </p>
        )}
        <p className="mt-2 text-[var(--color-muted)]">
          {loading
            ? t('monthly.loading')
            : existingId !== null
              ? t('monthly.reviewDescEdit')
              : t('monthly.reviewDescNew')}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <Section title={t('monthly.sectionMeasurements')}>
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
        </Section>

        <Section title={t('monthly.sectionMentalState')}>
          {SCORES.map(({ key, label }) => (
            <Field key={key} label={t(label)} htmlFor={key}>
              <LevelSelect
                id={key}
                value={fields[key]}
                onChange={(v) => set(key, v)}
              />
            </Field>
          ))}
        </Section>

        <Section title={t('monthly.sectionNotes')} single>
          <Field label={t('monthly.notes')} htmlFor="notes">
            <textarea
              id="notes"
              rows={4}
              value={fields.notes}
              onChange={(e) => set('notes', e.target.value)}
              className={`${inputCls} resize-y`}
            />
          </Field>
        </Section>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)]/5 px-3 py-2 text-sm text-[var(--color-accent)]"
          >
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || loading}
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting
              ? existingId !== null
                ? t('monthly.updating')
                : t('monthly.saving')
              : existingId !== null
                ? t('monthly.update')
                : t('monthly.save')}
          </button>
          <Link
            href="/dashboard/monthly-report"
            className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--color-accent)]/10"
          >
            {t('common.cancel')}
          </Link>
        </div>
      </form>
    </main>
  )
}

function Section({
  title,
  children,
  single,
}: {
  title: string
  children: React.ReactNode
  single?: boolean
}) {
  return (
    <fieldset className="rounded-xl border border-[var(--color-border)] p-5">
      <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {title}
      </legend>
      <div
        className={
          single ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 gap-4 sm:grid-cols-3'
        }
      >
        {children}
      </div>
    </fieldset>
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

function LevelSelect({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    >
      <option value="">—</option>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  )
}
