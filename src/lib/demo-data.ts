/**
 * Demo fixtures used when the logged-in user is the demo admin (firmId === 'demo-firm')
 * or when the live database is unavailable. All shapes are hand-rolled — they do NOT
 * need to match Prisma exactly, they just need to render the dashboard.
 *
 * Every fixture is keyed around the six differentiators:
 *   1. Matter Command Center
 *   2. Private AI Paralegal
 *   3. Deadline Engine
 *   4. Privilege Log (auto-tagged)
 *   5. Intelligence Feed
 *   6. Conflict Check
 */

export type DemoRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type DemoMatterStatus = 'ACTIVE' | 'INTAKE' | 'CLOSED' | 'PENDING'

export interface DemoMatter {
  id: string
  number: string
  name: string
  client: string
  practice: 'Litigation' | 'Corporate' | 'Private Client' | 'Regulatory' | 'Investigations'
  status: DemoMatterStatus
  risk: DemoRisk
  attorney: string
  lastActivity: string // relative time string
  deadlineCount: number
  unreadFilings: number
  aiFlags: number
  openBalance: number
}

export const demoMatters: DemoMatter[] = [
  {
    id: 'm-0142',
    number: 'M-2026-0142',
    name: 'Roth v. Aventra Capital',
    client: 'Roth Family Trust',
    practice: 'Litigation',
    status: 'ACTIVE',
    risk: 'HIGH',
    attorney: 'Margaret Hartley',
    lastActivity: '14 min ago',
    deadlineCount: 3,
    unreadFilings: 2,
    aiFlags: 4,
    openBalance: 184_250,
  },
  {
    id: 'm-0128',
    number: 'M-2026-0128',
    name: 'Harrington Estate — Trust Contest',
    client: 'Estate of C. Harrington',
    practice: 'Private Client',
    status: 'ACTIVE',
    risk: 'MEDIUM',
    attorney: 'Sofia Reyes',
    lastActivity: '1 hr ago',
    deadlineCount: 2,
    unreadFilings: 0,
    aiFlags: 1,
    openBalance: 92_400,
  },
  {
    id: 'm-0117',
    number: 'M-2026-0117',
    name: 'Meridian Acquisition — Phase II Diligence',
    client: 'Meridian Holdings, Inc.',
    practice: 'Corporate',
    status: 'ACTIVE',
    risk: 'LOW',
    attorney: 'Jonathan Chan',
    lastActivity: '3 hr ago',
    deadlineCount: 1,
    unreadFilings: 0,
    aiFlags: 0,
    openBalance: 312_800,
  },
  {
    id: 'm-0109',
    number: 'M-2026-0109',
    name: 'Nexovance — SEC Inquiry Response',
    client: 'Nexovance Technologies',
    practice: 'Regulatory',
    status: 'ACTIVE',
    risk: 'CRITICAL',
    attorney: 'Margaret Hartley',
    lastActivity: '22 min ago',
    deadlineCount: 5,
    unreadFilings: 7,
    aiFlags: 12,
    openBalance: 428_100,
  },
  {
    id: 'm-0101',
    number: 'M-2026-0101',
    name: 'Alderton Capital — Internal Investigation',
    client: 'Alderton Capital Management',
    practice: 'Investigations',
    status: 'ACTIVE',
    risk: 'HIGH',
    attorney: 'Dev Patel',
    lastActivity: '6 hr ago',
    deadlineCount: 2,
    unreadFilings: 1,
    aiFlags: 3,
    openBalance: 247_600,
  },
  {
    id: 'm-0094',
    number: 'M-2026-0094',
    name: 'Marchetti Family Office — Succession Plan',
    client: 'Marchetti Family Office',
    practice: 'Private Client',
    status: 'ACTIVE',
    risk: 'LOW',
    attorney: 'Sofia Reyes',
    lastActivity: '1 day ago',
    deadlineCount: 1,
    unreadFilings: 0,
    aiFlags: 0,
    openBalance: 58_900,
  },
  {
    id: 'm-0087',
    number: 'M-2026-0087',
    name: 'Pinnacle Therapeutics — Series C',
    client: 'Pinnacle Therapeutics',
    practice: 'Corporate',
    status: 'ACTIVE',
    risk: 'MEDIUM',
    attorney: 'Jonathan Chan',
    lastActivity: '2 days ago',
    deadlineCount: 2,
    unreadFilings: 0,
    aiFlags: 2,
    openBalance: 176_400,
  },
  {
    id: 'm-0076',
    number: 'M-2026-0076',
    name: 'Blackrock Dispute — Vendor Breach',
    client: 'Blackrock Hospitality Group',
    practice: 'Litigation',
    status: 'ACTIVE',
    risk: 'MEDIUM',
    attorney: 'Amy Lee',
    lastActivity: '4 hr ago',
    deadlineCount: 3,
    unreadFilings: 1,
    aiFlags: 1,
    openBalance: 89_300,
  },
]

