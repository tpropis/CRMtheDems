export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { formatCurrency } from '@/lib/utils'
import {
  demoMatters,
  demoDeadlines,
  demoAIQueries,
  demoPrivilegeEntries,
  demoFeedItems,
  demoConflictHits,
  demoStats,
  type DemoMatter,
  type DemoDeadline,
  type DemoAIQuery,
  type DemoPrivilegeEntry,
  type DemoFeedItem,
  type DemoConflictHit,
} from '@/lib/demo-data'
import {
  Briefcase, AlertTriangle, Receipt, Bot, FileText,
  ArrowRight, Plus, Calendar, Sparkles, Shield, Radio,
  Scale, Search, FileSearch, CheckCircle2, Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await auth()
  const userName = session?.user?.name?.split(' ')[0] ?? 'Counsel'
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Pull demo fixtures (Phase 3 uses these unconditionally so the dashboard
  // tells a complete story even without DB). Live DB wiring comes later.
  const matters = demoMatters
  const deadlines = demoDeadlines
  const aiQueries = demoAIQueries
  const privilege = demoPrivilegeEntries
  const feed = demoFeedItems
  const conflicts = demoConflictHits
  const stats = demoStats

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ── Editorial greeting header ─────────────────────────── */}
      <header className="relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-4 bg-vault-gold/60" />
              <p className="eyebrow text-vault-gold tracking-[0.2em]">Command Center</p>
            </div>
            <h1 className="display-serif text-[2rem] font-semibold text-vault-ink tracking-[-0.025em] md:text-[2.5rem] leading-tight">
              {greeting}, {userName}.
            </h1>
            <p className="mt-2.5 max-w-xl text-[13px] text-vault-text-secondary leading-relaxed">
              <span className="font-semibold text-vault-ink">{stats.activeMatters}</span> active matters
              {' · '}
              <span className="font-semibold text-vault-danger">{stats.urgentDeadlines}</span> imminent deadlines
              {' · '}
              <span className="font-semibold text-vault-gold">{stats.aiActionsToday}</span> AI actions signed today
              {' · '}
              {stats.docsIngestedToday.toLocaleString()} documents ingested
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/intake/new">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                New Intake
              </Button>
            </Link>
            <Link href="/conflicts">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Scale className="h-3.5 w-3.5" />
                Run Conflict Check
              </Button>
            </Link>
          </div>
        </div>
        <div className="vault-divider mt-7" />
      </header>

      {/* ── Stat strip ────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatTile
          icon={Briefcase}
          label="Active Matters"
          value={stats.activeMatters.toString()}
          sub="8 partner-led"
        />
        <StatTile
          icon={AlertTriangle}
          label="Urgent Deadlines"
          value={stats.urgentDeadlines.toString()}
          sub="Next 48 hours"
          accent="danger"
        />
        <StatTile
          icon={FileText}
          label="Intake Queue"
          value={stats.newIntake.toString()}
          sub="Awaiting screening"
        />
        <StatTile
          icon={Receipt}
          label="Unbilled WIP"
          value={formatCurrency(stats.unbilledWip).replace('.00', '')}
          sub="Draft · ready to bill"
        />
        <StatTile
          icon={Sparkles}
          label="AI Actions · 24h"
          value={stats.aiActionsToday.toString()}
          sub="Signed · immutable"
          accent="gold"
        />
      </section>

      {/* ── Main two-column grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 gap-7 xl:grid-cols-3">
        {/* Left column (primary, 2/3) */}
        <div className="space-y-6 xl:col-span-2">
          <MatterCommandCenter matters={matters} />
          <DeadlineEngine deadlines={deadlines} />
          <PrivilegeLog entries={privilege} />
        </div>

        {/* Right column (secondary, 1/3) */}
        <div className="space-y-6">
          <PrivateAIParalegal queries={aiQueries} />
          <IntelligenceFeed items={feed} />
          <ConflictCheck hits={conflicts} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STAT TILE
═══════════════════════════════════════════════════════════════ */
function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  accent = 'default',
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub: string
  accent?: 'default' | 'danger' | 'gold'
}) {
  const accentClass =
    accent === 'danger' ? 'text-vault-danger' : accent === 'gold' ? 'text-vault-gold' : 'text-vault-ink'
  const iconTint =
    accent === 'danger'
      ? 'text-vault-danger bg-vault-danger/8 border-vault-danger/25'
      : accent === 'gold'
      ? 'text-vault-gold bg-vault-gold/10 border-vault-gold/30'
      : 'text-vault-accent bg-vault-accent/8 border-vault-accent/20'
  const stripeCls =
    accent === 'danger' ? 'stripe-danger' : accent === 'gold' ? 'stripe-gold' : 'stripe-accent'

  return (
    <div className="stat-card">
      <div className={`h-[3px] w-full ${stripeCls}`} />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">{label}</p>
          <div className={`flex h-7 w-7 items-center justify-center rounded border ${iconTint} shrink-0`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className={`mt-3 font-display text-[1.85rem] font-bold tabular-nums leading-none tracking-tight ${accentClass}`}>
          {value}
        </p>
        <p className="mt-2.5 text-[11px] text-vault-text-secondary">{sub}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ⑴ MATTER COMMAND CENTER
═══════════════════════════════════════════════════════════════ */
function MatterCommandCenter({ matters }: { matters: DemoMatter[] }) {
  return (
    <section className="section-card">
      <SectionHead
        num="I"
        title="Matter Command Center"
        subtitle="Every matter, live state at a glance"
        action={
          <Link href="/matters">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              View all · {matters.length}
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        }
      />

      <div className="divide-y divide-vault-border/70">
        {matters.map((m) => (
          <Link
            key={m.id}
            href={`/matters/${m.id}`}
            className="group relative grid grid-cols-12 items-center gap-3 px-5 py-3 hover:bg-vault-elevated/60 transition-colors before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-vault-accent before:rounded-r-full before:opacity-0 hover:before:opacity-100 before:transition-opacity"
          >
            <div className="col-span-5 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[10px] text-vault-muted tabular-nums">{m.number}</span>
                <RiskBadge risk={m.risk} />
              </div>
              <p className="text-[13px] font-medium text-vault-ink truncate">{m.name}</p>
              <p className="text-[11px] text-vault-text-secondary truncate">
                {m.client} · {m.attorney}
              </p>
            </div>

            <div className="col-span-2 text-center">
              <p className="font-mono text-[10px] uppercase tracking-wider text-vault-muted">Practice</p>
              <p className="text-[12px] text-vault-text-secondary">{m.practice}</p>
            </div>

            <div className="col-span-3 flex items-center justify-center gap-3">
              <MatterPulse icon={Calendar} value={m.deadlineCount} label="due" tone={m.deadlineCount > 2 ? 'warn' : 'default'} />
              <MatterPulse icon={FileSearch} value={m.unreadFilings} label="new" tone={m.unreadFilings > 0 ? 'accent' : 'default'} />
              <MatterPulse icon={Sparkles} value={m.aiFlags} label="AI" tone={m.aiFlags > 2 ? 'gold' : 'default'} />
            </div>

            <div className="col-span-2 text-right">
              <p className="font-mono text-[10px] uppercase tracking-wider text-vault-muted">Active</p>
              <p className="text-[11px] text-vault-text-secondary">{m.lastActivity}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function RiskBadge({ risk }: { risk: DemoMatter['risk'] }) {
  const styles =
    risk === 'CRITICAL'
      ? 'bg-vault-danger/10 text-vault-danger border-vault-danger/30'
      : risk === 'HIGH'
      ? 'bg-vault-warning/10 text-vault-warning border-vault-warning/30'
      : risk === 'MEDIUM'
      ? 'bg-vault-gold/10 text-vault-gold border-vault-gold/30'
      : 'bg-vault-success/10 text-vault-success border-vault-success/30'
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-widest border ${styles}`}>
      {risk}
    </span>
  )
}

function MatterPulse({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: number
  label: string
  tone: 'default' | 'warn' | 'accent' | 'gold'
}) {
  const cls =
    tone === 'warn'
      ? 'text-vault-warning'
      : tone === 'accent'
      ? 'text-vault-accent'
      : tone === 'gold'
      ? 'text-vault-gold'
      : 'text-vault-muted'
  return (
    <div className={`flex items-center gap-1 ${cls}`}>
      <Icon className="h-3 w-3" />
      <span className="font-mono text-[11px] tabular-nums font-medium">{value}</span>
      <span className="font-mono text-[9px] uppercase tracking-wider text-vault-faint">{label}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ⑶ DEADLINE ENGINE
═══════════════════════════════════════════════════════════════ */
function DeadlineEngine({ deadlines }: { deadlines: DemoDeadline[] }) {
  return (
    <section className="section-card">
      <SectionHead
        num="III"
        title="Deadline Engine"
        subtitle="Rule-based cascades · auto-computed from court & contract events"
        action={
          <Link href="/calendar">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              Full calendar
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        }
      />

      <div className="divide-y divide-vault-border/70">
        {deadlines.map((d) => (
          <div key={d.id} className="grid grid-cols-12 items-center gap-3 px-5 py-3 hover:bg-vault-elevated/40 transition-colors">
            <div className="col-span-5 min-w-0">
              <p className="text-[13px] font-medium text-vault-ink truncate">{d.title}</p>
              <p className="text-[11px] text-vault-text-secondary truncate">{d.matter}</p>
            </div>

            <div className="col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-vault-muted">{d.jurisdiction}</p>
              <p className="text-[11px] text-vault-text-secondary truncate">
                {d.source} <span className="text-vault-faint">·</span> {d.rule}
              </p>
            </div>

            <div className="col-span-2">
              {d.computed ? (
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-accent/25 bg-vault-accent/[0.06]">
                  <Radio className="h-2.5 w-2.5 text-vault-accent" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-vault-accent">
                    Computed
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-border bg-vault-elevated">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-vault-muted">
                    Manual
                  </span>
                </div>
              )}
              {d.cascadeOf && (
                <p className="mt-1 text-[10px] text-vault-faint truncate">↳ {d.cascadeOf}</p>
              )}
            </div>

            <div className="col-span-2 text-right">
              <p
                className={`font-mono text-[11px] uppercase tracking-wider tabular-nums ${
                  d.urgency === 'imminent'
                    ? 'text-vault-danger'
                    : d.urgency === 'overdue'
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
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ⑷ PRIVILEGE LOG (auto-tagged)
═══════════════════════════════════════════════════════════════ */
function PrivilegeLog({ entries }: { entries: DemoPrivilegeEntry[] }) {
  return (
    <section className="section-card">
      <SectionHead
        num="IV"
        title="Privilege Log"
        subtitle="Automatic classification at ingest · defensible, one-click export"
        action={
          <Link href="/documents?view=privilege">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              Full log
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        }
      />

      <div className="divide-y divide-vault-border/70">
        {entries.map((e) => (
          <div key={e.id} className="px-5 py-3 hover:bg-vault-elevated/40 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-vault-ink truncate">{e.doc}</p>
                <p className="text-[11px] text-vault-text-secondary truncate">{e.matter}</p>
              </div>
              <ClassificationBadge kind={e.classification} confidence={e.confidence} />
            </div>
            <p className="text-[11px] text-vault-text-secondary leading-relaxed">
              <span className="font-mono text-[10px] uppercase tracking-wider text-vault-faint mr-1.5">
                Basis
              </span>
              {e.basis}
            </p>
            <p className="mt-1 font-mono text-[10px] text-vault-faint">
              {e.pages} pp. · ingested {e.ingestedAt}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ClassificationBadge({
  kind,
  confidence,
}: {
  kind: DemoPrivilegeEntry['classification']
  confidence: number
}) {
  const style =
    kind === 'Attorney-Client'
      ? 'bg-vault-accent/10 text-vault-accent border-vault-accent/30'
      : kind === 'Work Product'
      ? 'bg-vault-gold/10 text-vault-gold border-vault-gold/30'
      : kind === 'Common Interest'
      ? 'bg-vault-accent-soft text-vault-accent-light border-vault-accent/20'
      : kind === 'Needs Review'
      ? 'bg-vault-warning/10 text-vault-warning border-vault-warning/30'
      : 'bg-vault-elevated text-vault-muted border-vault-border'
  return (
    <div
      className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded border ${style}`}
      title={`${confidence}% confidence`}
    >
      <span className="font-mono text-[9px] uppercase tracking-wider font-semibold">{kind}</span>
      <span className="font-mono text-[9px] tabular-nums opacity-70">{confidence}%</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ⑵ PRIVATE AI PARALEGAL
═══════════════════════════════════════════════════════════════ */
function PrivateAIParalegal({ queries }: { queries: DemoAIQuery[] }) {
  return (
    <section className="section-card">
      <SectionHead
        num="II"
        title="Private AI Paralegal"
        subtitle="Matter-scoped · cited · signed"
        icon={Bot}
        action={
          <Link href="/ai">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              Open
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        }
      />

      <div className="divide-y divide-vault-border/70">
        {queries.map((q) => (
          <article key={q.id} className="px-5 py-4 hover:bg-vault-elevated/40 transition-colors">
            <div className="flex items-start gap-2 mb-2">
              <div className="h-5 w-5 rounded-full border border-vault-accent/30 bg-vault-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                <Search className="h-2.5 w-2.5 text-vault-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-vault-ink leading-snug">{q.question}</p>
                <p className="font-mono text-[10px] text-vault-faint mt-0.5 truncate">
                  {q.matterNumber} · {q.askedBy} · {q.askedAt}
                </p>
              </div>
            </div>

            <p className="text-[11.5px] text-vault-text-secondary leading-relaxed pl-7 line-clamp-3">
              {q.answer}
            </p>

            <div className="pl-7 mt-2 flex flex-wrap items-center gap-1.5">
              {q.citations.slice(0, 3).map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-border bg-vault-elevated text-[10px] text-vault-text-secondary"
                >
                  <FileText className="h-2.5 w-2.5 text-vault-muted" />
                  <span className="truncate max-w-[140px]">{c.doc}</span>
                  <span className="text-vault-faint">·</span>
                  <span className="font-mono text-vault-faint">{c.page}</span>
                </span>
              ))}
            </div>

            <div className="pl-7 mt-2 flex items-center gap-2">
              <StatusPill status={q.status} reviewer={q.reviewer} />
              <span className="font-mono text-[9px] text-vault-faint truncate">{q.model}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function StatusPill({ status, reviewer }: { status: DemoAIQuery['status']; reviewer?: string }) {
  if (status === 'signed') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-success/30 bg-vault-success/8 text-[9px] font-mono uppercase tracking-wider text-vault-success">
        <CheckCircle2 className="h-2.5 w-2.5" />
        Signed · {reviewer}
      </span>
    )
  }
  if (status === 'pending_review') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-warning/30 bg-vault-warning/8 text-[9px] font-mono uppercase tracking-wider text-vault-warning">
        <Clock className="h-2.5 w-2.5" />
        Pending review
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-border bg-vault-elevated text-[9px] font-mono uppercase tracking-wider text-vault-muted">
      Draft
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ⑸ INTELLIGENCE FEED
═══════════════════════════════════════════════════════════════ */
function IntelligenceFeed({ items }: { items: DemoFeedItem[] }) {
  return (
    <section className="section-card">
      <SectionHead
        num="V"
        title="Intelligence Feed"
        subtitle="What changed on your matters · right now"
        icon={Radio}
        action={
          <span className="flex items-center gap-1.5 px-2 py-1 rounded border border-vault-success/30 bg-vault-success/5">
            <span className="live-dot" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-vault-success">Live</span>
          </span>
        }
      />

      <ol className="divide-y divide-vault-border/70">
        {items.map((f) => (
          <li key={f.id} className="px-5 py-2.5 flex items-start gap-3 hover:bg-vault-elevated/40 transition-colors">
            <FeedDot severity={f.severity} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-vault-ink leading-snug">{f.headline}</p>
              <p className="font-mono text-[10px] text-vault-faint mt-0.5 truncate">
                {f.matterNumber === '—' ? 'Firm-wide' : f.matterNumber} · {f.at}
              </p>
            </div>
            <FeedKindTag kind={f.kind} />
          </li>
        ))}
      </ol>
    </section>
  )
}

function FeedDot({ severity }: { severity: DemoFeedItem['severity'] }) {
  const style =
    severity === 'urgent'
      ? 'bg-vault-danger shadow-[0_0_0_3px_rgba(122,45,42,0.12)]'
      : severity === 'notable'
      ? 'bg-vault-gold shadow-[0_0_0_3px_rgba(182,138,62,0.15)]'
      : 'bg-vault-muted/50'
  return <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${style}`} />
}

function FeedKindTag({ kind }: { kind: DemoFeedItem['kind'] }) {
  const map: Record<DemoFeedItem['kind'], string> = {
    filing: 'Filing',
    opposing: 'Opposing',
    docket: 'Docket',
    regulatory: 'Reg.',
    deadline: 'Deadline',
    ai: 'AI',
  }
  return (
    <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-vault-muted">
      {map[kind]}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ⑹ CONFLICT CHECK
═══════════════════════════════════════════════════════════════ */
function ConflictCheck({ hits }: { hits: DemoConflictHit[] }) {
  return (
    <section className="section-card">
      <SectionHead
        num="VI"
        title="Conflict Check"
        subtitle="Natural-language search · 3-second scan across all historical matters"
        icon={Scale}
        action={
          <Link href="/conflicts">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              History
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        }
      />

      <div className="px-5 py-3 border-b border-vault-border/70 bg-vault-elevated/40">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-vault-border bg-vault-elevated shadow-vault-inset">
          <Search className="h-3.5 w-3.5 text-vault-muted shrink-0" />
          <span className="text-[12px] text-vault-muted">
            e.g., &ldquo;Aventra Capital or any affiliate&rdquo;
          </span>
          <span className="ml-auto flex items-center gap-0.5">
            <span className="kbd">⏎</span>
          </span>
        </div>
        <p className="mt-2 font-mono text-[10px] text-vault-faint">
          Recent hits · confidence-scored across parties, counsel, related entities, witnesses
        </p>
      </div>

      <div className="divide-y divide-vault-border/70">
        {hits.map((h) => (
          <div key={h.id} className="px-5 py-3 hover:bg-vault-elevated/40 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-medium text-vault-ink truncate">{h.entity}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-vault-muted mt-0.5">
                  {h.type} · {h.role}
                </p>
              </div>
              <ConfidenceMeter value={h.confidence} />
            </div>
            <p className="text-[11px] text-vault-text-secondary truncate">{h.historicalMatter}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <ResolutionBadge status={h.resolution} />
              <span className="font-mono text-[9px] text-vault-faint">{h.flaggedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ConfidenceMeter({ value }: { value: number }) {
  const tone =
    value >= 90 ? 'text-vault-danger' : value >= 75 ? 'text-vault-warning' : 'text-vault-text-secondary'
  return (
    <div className="shrink-0 text-right">
      <p className={`font-mono text-[11px] font-semibold tabular-nums ${tone}`}>{value}%</p>
      <p className="font-mono text-[9px] uppercase tracking-wider text-vault-faint">Match</p>
    </div>
  )
}

function ResolutionBadge({ status }: { status: DemoConflictHit['resolution'] }) {
  const styles: Record<DemoConflictHit['resolution'], string> = {
    cleared:
      'border-vault-success/30 bg-vault-success/8 text-vault-success',
    waived:
      'border-vault-gold/30 bg-vault-gold/8 text-vault-gold',
    screened:
      'border-vault-accent/30 bg-vault-accent/8 text-vault-accent',
    pending:
      'border-vault-warning/30 bg-vault-warning/8 text-vault-warning',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-mono uppercase tracking-wider font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION HEAD — shared
═══════════════════════════════════════════════════════════════ */
function SectionHead({
  num,
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  num: string
  title: string
  subtitle: string
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
}) {
  return (
    <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-vault-border bg-gradient-to-r from-vault-elevated/80 via-vault-elevated/40 to-vault-surface">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex h-7 w-7 items-center justify-center rounded border border-vault-gold/40 bg-gradient-to-b from-vault-gold/10 to-vault-gold/5 shrink-0"
          style={{ boxShadow: '0 0 0 1px rgba(182,138,62,0.14), 0 1px 3px rgba(182,138,62,0.06)' }}
        >
          {Icon ? (
            <Icon className="h-3.5 w-3.5 text-vault-gold" />
          ) : (
            <span className="font-mono text-[10px] font-bold text-vault-gold">{num}</span>
          )}
        </div>
        <div className="min-w-0">
          <h2 className="display-serif text-[15px] font-semibold text-vault-ink leading-none tracking-[-0.01em]">
            {title}
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-vault-muted/80 truncate">
            {subtitle}
          </p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
