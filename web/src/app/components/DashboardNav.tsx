'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from '@/i18n/client'
import type { MessageKey } from '@/i18n/messages'
import LogoutButton from './LogoutButton'
import LanguageSwitcher from './LanguageSwitcher'

const items: { href: string; labelKey: MessageKey }[] = [
  { href: '/dashboard', labelKey: 'nav.home' },
  { href: '/dashboard/daily-log', labelKey: 'nav.dailyLog' },
  { href: '/dashboard/weekly-report', labelKey: 'nav.weeklyReview' },
  { href: '/dashboard/monthly-report', labelKey: 'nav.monthlyReview' },
]

export default function DashboardNav() {
  const pathname = usePathname()
  const t = useTranslations()

  // Home matches exactly; the others match their section (incl. subroutes).
  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href)

  return (
    <nav className="mt-4 flex flex-1 flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? 'page' : undefined}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive(item.href)
              ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
              : 'text-[var(--color-muted)] hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-foreground)]'
          }`}
        >
          {t(item.labelKey)}
        </Link>
      ))}
      <div className="mt-4 flex items-center justify-between gap-2 sm:mt-auto sm:pt-4">
        <LogoutButton />
        <LanguageSwitcher />
      </div>
    </nav>
  )
}
