import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate, formatCurrency } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { Plus, Receipt, Clock, TrendingUp, Filter } from 'lucide-react'
import Link from 'next/link'

export default async function BillingPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const [invoices, wipAmount, paidAmount] = await Promise.all([
    db.invoice.findMany({
      where: { firmId },
      orderBy: { createdAt: 'desc' },
      include: { matter: { select: { name: true, matterNumber: true, client: { select: { name: true } } } } },
      take: 50,
    }),
    db.timeEntry.aggregate({
      where: { firmId, status: { in: ['DRAFT', 'SUBMITTED', 'APPROVED'] }, isBillable: true },
      _sum: { amount: true },
    }),
    db.payment.aggregate({
      where: { invoice: { firmId } },
      _sum: { amount: true },
    }),
  ])

  const totalBilled = invoices.reduce((sum, inv) => sum + Number(inv.total), 0)
  const totalCollected = Number(paidAmount._sum.amount || 0)
  const wip = Number(wipAmount._sum.amount || 0)

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Billing"
        description="Invoice queue and revenue overview"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Generate Invoice
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="WIP" value={formatCurrency(wip)} icon={Clock} color="warning" />
        <StatCard label="Total Billed" value={formatCurrency(totalBilled)} icon={Receipt} color="accent" />
        <StatCard label="Collected" value={formatCurrency(totalCollected)} icon={TrendingUp} color="success" />
        <StatCard
          label="AR Balance"
          value={formatCurrency(totalBilled - totalCollected)}
          icon={Receipt}
          color={totalBilled - totalCollected > 50000 ? 'danger' : 'default'}
        />
      </div>

      <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-vault-border">
          <h2 className="text-sm font-semibold text-vault-text">Invoice Queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Matter / Client</th>
                <th>Status</th>
                <th>Total</th>
                <th>Balance</th>
                <th>Issued</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-vault-text-secondary">
                    No invoices yet. Time entries must be approved before generating invoices.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <span className="font-mono text-xs text-vault-text">{inv.invoiceNumber}</span>
                    </td>
                    <td>
                      <p className="text-sm text-vault-text">{inv.matter.client.name}</p>
                      <p className="text-xs text-vault-muted">{inv.matter.name}</p>
                    </td>
                    <td><StatusBadge status={inv.status} /></td>
                    <td className="tabular-nums font-medium text-vault-text">{formatCurrency(Number(inv.total))}</td>
                    <td className={`tabular-nums font-medium ${Number(inv.balance) > 0 ? 'text-vault-warning' : 'text-vault-success'}`}>
                      {formatCurrency(Number(inv.balance))}
                    </td>
                    <td className="text-xs text-vault-muted">{formatDate(inv.issueDate)}</td>
                    <td className="text-xs text-vault-muted">{inv.dueDate ? formatDate(inv.dueDate) : '—'}</td>
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
