export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Plus, AlertTriangle, CheckCircle2, Clock, Filter } from 'lucide-react'

const STATUS_ORDER = ['NEW', 'SCREENING', 'CONFLICT_CHECK', 'APPROVED', 'CONVERTED', 'REJECTED', 'ABANDONED']

export default async function IntakePage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const leads = await db.intakeLead.findMany({
    where: { firmId },
    orderBy: { createdAt: 'desc' },
    include: { conflictCheck: { select: { status: true } } },
    take: 100,
  })

  const pipeline = STATUS_ORDER.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }))

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Intake"
        description="New client leads and conflict clearance pipeline"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Link href="/app/intake/new">
              <Button size="sm">
                <Plus className="h-4 w-4" />
                New Lead
              </Button>
            </Link>
          </>
        }
      />

      {/* Pipeline summary */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {pipeline.map(({ status, count }) => (
          <div
            key={status}
            className="shrink-0 rounded-md border border-vault-border bg-vault-surface px-4 py-3 min-w-[120px]"
          >
            <p className="text-xs text-vault-muted uppercase tracking-wider mb-1">
              {status.replace(/_/g, ' ')}
            </p>
            <p className="text-2xl font-bold text-vault-text tabular-nums">{count}</p>
          </div>
        ))}
      </div>

      {/* Leads table */}
      <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Prospect</th>
                <th>Matter Type</th>
                <th>Status</th>
                <th>Conflict Check</th>
                <th>Urgency</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-vault-text-secondary">
                    No intake leads yet.{' '}
                    <Link href="/app/intake/new" className="text-vault-accent-light hover:underline">
                      Create the first one
                    </Link>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <Link href={`/app/intake/${lead.id}`} className="hover:text-vault-accent-light">
                        <span className="text-xs font-mono text-vault-muted">{lead.leadNumber}</span>
                      </Link>
                    </td>
                    <td>
                      <p className="font-medium text-vault-text">{lead.prospectName}</p>
                      {lead.prospectEmail && (
                        <p className="text-xs text-vault-text-secondary">{lead.prospectEmail}</p>
                      )}
                    </td>
                    <td className="text-vault-text-secondary text-sm">
                      {lead.matterType?.replace(/_/g, ' ') || '—'}
                    </td>
                    <td><StatusBadge status={lead.status} /></td>
                    <td>
                      {lead.conflictCheck ? (
                        <div className="flex items-center gap-1.5">
                          {lead.conflictCheck.status === 'CLEAR' && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-vault-success" />
                          )}
                          {lead.conflictCheck.status === 'POTENTIAL_CONFLICT' && (
                            <AlertTriangle className="h-3.5 w-3.5 text-vault-warning" />
                          )}
                          {lead.conflictCheck.status === 'CONFLICT_CONFIRMED' && (
                            <AlertTriangle className="h-3.5 w-3.5 text-vault-danger" />
                          )}
                          <StatusBadge status={lead.conflictCheck.status} />
                        </div>
                      ) : (
                        <span className="text-xs text-vault-muted">Not run</span>
                      )}
                    </td>
                    <td>
                      <span className={`text-xs font-semibold uppercase ${
                        lead.urgency === 'URGENT' ? 'text-vault-danger' :
                        lead.urgency === 'HIGH' ? 'text-vault-warning' : 'text-vault-text-secondary'
                      }`}>
                        {lead.urgency}
                      </span>
                    </td>
                    <td className="text-xs text-vault-muted">{formatDate(lead.createdAt)}</td>
                    <td>
                      <Link href={`/app/intake/${lead.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs">View</Button>
                      </Link>
                    </td>
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
