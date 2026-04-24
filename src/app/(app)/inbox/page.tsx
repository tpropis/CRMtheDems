export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, AlertTriangle, Info, CheckCircle2 } from 'lucide-react'

export default async function InboxPage() {
  const session = await auth()
  const userId = session?.user?.id

  const notifications = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  }).catch(() => [])

  const ICONS: Record<string, any> = {
    URGENT: AlertTriangle,
    ACTION_REQUIRED: AlertTriangle,
    WARNING: AlertTriangle,
    INFO: Info,
  }

  const COLORS: Record<string, string> = {
    URGENT: 'text-vault-danger',
    ACTION_REQUIRED: 'text-vault-warning',
    WARNING: 'text-vault-warning',
    INFO: 'text-vault-muted',
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Inbox"
        description={`${notifications.filter(n => !n.isRead).length} unread`}
        actions={<Button variant="outline" size="sm">Mark all read</Button>}
      />
      <div className="rounded-md border border-vault-border bg-vault-surface divide-y divide-vault-border/50">
        {notifications.length === 0 ? (
          <div className="py-12 text-center"><Bell className="h-8 w-8 text-vault-muted mx-auto mb-3" /><p className="text-sm text-vault-text-secondary">Your inbox is clear.</p></div>
        ) : notifications.map((n) => {
          const Icon = ICONS[n.type] || Bell
          return (
            <div key={n.id} className={`flex items-start gap-4 px-5 py-4 ${!n.isRead ? 'bg-vault-elevated/40' : ''}`}>
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${COLORS[n.type] || 'text-vault-muted'}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${!n.isRead ? 'text-vault-text' : 'text-vault-text-secondary'}`}>{n.title}</p>
                <p className="text-sm text-vault-text-secondary mt-0.5">{n.body}</p>
                <p className="text-xs text-vault-muted mt-1">{formatDate(n.createdAt)}</p>
              </div>
              {!n.isRead && <div className="h-2 w-2 rounded-full bg-vault-accent shrink-0 mt-1.5" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
