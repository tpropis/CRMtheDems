export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Filter, Users } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export default async function ContactsPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const contacts = await db.contact.findMany({
    where: { firmId },
    orderBy: { lastName: 'asc' },
    include: { client: { select: { name: true } } },
    take: 100,
  }).catch(() => [] as any[])

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Contacts"
        description={`${contacts.length} contact${contacts.length !== 1 ? 's' : ''}`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-3.5 w-3.5" />Filter</Button>
            <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Add Contact</Button>
          </>
        }
      />
      <div className="section-card">
        {contacts.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No contacts yet"
            description="Contacts linked to your clients will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Organization</th>
                  <th>Type</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Client</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <p className="font-medium text-vault-ink">{c.firstName} {c.lastName}</p>
                      {c.title && <p className="font-mono text-[11px] text-vault-muted">{c.title}</p>}
                    </td>
                    <td className="text-[13px] text-vault-text-secondary">{c.organization || '—'}</td>
                    <td><Badge variant="default">{c.type.replace(/_/g, ' ')}</Badge></td>
                    <td className="font-mono text-[11px] text-vault-text-secondary">{c.email || '—'}</td>
                    <td className="font-mono text-[11px] text-vault-text-secondary">{c.phone || '—'}</td>
                    <td className="text-[13px] text-vault-text-secondary">{c.client?.name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
