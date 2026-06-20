import Link from 'next/link'
import DashboardNav from '@/app/components/DashboardNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col sm:flex-row">
      <aside className="border-b border-[var(--color-border)] sm:w-56 sm:shrink-0 sm:border-b-0 sm:border-r">
        <div className="flex h-full flex-col p-4">
          <Link
            href="/dashboard"
            className="px-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]"
          >
            FORGE
          </Link>
          <DashboardNav />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  )
}
