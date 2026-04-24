import Link from 'next/link'
import { demoResearchThreads, type DemoResearchThread } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import {
  Plus, Search, BookOpen, MessageSquare, Bookmark, FileText, ArrowRight,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function ResearchPage() {
  const threads = demoResearchThreads
  const saved = threads.filter((t) => t.saved)
  const open = threads.filter((t) => !t.saved)

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <header>
        <p className="eyebrow text-vault-gold">§ Research</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="display-serif text-3xl font-medium text-vault-ink tracking-tight md:text-4xl">
              Saved work product.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-vault-text-secondary leading-relaxed">
              Every research thread cites the matter workspace — and its own sources. No vendor
              training, no prompt leakage, no retention beyond your policy.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Search className="h-3.5 w-3.5" />
              Search
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New research thread
            </Button>
          </div>
        </div>
        <div className="vault-divider mt-6" />
      </header>

      {/* Saved */}
      {saved.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Bookmark className="h-4 w-4 text-vault-gold" />
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-vault-ink font-semibold">
              Saved
            </h2>
            <span className="font-mono text-[10px] text-vault-muted tabular-nums">
              {saved.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {saved.map((t) => (
              <ResearchCard key={t.id} t={t} />
            ))}
          </div>
        </section>
      )}

      {/* Open */}
      {open.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-4 w-4 text-vault-muted" />
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-vault-ink font-semibold">
              In progress
            </h2>
            <span className="font-mono text-[10px] text-vault-muted tabular-nums">
              {open.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {open.map((t) => (
              <ResearchCard key={t.id} t={t} />
            ))}
          </div>
        </section>
      )}

      {threads.length === 0 && (
        <div className="rounded-md border border-vault-border bg-vault-surface p-12 text-center shadow-vault">
          <BookOpen className="h-10 w-10 text-vault-muted mx-auto mb-3" />
          <p className="text-[13px] text-vault-text-secondary">
            No research threads yet. Open a matter and start a new thread to begin.
          </p>
        </div>
      )}
    </div>
  )
}

function ResearchCard({ t }: { t: DemoResearchThread }) {
  const matterId = t.matterNumber.match(/M-\d{4}-(\d{4})/i)?.[1]
  return (
    <Link
      href={matterId ? `/matters/m-${matterId}/research` : '#'}
      className="group block rounded-md border border-vault-border bg-vault-surface p-5 shadow-vault hover:border-vault-border-strong hover:shadow-vault-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <BookOpen className="h-4 w-4 text-vault-muted mt-1" />
        {t.saved && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-gold/30 bg-vault-gold/8 font-mono text-[9px] uppercase tracking-wider text-vault-gold">
            <Bookmark className="h-2.5 w-2.5" />
            Saved
          </span>
        )}
      </div>

      <p className="font-mono text-[9.5px] uppercase tracking-wider text-vault-muted tabular-nums">
        {t.matterNumber}
      </p>
      <h3 className="mt-1 display-serif text-[15px] font-medium text-vault-ink tracking-tight leading-snug group-hover:text-vault-accent transition-colors">
        {t.title}
      </h3>
      <p className="mt-1 text-[11px] text-vault-text-secondary truncate">{t.matter}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {t.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[9.5px] px-1.5 py-0.5 rounded border border-vault-border bg-vault-elevated text-vault-text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>

      <footer className="mt-4 pt-4 border-t border-vault-border/70 flex items-center justify-between">
        <div className="flex items-center gap-4 text-vault-muted">
          <span className="inline-flex items-center gap-1 font-mono text-[10px] tabular-nums">
            <MessageSquare className="h-3 w-3" />
            {t.messageCount}
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] tabular-nums">
            <FileText className="h-3 w-3" />
            {t.citations}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9.5px] text-vault-faint">{t.lastActivity}</span>
          <ArrowRight className="h-3 w-3 text-vault-muted group-hover:text-vault-accent transition-colors" />
        </div>
      </footer>
    </Link>
  )
}
