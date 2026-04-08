import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, BookOpen, MessageSquare } from 'lucide-react'

export default async function ResearchPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const threads = await db.researchThread.findMany({
    where: { matter: { firmId } },
    orderBy: { updatedAt: 'desc' },
    include: {
      matter: { select: { name: true, matterNumber: true } },
      user: { select: { name: true } },
      _count: { select: { messages: true } },
    },
    take: 50,
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="AI Research"
        description="Legal research threads and saved work product"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Research Thread
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {threads.length === 0 ? (
          <div className="col-span-3 rounded-md border border-vault-border bg-vault-surface p-12 text-center">
            <Search className="h-8 w-8 text-vault-muted mx-auto mb-3" />
            <p className="text-sm text-vault-text-secondary">No research threads yet. Open a matter and use the Research tab to begin.</p>
          </div>
        ) : (
          threads.map((thread) => (
            <div key={thread.id} className="rounded-md border border-vault-border bg-vault-surface p-5 hover:border-vault-border-strong transition-colors">
              <div className="flex items-start justify-between mb-3">
                <BookOpen className="h-4 w-4 text-vault-muted mt-0.5" />
                {thread.isSaved && <Badge variant="gold">Saved</Badge>}
              </div>
              <h3 className="text-sm font-semibold text-vault-text mb-1">{thread.title}</h3>
              <p className="text-xs text-vault-text-secondary mb-3">
                {thread.matter?.name} · {thread.user.name}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-vault-muted">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {thread._count.messages} messages
                </div>
                <span className="text-xs text-vault-muted">{formatDate(thread.updatedAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
