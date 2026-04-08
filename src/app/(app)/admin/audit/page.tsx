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
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Audit Log"
        description="Immutable record of all firm activity"
        badge={<Badge variant="active" className="gap-1"><Lock className="h-3 w-3" />Immutable</Badge>}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </>
        }
      />

      {/* Security banner */}
      <div className="flex items-center gap-3 rounded-md border border-vault-success/30 bg-vault-success/10 px-4 py-3">
        <Shield className="h-4 w-4 text-vault-success shrink-0" />
        <p className="text-sm text-vault-success">
          This audit log is cryptographically sealed and tamper-evident. All entries are write-once and cannot be modified or deleted.
        </p>
      </div>

      <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
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
                  <td colSpan={7} className="text-center py-12 text-vault-text-secondary">
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
                          <p className="text-sm text-vault-text">{event.user.name}</p>
                          <p className="text-xs text-vault-muted">{event.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-vault-muted text-xs">System</span>
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
