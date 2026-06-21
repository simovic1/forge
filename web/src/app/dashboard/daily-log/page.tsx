'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ApiError,
  createDailyLog,
  getDailyLogByDate,
  updateDailyLog,
  type CreateDailyLogRequest,
  type DailyLogResponse,
} from '@/lib/api'
import { useTranslations } from '@/i18n/client'
import type { MessageKey } from '@/i18n/messages'

const TRIGGERS = [
  'HUNGER',
  'STRESS',
  'BOREDOM',
  'SOCIAL',
  'FATIGUE',
  'CHAOS',
  'AVAILABILITY',
  'NONE',
] as const

type FormState = {
  logDate: string
  weight: string
  sleepingHours: string
  steps: string
  trainingCompleted: boolean
  proteinGrams: string
  calories: string
  waterLiters: string
  overeating: boolean
  triggerType: string
  resistedTrigger: boolean
  cravingLevel: string
  cravedFood: string
  resistedCraving: boolean
  energyLevel: string
  stressLevel: string
  moodLevel: string
  notes: string
}

const EMPTY: FormState = {
  logDate: '',
  weight: '',
  sleepingHours: '',
  steps: '',
  trainingCompleted: false,
  proteinGrams: '',
  calories: '',
  waterLiters: '',
  overeating: false,
  triggerType: '',
  resistedTrigger: false,
  cravingLevel: '',
  cravedFood: '',
  resistedCraving: false,
  energyLevel: '',
  stressLevel: '',
  moodLevel: '',
  notes: '',
}

const inputCls =
  'rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]'

function todayISO() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function toNumber(value: string): number | undefined {
  if (value.trim() === '') return undefined
  const n = Number(value)
  return Number.isNaN(n) ? undefined : n
}

// Maps a saved log back into editable form fields (numbers/nulls -> strings).
function presetFrom(log: DailyLogResponse): FormState {
  const s = (v: number | null | undefined) =>
    v === null || v === undefined ? '' : String(v)
  return {
    logDate: log.logDate,
    weight: s(log.weight),
    sleepingHours: s(log.sleepingHours),
    steps: s(log.steps),
    trainingCompleted: log.trainingCompleted ?? false,
    proteinGrams: s(log.proteinGrams),
    calories: s(log.calories),
    waterLiters: s(log.waterLiters),
    overeating: log.overeating ?? false,
    triggerType: log.triggerType ?? '',
    resistedTrigger: log.resistedTrigger ?? false,
    cravingLevel: s(log.cravingLevel),
    cravedFood: log.cravedFood ?? '',
    resistedCraving: log.resistedCraving ?? false,
    energyLevel: s(log.energyLevel),
    stressLevel: s(log.stressLevel),
    moodLevel: s(log.moodLevel),
    notes: log.notes ?? '',
  }
}

