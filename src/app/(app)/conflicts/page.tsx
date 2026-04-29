export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export default async function ConflictsPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const checks = await db.conflictCheck.findMany({
    where: { intakeLead: { firmId } },
    orderBy: { runAt: 'desc' },
    include: { intakeLead: { select: { prospectName: true, leadNumber: true } }, results: true },
    take: 50,
  }).catch(() => [] as any[])

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Conflict Checks" description="Automated conflict screening for all intake leads" />
      <div className="section-card">
        {checks.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No conflict checks run yet"
            description="Create an intake lead to trigger an automatic conflict check."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Prospect</th>
                  <th>Status</th>
                  <th>Matches Found</th>
                  <th>Summary</th>
                  <th>Run At</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono text-[11px] text-vault-muted">{c.intakeLead.leadNumber}</td>
                    <td className="font-medium text-vault-ink">{c.intakeLead.prospectName}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {c.status === 'CLEAR' && <CheckCircle2 className="h-3.5 w-3.5 text-vault-success" />}
                        {c.status === 'POTENTIAL_CONFLICT' && <AlertTriangle className="h-3.5 w-3.5 text-vault-warning" />}
                        {c.status === 'CONFLICT_CONFIRMED' && <XCircle className="h-3.5 w-3.5 text-vault-danger" />}
                        <StatusBadge status={c.status} />
                      </div>
                    </td>
                    <td className="font-mono tabular-nums font-semibold text-vault-text">{c.results.length}</td>
                    <td className="text-[13px] text-vault-text-secondary max-w-xs truncate">{c.summary || '—'}</td>
                    <td className="font-mono text-[11px] text-vault-muted">{formatDate(c.runAt)}</td>
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