// ── Deadline Engine ─────────────────────────────────────────────────
export interface DemoDeadline {
  id: string
  title: string
  matter: string
  matterNumber: string
  due: string // display-ready relative time
  dueISO: string // absolute (for sorting)
  jurisdiction: string
  source: 'Fed. R. Civ. P.' | 'State Court Rule' | 'Statute' | 'Contract' | 'Court Order'
  rule: string
  computed: boolean // whether this was auto-computed by Deadline Engine
  cascadeOf?: string // the parent event that triggered this deadline
  urgency: 'overdue' | 'imminent' | 'soon' | 'routine'
}

export const demoDeadlines: DemoDeadline[] = [
  {
    id: 'd-1',
    title: 'SEC Wells response — supplemental',
    matter: 'Nexovance — SEC Inquiry Response',
    matterNumber: 'M-2026-0109',
    due: 'in 18 hours',
    dueISO: '2026-04-25T09:00:00Z',
    jurisdiction: 'S.D.N.Y.',
    source: 'Court Order',
    rule: 'Dkt. 47',
    computed: false,
    urgency: 'imminent',
  },
  {
    id: 'd-2',
    title: 'Answer to amended complaint',
    matter: 'Roth v. Aventra Capital',
    matterNumber: 'M-2026-0142',
    due: 'in 4 days',
    dueISO: '2026-04-28T00:00:00Z',
    jurisdiction: 'S.D.N.Y.',
    source: 'Fed. R. Civ. P.',
    rule: 'Rule 15(a)(3)',
    computed: true,
    cascadeOf: 'Amended complaint served 4/7',
    urgency: 'soon',
  },
  {
    id: 'd-3',
    title: 'Motion-to-dismiss window opens',
    matter: 'Roth v. Aventra Capital',
    matterNumber: 'M-2026-0142',
    due: 'in 4 days',
    dueISO: '2026-04-28T00:00:00Z',
    jurisdiction: 'S.D.N.Y.',
    source: 'Fed. R. Civ. P.',
    rule: 'Rule 12(b)',
    computed: true,
    cascadeOf: 'Answer due 4/28',
    urgency: 'soon',
  },
  {
    id: 'd-4',
    title: 'Rule 26(a) initial disclosures',
    matter: 'Blackrock Dispute — Vendor Breach',
    matterNumber: 'M-2026-0076',
    due: 'in 7 days',
    dueISO: '2026-05-01T00:00:00Z',
    jurisdiction: 'D. Mass.',
    source: 'Fed. R. Civ. P.',
    rule: 'Rule 26(a)(1)',
    computed: true,
    cascadeOf: 'Rule 26(f) conference 4/17',
    urgency: 'soon',
  },
  {
    id: 'd-5',
    title: 'Statute of limitations — breach claim',
    matter: 'Harrington Estate — Trust Contest',
    matterNumber: 'M-2026-0128',
    due: 'in 11 days',
    dueISO: '2026-05-05T00:00:00Z',
    jurisdiction: 'N.Y. Surrogate',
    source: 'Statute',
    rule: 'EPTL § 11-1.1',
    computed: false,
    urgency: 'routine',
  },
  {
    id: 'd-6',
    title: 'Series C closing target',
    matter: 'Pinnacle Therapeutics — Series C',
    matterNumber: 'M-2026-0087',
    due: 'in 14 days',
    dueISO: '2026-05-08T00:00:00Z',
    jurisdiction: 'DE',
    source: 'Contract',
    rule: 'SPA § 2.3',
    computed: false,
    urgency: 'routine',
  },
]

// ── AI Paralegal (recent queries + citations) ───────────────────────
export interface DemoAIQuery {
  id: string
  question: string
  matter: string
  matterNumber: string
  answer: string
  citations: { doc: string; page: string; bates?: string }[]
  model: string
  askedBy: string
  askedAt: string
  status: 'signed' | 'pending_review' | 'draft'
  reviewer?: string
}

