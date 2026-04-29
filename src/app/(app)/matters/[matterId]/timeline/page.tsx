import { notFound } from 'next/navigation'
import { getDemoMatter } from '@/lib/demo-data'
import { Shield, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default function MatterTimelinePage({ params }: { params: { matterId: string } }) {
  const matter = getDemoMatter(params.matterId)
  if (!matter) notFound()

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-vault-gold">§ Event Ledger</p>
          <p className="mt-1 text-[12px] text-vault-text-secondary">
            {matter.timeline.length} events · signed, hash-chained, append-only
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </Button>
      </div>

      {/* Timeline ledger */}
      <section className="section-card overflow-hidden">
        <div className="relative">
          {/* Spine */}
          <div className="absolute left-[140px] top-4 bottom-4 w-px bg-vault-border" />

          <ol className="divide-y divide-vault-border/60">
            {matter.timeline.map((ev) => (
              <li key={ev.id} className="relative grid grid-cols-[130px_1fr] gap-4 items-start px-5 py-5">
                {/* Left: time */}
                <div className="text-right min-w-0">
                  <p className="font-mono text-[11px] text-vault-muted tabular-nums">{ev.at}</p>
                  <p className="font-mono text-[9px] text-vault-faint mt-0.5 uppercase tracking-wider">
                    {kindLabel(ev.kind)}
                  </p>
                </div>

                {/* Middle: dot */}
                <div className="absolute left-[140px] top-[26px] -translate-x-1/2 z-10">
                  <EventDot kind={ev.kind} />
                </div>

                {/* Right: content */}
                <div className="pl-7 min-w-0">
                  <p className="text-[13.5px] font-medium text-vault-ink leading-snug">{ev.title}</p>
                  {ev.body && (
                    <p className="mt-1.5 text-[12px] text-vault-text-secondary leading-relaxed">
                      {ev.body}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3">
                    <p className="font-mono text-[10px] text-vault-faint">{ev.actor}</p>
                    <div className="flex items-center gap-1 text-vault-gold/70">
                      <Shield className="h-2.5 w-2.5" />
                      <span className="font-mono text-[9px] uppercase tracking-wider">
                        0x{ev.id.slice(-8).padStart(8, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <footer className="px-5 py-3 border-t border-vault-border bg-vault-elevated/40 flex items-center justify-between">
          <p className="font-mono text-[10px] text-vault-muted">
            Oldest event · {matter.timeline[matter.timeline.length - 1]?.at ?? '—'}
          </p>
          <div className="flex items-center gap-1.5 text-vault-gold">
            <Shield className="h-3 w-3" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Immutable</span>
          </div>
        </footer>
      </section>
    </div>
  )
}

function EventDot({ kind }: { kind: string }) {
  const cls =
    kind === 'filing'
      ? 'bg-vault-danger border-vault-danger'
      : kind === 'ai_action'
      ? 'bg-vault-gold border-vault-gold'
      : kind === 'deadline_computed'
      ? 'bg-vault-accent border-vault-accent'
      : kind === 'doc_ingested'
      ? 'bg-vault-accent-light border-vault-accent-light'
      : kind === 'meeting'
      ? 'bg-vault-warning border-vault-warning'
      : 'bg-vault-muted border-vault-muted'
  return <div className={`h-3 w-3 rounded-full border-2 ring-4 ring-vault-surface ${cls}`} />
}

function kindLabel(kind: string): string {
  const m: Record<string, string> = {
    filing: 'Filing',
    correspondence: 'Corresp.',
    ai_action: 'AI Action',
    deadline_computed: 'Deadline',
    doc_ingested: 'Ingest',
    meeting: 'Meeting',
    note: 'Note',
    billing: 'Billing',
  }
  return m[kind] ?? kind
}
