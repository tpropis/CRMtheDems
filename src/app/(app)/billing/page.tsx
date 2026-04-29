import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate, formatCurrency } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { Plus, Receipt, Clock, TrendingUp, Filter, FileText } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
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
    }).catch(() => [] as any[]),
    db.timeEntry.aggregate({
      where: { firmId, status: { in: ['DRAFT', 'SUBMITTED', 'APPROVED'] }, isBillable: true },
      _sum: { amount: true },
    }).catch(() => ({ _sum: { amount: null } } as any)),
    db.payment.aggregate({
      where: { invoice: { firmId } },
      _sum: { amount: true },
    }).catch(() => ({ _sum: { amount: null } } as any)),
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
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
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

      <div className="section-card">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-vault-border bg-gradient-to-b from-vault-elevated/80 to-vault-elevated/40">
          <h2 className="display-serif text-[14px] font-semibold text-vault-ink tracking-[-0.01em]">Invoice Queue</h2>
        </div>
        {invoices.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No invoices yet"
            description="Approve time entries first, then generate invoices from the matter."
          />
        ) : (
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
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <span className="font-mono text-[11px] text-vault-text">{inv.invoiceNumber}</span>
                    </td>
                    <td>
                      <p className="font-medium text-vault-ink">{inv.matter.client.name}</p>
                      <p className="font-mono text-[11px] text-vault-muted">{inv.matter.name}</p>
                    </td>
                    <td><StatusBadge status={inv.status} /></td>
                    <td className="font-mono tabular-nums font-semibold text-vault-ink">{formatCurrency(Number(inv.total))}</td>
                    <td className={`font-mono tabular-nums font-semibold ${Number(inv.balance) > 0 ? 'text-vault-warning' : 'text-vault-success'}`}>
                      {formatCurrency(Number(inv.balance))}
                    </td>
                    <td className="font-mono text-[11px] text-vault-muted">{formatDate(inv.issueDate)}</td>
                    <td className="font-mono text-[11px] text-vault-muted">{inv.dueDate ? formatDate(inv.dueDate) : '—'}</td>
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
