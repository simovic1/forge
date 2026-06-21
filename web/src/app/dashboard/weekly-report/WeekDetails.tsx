'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ApiError,
  createWeeklyReport,
  updateWeeklyReport,
  type DailyLogResponse,
  type WeeklyReportResponse,
} from '@/lib/api'
import type { WeeklySummary } from '@/lib/weekly'
import { useTranslations } from '@/i18n/client'

const inputCls =
  'rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] resize-y'

const DASH = '—'
const cell = (v: number | null | undefined, suffix = '') =>
  v === null || v === undefined ? DASH : `${v}${suffix}`

export default function WeekDetails({
  week,
  logs,
  report,
}: {
  week: WeeklySummary
  logs: DailyLogResponse[]
  report: WeeklyReportResponse | null
}) {
  const t = useTranslations()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [whatWentWell, setWhatWentWell] = useState(report?.whatWentWell ?? '')
  const [biggestChallenge, setBiggestChallenge] = useState(
    report?.biggestChallenge ?? '',
  )
  const [mainTriggerNote, setMainTriggerNote] = useState(
    report?.mainTriggerNote ?? '',
  )
  const [nextWeekFocus, setNextWeekFocus] = useState(report?.nextWeekFocus ?? '')
  const [notes, setNotes] = useState(report?.notes ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const body = {
      weekStartDate: week.weekStart,
      whatWentWell: whatWentWell.trim() || undefined,
      biggestChallenge: biggestChallenge.trim() || undefined,
      mainTriggerNote: mainTriggerNote.trim() || undefined,
      nextWeekFocus: nextWeekFocus.trim() || undefined,
      notes: notes.trim() || undefined,
    }

    try {
      if (report) await updateWeeklyReport(report.id, body)
      else await createWeeklyReport(body)
      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('common.errorGeneric'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--color-accent)]/10"
      >
        {t('weekly.details')}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="my-8 w-full max-w-2xl rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {t('weekly.weekNumber', { n: week.index })}
                </h2>
                <p className="text-sm text-[var(--color-muted)]">{week.label}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('common.close')}
                className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm hover:bg-[var(--color-accent)]/10"
              >
                {t('common.close')}
              </button>
            </div>

            <form onSubmit={handleSave}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                {t('weekly.reflection')}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <Field label={t('weekly.whatWentWell')}>
                  <textarea
                    rows={2}
                    value={whatWentWell}
                    onChange={(e) => setWhatWentWell(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label={t('weekly.biggestChallenge')}>
                  <textarea
                    rows={2}
                    value={biggestChallenge}
                    onChange={(e) => setBiggestChallenge(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label={t('weekly.mainTriggerNote')}>
                  <textarea
                    rows={2}
                    value={mainTriggerNote}
                    onChange={(e) => setMainTriggerNote(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label={t('weekly.nextWeekFocus')}>
                  <textarea
                    rows={2}
                    value={nextWeekFocus}
                    onChange={(e) => setNextWeekFocus(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label={t('weekly.notes')}>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)]/5 px-3 py-2 text-sm text-[var(--color-accent)]"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? t('weekly.saving') : t('weekly.save')}
              </button>
            </form>

            <section className="mt-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                {t('weekly.dailyLogsTitle')}
              </h3>
              {logs.length === 0 ? (
                <p className="text-sm text-[var(--color-muted)]">
                  {t('weekly.noLogsInWeek')}
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
                        <th className="p-2 font-medium">{t('dailyLog.logDate')}</th>
                        <th className="p-2 font-medium">{t('dailyLog.weight')}</th>
                        <th className="p-2 font-medium">{t('dailyLog.sleep')}</th>
                        <th className="p-2 font-medium">{t('dailyLog.steps')}</th>
                        <th className="p-2 font-medium">{t('dailyLog.training')}</th>
                        <th className="p-2 font-medium">{t('dailyLog.energy')}</th>
                        <th className="p-2 font-medium">{t('dailyLog.stress')}</th>
                        <th className="p-2 font-medium">{t('dailyLog.mood')}</th>
                        <th className="p-2 font-medium">{t('dailyLog.craving')}</th>
                        <th className="p-2 font-medium">{t('dailyLog.cravedFood')}</th>
                        <th className="p-2 font-medium">{t('dailyLog.resistedCraving')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-[var(--color-border)] last:border-0"
                        >
                          <td className="whitespace-nowrap p-2 font-medium">
                            {log.logDate}
                          </td>
                          <td className="p-2">{cell(log.weight, ' kg')}</td>
                          <td className="p-2">{cell(log.sleepingHours, ' h')}</td>
                          <td className="p-2">{cell(log.steps)}</td>
                          <td className="p-2">
                            {log.trainingCompleted === true
                              ? '✓'
                              : log.trainingCompleted === false
                                ? '✗'
                                : DASH}
                          </td>
                          <td className="p-2">{cell(log.energyLevel)}</td>
                          <td className="p-2">{cell(log.stressLevel)}</td>
                          <td className="p-2">{cell(log.moodLevel)}</td>
                          <td className="p-2">{cell(log.cravingLevel)}</td>
                          <td className="p-2">{log.cravedFood || DASH}</td>
                          <td className="p-2">
                            {log.resistedCraving === true
                              ? '✓'
                              : log.resistedCraving === false
                                ? '✗'
                                : DASH}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}
