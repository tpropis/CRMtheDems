export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/ui/stat-card'
import { Plus, Database, Shield, AlertCircle, Eye } from 'lucide-react'

export default async function DiscoveryPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const collections = await db.discoveryCollection.findMany({
    where: { matter: { firmId } },
    orderBy: { createdAt: 'desc' },
    include: {
      matter: { select: { name: true, matterNumber: true } },
      _count: { select: { documents: true } },
    },
    take: 50,
  })

  const [totalDocs, privilegedDocs, hotDocs] = await Promise.all([
    db.discoveryDocument.count({ where: { collection: { matter: { firmId } } } }),
    db.discoveryDocument.count({ where: { collection: { matter: { firmId } }, isPrivileged: true } }),
    db.discoveryDocument.count({ where: { collection: { matter: { firmId } }, isHot: true } }),
  ])

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Discovery"
        description="Document review, privilege analysis, and production management"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Collection
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Documents" value={totalDocs} icon={Database} color="default" />
        <StatCard label="Privileged" value={privilegedDocs} icon={Shield} color="warning" />
        <StatCard label="Hot Documents" value={hotDocs} icon={AlertCircle} color="danger" />
      </div>

      <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Collection</th>
                <th>Matter</th>
                <th>Documents</th>
                <th>Reviewed</th>
                <th>Producing Party</th>
                <th>Production Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {collections.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-vault-text-secondary">
                    No discovery collections. Upload a production set from a matter's Discovery tab.
                  </td>
                </tr>
              ) : (
                collections.map((col) => {
                  const pct = col.totalDocs > 0 ? Math.round((col.reviewedDocs / col.totalDocs) * 100) : 0
                  return (
                    <tr key={col.id}>
                      <td className="font-medium text-vault-text">{col.name}</td>
                      <td>
                        <p className="text-sm text-vault-text-secondary">{col.matter.name}</p>
                        <p className="text-xs font-mono text-vault-muted">{col.matter.matterNumber}</p>
                      </td>
                      <td className="tabular-nums text-vault-text">{col._count.documents}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-vault-elevated rounded-full h-1.5 max-w-[80px]">
                            <div className="h-full bg-vault-accent rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-vault-muted tabular-nums">{pct}%</span>
                        </div>
                      </td>
                      <td className="text-vault-text-secondary">{col.producingParty || '—'}</td>
                      <td className="text-xs text-vault-muted">{col.productionDate ? formatDate(col.productionDate) : '—'}</td>
                      <td><Badge variant={col.status === 'ACTIVE' ? 'active' : 'inactive'}>{col.status}</Badge></td>
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
