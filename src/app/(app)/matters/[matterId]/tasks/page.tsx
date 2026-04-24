import { notFound } from 'next/navigation'
import { getDemoMatter, type DemoTask } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { Plus, Filter, AlertTriangle, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Status = DemoTask['status']

const STATUS_ORDER: Status[] = ['todo', 'in_progress', 'review', 'done']

const STATUS_LABEL: Record<Status, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  review: 'Review',
  done: 'Done',
}

export default function MatterTasksPage({ params }: { params: { matterId: string } }) {
  const matter = getDemoMatter(params.matterId)
  if (!matter) notFound()

  const byStatus: Record<Status, DemoTask[]> = {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  }
  matter.tasks.forEach((t) => byStatus[t.status].push(t))

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-vault-gold">§ Tasks</p>
          <p className="mt-1 text-[12px] text-vault-text-secondary">
            {matter.tasks.length} total · {byStatus.todo.length + byStatus.in_progress.length} open
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Task
          </Button>
        </div>
      </div>

      {matter.tasks.length === 0 ? (
        <section className="rounded-md border border-vault-border bg-vault-surface shadow-vault px-5 py-12 text-center">
          <p className="text-[13px] text-vault-text-secondary">
            No tasks on this matter yet. Create one to assign work and track status.
          </p>
          <Button size="sm" variant="outline" className="mt-4 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Create first task
          </Button>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATUS_ORDER.map((s) => (
            <section
              key={s}
              className="rounded-md border border-vault-border bg-vault-surface shadow-vault overflow-hidden flex flex-col"
            >
              <header className="flex items-center justify-between px-4 py-3 border-b border-vault-border bg-vault-elevated/50">
                <div className="flex items-center gap-2">
                  <StatusDot status={s} />
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-vault-ink font-semibold">
                    {STATUS_LABEL[s]}
                  </h2>
                </div>
                <span className="font-mono text-[10px] tabular-nums text-vault-muted">
                  {byStatus[s].length}
                </span>
              </header>

              <div className="divide-y divide-vault-border/60 flex-1">
                {byStatus[s].length === 0 ? (
                  <p className="px-4 py-6 text-center text-[11px] text-vault-faint">
                    Nothing here.
                  </p>
                ) : (
                  byStatus[s].map((t) => <TaskCard key={t.id} t={t} />)
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function TaskCard({ t }: { t: DemoTask }) {
  const priorityStyle =
    t.priority === 'high'
      ? 'border-vault-danger/30 text-vault-danger'
      : t.priority === 'medium'
      ? 'border-vault-gold/30 text-vault-gold'
      : 'border-vault-border text-vault-muted'

  return (
    <article className="px-4 py-3 hover:bg-vault-elevated/40 transition-colors">
      <div className="flex items-start gap-2 mb-2">
        <p className="flex-1 text-[12.5px] text-vault-ink leading-snug">{t.title}</p>
        {t.priority === 'high' && (
          <AlertTriangle className="h-3 w-3 text-vault-danger shrink-0 mt-0.5" />
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-vault-text-secondary">
          <User className="h-3 w-3" />
          <span className="text-[10.5px]">{t.assignee}</span>
        </div>
        <span className={`ml-auto px-1.5 py-0.5 rounded border font-mono text-[9px] uppercase tracking-wider ${priorityStyle}`}>
          {t.priority}
        </span>
      </div>
      <p className="mt-1 font-mono text-[9.5px] text-vault-faint">due {t.dueRelative}</p>
    </article>
  )
}

function StatusDot({ status }: { status: Status }) {
  const cls =
    status === 'in_progress'
      ? 'bg-vault-warning'
      : status === 'review'
      ? 'bg-vault-accent'
      : status === 'done'
      ? 'bg-vault-success'
      : 'bg-vault-muted'
  return <span className={`h-2 w-2 rounded-full ${cls}`} />
}
