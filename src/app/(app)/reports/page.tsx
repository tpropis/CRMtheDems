import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { BarChart3, Briefcase, Clock, Bot, Users } from 'lucide-react'

export default async function ReportsPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const [mattersByStatus, mattersByType, totalWIP, aiJobCount, activeUsers] = await Promise.all([
    db.matter.groupBy({ by: ['status'], where: { firmId }, _count: true }),
    db.matter.groupBy({ by: ['type'], where: { firmId }, _count: true }),
    db.timeEntry.aggregate({ where: { firmId, status: { in: ['DRAFT', 'SUBMITTED', 'APPROVED'] } }, _sum: { amount: true } }),
    db.aIJob.count({ where: { firmId } }),
    db.user.count({ where: { firmId, isActive: true } }),
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Reports" description="Firm-wide analytics and operational metrics" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Matters" value={mattersByStatus.find((m) => m.status === 'ACTIVE')?._count || 0} icon={Briefcase} color="accent" />
        <StatCard label="WIP" value={formatCurrency(Number(totalWIP._sum.amount || 0))} icon={Clock} color="success" />
        <StatCard label="AI Jobs Run" value={aiJobCount} icon={Bot} color="default" />
        <StatCard label="Active Users" value={activeUsers} icon={Users} color="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-md border border-vault-border bg-vault-surface p-5">
          <h3 className="text-sm font-semibold text-vault-text mb-4">Matters by Status</h3>
          <div className="space-y-3">
            {mattersByStatus.map((row) => (
              <div key={row.status} className="flex items-center justify-between">
                <span className="text-sm text-vault-text-secondary">{row.status.replace(/_/g, ' ')}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-vault-elevated rounded-full h-1.5">
                    <div className="h-full bg-vault-accent rounded-full" style={{ width: `${Math.min((row._count / 10) * 100, 100)}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-vault-text tabular-nums w-4">{row._count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-vault-border bg-vault-surface p-5">
          <h3 className="text-sm font-semibold text-vault-text mb-4">Matters by Practice Area</h3>
          <div className="space-y-3">
            {mattersByType.slice(0, 8).map((row) => (
              <div key={row.type} className="flex items-center justify-between">
                <span className="text-sm text-vault-text-secondary">{row.type.replace(/_/g, ' ')}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-vault-elevated rounded-full h-1.5">
                    <div className="h-full bg-vault-accent rounded-full" style={{ width: `${Math.min((row._count / 5) * 100, 100)}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-vault-text tabular-nums w-4">{row._count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
