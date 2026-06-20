'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { locales, type Locale } from '@/i18n/messages'
import { setLocale } from '@/i18n/actions'
import { useLocale, useTranslations } from '@/i18n/client'

const LABELS: Record<Locale, string> = { en: 'EN', hr: 'HR' }

export default function LanguageSwitcher() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const [pending, startTransition] = useTransition()

  function change(next: Locale) {
    if (next === locale) return
    // Persist via a server action, then re-render server components in the new
    // language.
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  return (
    <div className="inline-flex gap-1" role="group" aria-label={t('language.aria')}>
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => change(l)}
          disabled={pending}
          aria-pressed={l === locale}
          className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
            l === locale
              ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  )
}
