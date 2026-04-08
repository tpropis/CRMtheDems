export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate, formatFileSize } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { Plus, Filter, Search, FileText, Upload } from 'lucide-react'
import Link from 'next/link'

export default async function DocumentsPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const documents = await db.document.findMany({
    where: { firmId, isCurrentVersion: true },
    orderBy: { createdAt: 'desc' },
    include: {
      matter: { select: { name: true, matterNumber: true } },
      uploadedBy: { select: { name: true } },
    },
    take: 100,
  })

  const totalDocs = documents.length
  const privilegedDocs = documents.filter((d) => d.isPrivileged).length

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Documents"
        description={`${totalDocs} document${totalDocs !== 1 ? 's' : ''} · ${privilegedDocs} privileged`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </>
        }
      />

      <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Matter</th>
                <th>Status</th>
                <th>Privilege</th>
                <th>Size</th>
                <th>Uploaded By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-vault-text-secondary">
                    No documents uploaded yet.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-vault-muted shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-vault-text truncate max-w-xs">{doc.name}</p>
                          <p className="text-xs text-vault-muted">{doc.mimeType}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {doc.matter ? (
                        <Link href={`/app/matters/${doc.matterId}/documents`} className="hover:text-vault-accent-light">
                          <p className="text-sm text-vault-text-secondary">{doc.matter.name}</p>
                          <p className="text-xs font-mono text-vault-muted">{doc.matter.matterNumber}</p>
                        </Link>
                      ) : (
                        <span className="text-vault-muted text-sm">—</span>
                      )}
                    </td>
                    <td><StatusBadge status={doc.status} /></td>
                    <td>
                      {doc.isPrivileged ? (
                        <Badge variant="gold">{doc.privilegeTag?.replace(/_/g, ' ') || 'Privileged'}</Badge>
                      ) : (
                        <span className="text-xs text-vault-muted">—</span>
                      )}
                    </td>
                    <td className="text-xs text-vault-text-secondary tabular-nums">
                      {formatFileSize(doc.size)}
                    </td>
                    <td className="text-sm text-vault-text-secondary">{doc.uploadedBy.name}</td>
                    <td className="text-xs text-vault-muted">{formatDate(doc.createdAt)}</td>
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