export const demoAIQueries: DemoAIQuery[] = [
  {
    id: 'q-1',
    question: 'Summarize the indemnification carve-outs in the most recent draft of the Meridian SPA.',
    matter: 'Meridian Acquisition — Phase II Diligence',
    matterNumber: 'M-2026-0117',
    answer:
      'Three carve-outs survive indemnity cap under § 9.3(b): (i) fundamental reps, (ii) fraud or intentional misrepresentation, and (iii) tax reps through statute of limitations. Cap is 15% of purchase price with a 0.25% de minimis threshold. The Tipper/Xenon precedent does not change this structure.',
    citations: [
      { doc: 'SPA_v7_clean.pdf', page: '§ 9.3(b)', bates: 'MER-0004217' },
      { doc: 'Tipper v. Xenon (DE Ch. 2023)', page: 'at *12' },
      { doc: 'Diligence memo 04/18', page: 'p. 6' },
    ],
    model: 'vault-legal-7b · pinned to matter',
    askedBy: 'Jonathan Chan',
    askedAt: '23 min ago',
    status: 'signed',
    reviewer: 'J. Chan',
  },
  {
    id: 'q-2',
    question: 'Build a chronology of the Aventra board communications cited in the amended complaint.',
    matter: 'Roth v. Aventra Capital',
    matterNumber: 'M-2026-0142',
    answer:
      '17 communications identified between 11/14/2024 and 3/22/2026 — 6 likely privileged (counsel in-line), 9 business-only, 2 ambiguous (flagged for attorney review). Timeline exported to matter workspace.',
    citations: [
      { doc: 'Amended Complaint', page: '¶¶ 42–61' },
      { doc: 'AVT_PROD_001', page: '347 docs', bates: 'AVT-0003210 — 0003557' },
    ],
    model: 'vault-legal-7b · pinned to matter',
    askedBy: 'Margaret Hartley',
    askedAt: '1 hr ago',
    status: 'pending_review',
  },
  {
    id: 'q-3',
    question: 'Draft a deficiency letter re: SEC Wells notice paragraph 14.',
    matter: 'Nexovance — SEC Inquiry Response',
    matterNumber: 'M-2026-0109',
    answer:
      'Draft prepared (3 pp.). Argues (i) the characterization in ¶ 14 conflates two materially distinct transactions, (ii) the factual record in prod. batches 03–05 contradicts the Staff\'s inference, and (iii) requests 30-day meet-and-confer before any formal action.',
    citations: [
      { doc: 'Wells Notice 04/14', page: '¶ 14' },
      { doc: 'NXV Prod. batch 03', page: 'summary p. 2' },
      { doc: 'NXV Prod. batch 05', page: 'summary p. 1' },
    ],
    model: 'vault-legal-7b · pinned to matter',
    askedBy: 'Margaret Hartley',
    askedAt: '3 hr ago',
    status: 'draft',
  },
]

// ── Privilege Log (auto-tagged) ─────────────────────────────────────
export interface DemoPrivilegeEntry {
  id: string
  doc: string
  matter: string
  matterNumber: string
  classification: 'Attorney-Client' | 'Work Product' | 'Common Interest' | 'Not Privileged' | 'Needs Review'
  confidence: number // 0–100
  basis: string
  ingestedAt: string
  pages: number
}

export const demoPrivilegeEntries: DemoPrivilegeEntry[] = [
  {
    id: 'p-1',
    doc: 'Board email chain — Aventra, 3/22/2026',
    matter: 'Roth v. Aventra Capital',
    matterNumber: 'M-2026-0142',
    classification: 'Attorney-Client',
    confidence: 96,
    basis: 'Kirkland counsel on CC line; seeks legal advice on disclosure obligation',
    ingestedAt: '8 min ago',
    pages: 4,
  },
  {
    id: 'p-2',
    doc: 'Litigation hold memo draft v3',
    matter: 'Nexovance — SEC Inquiry Response',
    matterNumber: 'M-2026-0109',
    classification: 'Work Product',
    confidence: 99,
    basis: 'Prepared in anticipation of litigation by outside counsel',
    ingestedAt: '22 min ago',
    pages: 12,
  },
  {
    id: 'p-3',
    doc: 'Co-defendant JDA — Alderton',
    matter: 'Alderton Capital — Internal Investigation',
    matterNumber: 'M-2026-0101',
    classification: 'Common Interest',
    confidence: 88,
    basis: 'Joint defense agreement executed 2/11; shared strategy memo',
    ingestedAt: '1 hr ago',
    pages: 3,
  },
  {
    id: 'p-4',
    doc: 'Closing checklist — Meridian Phase II',
    matter: 'Meridian Acquisition — Phase II Diligence',
    matterNumber: 'M-2026-0117',
    classification: 'Not Privileged',
    confidence: 97,
    basis: 'Administrative document; no legal advice content',
    ingestedAt: '2 hr ago',
    pages: 2,
  },
  {
    id: 'p-5',
    doc: 'Hartley memo re: settlement valuation',
    matter: 'Blackrock Dispute — Vendor Breach',
    matterNumber: 'M-2026-0076',
    classification: 'Needs Review',
    confidence: 62,
    basis: 'Dual-purpose communication — business + legal analysis interleaved',
    ingestedAt: '3 hr ago',
    pages: 6,
  },
]

