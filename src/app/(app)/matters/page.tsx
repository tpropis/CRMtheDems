export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { formatCurrency } from '@/lib/utils'
import { demoMatters, isDemoSession, type DemoMatter } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import {
  Plus, Filter, Search, Briefcase, Calendar, FileSearch,
  Sparkles, ArrowRight, SlidersHorizontal,
} from 'lucide-react'

export default async function MattersPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId
  const demoMode = isDemoSession(firmId)

  // In Phase 4 the list page is demo-first. Non-demo path falls through
  // to the same fixtures until we wire real DB queries in a later phase.
  const matters = demoMatters

  const byPractice = matters.reduce<Record<string, number>>((acc, m) => {
    acc[m.practice] = (acc[m.practice] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Editorial header */}
      <header>
        <p className="eyebrow text-vault-gold">§ Matters</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="display-serif text-3xl font-medium text-vault-ink tracking-tight md:text-4xl">
              Matters in motion.
            </h1>
            <p className="mt-2 text-sm text-vault-text-secondary">
              {matters.length} active {matters.length === 1 ? 'matter' : 'matters'} across{' '}
              {Object.keys(byPractice).length} practice groups · every action sealed and audited.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              View
            </Button>
            <Link href="/intake/new">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                New Intake
              </Button>
            </Link>
          </div>
        </div>
        <div className="vault-divider mt-6" />
      </header>

      {/* Practice ribbon */}
      <nav className="flex items-center gap-6 overflow-x-auto">
        <PracticeChip label="All" count={matters.length} active />
        {Object.entries(byPractice).map(([practice, count]) => (
          <PracticeChip key={practice} label={practice} count={count} />
        ))}
      </nav>

      {/* Search bar */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-vault-border bg-vault-surface shadow-vault-inset">
        <Search className="h-3.5 w-3.5 text-vault-muted" />
        <input
          type="text"
          placeholder="Search matter name, number, client, or counsel…"
          className="flex-1 bg-transparent text-[13px] text-vault-ink placeholder:text-vault-muted focus:outline-none"
        />
        <span className="kbd">/</span>
      </div>

      {/* Matter table */}
      <section className="rounded-md border border-vault-border bg-vault-surface shadow-vault overflow-hidden">
       <div className="overflow-x-auto">
        <div className="min-w-[820px]">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-vault-border bg-vault-elevated/50">
          <div className="col-span-5 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            Matter
          </div>
          <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            Practice
          </div>
          <div className="col-span-3 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted text-center">
            Live state
          </div>
          <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted text-right">
            WIP · Activity
          </div>
        </div>

        <div className="divide-y divide-vault-border/70">
          {matters.map((m) => (
            <MatterRow key={m.id} m={m} />
          ))}
        </div>

        </div>
       </div>
        {!demoMode && (
          <footer className="px-5 py-3 border-t border-vault-border bg-vault-elevated/40">
            <p className="font-mono text-[10px] text-vault-muted">
              Showing demo data · live DB wiring ships in a later phase
            </p>
          </footer>
        )}
      </section>
    </div>
  )
}

function PracticeChip({ label, count, active }: { label: string; count: number; active?: boolean }) {
  return (
    <button
      className={`group shrink-0 flex items-center gap-2 pb-2 border-b-2 transition-colors ${
        active
          ? 'border-vault-accent text-vault-accent'
          : 'border-transparent text-vault-text-secondary hover:text-vault-ink hover:border-vault-border-strong'
      }`}
    >
      <span className="text-[13px] font-medium">{label}</span>
      <span
        className={`font-mono text-[10px] px-1.5 py-0.5 rounded tabular-nums ${
          active
            ? 'bg-vault-accent/10 text-vault-accent'
            : 'bg-vault-elevated text-vault-muted group-hover:bg-vault-raised'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function MatterRow({ m }: { m: DemoMatter }) {
  const riskStyle =
    m.risk === 'CRITICAL'
      ? 'bg-vault-danger/10 text-vault-danger border-vault-danger/30'
      : m.risk === 'HIGH'
      ? 'bg-vault-warning/10 text-vault-warning border-vault-warning/30'
      : m.risk === 'MEDIUM'
      ? 'bg-vault-gold/10 text-vault-gold border-vault-gold/30'
      : 'bg-vault-success/10 text-vault-success border-vault-success/30'

  return (
    <Link
      href={`/matters/${m.id}`}
      className="grid grid-cols-12 gap-3 items-center px-5 py-3.5 hover:bg-vault-elevated/50 transition-colors group"
    >
      <div className="col-span-5 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-mono text-[10px] text-vault-muted tabular-nums">{m.number}</span>
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-widest border ${riskStyle}`}
          >
            {m.risk}
          </span>
        </div>
        <p className="text-[13.5px] font-medium text-vault-ink truncate group-hover:text-vault-accent">
          {m.name}
        </p>
        <p className="text-[11px] text-vault-text-secondary truncate">
          {m.client} · {m.attorney}
        </p>
      </div>

      <div className="col-span-2 min-w-0">
        <p className="text-[12px] text-vault-text-secondary truncate">{m.practice}</p>
        <p className="font-mono text-[10px] text-vault-faint uppercase tracking-wider">{m.status}</p>
      </div>

      <div className="col-span-3 flex items-center justify-center gap-4">
        <Pulse
          icon={Calendar}
          value={m.deadlineCount}
          label="due"
          tone={m.deadlineCount > 2 ? 'warn' : 'default'}
        />
        <Pulse
          icon={FileSearch}
          value={m.unreadFilings}
          label="new"
          tone={m.unreadFilings > 0 ? 'accent' : 'default'}
        />
        <Pulse
          icon={Sparkles}
          value={m.aiFlags}
          label="AI"
          tone={m.aiFlags > 2 ? 'gold' : 'default'}
        />
      </div>

      <div className="col-span-2 text-right min-w-0">
        <p className="font-mono text-[12px] font-medium text-vault-ink tabular-nums">
          {formatCurrency(m.openBalance).replace('.00', '')}
        </p>
        <p className="text-[10px] text-vault-faint truncate">{m.lastActivity}</p>
      </div>
    </Link>
  )
}

function Pulse({
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
