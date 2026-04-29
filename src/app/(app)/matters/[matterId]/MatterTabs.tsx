'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Activity, CheckSquare,
  Receipt, Search, Database,
} from 'lucide-react'

const TABS = [
  { label: 'Overview',   slug: 'overview',   icon: LayoutDashboard },
  { label: 'Documents',  slug: 'documents',  icon: FileText },
  { label: 'Timeline',   slug: 'timeline',   icon: Activity },
  { label: 'Tasks',      slug: 'tasks',      icon: CheckSquare },
  { label: 'Billing',    slug: 'billing',    icon: Receipt },
  { label: 'Research',   slug: 'research',   icon: Search },
  { label: 'Discovery',  slug: 'discovery',  icon: Database },
]

export function MatterTabs({ matterId }: { matterId: string }) {
  const pathname = usePathname()
  return (
    <nav className="mt-6 flex items-center gap-0 -mb-px overflow-x-auto">
      {TABS.map((tab) => {
        const href = `/matters/${matterId}/${tab.slug}`
        const active = pathname.endsWith(`/${tab.slug}`) || (tab.slug === 'overview' && pathname === `/matters/${matterId}`)
        return (
          <Link
            key={tab.slug}
            href={href}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] border-b-2 transition-colors whitespace-nowrap ${
              active
                ? 'border-vault-accent text-vault-accent font-medium'
                : 'border-transparent text-vault-text-secondary hover:text-vault-ink hover:border-vault-border-strong'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
