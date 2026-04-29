export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Plus, AlertTriangle, CheckCircle2, Clock, Filter, FileInput } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

const STATUS_ORDER = ['NEW', 'SCREENING', 'CONFLICT_CHECK', 'APPROVED', 'CONVERTED', 'REJECTED', 'ABANDONED']

export default async function IntakePage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const leads = await db.intakeLead.findMany({
    where: { firmId },
    orderBy: { createdAt: 'desc' },
    include: { conflictCheck: { select: { status: true } } },
    take: 100,
  }).catch(() => [] as any[])

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
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Link href="/intake/new">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
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
            className="stat-card shrink-0 min-w-[130px] overflow-hidden"
          >
            <div className="h-[2px] w-full bg-gradient-to-r from-vault-border-strong to-vault-border-strong/30" />
            <div className="p-4">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-vault-muted mb-2">
                {status.replace(/_/g, ' ')}
              </p>
              <p className="font-display text-[1.65rem] font-bold tabular-nums leading-none text-vault-ink">{count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Leads table */}
      <div className="section-card">
        {leads.length === 0 ? (
          <EmptyState
            icon={FileInput}
            title="No intake leads yet"
            description="Create the first lead to begin the conflict clearance pipeline."
            action={{ label: 'New Lead', onClick: () => {} }}
          />
        ) : (
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
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <Link href={`/intake/${lead.id}`} className="hover:text-vault-accent">
                        <span className="font-mono text-[11px] text-vault-muted">{lead.leadNumber}</span>
                      </Link>
                    </td>
                    <td>
                      <p className="font-medium text-vault-ink">{lead.prospectName}</p>
                      {lead.prospectEmail && (
                        <p className="font-mono text-[11px] text-vault-text-secondary">{lead.prospectEmail}</p>
                      )}
                    </td>
                    <td className="text-[13px] text-vault-text-secondary">
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
                        <span className="font-mono text-[11px] text-vault-muted">Not run</span>
                      )}
                    </td>
                    <td>
                      <span className={`font-mono text-[11px] font-semibold uppercase tracking-[0.1em] ${
                        lead.urgency === 'URGENT' ? 'text-vault-danger' :
                        lead.urgency === 'HIGH' ? 'text-vault-warning' : 'text-vault-text-secondary'
                      }`}>
                        {lead.urgency}
                      </span>
                    </td>
                    <td className="font-mono text-[11px] text-vault-muted">{formatDate(lead.createdAt)}</td>
                    <td>
                      <Link href={`/intake/${lead.id}`}>
                        <Button variant="ghost" size="sm" className="text-[12px]">View</Button>
                      </Link>
                    </td>
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
