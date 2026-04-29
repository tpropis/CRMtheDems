import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate, formatCurrency, formatHours } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { Plus, Clock, TrendingUp, DollarSign, Timer } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export default async function TimekeepingPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId
  const userId = session?.user?.id

  const [myEntries, totalHours, totalAmount] = await Promise.all([
    db.timeEntry.findMany({
      where: { firmId, userId },
      orderBy: { billingDate: 'desc' },
      include: {
        matter: { select: { name: true, matterNumber: true } },
        user: { select: { name: true } },
      },
      take: 50,
    }).catch(() => [] as any[]),
    db.timeEntry.aggregate({
      where: { firmId, userId, status: { not: 'WRITTEN_OFF' } },
      _sum: { hoursWorked: true },
    }).catch(() => ({ _sum: { hoursWorked: null } } as any)),
    db.timeEntry.aggregate({
      where: { firmId, userId, isBillable: true, status: { not: 'WRITTEN_OFF' } },
      _sum: { amount: true },
    }).catch(() => ({ _sum: { amount: null } } as any)),
  ])

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Timekeeping"
        description="Your time entries and billing"
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Log Time
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Hours" value={formatHours(Number(totalHours._sum.hoursWorked || 0))} icon={Clock} color="accent" />
        <StatCard label="Billable Amount" value={formatCurrency(Number(totalAmount._sum.amount || 0))} icon={DollarSign} color="success" />
        <StatCard label="Entries" value={myEntries.length} icon={TrendingUp} color="default" />
      </div>

      <div className="section-card">
        {myEntries.length === 0 ? (
          <EmptyState
            icon={Timer}
            title="No time entries yet"
            description="Start logging your time against matters to track billable hours."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Matter</th>
                  <th>Description</th>
                  <th>Hours</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Billable</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="font-mono text-[11px] text-vault-muted whitespace-nowrap">{formatDate(entry.billingDate)}</td>
                    <td>
                      <p className="font-medium text-vault-ink">{entry.matter.name}</p>
                      <p className="font-mono text-[11px] text-vault-muted">{entry.matter.matterNumber}</p>
                    </td>
                    <td className="max-w-xs">
                      <p className="text-[13px] text-vault-text-secondary truncate">{entry.description}</p>
                    </td>
                    <td className="font-mono tabular-nums font-semibold text-vault-ink">{formatHours(Number(entry.hoursWorked))}</td>
                    <td className="font-mono tabular-nums text-[12px] text-vault-text-secondary">${Number(entry.ratePerHour).toFixed(0)}/hr</td>
                    <td className="font-mono tabular-nums font-semibold text-vault-ink">{formatCurrency(Number(entry.amount))}</td>
                    <td>
                      <div className={`h-2 w-2 rounded-full ${entry.isBillable ? 'bg-vault-success shadow-[0_0_4px_rgba(45,89,69,0.4)]' : 'bg-vault-muted'}`} />
                    </td>
                    <td><StatusBadge status={entry.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
