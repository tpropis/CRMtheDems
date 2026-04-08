import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate, formatCurrency, formatHours } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { Plus, Clock, TrendingUp, DollarSign } from 'lucide-react'

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
    }),
    db.timeEntry.aggregate({
      where: { firmId, userId, status: { not: 'WRITTEN_OFF' } },
      _sum: { hoursWorked: true },
    }),
    db.timeEntry.aggregate({
      where: { firmId, userId, isBillable: true, status: { not: 'WRITTEN_OFF' } },
      _sum: { amount: true },
    }),
  ])

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Timekeeping"
        description="Your time entries and billing"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Log Time
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Hours" value={formatHours(Number(totalHours._sum.hoursWorked || 0))} icon={Clock} color="accent" />
        <StatCard label="Billable Amount" value={formatCurrency(Number(totalAmount._sum.amount || 0))} icon={DollarSign} color="success" />
        <StatCard label="Entries" value={myEntries.length} icon={TrendingUp} color="default" />
      </div>

      <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
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
              {myEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-vault-text-secondary">
                    No time entries yet. Start logging your time.
                  </td>
                </tr>
              ) : (
                myEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="text-xs text-vault-muted whitespace-nowrap">{formatDate(entry.billingDate)}</td>
                    <td>
                      <p className="text-sm text-vault-text">{entry.matter.name}</p>
                      <p className="text-xs font-mono text-vault-muted">{entry.matter.matterNumber}</p>
                    </td>
                    <td className="max-w-xs">
                      <p className="text-sm text-vault-text-secondary truncate">{entry.description}</p>
                    </td>
                    <td className="tabular-nums text-vault-text font-medium">{formatHours(Number(entry.hoursWorked))}</td>
                    <td className="tabular-nums text-vault-text-secondary text-sm">${Number(entry.ratePerHour).toFixed(0)}/hr</td>
                    <td className="tabular-nums font-medium text-vault-text">{formatCurrency(Number(entry.amount))}</td>
                    <td>
                      <div className={`h-2 w-2 rounded-full ${entry.isBillable ? 'bg-vault-success' : 'bg-vault-muted'}`} />
                    </td>
                    <td><StatusBadge status={entry.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