// ── Intelligence Feed (Bloomberg-style ticker) ──────────────────────
export interface DemoFeedItem {
  id: string
  kind: 'filing' | 'opposing' | 'docket' | 'regulatory' | 'deadline' | 'ai'
  headline: string
  matter: string
  matterNumber: string
  at: string
  severity: 'info' | 'notable' | 'urgent'
}

export const demoFeedItems: DemoFeedItem[] = [
  {
    id: 'f-1',
    kind: 'filing',
    headline: 'New filing · Opposing counsel · MTD reply brief (23 pp.)',
    matter: 'Roth v. Aventra Capital',
    matterNumber: 'M-2026-0142',
    at: '6 min ago',
    severity: 'urgent',
  },
  {
    id: 'f-2',
    kind: 'ai',
    headline: 'AI flagged · Potential privilege conflict in Aventra prod. batch 07',
    matter: 'Roth v. Aventra Capital',
    matterNumber: 'M-2026-0142',
    at: '18 min ago',
    severity: 'notable',
  },
  {
    id: 'f-3',
    kind: 'docket',
    headline: 'Docket update · Nexovance · Staff request for supplemental response',
    matter: 'Nexovance — SEC Inquiry Response',
    matterNumber: 'M-2026-0109',
    at: '42 min ago',
    severity: 'urgent',
  },
  {
    id: 'f-4',
    kind: 'regulatory',
    headline: 'Reg. update · SEC Rule 10b5-1 amendment guidance released',
    matter: 'Cross-matter',
    matterNumber: '—',
    at: '1 hr ago',
    severity: 'notable',
  },
  {
    id: 'f-5',
    kind: 'opposing',
    headline: 'Opposing counsel switch · Blackrock now represented by Latham',
    matter: 'Blackrock Dispute — Vendor Breach',
    matterNumber: 'M-2026-0076',
    at: '2 hr ago',
    severity: 'notable',
  },
  {
    id: 'f-6',
    kind: 'deadline',
    headline: 'Deadline cascade · MTD window opens on 4/28 triggered by complaint service',
    matter: 'Roth v. Aventra Capital',
    matterNumber: 'M-2026-0142',
    at: '3 hr ago',
    severity: 'info',
  },
  {
    id: 'f-7',
    kind: 'filing',
    headline: 'New filing · Harrington · Objection to probate filed by remainderman',
    matter: 'Harrington Estate — Trust Contest',
    matterNumber: 'M-2026-0128',
    at: '4 hr ago',
    severity: 'notable',
  },
]

// ── Conflict Check (recent queries + scored results) ────────────────
export interface DemoConflictHit {
  id: string
  entity: string
  type: 'Party' | 'Counsel' | 'Related Entity' | 'Witness' | 'Vendor'
  historicalMatter: string
  role: string
  confidence: number
  resolution: 'cleared' | 'waived' | 'screened' | 'pending'
  flaggedAt: string
}

export const demoConflictHits: DemoConflictHit[] = [
  {
    id: 'c-1',
    entity: 'Aventra Capital Partners, LLC',
    type: 'Related Entity',
    historicalMatter: 'M-2024-0418 — Aventra Fund II formation',
    role: 'Client (2024)',
    confidence: 94,
    resolution: 'waived',
    flaggedAt: '2 days ago',
  },
  {
    id: 'c-2',
    entity: 'Latham & Watkins LLP',
    type: 'Counsel',
    historicalMatter: 'M-2025-0207 — Co-counsel in Titan v. Ericson',
    role: 'Co-counsel',
    confidence: 72,
    resolution: 'cleared',
    flaggedAt: '2 days ago',
  },
  {
    id: 'c-3',
    entity: 'Pinnacle Therapeutics Board — R. Okonkwo',
    type: 'Witness',
    historicalMatter: 'M-2023-0910 — Okonkwo IP dispute',
    role: 'Adverse party',
    confidence: 81,
    resolution: 'screened',
    flaggedAt: '5 hr ago',
  },
]

// ── Dashboard-level aggregates ──────────────────────────────────────
export const demoStats = {
  activeMatters: demoMatters.filter((m) => m.status === 'ACTIVE').length,
  urgentDeadlines: demoDeadlines.filter((d) => d.urgency === 'imminent' || d.urgency === 'overdue').length,
  newIntake: 4,
  unbilledWip: 428_190,
  aiActionsToday: 34,
  docsIngestedToday: 1287,
}

// ── Utility: is this session a demo session? ────────────────────────
export function isDemoSession(firmId?: string | null): boolean {
  return firmId === 'demo-firm'
}
