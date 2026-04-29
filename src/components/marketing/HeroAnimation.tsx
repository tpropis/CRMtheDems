import { LogoMark } from '@/components/brand/Logo'
import { FileText, Bot, CheckCircle2, Hash, ArrowRight, ShieldCheck } from 'lucide-react'

/**
 * Animated explainer for the Privilege Vault hero section.
 * 10-second CSS loop: docs enter → Vault AI processes inside the perimeter →
 * signed output emerges → audit ledger ticks in → brief pause → reset.
 */
export function HeroAnimation() {
  return (
    <div className="relative w-full max-w-[400px] select-none">
      {/* Main panel */}
      <div className="rounded-xl border border-vault-border bg-vault-surface/90 shadow-vault-xl backdrop-blur overflow-hidden">

        {/* ── Header: Privilege Vault branding ── */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-vault-border bg-vault-elevated/60">
          <LogoMark size={22} variant="dark" />
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-semibold text-vault-ink leading-none tracking-[-0.01em]">Privilege Vault</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-vault-gold mt-0.5">Legal Intelligence</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="live-dot" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-vault-success">Sealed · Live</span>
          </div>
        </div>

        <div className="p-5 space-y-4">

          {/* ── Perimeter boundary ── */}
          <div className="relative rounded-lg border border-dashed border-vault-gold/40 bg-vault-elevated/20 px-4 pt-5 pb-4">
            <div className="absolute -top-2.5 left-3 flex items-center gap-1.5 bg-vault-surface px-2 py-0.5 rounded-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-vault-gold/70" />
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-vault-gold">Your Perimeter</span>
            </div>

            {/* Flow: Doc → AI → Signed Output */}
            <div className="flex items-center justify-between gap-2">

              {/* Node 1 — Matter documents */}
              <div className="flex flex-col items-center gap-1.5 animate-hero-doc">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-vault-border bg-vault-surface shadow-vault">
                  <FileText className="h-4.5 w-4.5 h-[18px] w-[18px] text-vault-text-secondary" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-semibold text-vault-ink leading-none">Matter docs</p>
                  <p className="font-mono text-[8px] uppercase tracking-wider text-vault-muted mt-0.5">Enter</p>
                </div>
              </div>

              {/* Arrow 1 */}
              <ArrowRight className="h-3.5 w-3.5 text-vault-border-strong shrink-0 animate-hero-arrow1" />

              {/* Node 2 — Vault AI (always slightly visible as the core) */}
              <div className="flex flex-col items-center gap-1.5 animate-hero-ai">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-vault-gold/50 bg-vault-gold/10 shadow-vault-seal-sm">
                  <Bot className="h-[18px] w-[18px] text-vault-gold" />
                  {/* Ping ring — shows "processing" */}
                  <span className="absolute inset-0 rounded-lg border border-vault-gold/30 animate-ping opacity-75" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-semibold text-vault-ink leading-none">Vault AI</p>
                  <p className="font-mono text-[8px] uppercase tracking-wider text-vault-gold mt-0.5">Private</p>
                </div>
              </div>

              {/* Arrow 2 */}
              <ArrowRight className="h-3.5 w-3.5 text-vault-border-strong shrink-0 animate-hero-arrow2" />

              {/* Node 3 — Signed output */}
              <div className="flex flex-col items-center gap-1.5 animate-hero-output">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-vault-success/40 bg-vault-success/[0.08] shadow-vault">
                  <CheckCircle2 className="h-[18px] w-[18px] text-vault-success" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-semibold text-vault-ink leading-none">Signed</p>
                  <p className="font-mono text-[8px] uppercase tracking-wider text-vault-success mt-0.5">Reviewed</p>
                </div>
              </div>

            </div>
          </div>

          {/* ── Audit ledger ── */}
          <div className="rounded-md border border-vault-border bg-vault-elevated/40 overflow-hidden animate-hero-audit">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-vault-border/60 bg-vault-elevated/60">
              <Hash className="h-3 w-3 text-vault-gold shrink-0" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-vault-gold">Audit Ledger</span>
              <span className="ml-auto font-mono text-[8px] text-vault-success tracking-wider">Immutable</span>
            </div>
            <div className="divide-y divide-vault-border/40">
              {[
                { hash: '0x3f7a…c91d', label: 'AI draft reviewed & signed', matter: 'Matter #4821' },
                { hash: '0x9c2e…84ab', label: 'Privilege seal applied on ingest', matter: 'Matter #4820' },
              ].map((entry) => (
                <div key={entry.hash} className="flex items-center gap-2 px-3 py-2">
                  <code className="font-mono text-[9px] text-vault-muted shrink-0">{entry.hash}</code>
                  <span className="text-[10px] text-vault-text-secondary flex-1 truncate">{entry.label}</span>
                  <span className="font-mono text-[8px] text-vault-faint shrink-0 hidden sm:block">{entry.matter}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom tagline ── */}
          <div className="flex items-center justify-center gap-2.5 font-mono text-[9px] uppercase tracking-wider text-vault-muted pt-0.5">
            <span>Nothing trains</span>
            <span className="text-vault-border-strong">·</span>
            <span>Nothing leaves</span>
            <span className="text-vault-border-strong">·</span>
            <span>Every output signed</span>
          </div>
        </div>
      </div>

      {/* Floating compliance badge */}
      <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 rounded-full border border-vault-gold/40 bg-vault-surface/95 px-3 py-1.5 shadow-vault-seal-sm backdrop-blur">
        <ShieldCheck className="h-3 w-3 text-vault-gold" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-vault-gold">SOC 2 · ISO 27001</span>
      </div>
    </div>
  )
}
