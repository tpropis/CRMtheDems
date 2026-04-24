import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDemoMatter, demoDeadlines, demoAIQueries } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import {
  FileText, Activity, Calendar, CheckSquare, Users,
  Bot, ArrowRight, Sparkles, Gavel, Shield, Search,
  AlertTriangle, CheckCircle2, Clock,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function MatterOverviewPage({ params }: { params: { matterId: string } }) {
  const matter = getDemoMatter(params.matterId)
  if (!matter) notFound()

  // Cross-reference global fixtures to keep the page in sync
  const matterDeadlines = demoDeadlines.filter((d) => d.matterNumber === matter.number).slice(0, 5)
  const matterAIQueries = demoAIQueries.filter((q) => q.matterNumber === matter.number).slice(0, 3)
  const recentTimeline = matter.timeline.slice(0, 5)
  const openTasks = matter.tasks.filter((t) => t.status !== 'done').slice(0, 5)
  const recentDocs = matter.documents.slice(0, 5)

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* ────── Primary column ────── */}
      <div className="space-y-6 xl:col-span-2">
        {/* Key facts */}
        <section className="rounded-md border border-vault-border bg-vault-surface shadow-vault">
          <SectionHead title="Key Facts" subtitle="At-a-glance matter profile" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
            {matter.keyFacts.map((f, i) => (
              <div
                key={f.label}
                className={`px-5 py-4 ${
                  i % 3 !== 2 ? 'md:border-r md:border-vault-border/60' : ''
                } ${i < matter.keyFacts.length - (matter.keyFacts.length % 3 || 3) ? 'border-b border-vault-border/60' : ''}`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-vault-muted">
                  {f.label}
                </p>
                <p className="mt-1 font-display text-[17px] font-medium text-vault-ink">{f.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Deadlines */}
        <section className="rounded-md border border-vault-border bg-vault-surface shadow-vault">
          <SectionHead
            title="Upcoming Deadlines"
            subtitle="Rule-computed cascades visible · one-click calendar sync"
            icon={Calendar}
            action={
              <Link href={`/matters/${matter.id}/timeline`}>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  Full timeline
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            }
          />
          {matterDeadlines.length === 0 ? (
            <EmptyRow message="No scheduled deadlines for this matter." />
          ) : (
            <div className="divide-y divide-vault-border/70">
              {matterDeadlines.map((d) => (
                <div key={d.id} className="px-5 py-3 grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-6">
                    <p className="text-[13px] font-medium text-vault-ink">{d.title}</p>
                    <p className="text-[11px] text-vault-text-secondary">
                      {d.source} · {d.rule} · {d.jurisdiction}
                    </p>
                  </div>
                  <div className="col-span-4">
                    {d.computed ? (
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-accent/25 bg-vault-accent/[0.06]">
                        <Sparkles className="h-2.5 w-2.5 text-vault-accent" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-vault-accent">
                          Computed
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-vault-muted">
                        Manual
                      </span>
                    )}
                    {d.cascadeOf && (
                      <p className="mt-0.5 text-[10px] text-vault-faint truncate">↳ {d.cascadeOf}</p>
                    )}
                  </div>
                  <div className="col-span-2 text-right">
                    <p
                      className={`font-mono text-[11px] uppercase tracking-wider ${
                        d.urgency === 'imminent' || d.urgency === 'overdue'
                          ? 'text-vault-danger'
                          : d.urgency === 'soon'
                          ? 'text-vault-warning'
                          : 'text-vault-text-secondary'
                      }`}
                    >
                      {d.due}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent timeline */}
        <section className="rounded-md border border-vault-border bg-vault-surface shadow-vault">
          <SectionHead
            title="Recent Activity"
            subtitle="Full event ledger · signed & immutable"
            icon={Activity}
            action={
              <Link href={`/matters/${matter.id}/timeline`}>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  All events
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            }
          />
          <ol className="divide-y divide-vault-border/70">
            {recentTimeline.map((ev) => (
              <li key={ev.id} className="px-5 py-3.5 grid grid-cols-12 gap-3">
                <div className="col-span-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-vault-muted">
                    {kindLabel(ev.kind)}
                  </p>
                  <p className="font-mono text-[10px] text-vault-faint mt-0.5">{ev.at}</p>
                </div>
                <div className="col-span-10 min-w-0">
                  <p className="text-[13px] text-vault-ink leading-snug">{ev.title}</p>
                  {ev.body && (
                    <p className="mt-1 text-[11.5px] text-vault-text-secondary leading-relaxed line-clamp-2">
                      {ev.body}
                    </p>
                  )}
                  <p className="mt-1 font-mono text-[9.5px] text-vault-faint">{ev.actor}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Documents */}
        <section className="rounded-md border border-vault-border bg-vault-surface shadow-vault">
          <SectionHead
            title="Recent Documents"
            subtitle="Auto-classified · privilege-tagged on ingest"
            icon={FileText}
            action={
              <Link href={`/matters/${matter.id}/documents`}>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  All documents · {matter.documents.length}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            }
          />
          {recentDocs.length === 0 ? (
            <EmptyRow message="No documents ingested yet." />
          ) : (
            <div className="divide-y divide-vault-border/70">
              {recentDocs.map((d) => (
                <div key={d.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="h-7 w-7 rounded border border-vault-border bg-vault-elevated flex items-center justify-center shrink-0">
                    <FileText className="h-3.5 w-3.5 text-vault-muted" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-vault-ink truncate">{d.name}</p>
                    <p className="font-mono text-[10px] text-vault-faint">
                      {d.pages} pp. · {d.size} · {d.ingestedAt}
                      {d.bates && ` · ${d.bates}`}
                    </p>
                  </div>
                  {d.privilege && (
                    <span
                      className={`shrink-0 font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${privilegeStyle(
                        d.privilege
                      )}`}
                    >
                      {privilegeShort(d.privilege)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ────── Secondary column ────── */}
      <div className="space-y-6">
        {/* AI Paralegal on this matter */}
        <section className="rounded-md border border-vault-border bg-vault-surface shadow-vault">
          <SectionHead
            title="AI Paralegal · This Matter"
            subtitle="Model pinned to matter context"
            icon={Bot}
            action={
              <Link href={`/ai?matter=${matter.id}`}>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  Ask
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            }
          />
          {matterAIQueries.length === 0 ? (
            <div className="px-5 py-6 text-center">
              <p className="text-[12px] text-vault-text-secondary">
                No AI queries yet on this matter.
              </p>
              <Link href={`/ai?matter=${matter.id}`}>
                <Button size="sm" variant="outline" className="mt-3 gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Ask a question
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-vault-border/70">
              {matterAIQueries.map((q) => (
                <article key={q.id} className="px-5 py-3.5">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="h-5 w-5 rounded-full border border-vault-accent/30 bg-vault-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Search className="h-2.5 w-2.5 text-vault-accent" />
                    </div>
                    <p className="text-[12px] font-medium text-vault-ink leading-snug flex-1">
                      {q.question}
                    </p>
                  </div>
                  <p className="text-[11.5px] text-vault-text-secondary leading-relaxed pl-7 line-clamp-3">
                    {q.answer}
                  </p>
                  <div className="pl-7 mt-2 flex items-center gap-2">
                    {q.status === 'signed' ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-success/30 bg-vault-success/8 text-[9px] font-mono uppercase tracking-wider text-vault-success">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Signed
                      </span>
                    ) : q.status === 'pending_review' ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-warning/30 bg-vault-warning/8 text-[9px] font-mono uppercase tracking-wider text-vault-warning">
                        <Clock className="h-2.5 w-2.5" />
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-border bg-vault-elevated text-[9px] font-mono uppercase tracking-wider text-vault-muted">
                        Draft
                      </span>
                    )}
                    <span className="font-mono text-[9px] text-vault-faint truncate">{q.askedAt}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Open tasks */}
        <section className="rounded-md border border-vault-border bg-vault-surface shadow-vault">
          <SectionHead
            title="Open Tasks"
            subtitle="Assigned · due · prioritized"
            icon={CheckSquare}
            action={
              <Link href={`/matters/${matter.id}/tasks`}>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  All tasks
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            }
          />
          {openTasks.length === 0 ? (
            <EmptyRow message="No open tasks for this matter." />
          ) : (
            <div className="divide-y divide-vault-border/70">
              {openTasks.map((t) => (
                <div key={t.id} className="px-5 py-3 flex items-start gap-3">
                  <TaskStatusDot status={t.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] text-vault-ink leading-snug">{t.title}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-vault-faint">
                      {t.assignee} · due {t.dueRelative}
                    </p>
                  </div>
                  {t.priority === 'high' && (
                    <AlertTriangle className="h-3 w-3 text-vault-danger shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Parties */}
        <section className="rounded-md border border-vault-border bg-vault-surface shadow-vault">
          <SectionHead title="Parties" subtitle="Firm team · client · adverse" icon={Users} />
          <div className="divide-y divide-vault-border/70">
            {matter.parties.map((p) => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-vault-accent/10 border border-vault-accent/25 flex items-center justify-center shrink-0">
                  <span className="font-mono text-[10px] font-semibold text-vault-accent">
                    {p.name
                      .split(' ')
                      .map((x) => x[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-medium text-vault-ink truncate">{p.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-vault-muted truncate">
                    {partyRoleLabel(p.role)}
                    {p.org && ` · ${p.org}`}
                  </p>
                </div>
                {p.role === 'OPPOSING_COUNSEL' && (
                  <Gavel className="h-3 w-3 text-vault-danger shrink-0" />
                )}
                {p.role === 'RESPONSIBLE_ATTORNEY' && (
                  <Shield className="h-3 w-3 text-vault-gold shrink-0" />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────

function SectionHead({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string
  subtitle: string
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
}) {
  return (
    <header className="flex items-center justify-between gap-3 px-5 py-3 border-b border-vault-border bg-vault-elevated/40">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded border border-vault-gold/30 bg-vault-gold/5 shrink-0">
            <Icon className="h-3.5 w-3.5 text-vault-gold" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="display-serif text-[15px] font-medium text-vault-ink leading-none">
            {title}
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-vault-muted truncate">
            {subtitle}
          </p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="px-5 py-6 text-center">
      <p className="text-[12px] text-vault-text-secondary">{message}</p>
    </div>
  )
}

function TaskStatusDot({ status }: { status: 'todo' | 'in_progress' | 'review' | 'done' }) {
  const cls =
    status === 'in_progress'
      ? 'bg-vault-warning shadow-[0_0_0_3px_rgba(182,138,62,0.15)]'
      : status === 'review'
      ? 'bg-vault-accent shadow-[0_0_0_3px_rgba(31,74,61,0.15)]'
      : status === 'done'
      ? 'bg-vault-success'
      : 'bg-vault-muted'
  return <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${cls}`} />
}

// ── Helpers ──────────────────────────────────────────────────

function kindLabel(kind: string): string {
  const m: Record<string, string> = {
    filing: 'Filing',
    correspondence: 'Corresp.',
    ai_action: 'AI',
    deadline_computed: 'Deadline',
    doc_ingested: 'Ingest',
    meeting: 'Meeting',
    note: 'Note',
    billing: 'Billing',
  }
  return m[kind] ?? kind
}

function partyRoleLabel(role: string): string {
  const m: Record<string, string> = {
    RESPONSIBLE_ATTORNEY: 'Responsible Attorney',
    ORIGINATING_ATTORNEY: 'Originating Attorney',
    SUPERVISING_PARTNER: 'Supervising Partner',
    ASSOCIATE: 'Associate',
    PARALEGAL: 'Paralegal',
    CLIENT_CONTACT: 'Client Contact',
    OPPOSING_COUNSEL: 'Opposing Counsel',
    EXPERT: 'Expert',
  }
  return m[role] ?? role
}

function privilegeStyle(kind: string): string {
  if (kind === 'Attorney-Client') return 'bg-vault-accent/10 text-vault-accent border-vault-accent/30'
  if (kind === 'Work Product') return 'bg-vault-gold/10 text-vault-gold border-vault-gold/30'
  if (kind === 'Common Interest') return 'bg-vault-accent-soft text-vault-accent-light border-vault-accent/20'
  if (kind === 'Needs Review') return 'bg-vault-warning/10 text-vault-warning border-vault-warning/30'
  return 'bg-vault-elevated text-vault-muted border-vault-border'
}

function privilegeShort(kind: string): string {
  if (kind === 'Attorney-Client') return 'A/C'
  if (kind === 'Work Product') return 'WP'
  if (kind === 'Common Interest') return 'C/I'
  if (kind === 'Needs Review') return 'Review'
  return 'NP'
}
