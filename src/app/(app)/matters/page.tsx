import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDate, formatDeadline, matterTypeLabel, formatCurrency } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Badge } from '@/components/ui/badge'
import { Plus, Filter, ArrowUpDown, AlertTriangle } from 'lucide-react'

export default async function MattersPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const matters = await db.matter.findMany({
    where: { firmId },
    orderBy: { updatedAt: 'desc' },
    include: {
      client: { select: { name: true } },
      parties: {
        where: { role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
        include: { user: { select: { name: true } } },
        take: 1,
      },
      deadlines: {
        where: { isCompleted: false },
        orderBy: { dueAt: 'asc' },
        take: 1,
      },
    },
    take: 100,
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Matters"
        description={`${matters.length} matter${matters.length !== 1 ? 's' : ''}`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Link href="/app/intake/new">
              <Button size="sm">
                <Plus className="h-4 w-4" />
                New Matter
              </Button>
            </Link>
          </>
        }
      />

      <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Matter</th>
                <th>Client</th>
                <th>Type</th>
                <th>Status</th>
                <th>Attorney</th>
                <th>Risk</th>
                <th>Next Deadline</th>
                <th>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {matters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-vault-text-secondary">
                    No matters yet.{' '}
                    <Link href="/app/intake/new" className="text-vault-accent-light hover:underline">
                      Start with a new intake
                    </Link>
                  </td>
                </tr>
              ) : (
                matters.map((m) => {
                  const nextDeadline = m.deadlines[0]
                  const dl = nextDeadline ? formatDeadline(nextDeadline.dueAt) : null
                  const attorney = m.parties[0]?.user?.name || '—'
                  return (
                    <tr key={m.id}>
                      <td>
                        <Link href={`/app/matters/${m.id}/overview`} className="block hover:text-vault-accent-light">
                          <div className="font-medium text-vault-text">{m.name}</div>
                          <div className="text-xs font-mono text-vault-muted">{m.matterNumber}</div>
                        </Link>
                      </td>
                      <td className="text-vault-text-secondary">{m.client.name}</td>
                      <td>
                        <span className="text-xs text-vault-text-secondary">{matterTypeLabel(m.type)}</span>
                      </td>
                      <td><StatusBadge status={m.status} /></td>
                      <td className="text-vault-text-secondary text-sm">{attorney}</td>
                      <td>
                        <span className={`text-xs font-semibold uppercase tracking-wide ${
                          m.riskLevel === 'CRITICAL' ? 'text-vault-danger' :
                          m.riskLevel === 'HIGH' ? 'text-orange-400' :
                          m.riskLevel === 'MEDIUM' ? 'text-vault-warning' : 'text-vault-success'
                        }`}>
                          {m.riskLevel}
                        </span>
                      </td>
                      <td>
                        {dl ? (
                          <span className={`text-xs ${dl.overdue ? 'text-vault-danger' : dl.urgent ? 'text-vault-warning' : 'text-vault-text-secondary'}`}>
                            {dl.overdue && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                            {dl.label}
                          </span>
                        ) : (
                          <span className="text-xs text-vault-muted">—</span>
                        )}
                      </td>
                      <td className="text-xs text-vault-muted">{formatDate(m.updatedAt)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
