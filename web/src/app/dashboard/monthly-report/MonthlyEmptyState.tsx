import Link from 'next/link'
import { getT } from '@/i18n/server'

// Shown on the monthly overview and detail routes when the user has no reports
// yet — never a 404.
export default async function MonthlyEmptyState() {
  const t = await getT()
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t('monthly.title')}</h1>
      <div className="rounded-xl border border-[var(--color-border)] p-8 text-center">
        <p className="text-lg font-medium">{t('monthly.noReports')}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-muted)]">
          {t('monthly.emptyDescription')}
        </p>
        <Link
          href="/dashboard/monthly-report/new"
          className="mt-6 inline-block rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t('monthly.createInitial')}
        </Link>
      </div>
    </main>
  )
}