export default function DailyLogPage() {
  const router = useRouter()
  const t = useTranslations()
  // Default the date to today via a lazy initializer (no effect needed).
  const [form, setForm] = useState<FormState>(() => ({ ...EMPTY, logDate: todayISO() }))
  const [existingId, setExistingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Whenever the selected date changes, load that day's log (if any) and preset
  // the form, switching between create and update mode.
  useEffect(() => {
    const date = form.logDate
    let active = true

    async function load() {
      setLoading(true)
      try {
        const existing = await getDailyLogByDate(date)
        if (!active) return
        if (existing) {
          setExistingId(existing.id)
          setForm(presetFrom(existing))
        } else {
          setExistingId(null)
          setForm((f) => ({ ...EMPTY, logDate: f.logDate }))
        }
      } catch {
        // Couldn't load — fall back to create mode rather than blocking entry.
        if (active) setExistingId(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [form.logDate])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload: CreateDailyLogRequest = {
      logDate: form.logDate,
      weight: toNumber(form.weight),
      sleepingHours: toNumber(form.sleepingHours),
      steps: toNumber(form.steps),
      trainingCompleted: form.trainingCompleted,
      proteinGrams: toNumber(form.proteinGrams),
      calories: toNumber(form.calories),
      waterLiters: toNumber(form.waterLiters),
      overeating: form.overeating,
      triggerType: form.triggerType.trim() || undefined,
      resistedTrigger: form.resistedTrigger,
      cravingLevel: toNumber(form.cravingLevel),
      cravedFood: form.cravedFood.trim() || undefined,
      resistedCraving: form.resistedCraving,
      energyLevel: toNumber(form.energyLevel),
      stressLevel: toNumber(form.stressLevel),
      moodLevel: toNumber(form.moodLevel),
      notes: form.notes.trim() || undefined,
    }

    try {
      if (existingId !== null) {
        await updateDailyLog(existingId, payload)
      } else {
        await createDailyLog(payload)
      }
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 409 ? t('dailyLog.errorDuplicate') : err.message,
        )
      } else {
        setError(t('common.errorGeneric'))
      }
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {existingId !== null ? t('dailyLog.titleEdit') : t('dailyLog.titleNew')}
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          {loading
            ? t('dailyLog.loading')
            : existingId !== null
              ? t('dailyLog.descEdit')
              : t('dailyLog.descNew')}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <Section title={t('dailyLog.sectionDate')}>
          <Field label={t('dailyLog.logDate')} htmlFor="logDate">
            <input
              id="logDate"
              type="date"
              required
              value={form.logDate}
              max={todayISO()}
              onChange={(e) => set('logDate', e.target.value)}
              className={inputCls}
            />
          </Field>
        </Section>

        <Section title={t('dailyLog.sectionBody')}>
          <Field label={t('dailyLog.weight')} htmlFor="weight">
            <input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              inputMode="decimal"
              value={form.weight}
              onChange={(e) => set('weight', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={t('dailyLog.sleep')} htmlFor="sleepingHours">
            <input
              id="sleepingHours"
              type="number"
              step="0.1"
              min="0"
              max="24"
              inputMode="decimal"
              value={form.sleepingHours}
              onChange={(e) => set('sleepingHours', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={t('dailyLog.steps')} htmlFor="steps">
            <input
              id="steps"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={form.steps}
              onChange={(e) => set('steps', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={t('dailyLog.training')} htmlFor="trainingCompleted">
            <Checkbox
              id="trainingCompleted"
              checked={form.trainingCompleted}
              onChange={(v) => set('trainingCompleted', v)}
              text={t('dailyLog.trainingCheck')}
            />
          </Field>
        </Section>

        <Section title={t('dailyLog.sectionNutrition')}>
          <Field label={t('dailyLog.protein')} htmlFor="proteinGrams">
            <input
              id="proteinGrams"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={form.proteinGrams}
              onChange={(e) => set('proteinGrams', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={t('dailyLog.calories')} htmlFor="calories">
            <input
              id="calories"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={form.calories}
              onChange={(e) => set('calories', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={t('dailyLog.water')} htmlFor="waterLiters">
            <input
              id="waterLiters"
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              value={form.waterLiters}
              onChange={(e) => set('waterLiters', e.target.value)}
              className={inputCls}
            />
          </Field>
        </Section>

        <Section title={t('dailyLog.sectionBehavior')}>
          <Field label={t('dailyLog.overeating')} htmlFor="overeating">
            <Checkbox
              id="overeating"
              checked={form.overeating}
              onChange={(v) => set('overeating', v)}
              text={t('dailyLog.overeatingCheck')}
            />
          </Field>
          <Field label={t('dailyLog.trigger')} htmlFor="triggerType">
            <select
              id="triggerType"
              value={form.triggerType}
              onChange={(e) => set('triggerType', e.target.value)}
              className={inputCls}
            >
              <option value="">—</option>
              {TRIGGERS.map((value) => (
                <option key={value} value={value}>
                  {t(`trigger.${value}` as MessageKey)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('dailyLog.resistedTrigger')} htmlFor="resistedTrigger">
            <Checkbox
              id="resistedTrigger"
              checked={form.resistedTrigger}
              onChange={(v) => set('resistedTrigger', v)}
              text={t('dailyLog.resistedCheck')}
            />
          </Field>
          <Field label={t('dailyLog.craving')} htmlFor="cravingLevel">
            <LevelSelect
              id="cravingLevel"
              value={form.cravingLevel}
              onChange={(v) => set('cravingLevel', v)}
            />
          </Field>
          <Field label={t('dailyLog.cravedFood')} htmlFor="cravedFood">
            <input
              id="cravedFood"
              type="text"
              placeholder={t('dailyLog.cravedFoodPlaceholder')}
              value={form.cravedFood}
              onChange={(e) => set('cravedFood', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={t('dailyLog.resistedCraving')} htmlFor="resistedCraving">
            <Checkbox
              id="resistedCraving"
              checked={form.resistedCraving}
              onChange={(v) => set('resistedCraving', v)}
              text={t('dailyLog.resistedCravingCheck')}
            />
          </Field>
        </Section>

        <Section title={t('dailyLog.sectionWellbeing')}>
          <Field label={t('dailyLog.energy')} htmlFor="energyLevel">
            <LevelSelect
              id="energyLevel"
              value={form.energyLevel}
              onChange={(v) => set('energyLevel', v)}
            />
          </Field>
          <Field label={t('dailyLog.stress')} htmlFor="stressLevel">
            <LevelSelect
              id="stressLevel"
              value={form.stressLevel}
              onChange={(v) => set('stressLevel', v)}
            />
          </Field>
          <Field label={t('dailyLog.mood')} htmlFor="moodLevel">
            <LevelSelect
              id="moodLevel"
              value={form.moodLevel}
              onChange={(v) => set('moodLevel', v)}
            />
          </Field>
        </Section>

        <Section title={t('dailyLog.sectionNotes')} single>
          <Field label={t('dailyLog.notes')} htmlFor="notes">
            <textarea
              id="notes"
              rows={4}
              value={form.notes}
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
                ? t('dailyLog.updating')
                : t('dailyLog.saving')
              : existingId !== null
                ? t('dailyLog.update')
                : t('dailyLog.save')}
          </button>
          <Link
            href="/dashboard"
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
          single ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 gap-4 sm:grid-cols-2'
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

function Checkbox({
  id,
  checked,
  onChange,
  text,
}: {
  id: string
  checked: boolean
  onChange: (value: boolean) => void
  text: string
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 py-2 text-sm">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--color-accent)]"
      />
      <span className="text-[var(--color-muted)]">{text}</span>
    </label>
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
