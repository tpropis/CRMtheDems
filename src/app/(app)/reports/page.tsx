import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { BarChart3, Briefcase, Clock, Bot, Users } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default async function ReportsPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const [mattersByStatus, mattersByType, totalWIP, aiJobCount, activeUsers] = await Promise.all([
    db.matter.groupBy({ by: ['status'], where: { firmId }, _count: true }).catch(() => [] as any[]),
    db.matter.groupBy({ by: ['type'], where: { firmId }, _count: true }).catch(() => [] as any[]),
    db.timeEntry.aggregate({ where: { firmId, status: { in: ['DRAFT', 'SUBMITTED', 'APPROVED'] } }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: null } } as any)),
    db.aIJob.count({ where: { firmId } }).catch(() => 0),
    db.user.count({ where: { firmId, isActive: true } }).catch(() => 0),
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
        <div className="section-card p-5">
          <h3 className="display-serif text-[14px] font-semibold text-vault-ink tracking-[-0.01em] mb-5">Matters by Status</h3>
          <div className="space-y-4">
            {mattersByStatus.map((row) => (
              <div key={row.status}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] text-vault-text-secondary capitalize">{row.status.replace(/_/g, ' ').toLowerCase()}</span>
                  <span className="font-mono text-[12px] font-semibold text-vault-ink tabular-nums">{row._count}</span>
                </div>
                <Progress value={Math.min((row._count / 10) * 100, 100)} color="accent" />
              </div>
            ))}
          </div>
        </div>

        <div className="section-card p-5">
          <h3 className="display-serif text-[14px] font-semibold text-vault-ink tracking-[-0.01em] mb-5">Matters by Practice Area</h3>
          <div className="space-y-4">
            {mattersByType.slice(0, 8).map((row) => (
              <div key={row.type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] text-vault-text-secondary capitalize">{row.type.replace(/_/g, ' ').toLowerCase()}</span>
                  <span className="font-mono text-[12px] font-semibold text-vault-ink tabular-nums">{row._count}</span>
                </div>
                <Progress value={Math.min((row._count / 5) * 100, 100)} color="gold" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
