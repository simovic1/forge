import { getT } from '@/i18n/server'

export default async function WeeklyReviewPage() {
  const t = await getT()
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{t('weekly.title')}</h1>
      <p className="mt-2 text-[var(--color-muted)]">{t('common.nothingHere')}</p>
    </main>
  )
}
