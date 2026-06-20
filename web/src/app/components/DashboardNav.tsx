'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

const items = [
  { href: '/dashboard', label: 'Home' },
  { href: '/dashboard/daily-log', label: 'Daily log' },
  { href: '/dashboard/weekly-review', label: 'Weekly review' },
  { href: '/dashboard/monthly-review', label: 'Monthly review' },
]

export default function DashboardNav() {
  const pathname = usePathname()

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
          {item.label}
        </Link>
      ))}
      <div className="mt-4 sm:mt-auto sm:pt-4">
        <LogoutButton />
      </div>
    </nav>
  )
}
