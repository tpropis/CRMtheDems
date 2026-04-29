import { Shield, Briefcase, FileText, AlertTriangle, Bot, Clock, CheckCircle2 } from 'lucide-react'

export function DashboardMockup() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-vault-border-strong bg-vault-surface shadow-vault-xl ring-1 ring-vault-ink/5">
      {/* Top gold seam */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-vault-gold/50 to-transparent" />

      {/* Chrome */}
      <div className="flex items-center gap-2 border-b border-vault-border bg-gradient-to-b from-vault-elevated to-vault-elevated/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-vault-danger/55 ring-1 ring-vault-ink/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-vault-warning/60 ring-1 ring-vault-ink/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-vault-success/55 ring-1 ring-vault-ink/10" />
        </div>
        <div className="ml-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-vault-muted">
          <span className="live-dot" />
          <span>DEPLOYMENT · ON-PREM · us-east-firm-1</span>
          <span className="text-vault-faint">·</span>
          <span className="text-vault-gold/90">SEALED</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="kbd">⌘</span>
          <span className="kbd">K</span>
          <span className="ml-1 font-mono text-[10px] text-vault-muted">Matter scope</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        {/* Sidebar */}
        <div className="col-span-3 border-r border-vault-border bg-gradient-to-b from-vault-sidebar/60 to-vault-sidebar-hov/40 p-3">
          <div className="mb-3 px-1 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-vault-muted">
            Workspace
          </div>
          {[
            { label: 'Dashboard', active: true },
            { label: 'Matters' },
            { label: 'Contacts' },
            { label: 'Intake' },
            { label: 'Documents' },
            { label: 'Discovery' },
            { label: 'Calendar' },
            { label: 'AI Operator' },
            { label: 'Audit' },
          ].map((item) => (
            <div
              key={item.label}
              className={`relative flex items-center justify-between rounded px-2 py-1.5 text-[11px] ${
                item.active
                  ? 'bg-vault-accent/[0.10] text-vault-accent font-semibold'
                  : 'text-vault-text-secondary'
              }`}
            >
              {item.active && (
                <span className="absolute left-0 top-1/2 h-[60%] w-[2px] -translate-y-1/2 rounded-r bg-vault-accent shadow-[0_0_6px_rgba(45,89,69,0.4)]" />
              )}
              <span>{item.label}</span>
              {item.active && <span className="h-1 w-1 rounded-full bg-vault-accent" />}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="col-span-9 p-4">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h4 className="display-serif text-[15px] font-semibold tracking-[-0.01em] text-vault-ink">
                Good morning, Alexandra.
              </h4>
              <p className="mt-0.5 text-[10px] text-vault-muted">
                <span className="font-semibold text-vault-text">9</span> active matters ·{' '}
                <span className="font-semibold text-vault-danger">3</span> deadlines &lt; 48h ·{' '}
                <span className="font-semibold text-vault-text">$42,180</span> WIP ·{' '}
                <span className="font-semibold text-vault-gold">11</span> AI actions today
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded border border-vault-gold/30 bg-gradient-to-b from-vault-gold/10 to-vault-gold/5 px-2 py-1 shadow-vault-seal-sm">
              <Shield className="h-2.5 w-2.5 text-vault-gold" />
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-vault-gold">
                Privileged
              </span>
            </div>
          </div>

          {/* Stat row */}
          <div className="mb-3 grid grid-cols-4 gap-2">
            {[
              { label: 'Matters', value: '142', icon: Briefcase, trend: '+8', stripe: 'from-vault-accent to-vault-accent/40' },
              { label: 'Intake', value: '17', icon: FileText, trend: '4 new', stripe: 'from-vault-gold to-vault-gold/40' },
              { label: 'Deadlines', value: '3', icon: AlertTriangle, trend: '< 48h', danger: true, stripe: 'from-vault-danger to-vault-danger/40' },
              { label: 'WIP', value: '$42.1k', icon: Clock, trend: 'Draft', stripe: 'from-vault-border-strong to-vault-border-strong/30' },
            ].map((s) => (
              <div
                key={s.label}
                className="overflow-hidden rounded border border-vault-border bg-vault-surface shadow-[0_1px_2px_rgba(20,18,14,0.04)]"
              >
                <div className={`h-[2px] w-full bg-gradient-to-r ${s.stripe}`} />
                <div className="p-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8.5px] font-semibold uppercase tracking-[0.18em] text-vault-muted">
                      {s.label}
                    </span>
                    <s.icon className="h-2.5 w-2.5 text-vault-muted" />
                  </div>
                  <div className="mt-1 font-display text-base font-bold tabular-nums leading-none text-vault-ink">
                    {s.value}
                  </div>
                  <div
                    className={`mt-1 font-mono text-[9px] tabular-nums ${
                      s.danger ? 'text-vault-danger' : 'text-vault-text-secondary'
                    }`}
                  >
                    {s.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Matters table */}
          <div className="mb-3 overflow-hidden rounded border border-vault-border bg-vault-surface">
            <div className="flex items-center justify-between border-b border-vault-border bg-gradient-to-b from-vault-elevated/80 to-vault-elevated/40 px-3 py-1.5">
              <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-vault-text">
                Matters in motion
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-vault-muted">
                Last activity
              </span>
            </div>
            <div className="divide-y divide-vault-border/60">
              {[
                { n: 'M-2026-0142', name: 'Roth v. Aventra Capital', risk: 'HIGH', t: '14m' },
                { n: 'M-2026-0128', name: 'Harrington Estate · Trust Contest', risk: 'MED', t: '1h' },
                { n: 'M-2026-0117', name: 'Meridian Acquisition · Phase II', risk: 'LOW', t: '3h' },
              ].map((m) => (
                <div key={m.n} className="flex items-center gap-3 px-3 py-1.5">
                  <span className="font-mono text-[9px] text-vault-muted">{m.n}</span>
                  <span className="flex-1 text-[10px] text-vault-text">{m.name}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-[0.15em] ${
                      m.risk === 'HIGH'
                        ? 'bg-vault-danger/12 text-vault-danger ring-1 ring-vault-danger/20'
                        : m.risk === 'MED'
                        ? 'bg-vault-warning/12 text-vault-warning ring-1 ring-vault-warning/20'
                        : 'bg-vault-success/12 text-vault-success ring-1 ring-vault-success/20'
                    }`}
                  >
                    {m.risk}
                  </span>
                  <span className="font-mono text-[9px] tabular-nums text-vault-faint">{m.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Ledger */}
          <div className="overflow-hidden rounded border border-vault-border bg-vault-surface">
            <div className="flex items-center justify-between border-b border-vault-border bg-gradient-to-b from-vault-elevated/80 to-vault-elevated/40 px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <Bot className="h-2.5 w-2.5 text-vault-gold" />
                <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-vault-text">
                  AI Activity Ledger
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-vault-gold/80">
                SIGNED · IMMUTABLE
              </span>
            </div>
            <div className="divide-y divide-vault-border/60">
              {[
                { a: 'Draft · Discovery request', m: 'M-2026-0142', r: 'A. Pell', s: 'approved', h: 'a3f17c' },
                { a: 'Extract · Obligations', m: 'M-2026-0128', r: 'Pending', s: 'pending', h: 'b81e29' },
                { a: 'Summarize · Production batch 03', m: 'M-2026-0117', r: 'J. Okafor', s: 'approved', h: 'c4d962' },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-1.5">
                  {row.s === 'approved' ? (
                    <CheckCircle2 className="h-2.5 w-2.5 text-vault-success shrink-0" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-vault-warning animate-pulse shrink-0" />
                  )}
                  <span className="flex-1 text-[10px] text-vault-text">{row.a}</span>
                  <span className="font-mono text-[9px] text-vault-muted">{row.m}</span>
                  <span className="text-[9px] text-vault-text-secondary">{row.r}</span>
                  <span className="font-mono text-[9px] tabular-nums text-vault-faint">0x{row.h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
