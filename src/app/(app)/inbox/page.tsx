export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, AlertTriangle, Info, CheckCircle2 } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

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
      <div className="section-card divide-y divide-vault-border/50">
        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="Inbox is clear" description="Notifications and action items will appear here." />
        ) : notifications.map((n) => {
          const Icon = ICONS[n.type] || Bell
          return (
            <div key={n.id} className={`relative flex items-start gap-4 px-5 py-4 transition-colors ${!n.isRead ? 'bg-vault-elevated/40 hover:bg-vault-elevated/60' : 'hover:bg-vault-elevated/20'}`}>
              {!n.isRead && <span className="absolute left-0 top-1/2 h-[55%] w-[2px] -translate-y-1/2 rounded-r bg-vault-accent" />}
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${COLORS[n.type] || 'text-vault-muted'}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-[13.5px] font-medium ${!n.isRead ? 'text-vault-ink' : 'text-vault-text-secondary'}`}>{n.title}</p>
                <p className="text-[13px] text-vault-text-secondary mt-0.5 leading-relaxed">{n.body}</p>
                <p className="font-mono text-[11px] text-vault-muted mt-1.5">{formatDate(n.createdAt)}</p>
              </div>
              {!n.isRead && <div className="h-2 w-2 rounded-full bg-vault-accent shadow-[0_0_4px_rgba(45,89,69,0.35)] shrink-0 mt-1.5" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
