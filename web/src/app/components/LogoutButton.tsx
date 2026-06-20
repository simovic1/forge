'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/i18n/client'

export default function LogoutButton() {
  const router = useRouter()
  const t = useTranslations()
  const [submitting, setSubmitting] = useState(false)

  async function handleLogout() {
    setSubmitting(true)
    try {
      await fetch('/api/users/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={submitting}
      className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--color-accent)]/10 disabled:opacity-50"
    >
      {submitting ? t('nav.loggingOut') : t('nav.logout')}
    </button>
  )
}
