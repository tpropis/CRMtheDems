export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Filter } from 'lucide-react'

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
            <Button variant="outline" size="sm"><Filter className="h-4 w-4" />Filter</Button>
            <Button size="sm"><Plus className="h-4 w-4" />Add Contact</Button>
          </>
        }
      />
      <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
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
            {contacts.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-vault-text-secondary">No contacts yet.</td></tr>
            ) : contacts.map((c) => (
              <tr key={c.id}>
                <td><p className="font-medium text-vault-text">{c.firstName} {c.lastName}</p>{c.title && <p className="text-xs text-vault-muted">{c.title}</p>}</td>
                <td className="text-vault-text-secondary">{c.organization || '—'}</td>
                <td><Badge variant="default">{c.type.replace(/_/g, ' ')}</Badge></td>
                <td className="text-xs text-vault-text-secondary">{c.email || '—'}</td>
                <td className="text-xs text-vault-text-secondary">{c.phone || '—'}</td>
                <td className="text-xs text-vault-text-secondary">{c.client?.name || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
