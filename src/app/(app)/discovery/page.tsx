import Link from 'next/link'
import { demoDiscoveryCollections, type DemoDiscoveryCollection } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import {
  Plus, Database, Shield, AlertCircle, Filter, ArrowRight,
  CheckCircle2, Flame, Search,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export const dynamic = 'force-dynamic'

export default function DiscoveryPage() {
  const collections = demoDiscoveryCollections
  const totalDocs = collections.reduce((s, c) => s + c.totalDocs, 0)
  const reviewedDocs = collections.reduce((s, c) => s + c.reviewedDocs, 0)
  const privileged = collections.reduce((s, c) => s + c.privilegedDocs, 0)
  const hot = collections.reduce((s, c) => s + c.hotDocs, 0)
  const pctReviewed = totalDocs > 0 ? Math.round((reviewedDocs / totalDocs) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <header>
        <p className="eyebrow text-vault-gold">§ Discovery</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="display-serif text-3xl font-medium text-vault-ink tracking-tight md:text-4xl">
              Production, under control.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-vault-text-secondary leading-relaxed">
              Document review, privilege analysis, and production management across{' '}
              {collections.length} active collections · {totalDocs.toLocaleString()} documents
              under the firm&apos;s seal.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New Collection
            </Button>
          </div>
        </div>
        <div className="vault-divider mt-6" />
      </header>

      {/* Stat strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DiscoveryStat
          icon={Database}
          label="Total documents"
          value={totalDocs.toLocaleString()}
          sub={`Across ${collections.length} collections`}
        />
        <DiscoveryStat
          icon={CheckCircle2}
          label="Reviewed"
          value={`${pctReviewed}%`}
          sub={`${reviewedDocs.toLocaleString()} / ${totalDocs.toLocaleString()}`}
          accent="success"
        />
        <DiscoveryStat
          icon={Shield}
          label="Privileged"
          value={privileged.toLocaleString()}
          sub="Auto-classified"
          accent="gold"
        />
        <DiscoveryStat
          icon={Flame}
          label="Hot documents"
          value={hot.toString()}
          sub="Flagged by reviewers"
          accent="danger"
        />
      </section>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-vault-border bg-vault-elevated shadow-vault-inset">
        <Search className="h-3.5 w-3.5 text-vault-muted" />
        <input
          type="text"
          placeholder="Search collection, matter, or producing party…"
          className="flex-1 bg-transparent text-[13px] text-vault-ink placeholder:text-vault-muted focus:outline-none"
        />
      </div>

      {/* Collections */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {collections.map((c) => (
          <CollectionCard key={c.id} c={c} />
        ))}
      </section>
    </div>
  )
}

function DiscoveryStat({
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
  accent?: 'default' | 'success' | 'gold' | 'danger'
}) {
  const valCls =
    accent === 'success'
      ? 'text-vault-success'
      : accent === 'gold'
      ? 'text-vault-gold'
      : accent === 'danger'
      ? 'text-vault-danger'
      : 'text-vault-ink'
  const iconCls =
    accent === 'success'
      ? 'text-vault-success border-vault-success/30 bg-vault-success/8'
      : accent === 'gold'
      ? 'text-vault-gold border-vault-gold/30 bg-vault-gold/10'
      : accent === 'danger'
      ? 'text-vault-danger border-vault-danger/30 bg-vault-danger/8'
      : 'text-vault-accent border-vault-accent/20 bg-vault-accent/8'

  const stripe =
    accent === 'success'
      ? 'from-vault-success to-vault-success/40'
      : accent === 'gold'
      ? 'from-vault-gold to-vault-gold/40'
      : accent === 'danger'
      ? 'from-vault-danger to-vault-danger/40'
      : 'from-vault-border-strong to-vault-border-strong/30'

  return (
    <div className="stat-card overflow-hidden">
      <div className={`h-[3px] w-full bg-gradient-to-r ${stripe}`} />
      <div className="p-4">
        <div className="flex items-start justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            {label}
          </p>
          <div className={`flex h-7 w-7 items-center justify-center rounded border shrink-0 ${iconCls}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className={`mt-2 font-display text-[1.85rem] font-bold tabular-nums leading-none ${valCls}`}>
          {value}
        </p>
        <p className="mt-2 text-[11px] text-vault-text-secondary">{sub}</p>
      </div>
    </div>
  )
}

function CollectionCard({ c }: { c: DemoDiscoveryCollection }) {
  const pct = c.totalDocs > 0 ? Math.round((c.reviewedDocs / c.totalDocs) * 100) : 0
  const matterId = c.matterNumber.match(/M-\d{4}-(\d{4})/i)?.[1]

  const statusStyle: Record<DemoDiscoveryCollection['status'], string> = {
    active: 'border-vault-accent/30 bg-vault-accent/8 text-vault-accent',
    producing: 'border-vault-warning/30 bg-vault-warning/8 text-vault-warning',
    closed: 'border-vault-success/30 bg-vault-success/8 text-vault-success',
  }

  return (
    <Link
      href={matterId ? `/matters/m-${matterId}/discovery` : '#'}
      className="section-card group block p-5"
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[9.5px] uppercase tracking-wider text-vault-muted tabular-nums">
            {c.matterNumber}
          </p>
          <h3 className="mt-1 display-serif text-[16px] font-medium text-vault-ink tracking-tight leading-snug group-hover:text-vault-accent transition-colors">
            {c.name}
          </h3>
          <p className="mt-0.5 text-[11px] text-vault-text-secondary truncate">{c.matter}</p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-mono text-[10px] uppercase tracking-wider font-semibold ${statusStyle[c.status]}`}
        >
          {c.status}
        </span>
      </div>

      <p className="mb-3 text-[11px] text-vault-text-secondary">
        <span className="font-mono text-[10px] text-vault-faint uppercase tracking-wider mr-1.5">
          Producing
        </span>
        {c.producingParty}
      </p>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-vault-muted">
            Review progress
          </span>
          <span className="font-mono text-[11px] text-vault-ink tabular-nums font-semibold">
            {pct}%
          </span>
        </div>
        <Progress value={pct} color="accent" />
        <p className="mt-1.5 font-mono text-[9.5px] text-vault-faint tabular-nums">
          {c.reviewedDocs.toLocaleString()} / {c.totalDocs.toLocaleString()} reviewed
        </p>
      </div>

      {/* Stats ribbon */}
      <div className="mt-4 pt-4 border-t border-vault-border/70 grid grid-cols-3 gap-3">
        <StatMini icon={Database} value={c.totalDocs.toLocaleString()} label="Total" />
        <StatMini icon={Shield} value={c.privilegedDocs.toLocaleString()} label="Privileged" tone="gold" />
        <StatMini icon={Flame} value={c.hotDocs.toString()} label="Hot" tone="danger" />
      </div>

      <footer className="mt-4 flex items-center justify-between text-vault-muted">
        <span className="font-mono text-[10px]">
          {c.productionDate ? `Produced ${c.productionDate}` : 'Review in progress'}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9.5px] text-vault-faint">{c.lastActivity}</span>
          <ArrowRight className="h-3 w-3 group-hover:text-vault-accent transition-colors" />
        </div>
      </footer>
    </Link>
  )
}

function StatMini({
  icon: Icon,
  value,
  label,
  tone = 'default',
}: {
  icon: React.ComponentType<{ className?: string }>
  value: string
  label: string
  tone?: 'default' | 'gold' | 'danger'
}) {
  const cls =
    tone === 'gold' ? 'text-vault-gold' : tone === 'danger' ? 'text-vault-danger' : 'text-vault-ink'
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3 w-3 ${cls}`} />
        <span className={`font-mono text-[12px] font-semibold tabular-nums ${cls}`}>{value}</span>
      </div>
      <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-wider text-vault-muted">
        {label}
      </p>
    </div>
  )
}
