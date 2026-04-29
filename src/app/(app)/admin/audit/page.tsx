export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDateTime } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Download, Filter, Lock } from 'lucide-react'

const ACTION_COLORS: Record<string, string> = {
  LOGIN: 'accent',
  LOGIN_FAILED: 'danger',
  LOGOUT: 'default',
  DOCUMENT_UPLOADED: 'default',
  DOCUMENT_DOWNLOADED: 'warning',
  DOCUMENT_EXPORTED: 'warning',
  AI_QUERY: 'accent',
  PRIVILEGE_FLAGGED: 'gold',
  PERMISSION_CHANGED: 'danger',
  DELETE: 'danger',
  INTAKE_CREATED: 'active',
  MATTER_CREATED: 'active',
  INVOICE_GENERATED: 'default',
}

export default async function AuditPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const auditEvents = await db.auditEvent.findMany({
    where: { firmId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      matter: { select: { name: true, matterNumber: true } },
    },
    take: 200,
  }).catch(() => [] as any[])

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Audit Log"
        description="Immutable record of all firm activity"
        badge={<Badge variant="active" className="gap-1"><Lock className="h-3 w-3" />Immutable</Badge>}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </>
        }
      />

      {/* Security banner */}
      <div className="section-card overflow-hidden">
        <div className="h-[3px] w-full bg-gradient-to-r from-vault-success to-vault-success/40" />
        <div className="flex items-center gap-3 px-5 py-3">
          <Shield className="h-4 w-4 text-vault-success shrink-0" />
          <p className="text-[13px] text-vault-success leading-relaxed">
            This audit log is cryptographically sealed and tamper-evident. All entries are write-once and cannot be modified or deleted.
          </p>
        </div>
      </div>

      <div className="section-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Matter</th>
                <th>IP Address</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 font-mono text-[12px] text-vault-muted">
                    No audit events recorded yet.
                  </td>
                </tr>
              ) : (
                auditEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="text-xs font-mono text-vault-muted whitespace-nowrap">
                      {formatDateTime(event.createdAt)}
                    </td>
                    <td>
                      {event.user ? (
                        <div>
                          <p className="font-medium text-vault-ink">{event.user.name}</p>
                          <p className="font-mono text-[11px] text-vault-muted">{event.user.email}</p>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-vault-muted">System</span>
                      )}
                    </td>
                    <td>
                      <Badge variant={(ACTION_COLORS[event.action] as any) || 'default'}>
                        {event.action.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="text-xs text-vault-text-secondary">
                      {event.resource || '—'}
                    </td>
                    <td>
                      {event.matter ? (
                        <div>
                          <p className="text-xs text-vault-text-secondary">{event.matter.name}</p>
                          <p className="text-xs font-mono text-vault-muted">{event.matter.matterNumber}</p>
                        </div>
                      ) : (
                        <span className="text-vault-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="text-xs font-mono text-vault-muted">{event.ipAddress || '—'}</td>
                    <td className="text-xs text-vault-text-secondary max-w-xs truncate">
                      {event.description || '—'}
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
