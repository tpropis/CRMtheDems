export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FolderOpen } from 'lucide-react'

export default async function TemplatesPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId
  const templates = await db.template.findMany({ where: { firmId }, orderBy: { name: 'asc' }, take: 50 })

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Templates" description="Document templates and clause library" actions={<Button size="sm"><Plus className="h-4 w-4" />New Template</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.length === 0 ? (
          <div className="col-span-3 rounded-md border border-vault-border bg-vault-surface p-12 text-center">
            <FolderOpen className="h-8 w-8 text-vault-muted mx-auto mb-3" />
            <p className="text-sm text-vault-text-secondary">No templates yet. Create your first document template.</p>
          </div>
        ) : templates.map((t) => (
          <div key={t.id} className="rounded-md border border-vault-border bg-vault-surface p-5">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-semibold text-vault-text">{t.name}</p>
              <Badge variant="default">{t.category}</Badge>
            </div>
            <p className="text-xs text-vault-text-secondary">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
