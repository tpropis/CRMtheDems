'use client'
import { useState } from 'react'
import {
  demoAIThreads,
  type DemoAIThread,
  type DemoAIMessage,
} from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import {
  Bot, Send, FileText, Shield, Search, Plus,
  CheckCircle2, Clock, ArrowRight, Bookmark, MoreHorizontal,
  Pin, Copy,
} from 'lucide-react'

export default function AIParalegalPage() {
  const [threads] = useState<DemoAIThread[]>(demoAIThreads)
  const [activeId, setActiveId] = useState<string>(threads[0]?.id ?? '')
  const active = threads.find((t) => t.id === activeId) ?? threads[0]

  // Collect unique citations across the active thread for the right rail
  const citations = active
    ? active.messages
        .flatMap((m) => m.citations ?? [])
        .filter((c, i, arr) => arr.findIndex((x) => x.doc === c.doc && x.page === c.page) === i)
    : []

  return (
    <div className="-mx-4 md:-mx-6 -mt-4 md:-mt-6 h-[calc(100vh-56px)] flex animate-fade-in">
      {/* ────── Left rail: thread list ────── */}
      <aside className="hidden md:flex w-72 shrink-0 border-r border-vault-border bg-vault-elevated/40 flex-col">
        <div className="px-4 pt-5 pb-3">
          <p className="eyebrow text-vault-gold">§ AI Paralegal</p>
          <h1 className="display-serif mt-1.5 text-[20px] font-medium text-vault-ink tracking-tight">
            Conversations
          </h1>
          <p className="mt-1 text-[11px] text-vault-text-secondary leading-relaxed">
            Every answer matter-scoped · cited · signed
          </p>
        </div>

        <div className="px-4 pb-3">
          <Button size="sm" className="w-full gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New conversation
          </Button>
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-vault-border bg-vault-elevated shadow-vault-inset">
            <Search className="h-3 w-3 text-vault-muted" />
            <input
              type="text"
              placeholder="Search threads…"
              className="flex-1 bg-transparent text-[12px] text-vault-ink placeholder:text-vault-muted focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ThreadSectionHeading label="Active" />
          {threads
            .filter((t) => t.status === 'active')
            .map((t) => (
              <ThreadListItem
                key={t.id}
                thread={t}
                active={t.id === activeId}
                onClick={() => setActiveId(t.id)}
              />
            ))}
          <ThreadSectionHeading label="Signed" />
          {threads.filter((t) => t.status === 'signed').length === 0 ? (
            <p className="px-4 py-3 text-[11px] text-vault-faint italic">
              No signed threads yet.
            </p>
          ) : (
            threads
              .filter((t) => t.status === 'signed')
              .map((t) => (
                <ThreadListItem
                  key={t.id}
                  thread={t}
                  active={t.id === activeId}
                  onClick={() => setActiveId(t.id)}
                />
              ))
          )}
        </div>

        {/* Model pin */}
        <div className="px-4 py-3 border-t border-vault-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-vault-gold/30 bg-vault-gold/5">
            <Pin className="h-3 w-3 text-vault-gold shrink-0" />
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-vault-muted">
                Model · pinned
              </p>
              <p className="text-[11px] text-vault-ink font-medium truncate">vault-legal-7b</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ────── Center: conversation ────── */}
      <main className="flex-1 min-w-0 flex flex-col bg-vault-bg">
        {active ? (
          <>
            {/* Thread header */}
            <header className="shrink-0 border-b border-vault-border bg-vault-surface px-6 py-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
                  {active.scope === 'matter' ? 'Matter-scoped' : active.scope}
                  {active.matterNumber && ` · ${active.matterNumber}`}
                </p>
                <h2 className="display-serif mt-1 text-[17px] font-medium text-vault-ink tracking-tight truncate">
                  {active.title}
                </h2>
                {active.matter && (
                  <p className="mt-0.5 text-[11px] text-vault-text-secondary truncate">
                    {active.matter}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-vault-gold/30 bg-vault-gold/5">
                  <Shield className="h-3 w-3 text-vault-gold" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-vault-gold">
                    Sealed
                  </span>
                </div>
                <Button variant="ghost" size="icon-sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {active.messages.map((m) => (
                  <MessageBubble key={m.id} m={m} />
                ))}
              </div>
            </div>

            {/* Composer */}
            <footer className="shrink-0 border-t border-vault-border bg-vault-surface p-4">
              <div className="max-w-3xl mx-auto">
                <div className="section-card focus-within:border-vault-accent/60 focus-within:ring-2 focus-within:ring-vault-accent/20 transition-all">
                  <textarea
                    placeholder={`Ask about ${
                      active.matter ?? 'this matter'
                    }… Responses cite the matter workspace.`}
                    rows={3}
                    className="w-full resize-none bg-transparent px-4 py-3 text-[13.5px] text-vault-ink placeholder:text-vault-muted focus:outline-none"
                  />
                  <div className="flex items-center justify-between px-3 py-2 border-t border-vault-border bg-vault-elevated/50">
                    <div className="flex items-center gap-3 text-[10px] text-vault-muted">
                      <span className="font-mono uppercase tracking-[0.14em]">{active.model}</span>
                      <span className="text-vault-faint">·</span>
                      <span>Matter context active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="kbd">⏎</span>
                      <Button size="sm" className="gap-1.5">
                        <Send className="h-3.5 w-3.5" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="mt-2 px-1 text-[10px] text-vault-faint">
                  Outputs are drafts until signed. No data leaves your firm&apos;s perimeter.
                </p>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center max-w-sm">
              <Bot className="mx-auto h-10 w-10 text-vault-muted mb-4" />
              <p className="text-[13px] text-vault-text-secondary">
                Start a new conversation to draft, summarize, extract, or chronicle.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ────── Right rail: citations & context ────── */}
      {active && (
        <aside className="hidden xl:flex w-80 shrink-0 border-l border-vault-border bg-vault-elevated/40 overflow-y-auto flex-col">
          <div className="px-5 pt-5 pb-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
              § Citations
            </p>
            <h3 className="display-serif mt-1 text-[15px] font-medium text-vault-ink">
              Sources for this thread
            </h3>
            <p className="mt-1 text-[11px] text-vault-text-secondary">
              {citations.length} {citations.length === 1 ? 'source' : 'sources'} · all auditable
            </p>
          </div>

          <div className="px-4 pb-4 space-y-2">
            {citations.map((c, i) => (
              <div
                key={i}
                className="section-card p-3 cursor-pointer"
              >
                <div className="flex items-start gap-2 mb-1.5">
                  <FileText className="h-3.5 w-3.5 text-vault-muted shrink-0 mt-0.5" />
                  <p className="flex-1 text-[12px] font-medium text-vault-ink leading-snug">
                    {c.doc}
                  </p>
                </div>
                <p className="font-mono text-[10px] text-vault-faint">
                  {c.page}
                  {c.bates && ` · ${c.bates}`}
                </p>
                {c.excerpt && (
                  <p className="mt-2 text-[11px] text-vault-text-secondary italic border-l-2 border-vault-gold/40 pl-2.5 leading-relaxed">
                    {c.excerpt}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Matter context */}
          {active.matter && (
            <div className="border-t border-vault-border px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted mb-2">
                § Matter Context
              </p>
              <a
                href={`/matters/${active.matterNumber?.toLowerCase().replace(/m-2026-/, 'm-')}`}
                className="block rounded-md border border-vault-accent/25 bg-vault-accent/5 p-3 hover:bg-vault-accent/8 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-vault-muted tabular-nums">
                    {active.matterNumber}
                  </span>
                  <ArrowRight className="h-3 w-3 text-vault-accent" />
                </div>
                <p className="text-[12.5px] font-medium text-vault-ink leading-snug">
                  {active.matter}
                </p>
                <p className="mt-2 font-mono text-[9.5px] uppercase tracking-wider text-vault-faint">
                  Open matter workspace
                </p>
              </a>
            </div>
          )}

          {/* Provenance */}
          <div className="border-t border-vault-border px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted mb-2">
              § Provenance
            </p>
            <dl className="space-y-2">
              <ProvRow label="Started" value={active.startedAt} />
              <ProvRow label="Last active" value={active.lastActivity} />
              <ProvRow label="Created by" value={active.createdBy} />
              <ProvRow label="Scope" value={active.scope} />
              <ProvRow label="Messages" value={active.messages.length.toString()} />
            </dl>
          </div>
        </aside>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────── */

function ThreadSectionHeading({ label }: { label: string }) {
  return (
    <p className="px-4 pt-3 pb-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-vault-muted font-semibold">
      {label}
    </p>
  )
}

function ThreadListItem({
  thread,
  active,
  onClick,
}: {
  thread: DemoAIThread
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-l-2 transition-colors ${
        active
          ? 'bg-vault-accent/[0.06] border-vault-accent shadow-[inset_0_0_0_1px_rgba(45,89,69,0.04)]'
          : 'border-transparent hover:bg-vault-surface/70 hover:border-vault-border-strong'
      }`}
    >
      {thread.matterNumber && (
        <p className="font-mono text-[9.5px] uppercase tracking-wider text-vault-muted tabular-nums">
          {thread.matterNumber}
        </p>
      )}
      <p
        className={`mt-0.5 text-[12.5px] leading-snug line-clamp-2 ${
          active ? 'text-vault-ink font-medium' : 'text-vault-text-secondary'
        }`}
      >
        {thread.title}
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="font-mono text-[9.5px] text-vault-faint">{thread.lastActivity}</span>
        <span className="font-mono text-[9.5px] text-vault-faint">·</span>
        <span className="font-mono text-[9.5px] text-vault-faint">
          {thread.messages.length} {thread.messages.length === 1 ? 'msg' : 'msgs'}
        </span>
      </div>
    </button>
  )
}

function MessageBubble({ m }: { m: DemoAIMessage }) {
  if (m.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] section-card px-4 py-3">
          <p className="text-[13.5px] text-vault-ink leading-relaxed whitespace-pre-wrap">
            {m.content}
          </p>
          <p className="mt-2 font-mono text-[9.5px] text-vault-faint uppercase tracking-wider">
            You · {m.at}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-md border border-vault-gold/40 bg-vault-gold/10 flex items-center justify-center shrink-0">
        <Bot className="h-4 w-4 text-vault-gold" />
      </div>
      <div className="flex-1 min-w-0 section-card overflow-hidden">
        <header className="flex items-center gap-2 px-4 py-2 border-b border-vault-border bg-gradient-to-b from-vault-elevated/80 to-vault-elevated/40">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted font-semibold">
            Vault-Legal 7B
          </span>
          <span className="text-vault-faint">·</span>
          <span className="font-mono text-[10px] text-vault-faint">{m.at}</span>
          <div className="ml-auto flex items-center gap-1.5">
            {m.reviewed ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-success/30 bg-vault-success/8 text-[9.5px] font-mono uppercase tracking-wider text-vault-success">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Signed · {m.reviewer}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-warning/30 bg-vault-warning/8 text-[9.5px] font-mono uppercase tracking-wider text-vault-warning">
                <Clock className="h-2.5 w-2.5" />
                Pending review
              </span>
            )}
            <button className="p-1 text-vault-muted hover:text-vault-ink" title="Copy">
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </header>

        <div className="px-4 py-3">
          <p className="text-[13.5px] text-vault-ink leading-relaxed whitespace-pre-wrap">
            {m.content}
          </p>
          {m.citations && m.citations.length > 0 && (
            <div className="mt-4 pt-3 border-t border-vault-border/70">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted mb-2">
                Sources · {m.citations.length}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {m.citations.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-vault-border bg-vault-elevated text-[10px]"
                    title={c.excerpt}
                  >
                    <FileText className="h-2.5 w-2.5 text-vault-muted shrink-0" />
                    <span className="text-vault-ink truncate max-w-[180px]">{c.doc}</span>
                    <span className="text-vault-faint">·</span>
                    <span className="font-mono text-vault-muted">{c.page}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProvRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="font-mono text-[9.5px] uppercase tracking-wider text-vault-muted">{label}</dt>
      <dd className="text-[11.5px] text-vault-ink text-right truncate">{value}</dd>
    </div>
  )
}
