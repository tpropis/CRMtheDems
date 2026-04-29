import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { PERMISSIONS } from '@/lib/permissions'
import { UserRole } from '@prisma/client'

const ALL_ROLES = Object.values(UserRole)

export default function RolesPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Roles & Permissions" description="Permission matrix for all firm roles" />
      <div className="section-card overflow-hidden overflow-x-auto">
        <table className="data-table text-xs">
          <thead>
            <tr>
              <th className="text-left min-w-[180px]">Permission</th>
              {ALL_ROLES.map((r) => <th key={r} className="text-center">{r.replace(/_/g, ' ')}</th>)}
            </tr>
          </thead>
          <tbody>
            {Object.entries(PERMISSIONS).map(([perm, roles]) => (
              <tr key={perm}>
                <td className="font-medium text-vault-text">{perm.replace(/_/g, ' ')}</td>
                {ALL_ROLES.map((r) => (
                  <td key={r} className="text-center">
                    {(roles as UserRole[]).includes(r) ? (
                      <div className="h-2 w-2 rounded-full bg-vault-success mx-auto" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-vault-border mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
