import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export default async function ConflictsPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const checks = await db.conflictCheck.findMany({
    where: { intakeLead: { firmId } },
    orderBy: { runAt: 'desc' },
    include: { intakeLead: { select: { prospectName: true, leadNumber: true } }, results: true },
    take: 50,
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Conflict Checks" description="Automated conflict screening for all intake leads" />
      <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
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
            {checks.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-vault-text-secondary">No conflict checks run yet. Create an intake lead to trigger automatic conflict check.</td></tr>
            ) : checks.map((c) => (
              <tr key={c.id}>
                <td className="font-mono text-xs text-vault-muted">{c.intakeLead.leadNumber}</td>
                <td className="font-medium text-vault-text">{c.intakeLead.prospectName}</td>
                <td>
                  <div className="flex items-center gap-1.5">
                    {c.status === 'CLEAR' && <CheckCircle2 className="h-4 w-4 text-vault-success" />}
                    {c.status === 'POTENTIAL_CONFLICT' && <AlertTriangle className="h-4 w-4 text-vault-warning" />}
                    {c.status === 'CONFLICT_CONFIRMED' && <XCircle className="h-4 w-4 text-vault-danger" />}
                    <StatusBadge status={c.status} />
                  </div>
                </td>
                <td className="tabular-nums text-vault-text">{c.results.length}</td>
                <td className="text-sm text-vault-text-secondary max-w-xs truncate">{c.summary || '—'}</td>
                <td className="text-xs text-vault-muted">{formatDate(c.runAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
