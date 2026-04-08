import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/ui/page-header'
import { roleLabel } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initials, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'

export default async function ProfilePage() {
  const session = await auth()
  const user = await db.user.findUnique({ where: { id: session?.user?.id }, include: { office: true } })
  if (!user) return null

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <PageHeader title="Profile" description="Your account and security settings" />
      <div className="rounded-md border border-vault-border bg-vault-surface p-6">
        <div className="flex items-start gap-5 mb-6">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-vault-text">{user.name}</h2>
            <p className="text-sm text-vault-text-secondary">{user.title}</p>
            <p className="text-sm text-vault-muted">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default">{roleLabel(user.role)}</Badge>
              {user.office && <Badge variant="outline">{user.office.name}</Badge>}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-5 border-t border-vault-border">
          {[
            { label: 'Bar Number', value: user.barNumber || '—' },
            { label: 'Last Login', value: user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never' },
            { label: 'Account Created', value: formatDate(user.createdAt) },
            { label: 'MFA', value: user.mfaEnabled ? 'Enabled' : 'Not enabled' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-vault-muted uppercase tracking-wider mb-0.5">{label}</p>
              <p className="text-sm text-vault-text">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
