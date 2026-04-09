import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/status-badge'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard, FileText, Clock, CheckSquare,
  Receipt, Search, Database, Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MATTER_NAV = [
  { label: 'Overview',   href: 'overview',   icon: LayoutDashboard },
  { label: 'Documents',  href: 'documents',  icon: FileText },
  { label: 'Timeline',   href: 'timeline',   icon: Activity },
  { label: 'Tasks',      href: 'tasks',      icon: CheckSquare },
  { label: 'Billing',    href: 'billing',    icon: Receipt },
  { label: 'Research',   href: 'research',   icon: Search },
  { label: 'Discovery',  href: 'discovery',  icon: Database },
]

export default async function MatterLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { matterId: string }
}) {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const matter = await db.matter.findFirst({
    where: { id: params.matterId, firmId },
    include: {
      client: { select: { name: true } },
      parties: {
        where: { isPrimary: true },
        include: { user: { select: { name: true } } },
        take: 1,
      },
    },
  })

  if (!matter) notFound()

  return (
    <div className="space-y-0 animate-fade-in">
      {/* Matter header */}
      <div className="mb-5">
        <nav className="flex items-center gap-1.5 text-xs text-vault-muted mb-3">
          <Link href="/matters" className="hover:text-vault-text-secondary">Matters</Link>
          <span>/</span>
          <span className="text-vault-text-secondary">{matter.matterNumber}</span>
        </nav>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold text-vault-text tracking-tight">{matter.name}</h1>
              <StatusBadge status={matter.status} />
              {matter.isLegalHold && (
                <Badge variant="danger">Legal Hold</Badge>
              )}
            </div>
            <p className="text-sm text-vault-text-secondary">
              {matter.client.name} · {matter.matterNumber} · {matter.parties[0]?.user?.name || 'Unassigned'}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-navigation */}
      <nav className="flex items-center gap-0 border-b border-vault-border mb-5 overflow-x-auto">
        {MATTER_NAV.map((item) => (
          <Link
            key={item.href}
            href={`/app/matters/${params.matterId}/${item.href}`}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-vault-text-secondary hover:text-vault-text border-b-2 border-transparent hover:border-vault-border-strong transition-colors whitespace-nowrap"
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  )
}
