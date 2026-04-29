export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Filter, Building, User, Users } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

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
  }).catch(() => [] as any[])

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Clients"
        description={`${clients.length} client${clients.length !== 1 ? 's' : ''}`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New Client
            </Button>
          </>
        }
      />

      <div className="section-card">
        {clients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No clients yet"
            description="Add your first client from intake to get started."
          />
        ) : (
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
                {clients.map((client: any) => {
                  const activeMatters = client.matters.filter((m: any) => m.status === 'ACTIVE').length
                  return (
                    <tr key={client.id}>
                      <td>
                        <Link href={`/clients/${client.id}`} className="block hover:text-vault-accent">
                          <p className="font-medium text-vault-ink">{client.name}</p>
                          <p className="font-mono text-[11px] text-vault-muted">{client.clientNumber}</p>
                        </Link>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          {client.type === 'ORGANIZATION' ? (
                            <Building className="h-3.5 w-3.5 text-vault-muted" />
                          ) : (
                            <User className="h-3.5 w-3.5 text-vault-muted" />
                          )}
                          <span className="text-[13px] text-vault-text-secondary capitalize">{client.type.toLowerCase()}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`font-mono text-[13px] font-semibold tabular-nums ${activeMatters > 0 ? 'text-vault-accent' : 'text-vault-muted'}`}>
                          {activeMatters}
                        </span>
                      </td>
                      <td className="font-mono text-[13px] tabular-nums text-vault-text-secondary">{client._count.matters}</td>
                      <td className="font-mono text-[13px] tabular-nums text-vault-text-secondary">{client._count.contacts}</td>
                      <td>
                        <Badge variant={client.isActive ? 'active' : 'inactive'}>
                          {client.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="font-mono text-[11px] text-vault-muted">{formatDate(client.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
