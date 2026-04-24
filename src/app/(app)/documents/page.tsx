import Link from 'next/link'
import { demoGlobalDocuments, type DemoGlobalDocument } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import {
  FileText, Upload, Filter, Search, Shield, Sparkles,
  ArrowRight, CheckCircle2, Clock, Loader2, XCircle,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function DocumentsPage() {
  const docs = demoGlobalDocuments

  const stats = {
    total: docs.length,
    ingesting: docs.filter((d) => d.status === 'ingesting').length,
    privileged: docs.filter(
      (d) => d.privilege && d.privilege !== 'Not Privileged' && d.privilege !== 'Needs Review'
    ).length,
    review: docs.filter((d) => d.privilege === 'Needs Review' || d.status === 'review').length,
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <header>
        <p className="eyebrow text-vault-gold">§ Document Intelligence</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="display-serif text-3xl font-medium text-vault-ink tracking-tight md:text-4xl">
              Every document, classified.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-vault-text-secondary leading-relaxed">
              Auto-privilege tagging on ingest · per-matter vectorization · defensible log at a
              click. {stats.total.toLocaleString()} documents indexed across the firm.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button size="sm" className="gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Ingest
            </Button>
          </div>
        </div>
        <div className="vault-divider mt-6" />
      </header>

      {/* Stat strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DocStat
          label="Indexed"
          value={stats.total}
          sub="Across all matters"
          icon={FileText}
        />
        <DocStat
          label="Ingesting"
          value={stats.ingesting}
          sub="Live · auto-classifying"
          icon={Loader2}
          accent="accent"
          spinning
        />
        <DocStat
          label="Privileged"
          value={stats.privileged}
          sub="A/C · WP · C/I"
          icon={Shield}
          accent="gold"
        />
        <DocStat
          label="Needs review"
          value={stats.review}
          sub="Attorney action required"
          icon={Sparkles}
          accent="warn"
        />
      </section>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-vault-border bg-vault-surface shadow-vault-inset">
        <Search className="h-3.5 w-3.5 text-vault-muted" />
        <input
          type="text"
          placeholder="Search document name, content, Bates, author, matter…"
          className="flex-1 bg-transparent text-[13px] text-vault-ink placeholder:text-vault-muted focus:outline-none"
        />
        <span className="kbd">/</span>
      </div>

      {/* Document table */}
      <section className="rounded-md border border-vault-border bg-vault-surface shadow-vault overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-vault-border bg-vault-elevated/50">
          <div className="col-span-5 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            Document
          </div>
          <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            Matter
          </div>
          <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            Privilege
          </div>
          <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            Status
          </div>
          <div className="col-span-1 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted text-right">
            Ingested
          </div>
        </div>

        <div className="divide-y divide-vault-border/70">
          {docs.map((d) => (
            <DocRow key={d.id} d={d} />
          ))}
        </div>

        <footer className="px-5 py-3 border-t border-vault-border bg-vault-elevated/40 flex items-center justify-between">
          <p className="font-mono text-[10px] text-vault-muted">
            {docs.length} documents · auto-classified at ingest · every view logged
          </p>
          <div className="flex items-center gap-1.5 text-vault-gold">
            <Shield className="h-3 w-3" />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Sealed · per-matter encryption
            </span>
          </div>
        </footer>
      </section>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────── */

function DocStat({
  label,
  value,
  sub,
  icon: Icon,
  accent = 'default',
  spinning,
}: {
  label: string
  value: number
  sub: string
  icon: React.ComponentType<{ className?: string }>
  accent?: 'default' | 'gold' | 'warn' | 'accent'
  spinning?: boolean
}) {
  const valCls =
    accent === 'gold'
      ? 'text-vault-gold'
      : accent === 'warn'
      ? 'text-vault-warning'
      : accent === 'accent'
      ? 'text-vault-accent'
      : 'text-vault-ink'
  const tileIcon =
    accent === 'gold'
      ? 'text-vault-gold border-vault-gold/30 bg-vault-gold/10'
      : accent === 'warn'
      ? 'text-vault-warning border-vault-warning/25 bg-vault-warning/8'
      : accent === 'accent'
      ? 'text-vault-accent border-vault-accent/25 bg-vault-accent/8'
      : 'text-vault-accent border-vault-accent/20 bg-vault-accent/8'

  return (
    <div className="rounded-md border border-vault-border bg-vault-surface p-4 shadow-vault">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            {label}
          </p>
          <p className={`mt-2 font-display text-2xl font-semibold tabular-nums ${valCls}`}>
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`flex h-7 w-7 items-center justify-center rounded border ${tileIcon}`}>
          <Icon className={`h-3.5 w-3.5 ${spinning ? 'animate-spin' : ''}`} />
        </div>
      </div>
      <p className="mt-2 text-[11px] text-vault-text-secondary">{sub}</p>
    </div>
  )
}

function DocRow({ d }: { d: DemoGlobalDocument }) {
  return (
    <Link
      href={`/matters/${deriveMatterId(d.matterNumber)}/documents`}
      className="grid grid-cols-12 gap-3 items-center px-5 py-3 hover:bg-vault-elevated/50 transition-colors"
    >
      <div className="col-span-5 flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 rounded border border-vault-border bg-vault-elevated flex items-center justify-center shrink-0">
          <FileText className="h-3.5 w-3.5 text-vault-muted" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-vault-ink truncate">{d.name}</p>
          <p className="font-mono text-[10px] text-vault-faint truncate">
            {d.pages.toLocaleString()} pp. · {d.size}
            {d.author && ` · ${d.author}`}
            {d.bates && ` · ${d.bates}`}
          </p>
        </div>
      </div>

      <div className="col-span-2 min-w-0">
        <p className="font-mono text-[10px] text-vault-muted tabular-nums">{d.matterNumber}</p>
        <p className="text-[11px] text-vault-text-secondary truncate">{d.matter}</p>
      </div>

      <div className="col-span-2">
        {d.privilege ? (
          <PrivilegeBadge kind={d.privilege} confidence={d.confidence} />
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-wider text-vault-muted">
            Unclassified
          </span>
        )}
      </div>

      <div className="col-span-2">
        <StatusChip status={d.status} />
      </div>

      <div className="col-span-1 text-right">
        <p className="font-mono text-[10px] text-vault-faint whitespace-nowrap">{d.ingestedAt}</p>
      </div>
    </Link>
  )
}

function PrivilegeBadge({
  kind,
  confidence,
}: {
  kind: DemoGlobalDocument['privilege']
  confidence?: number
}) {
  if (!kind) return null
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
  const short =
    kind === 'Attorney-Client'
      ? 'A/C'
      : kind === 'Work Product'
      ? 'WP'
      : kind === 'Common Interest'
      ? 'C/I'
      : kind === 'Needs Review'
      ? 'Review'
      : 'NP'
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-[10px] uppercase tracking-wider font-semibold ${style}`}
    >
      <span>{short}</span>
      {typeof confidence === 'number' && (
        <span className="opacity-70 tabular-nums">{confidence}%</span>
      )}
    </span>
  )
}

function StatusChip({ status }: { status: DemoGlobalDocument['status'] }) {
  const map: Record<
    DemoGlobalDocument['status'],
    { label: string; cls: string; Icon: React.ComponentType<{ className?: string }> }
  > = {
    indexed: {
      label: 'Indexed',
      cls: 'border-vault-success/30 bg-vault-success/8 text-vault-success',
      Icon: CheckCircle2,
    },
    ingesting: {
      label: 'Ingesting',
      cls: 'border-vault-accent/30 bg-vault-accent/8 text-vault-accent',
      Icon: Loader2,
    },
    review: {
      label: 'Review',
      cls: 'border-vault-warning/30 bg-vault-warning/8 text-vault-warning',
      Icon: Clock,
    },
    produced: {
      label: 'Produced',
      cls: 'border-vault-border-strong/50 bg-vault-elevated text-vault-text-secondary',
      Icon: ArrowRight,
    },
    withheld: {
      label: 'Withheld',
      cls: 'border-vault-danger/30 bg-vault-danger/8 text-vault-danger',
      Icon: XCircle,
    },
  }
  const { label, cls, Icon } = map[status]
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-mono text-[10px] uppercase tracking-wider font-semibold ${cls}`}
    >
      <Icon className={`h-2.5 w-2.5 ${status === 'ingesting' ? 'animate-spin' : ''}`} />
      {label}
    </span>
  )
}

// Best-effort matter-id derivation (M-2026-0142 → m-0142) to match
// the demo matter fixture IDs.
function deriveMatterId(matterNumber: string): string {
  const m = matterNumber.match(/M-\d{4}-(\d{4})/i)
  if (!m) return ''
  return `m-${m[1]}`
}
