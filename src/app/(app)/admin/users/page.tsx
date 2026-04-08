import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, UserPlus, Shield } from 'lucide-react'
import { initials, roleLabel } from '@/lib/utils'

export default async function AdminUsersPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const users = await db.user.findMany({
    where: { firmId },
    orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    include: { office: { select: { name: true } } },
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Users"
        description={`${users.filter((u) => u.isActive).length} active · ${users.length} total`}
        actions={
          <Button size="sm">
            <UserPlus className="h-4 w-4" />
            Invite User
          </Button>
        }
      />

      <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Office</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>MFA</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-2xs">{initials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-vault-text">{user.name}</p>
                      <p className="text-xs text-vault-muted">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge variant="default">{roleLabel(user.role)}</Badge>
                </td>
                <td className="text-sm text-vault-text-secondary">{user.office?.name || '—'}</td>
                <td>
                  <Badge variant={user.isActive ? 'active' : 'inactive'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="text-xs text-vault-muted">
                  {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                </td>
                <td>
                  {user.mfaEnabled ? (
                    <div className="flex items-center gap-1 text-vault-success">
                      <Shield className="h-3.5 w-3.5" />
                      <span className="text-xs">Enabled</span>
                    </div>
                  ) : (
                    <span className="text-xs text-vault-muted">Disabled</span>
                  )}
                </td>
                <td className="text-xs text-vault-muted">{formatDate(user.createdAt)}</td>
                <td>
                  <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
