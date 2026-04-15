'use client'
export const dynamic = 'force-dynamic'

import React, { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  ChevronUp,
  ChevronDown,
  X,
  FileText,
  Clock,
  CalendarDays,
  Brain,
  Folder,
} from 'lucide-react'

// ── Mock data ────────────────────────────────────────────────────────────────

const MATTERS = [
  { id: '1',  number: 'MCL-2024-001', name: 'Okafor v. Meridian Health Systems',          client: 'James Okafor',       area: 'Personal Injury',   attorney: 'Sarah Morrison', status: 'URGENT',  opened: '2024-01-15', billed: 186500, hours: 124.5 },
  { id: '2',  number: 'MCL-2024-002', name: 'Chen Family Trust Restructuring',             client: 'Linda Chen',         area: 'Estate Planning',   attorney: 'Thomas Chen',    status: 'ACTIVE',  opened: '2024-01-22', billed: 28500,  hours: 38.0  },
  { id: '3',  number: 'MCL-2024-003', name: 'Morrison Realty Portfolio Acquisition',       client: 'Morrison Group LLC', area: 'Real Estate',       attorney: 'Sarah Morrison', status: 'ACTIVE',  opened: '2024-02-01', billed: 84200,  hours: 67.5  },
  { id: '4',  number: 'MCL-2024-004', name: 'State v. Williams — Drug Charges',            client: 'D. Williams',        area: 'Criminal Defense',  attorney: 'James Rowe',     status: 'ACTIVE',  opened: '2024-02-10', billed: 124000, hours: 89.0  },
  { id: '5',  number: 'MCL-2024-005', name: 'Nguyen v. Nguyen — Dissolution',              client: 'Michelle Nguyen',    area: 'Family Law',        attorney: 'Amy Kim',        status: 'ACTIVE',  opened: '2024-02-14', billed: 38500,  hours: 45.5  },
  { id: '6',  number: 'MCL-2024-006', name: 'TechVentures IP Portfolio Defense',           client: 'TechVentures Inc.',  area: 'IP/Patent',         attorney: 'Thomas Chen',    status: 'ACTIVE',  opened: '2024-02-20', billed: 245000, hours: 156.0 },
  { id: '7',  number: 'MCL-2024-007', name: 'Alvarez v. Riverside Retail — Slip & Fall',  client: 'Rosa Alvarez',       area: 'Personal Injury',   attorney: 'Sarah Morrison', status: 'ACTIVE',  opened: '2024-03-01', billed: 42500,  hours: 52.0  },
  { id: '8',  number: 'MCL-2024-008', name: 'H-1B Renewal — Park / Apex Corp',            client: 'Jin-Su Park',        area: 'Immigration',       attorney: 'Amy Kim',        status: 'PENDING', opened: '2024-03-05', billed: 8500,   hours: 12.0  },
  { id: '9',  number: 'MCL-2024-009', name: 'Rodriguez Business Formation',               client: 'Maria Rodriguez',    area: 'Corporate',         attorney: 'Thomas Chen',    status: 'ACTIVE',  opened: '2024-03-10', billed: 15000,  hours: 18.5  },
  { id: '10', number: 'MCL-2024-010', name: 'Estate of Harold Kim — Probate',             client: 'Kim Family',         area: 'Estate Planning',   attorney: 'James Rowe',     status: 'ACTIVE',  opened: '2024-03-15', billed: 32000,  hours: 28.0  },
  { id: '11', number: 'MCL-2024-011', name: 'Washington v. City of Riverside',            client: 'T. Washington',      area: 'Civil Litigation',  attorney: 'Sarah Morrison', status: 'ACTIVE',  opened: '2024-03-20', billed: 68500,  hours: 74.0  },
  { id: '12', number: 'MCL-2024-012', name: 'Sunrise Apartments Eviction — Unit 12',      client: 'Sunrise Properties', area: 'Real Estate',       attorney: 'James Rowe',     status: 'CLOSED',  opened: '2024-01-10', billed: 5500,   hours: 8.0   },
  { id: '13', number: 'MCL-2024-013', name: 'Davidson Employment Dispute',                client: 'Carl Davidson',      area: 'Employment',        attorney: 'Amy Kim',        status: 'PENDING', opened: '2024-04-01', billed: 12000,  hours: 14.5  },
  { id: '14', number: 'MCL-2024-014', name: 'Patel Green Card — EB-2',                    client: 'Priya Patel',        area: 'Immigration',       attorney: 'Amy Kim',        status: 'ACTIVE',  opened: '2024-04-05', billed: 6800,   hours: 9.0   },
  { id: '15', number: 'MCL-2024-015', name: 'Chen v. Former Employer — Wrongful Term.',   client: 'David Chen',         area: 'Employment',        attorney: 'Amy Kim',        status: 'ACTIVE',  opened: '2024-04-08', billed: 18500,  hours: 22.0  },
]

