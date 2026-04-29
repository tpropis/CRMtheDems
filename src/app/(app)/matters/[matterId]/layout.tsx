import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getDemoMatter, isDemoSession } from '@/lib/demo-data'
import { MatterTabs } from './MatterTabs'
import { formatCurrency } from '@/lib/utils'
import {
  Shield, AlertTriangle, Briefcase, Building2, Gavel, User,
  Sparkles, Calendar, FileSearch,
} from 'lucide-react'

export default async function MatterLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { matterId: string }
}) {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  // Phase 4 uses demo fixtures exclusively. Later phases will branch
  // on isDemoSession(firmId) and hit Prisma for real matters.
  void firmId
  void isDemoSession

  const matter = getDemoMatter(params.matterId)
  if (!matter) notFound()

  const riskStyle =
    matter.risk === 'CRITICAL'
      ? 'bg-vault-danger/10 text-vault-danger border-vault-danger/30'
      : matter.risk === 'HIGH'
      ? 'bg-vault-warning/10 text-vault-warning border-vault-warning/30'
      : matter.risk === 'MEDIUM'
      ? 'bg-vault-gold/10 text-vault-gold border-vault-gold/30'
      : 'bg-vault-success/10 text-vault-success border-vault-success/30'

  return (
    <div className="animate-fade-in pb-12 -mx-4 md:-mx-6 -mt-4 md:-mt-6">
      {/* Matter header band */}
      <header className="bg-vault-elevated border-b border-vault-border px-4 md:px-6 pt-5 pb-0">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] mb-3">
          <Link href="/matters" className="text-vault-text-secondary hover:text-vault-accent transition-colors">
            Matters
          </Link>
          <span className="text-vault-faint">/</span>
          <span className="font-mono text-vault-muted tabular-nums">{matter.number}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: title block */}
          <div className="lg:col-span-7 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-widest border ${riskStyle}`}
              >
                <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                {matter.risk} RISK
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border border-vault-accent/25 bg-vault-accent/8 text-vault-accent">
                <Briefcase className="h-2.5 w-2.5" />
                {matter.status}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border border-vault-gold/30 bg-vault-gold/5 text-vault-gold">
                <Shield className="h-2.5 w-2.5" />
                Sealed
              </span>
            </div>
            <h1 className="display-serif text-3xl font-medium text-vault-ink tracking-tight md:text-[32px] leading-tight">
              {matter.name}
            </h1>
            <p className="mt-2 text-[13px] text-vault-text-secondary leading-relaxed max-w-2xl">
              {matter.description}
            </p>
          </div>

          {/* Right: key meta grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[12px]">
            <MetaRow icon={Building2} label="Client" value={matter.client} />
            <MetaRow icon={User} label="Attorney" value={matter.attorney} />
            {matter.court && <MetaRow icon={Gavel} label="Court" value={matter.court} />}
            {matter.caseNumber && <MetaRow icon={Briefcase} label="Case no." value={matter.caseNumber} mono />}
            <MetaRow icon={Calendar} label="Opened" value={matter.openedAt} />
            <MetaRow
              icon={Sparkles}
              label="Open WIP"
              value={formatCurrency(matter.openBalance).replace('.00', '')}
              mono
            />
          </div>
        </div>

        {/* Live state pulses — thin bar */}
        <div className="mt-6 flex items-center gap-6 pb-0">
          <PulseStat icon={Calendar} value={matter.deadlineCount} label="Active deadlines" />
          <PulseStat icon={FileSearch} value={matter.unreadFilings} label="Unread filings" />
          <PulseStat icon={Sparkles} value={matter.aiFlags} label="AI flags" />
          <div className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            <span className="live-dot" />
            Last activity · {matter.lastActivity}
          </div>
        </div>

        {/* Tabs */}
        <MatterTabs matterId={params.matterId} />
      </header>

      {/* Page body */}
      <div className="px-4 md:px-6 pt-6">{children}</div>
    </div>
  )
}

function MetaRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon className="h-3.5 w-3.5 text-vault-muted mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-vault-faint">
          {label}
        </p>
        <p
          className={`text-[12.5px] text-vault-ink truncate ${
            mono ? 'font-mono tabular-nums' : ''
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

function PulseStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: number
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-vault-muted" />
      <span className="font-display text-[15px] font-semibold text-vault-ink tabular-nums">
        {value}
      </span>
      <span className="text-[11px] text-vault-text-secondary">{label}</span>
    </div>
  )
}
