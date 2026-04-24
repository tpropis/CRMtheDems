import { Shield, Briefcase, FileText, AlertTriangle, Bot, Clock, CheckCircle2 } from 'lucide-react'

export function DashboardMockup() {
  return (
    <div className="relative rounded-lg border border-vault-border-strong bg-vault-surface shadow-vault-lg">
      {/* Chrome */}
      <div className="flex items-center gap-2 border-b border-vault-border bg-vault-elevated/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-vault-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-vault-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-vault-border-strong" />
        </div>
        <div className="ml-3 flex items-center gap-2 font-mono text-[10px] text-vault-muted">
          <span className="live-dot" />
          <span>DEPLOYMENT · ON-PREM · us-east-firm-1</span>
          <span className="text-vault-faint">·</span>
          <span>SEALED</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="kbd">⌘</span>
          <span className="kbd">K</span>
          <span className="ml-1 text-[10px] text-vault-muted">Matter scope</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        {/* Sidebar */}
        <div className="col-span-3 border-r border-vault-border p-3">
          <div className="mb-3 text-[9px] font-semibold uppercase tracking-widest text-vault-muted">
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
              className={`flex items-center justify-between rounded px-2 py-1.5 text-[11px] ${
                item.active
                  ? 'bg-vault-accent/10 text-vault-accent-light'
                  : 'text-vault-text-secondary'
              }`}
            >
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
              <h4 className="text-sm font-semibold text-vault-text">Good morning, Alexandra.</h4>
              <p className="text-[10px] text-vault-muted">
                9 active matters · 3 deadlines &lt; 48h · $42,180 WIP · 11 AI actions today
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded border border-vault-gold/25 bg-vault-gold/5 px-2 py-1">
              <Shield className="h-2.5 w-2.5 text-vault-gold" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-vault-gold">
                Privileged
              </span>
            </div>
          </div>

          {/* Stat row */}
          <div className="mb-3 grid grid-cols-4 gap-2">
            {[
              { label: 'Matters', value: '142', icon: Briefcase, trend: '+8' },
              { label: 'Intake', value: '17', icon: FileText, trend: '4 new' },
              { label: 'Deadlines', value: '3', icon: AlertTriangle, trend: '< 48h', danger: true },
              { label: 'WIP', value: '$42.1k', icon: Clock, trend: 'Draft' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded border border-vault-border bg-vault-elevated p-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-wider text-vault-muted">
                    {s.label}
                  </span>
                  <s.icon className="h-2.5 w-2.5 text-vault-muted" />
                </div>
                <div className="mt-1 font-display text-base font-semibold text-vault-text">
                  {s.value}
                </div>
                <div
                  className={`mt-0.5 text-[9px] ${
                    s.danger ? 'text-vault-danger' : 'text-vault-text-secondary'
                  }`}
                >
                  {s.trend}
                </div>
              </div>
            ))}
          </div>

          {/* Matters table */}
          <div className="mb-3 rounded border border-vault-border bg-vault-surface">
            <div className="flex items-center justify-between border-b border-vault-border px-3 py-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-vault-text">
                Matters in motion
              </span>
              <span className="text-[9px] text-vault-muted">Last activity</span>
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
                    className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                      m.risk === 'HIGH'
                        ? 'bg-vault-danger/15 text-vault-danger'
                        : m.risk === 'MED'
                        ? 'bg-vault-warning/15 text-vault-warning'
                        : 'bg-vault-success/15 text-vault-success'
                    }`}
                  >
                    {m.risk}
                  </span>
                  <span className="font-mono text-[9px] text-vault-faint">{m.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Ledger */}
          <div className="rounded border border-vault-border bg-vault-surface">
            <div className="flex items-center justify-between border-b border-vault-border px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <Bot className="h-2.5 w-2.5 text-vault-gold" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-vault-text">
                  AI Activity Ledger
                </span>
              </div>
              <span className="font-mono text-[9px] text-vault-muted">SIGNED · IMMUTABLE</span>
            </div>
            <div className="divide-y divide-vault-border/60">
              {[
                { a: 'Draft · Discovery request', m: 'M-2026-0142', r: 'A. Pell', s: 'approved' },
                { a: 'Extract · Obligations', m: 'M-2026-0128', r: 'Pending', s: 'pending' },
                { a: 'Summarize · Production batch 03', m: 'M-2026-0117', r: 'J. Okafor', s: 'approved' },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-1.5">
                  {row.s === 'approved' ? (
                    <CheckCircle2 className="h-2.5 w-2.5 text-vault-success" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-vault-warning animate-pulse" />
                  )}
                  <span className="flex-1 text-[10px] text-vault-text">{row.a}</span>
                  <span className="font-mono text-[9px] text-vault-muted">{row.m}</span>
                  <span className="text-[9px] text-vault-text-secondary">{row.r}</span>
                  <span className="font-mono text-[9px] text-vault-faint">0x{Math.random().toString(16).slice(2, 8)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