type Matter = typeof MATTERS[number]
type SortKey = keyof Matter
type FilterTab = 'ALL' | 'ACTIVE' | 'PENDING' | 'CLOSED' | 'URGENT'

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatusPill({ status }: { status: string }) {
  const cls: Record<string, string> = {
    URGENT:  'bg-vault-danger/15 text-vault-danger border border-vault-danger/25',
    ACTIVE:  'bg-vault-accent/15 text-[#4A9DD4]   border border-vault-accent/25',
    PENDING: 'bg-vault-warning/15 text-vault-warning border border-vault-warning/25',
    CLOSED:  'bg-vault-muted/20 text-vault-muted   border border-vault-muted/25',
  }
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-2xs font-semibold uppercase tracking-wide ${cls[status] ?? cls.CLOSED}`}>
      {status}
    </span>
  )
}

// ── Mock activity & documents for detail panel ───────────────────────────────

const MOCK_ACTIVITY = [
  { label: 'Document uploaded',       detail: 'Medical records batch',        time: '2h ago' },
  { label: 'AI Research query',        detail: 'Case law on damages caps',     time: '4h ago' },
  { label: 'Time entry added',         detail: '2.5h — Deposition prep',       time: 'Yesterday' },
  { label: 'Note added',               detail: 'Client briefing notes',        time: '2d ago' },
  { label: 'Email sent to client',     detail: 'Status update — damages est.', time: '3d ago' },
]

const MOCK_DOCUMENTS = [
  { name: 'Complaint — Filed.pdf',            size: '284 KB', date: 'Jan 16, 2024' },
  { name: 'Medical Records — Batch 1.pdf',    size: '4.2 MB', date: 'Feb 2, 2024'  },
  { name: 'Demand Letter — Draft 2.docx',     size: '56 KB',  date: 'Mar 4, 2024'  },
  { name: 'Deposition Transcript — Okafor.pdf', size: '1.1 MB', date: 'Mar 20, 2024' },
  { name: 'Expert Report — Damages.pdf',      size: '780 KB', date: 'Apr 5, 2024'  },
]

const MOCK_TIMELINE = [
  { date: 'Apr 10, 2024', event: 'Motion for Summary Judgment filed', type: 'filing'   },
  { date: 'Mar 20, 2024', event: 'Deposition of J. Okafor completed', type: 'depo'     },
  { date: 'Mar 4,  2024', event: 'Demand letter sent to defendant',   type: 'letter'   },
  { date: 'Feb 28, 2024', event: 'Expert witness retained',            type: 'retainer' },
  { date: 'Feb 10, 2024', event: 'Discovery requests served',          type: 'discovery'},
  { date: 'Jan 30, 2024', event: 'Defendant answered complaint',       type: 'filing'   },
  { date: 'Jan 16, 2024', event: 'Complaint filed — Superior Court',   type: 'filing'   },
  { date: 'Jan 15, 2024', event: 'Matter opened',                      type: 'open'     },
]

const MOCK_AI_HISTORY = [
  { query: 'What is the statute of limitations for personal injury in CA?', result: '2 years per CCP § 335.1', time: 'Apr 10 · 2:14 PM' },
  { query: 'Summarize Exhibit 12 — medical records',                        result: 'Generated 3-page summary', time: 'Mar 22 · 10:05 AM' },
  { query: 'Draft demand letter for Okafor v. Meridian',                    result: 'Draft generated, 1,240 words', time: 'Mar 4 · 9:30 AM' },
  { query: 'Find cases on lost wages damages calculation',                  result: '14 cases found, 6 highlighted', time: 'Feb 15 · 3:45 PM' },
]

// ── Detail panel tabs ─────────────────────────────────────────────────────────
type DetailTab = 'overview' | 'documents' | 'timeline' | 'ai'

function DetailPanel({ matter, onClose }: { matter: Matter; onClose: () => void }) {
  const [tab, setTab] = useState<DetailTab>('overview')

  const tabs: { key: DetailTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview',   label: 'Overview',   icon: <FileText className="h-3.5 w-3.5" /> },
    { key: 'documents',  label: 'Documents',  icon: <Folder className="h-3.5 w-3.5" /> },
    { key: 'timeline',   label: 'Timeline',   icon: <CalendarDays className="h-3.5 w-3.5" /> },
    { key: 'ai',         label: 'AI History', icon: <Brain className="h-3.5 w-3.5" /> },
  ]

  return (
    <div className="absolute inset-y-0 right-0 w-[480px] bg-vault-surface border-l border-vault-border flex flex-col animate-slide-in-right z-20 shadow-vault-lg">
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-4 border-b border-vault-border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-serif text-lg font-bold text-vault-text leading-tight">{matter.name}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-mono text-vault-muted">{matter.number}</span>
              <StatusPill status={matter.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded p-1.5 text-vault-muted hover:text-vault-text hover:bg-vault-elevated transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 mt-4">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                tab === key
                  ? 'bg-vault-elevated text-vault-text border border-vault-border'
                  : 'text-vault-muted hover:text-vault-text-secondary hover:bg-vault-elevated/50'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-5">
            {/* Mini stat row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="vault-elevated p-3 rounded-lg text-center">
                <p className="text-2xs text-vault-muted uppercase tracking-wider">Total Billed</p>
                <p className="font-serif text-base font-bold text-vault-gold mt-0.5">{fmtCurrency(matter.billed)}</p>
              </div>
              <div className="vault-elevated p-3 rounded-lg text-center">
                <p className="text-2xs text-vault-muted uppercase tracking-wider">Hours Logged</p>
                <p className="font-serif text-base font-bold text-vault-text mt-0.5">{matter.hours}h</p>
              </div>
              <div className="vault-elevated p-3 rounded-lg text-center">
                <p className="text-2xs text-vault-muted uppercase tracking-wider">Status</p>
                <div className="mt-1 flex justify-center"><StatusPill status={matter.status} /></div>
              </div>
            </div>

            {/* Key Facts */}
            <div className="vault-elevated p-4 rounded-lg space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-vault-muted mb-3">Key Facts</h3>
              {[
                { label: 'Client',         value: matter.client },
                { label: 'Practice Area',  value: matter.area },
                { label: 'Lead Attorney',  value: matter.attorney },
                { label: 'Opened',         value: fmtDate(matter.opened) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-vault-muted">{label}</span>
                  <span className="text-xs font-medium text-vault-text">{value}</span>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-vault-muted mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {MOCK_ACTIVITY.map((act, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-vault-accent shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-vault-text">{act.label}</p>
                      <p className="text-2xs text-vault-muted">{act.detail}</p>
                    </div>
                    <span className="text-2xs text-vault-muted shrink-0">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {tab === 'documents' && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-vault-muted mb-3">Documents</h3>
            {MOCK_DOCUMENTS.map((doc, i) => (
              <div key={i} className="flex items-center gap-3 vault-elevated rounded-lg px-3 py-2.5 hover:bg-vault-border/20 transition-colors cursor-pointer">
                <FileText className="h-4 w-4 text-vault-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-vault-text truncate">{doc.name}</p>
                  <p className="text-2xs text-vault-muted">{doc.size} · {doc.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TIMELINE TAB */}
        {tab === 'timeline' && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-vault-muted mb-4">Matter Timeline</h3>
            <div className="relative pl-5">
              {/* Vertical line */}
              <div className="absolute left-1.5 top-0 bottom-0 w-px bg-vault-border" />
              <div className="space-y-5">
                {MOCK_TIMELINE.map((ev, i) => (
                  <div key={i} className="relative flex gap-4">
                    <div className="absolute -left-5 mt-1 h-3 w-3 rounded-full border-2 border-vault-accent bg-vault-surface shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-vault-text">{ev.event}</p>
                      <p className="text-2xs text-vault-muted mt-0.5">{ev.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI HISTORY TAB */}
        {tab === 'ai' && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-vault-muted mb-4">AI Query History</h3>
            <div className="space-y-4">
              {MOCK_AI_HISTORY.map((item, i) => (
                <div key={i} className="vault-elevated rounded-lg p-3 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <Brain className="h-3.5 w-3.5 text-vault-gold mt-0.5 shrink-0" />
                    <p className="text-xs font-medium text-vault-text leading-snug">{item.query}</p>
                  </div>
                  <p className="text-2xs text-vault-success pl-5">{item.result}</p>
                  <p className="text-2xs text-vault-muted pl-5">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function MattersPage() {
  const [search, setSearch] = useState('')
  const [filterTab, setFilterTab] = useState<FilterTab>('ALL')
  const [sortKey, setSortKey] = useState<SortKey>('opened')
  const [sortAsc, setSortAsc] = useState(false)
  const [selected, setSelected] = useState<Matter | null>(null)

  const filtered = useMemo(() => {
    let rows = [...MATTERS]

    // Filter by tab
    if (filterTab !== 'ALL') {
      rows = rows.filter((m) => m.status === filterTab)
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.client.toLowerCase().includes(q) ||
          m.number.toLowerCase().includes(q) ||
          m.area.toLowerCase().includes(q) ||
          m.attorney.toLowerCase().includes(q)
      )
    }

    // Sort
    rows.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv))
      return sortAsc ? cmp : -cmp
    })

    return rows
  }, [search, filterTab, sortKey, sortAsc])

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((a) => !a)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronDown className="h-3 w-3 opacity-30" />
    return sortAsc ? <ChevronUp className="h-3 w-3 text-vault-gold" /> : <ChevronDown className="h-3 w-3 text-vault-gold" />
  }

  const filterTabs: FilterTab[] = ['ALL', 'ACTIVE', 'PENDING', 'CLOSED', 'URGENT']
  const tabCounts: Record<FilterTab, number> = {
    ALL:     MATTERS.length,
    ACTIVE:  MATTERS.filter((m) => m.status === 'ACTIVE').length,
    PENDING: MATTERS.filter((m) => m.status === 'PENDING').length,
    CLOSED:  MATTERS.filter((m) => m.status === 'CLOSED').length,
    URGENT:  MATTERS.filter((m) => m.status === 'URGENT').length,
  }

  return (
    <div className="flex flex-col h-full gap-5 animate-fade-in relative">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-vault-text">Matters</h1>
          <p className="text-sm text-vault-text-secondary mt-0.5">
            {filtered.length} of {MATTERS.length} matter{MATTERS.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-gold">
          <Plus className="h-4 w-4" />
          New Matter
        </button>
      </div>

      {/* Search + filter pills */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-vault-muted pointer-events-none" />
          <input
            className="vault-input pl-9"
            placeholder="Search matters, clients, attorneys…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-1.5">
          {filterTabs.map((ft) => (
            <button
              key={ft}
              onClick={() => setFilterTab(ft)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterTab === ft
                  ? 'bg-vault-gold text-vault-bg shadow-vault-gold-glow'
                  : 'bg-vault-elevated border border-vault-border text-vault-text-secondary hover:text-vault-text hover:border-vault-border-strong'
              }`}
            >
              {ft === 'ALL' ? 'All' : ft.charAt(0) + ft.slice(1).toLowerCase()}
              <span className={`rounded-full px-1 py-0.5 text-2xs leading-none ${
                filterTab === ft ? 'bg-vault-bg/20 text-vault-bg' : 'bg-vault-border text-vault-muted'
              }`}>
                {tabCounts[ft]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table wrapper — relative so slide panel can be positioned */}
      <div className="relative flex-1 vault-panel p-0 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto h-full">
          <table className="data-table">
            <thead className="sticky top-0 z-10 bg-vault-surface">
              <tr>
                {(
                  [
                    { key: 'number', label: 'Matter #' },
                    { key: 'name', label: 'Matter Name' },
                    { key: 'client', label: 'Client' },
                    { key: 'area', label: 'Practice Area' },
                    { key: 'attorney', label: 'Lead Attorney' },
                    { key: 'status', label: 'Status' },
                    { key: 'opened', label: 'Opened' },
                    { key: 'billed', label: 'Billed $' },
                    { key: 'hours', label: 'Hours' },
                  ] as { key: SortKey; label: string }[]
                ).map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="cursor-pointer select-none"
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      <SortIcon col={key} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-vault-text-secondary">
                    No matters match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((m, i) => (
                  <tr
                    key={m.id}
                    onClick={() => setSelected(m.id === selected?.id ? null : m)}
                    className={`${i % 2 !== 0 ? 'bg-vault-elevated/20' : ''} ${
                      selected?.id === m.id ? '!bg-vault-gold/8 border-l-2 border-vault-gold' : ''
                    }`}
                  >
                    <td>
                      <span className="text-xs font-mono text-vault-muted">{m.number}</span>
                    </td>
                    <td>
                      <span className="font-medium text-vault-text text-sm">{m.name}</span>
                    </td>
                    <td className="text-vault-text-secondary text-sm">{m.client}</td>
                    <td>
                      <span className="text-xs text-vault-muted">{m.area}</span>
                    </td>
                    <td className="text-vault-text-secondary text-sm">{m.attorney}</td>
                    <td><StatusPill status={m.status} /></td>
                    <td className="text-vault-muted text-xs">{fmtDate(m.opened)}</td>
                    <td>
                      <span className="font-mono text-sm text-vault-text">{fmtCurrency(m.billed)}</span>
                    </td>
                    <td>
                      <span className="font-mono text-sm text-vault-text-secondary">{m.hours.toFixed(1)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Slide-in detail panel */}
        {selected && (
          <>
            {/* Overlay to close */}
            <div
              className="absolute inset-0 z-10 bg-vault-bg/40"
              onClick={() => setSelected(null)}
            />
            <DetailPanel matter={selected} onClose={() => setSelected(null)} />
          </>
        )}
      </div>
    </div>
  )
}
