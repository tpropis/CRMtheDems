import { notFound } from 'next/navigation'
import { getDemoMatter, type DemoDocument } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import { FileText, Upload, Filter, Shield, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function MatterDocumentsPage({ params }: { params: { matterId: string } }) {
  const matter = getDemoMatter(params.matterId)
  if (!matter) notFound()

  const privilegedCount = matter.documents.filter((d) => d.privilege && d.privilege !== 'Not Privileged').length
  const reviewCount = matter.documents.filter((d) => d.privilege === 'Needs Review').length

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <DocStat label="Total" value={matter.documents.length} />
          <DocStat label="Privileged" value={privilegedCount} tone="gold" />
          <DocStat label="Needs review" value={reviewCount} tone="warn" />
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

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-vault-border bg-vault-elevated shadow-vault-inset">
        <Search className="h-3.5 w-3.5 text-vault-muted" />
        <input
          type="text"
          placeholder="Search document name, content, Bates range, author…"
          className="flex-1 bg-transparent text-[13px] text-vault-ink placeholder:text-vault-muted focus:outline-none"
        />
      </div>

      {/* Table */}
      <section className="section-card overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-vault-border bg-gradient-to-b from-vault-elevated/80 to-vault-elevated/40">
          <div className="col-span-5 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            Document
          </div>
          <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            Type
          </div>
          <div className="col-span-3 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            Classification
          </div>
          <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted text-right">
            Ingested
          </div>
        </div>

        {matter.documents.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-vault-muted mb-3" />
            <p className="text-[13px] text-vault-text-secondary">
              No documents ingested yet for this matter.
            </p>
            <Button size="sm" variant="outline" className="mt-4 gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Ingest first document
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-vault-border/70">
            {matter.documents.map((d) => (
              <DocumentRow key={d.id} d={d} />
            ))}
          </div>
        )}

        <footer className="px-5 py-3 border-t border-vault-border bg-vault-elevated/40 flex items-center justify-between">
          <p className="font-mono text-[10px] text-vault-muted">
            {matter.documents.length} documents · auto-classified at ingest · every view logged
          </p>
          <div className="flex items-center gap-1.5 text-vault-gold">
            <Shield className="h-3 w-3" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Sealed storage</span>
          </div>
        </footer>
      </section>
    </div>
  )
}

function DocStat({ label, value, tone = 'default' }: { label: string; value: number; tone?: 'default' | 'gold' | 'warn' }) {
  const valCls =
    tone === 'gold' ? 'text-vault-gold' : tone === 'warn' ? 'text-vault-warning' : 'text-vault-ink'
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`font-display text-[19px] font-bold tabular-nums leading-none ${valCls}`}>{value}</span>
      <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-vault-muted">{label}</span>
    </div>
  )
}

function DocumentRow({ d }: { d: DemoDocument }) {
  return (
    <div className="grid grid-cols-12 gap-3 items-center px-5 py-3 hover:bg-vault-elevated/50 transition-colors cursor-pointer">
      <div className="col-span-5 flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 rounded border border-vault-border bg-gradient-to-b from-vault-elevated to-vault-elevated/60 flex items-center justify-center shrink-0">
          <FileText className="h-3.5 w-3.5 text-vault-muted" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-vault-ink truncate">{d.name}</p>
          <p className="font-mono text-[10px] text-vault-faint truncate">
            {d.pages} pp. · {d.size}
            {d.bates && ` · ${d.bates}`}
            {d.author && ` · ${d.author}`}
          </p>
        </div>
      </div>

      <div className="col-span-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-vault-text-secondary">
          {d.type}
        </span>
      </div>

      <div className="col-span-3">
        {d.privilege ? (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono uppercase tracking-wider font-semibold ${privilegeStyle(
              d.privilege
            )}`}
          >
            {privilegeLabel(d.privilege)}
          </span>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-wider text-vault-muted">
            Unclassified
          </span>
        )}
      </div>

      <div className="col-span-2 text-right">
        <p className="font-mono text-[10px] uppercase tracking-wider text-vault-text-secondary">
          {d.ingestedAt}
        </p>
      </div>
    </div>
  )
}

function privilegeStyle(kind: string): string {
  if (kind === 'Attorney-Client') return 'bg-vault-accent/10 text-vault-accent border-vault-accent/30'
  if (kind === 'Work Product') return 'bg-vault-gold/10 text-vault-gold border-vault-gold/30'
  if (kind === 'Common Interest') return 'bg-vault-accent-soft text-vault-accent-light border-vault-accent/20'
  if (kind === 'Needs Review') return 'bg-vault-warning/10 text-vault-warning border-vault-warning/30'
  return 'bg-vault-elevated text-vault-muted border-vault-border'
}

function privilegeLabel(kind: string): string {
  if (kind === 'Attorney-Client') return 'A/C Privileged'
  if (kind === 'Work Product') return 'Work Product'
  if (kind === 'Common Interest') return 'Common Interest'
  if (kind === 'Needs Review') return 'Needs Review'
  return 'Not Privileged'
}
