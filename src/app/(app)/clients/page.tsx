export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Filter, Building, User } from 'lucide-react'

export default async function ClientsPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const clients = await db.client.findMany({
    where: { firmId },
    orderBy: { createdAt: 'desc' },
    include: {
      matters: { select: { id: true, status: true } },
      _count: { select: { matters: true, contacts: true } },
    },
    take: 100,
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Clients"
        description={`${clients.length} client${clients.length !== 1 ? 's' : ''}`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Client
            </Button>
          </>
        }
      />

      <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Type</th>
                <th>Active Matters</th>
                <th>Total Matters</th>
                <th>Contacts</th>
                <th>Status</th>
                <th>Since</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-vault-text-secondary">
                    No clients yet. Add your first client from intake.
                  </td>
                </tr>
              ) : (
                clients.map((client) => {
                  const activeMatters = client.matters.filter((m) => m.status === 'ACTIVE').length
                  return (
                    <tr key={client.id}>
                      <td>
                        <Link href={`/app/clients/${client.id}`} className="hover:text-vault-accent-light block">
                          <p className="font-medium text-vault-text">{client.name}</p>
                          <p className="text-xs font-mono text-vault-muted">{client.clientNumber}</p>
                        </Link>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          {client.type === 'ORGANIZATION' ? (
                            <Building className="h-3.5 w-3.5 text-vault-muted" />
                          ) : (
                            <User className="h-3.5 w-3.5 text-vault-muted" />
                          )}
                          <span className="text-sm text-vault-text-secondary capitalize">{client.type.toLowerCase()}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`text-sm font-medium ${activeMatters > 0 ? 'text-vault-accent-light' : 'text-vault-muted'}`}>
                          {activeMatters}
                        </span>
                      </td>
                      <td className="text-vault-text-secondary">{client._count.matters}</td>
                      <td className="text-vault-text-secondary">{client._count.contacts}</td>
                      <td>
                        <Badge variant={client.isActive ? 'active' : 'inactive'}>
                          {client.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="text-xs text-vault-muted">{formatDate(client.createdAt)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
