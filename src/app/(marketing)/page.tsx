import Link from 'next/link'
import {
  Shield, Lock, Bot, FileText, Search, Database, Clock, Scale,
  ChevronRight, CheckCircle2, ArrowRight, Zap, Eye, KeyRound,
  ShieldCheck, Building2, Gavel, Users, Briefcase, Receipt,
  Calendar, MessageSquare, Server, CloudOff, FileSearch, X, Check,
  CircleDot, Fingerprint,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Seal } from '@/components/marketing/Seal'
import { SectionMark, Eyebrow } from '@/components/marketing/SectionMark'
import { DashboardMockup } from '@/components/marketing/DashboardMockup'

const PRINCIPLES = [
  {
    icon: Server,
    title: 'Sovereign Inference',
    desc: 'Runs inside your VPC, private cloud, or on-prem GPU cluster. Your keys. Your hardware. Your perimeter.',
    mark: 'I',
  },
  {
    icon: Eye,
    title: 'Matter-Scoped Context',
    desc: 'Every AI call is bounded by matter-level permissions. No cross-matter bleed. No shared vectors. Ever.',
    mark: 'II',
  },
  {
    icon: ShieldCheck,
    title: 'Reviewable Outputs',
    desc: 'Every generation is a card before it is a fact. Nothing is exported, pasted, or billed until a human signs.',
    mark: 'III',
  },
  {
    icon: Fingerprint,
    title: 'Immutable Audit',
    desc: 'Append-only, hash-chained ledger of every action. Exportable, signed, and pinned to object-lock storage.',
    mark: 'IV',
  },
]

const MODULES = [
  { icon: Briefcase, label: 'Matters' },
  { icon: FileText, label: 'Intake' },
  { icon: Scale, label: 'Conflicts' },
  { icon: Database, label: 'Documents' },
  { icon: FileSearch, label: 'Discovery' },
  { icon: Calendar, label: 'Calendar' },
  { icon: CheckCircle2, label: 'Tasks' },
  { icon: MessageSquare, label: 'Communications' },
  { icon: Clock, label: 'Time' },
  { icon: Receipt, label: 'Billing' },
  { icon: Bot, label: 'AI Operator' },
  { icon: Fingerprint, label: 'Audit' },
]

const STEPS = [
  {
    n: '01',
    title: 'Deploy inside your perimeter',
    desc: 'VPC (AWS / Azure / GCP), private cloud (GovCloud / Azure Gov), or on-prem Linux + GPU. Three real modes — not three marketing words.',
  },
  {
    n: '02',
    title: 'Connect quietly',
    desc: 'Matter system, document stores, email, and IAM wire in through read-scoped connectors. No data leaves the perimeter.',
  },
  {
    n: '03',
    title: 'Index privately',
    desc: 'Per-matter encrypted vectors inside your Postgres. Privilege classifier runs on ingest. Ethical walls enforced at query plan.',
  },
  {
    n: '04',
    title: 'Operate, sign, audit',
    desc: 'AI runs through a tool registry — never raw SQL, never arbitrary calls. Every output is signed, reviewed, and logged.',
  },
]

const SECURITY = [
  {
    icon: Server,
    title: 'Deployment modes',
    desc: 'VPC, private cloud, or on-prem. Visible deployment indicator lives in the topbar — the product tells you where it lives.',
  },
  {
    icon: KeyRound,
    title: 'Firm-owned keys',
    desc: 'Envelope encryption with per-matter data keys. KMS lives in your tenant. We never hold the master.',
  },
  {
    icon: Users,
    title: 'Matter-scoped RBAC',
    desc: 'Firm → practice group → matter → document. Ethical walls as first-class deny-lists. Admin simulator previews visibility.',
  },
  {
    icon: Fingerprint,
    title: 'Immutable audit',
    desc: 'Hash-chained, append-only, object-locked. Every AI call logs input hash, output hash, model, reviewer, and signature.',
  },
  {
    icon: CloudOff,
    title: 'No training, no retention',
    desc: 'Zero vendor training on firm data — contractual and architectural. Zero retention beyond your policy window.',
  },
  {
    icon: Bot,
    title: 'Model governance',
    desc: 'Pin a model to a matter for reproducibility. Approve model upgrades firm-wide with rollout gates and rollback.',
  },
]

const WORKFLOWS = [
  {
    label: 'Litigation',
    items: [
      'Discovery production ingestion with privilege seal',
      'AI chronology builder across deposition exhibits',
      'Jurisdictional deadline extraction + calendaring',
      'Privilege log generation with citation traces',
    ],
  },
  {
    label: 'Transactional',
    items: [
      'Diligence room with issue tagging and redline diff',
      'Clause library with matter-scoped draft assistant',
      'Obligation extraction into post-close tracker',
      'Closing checklist with signature ledger',
    ],
  },
  {
    label: 'Private Client',
    items: [
      'Estate and trust document intelligence',
      'Cross-matter family conflict check',
      'Fiduciary timeline and distribution tracking',
      'Client portal with AI-drafted status letters',
    ],
  },
  {
    label: 'Investigations',
    items: [
      'Privileged interview memo drafting',
      'Entity resolution across document corpora',
      'Witness chronology builder',
      'Scoped disclosures with redaction preview',
    ],
  },
]

const COMPARISON = [
  { row: 'Where inference runs', pub: 'Vendor cloud', saas: 'Vendor cloud', pv: 'Your VPC / on-prem' },
  { row: 'Trains on your data', pub: 'By default', saas: 'Opt-out policy', pv: 'Never — architectural' },
  { row: 'Matter-scoped context', pub: 'No', saas: 'Partial', pv: 'Enforced' },
  { row: 'Output signing', pub: 'No', saas: 'No', pv: 'Cryptographic' },
  { row: 'Immutable audit ledger', pub: 'No', saas: 'Logs', pv: 'Hash-chained, signed' },
  { row: 'Ethical walls', pub: 'N/A', saas: 'Basic roles', pv: 'First-class, simulated' },
  { row: 'Privilege detector', pub: 'No', saas: 'No', pv: 'Runs on ingest' },
  { row: 'Model governance', pub: 'None', saas: 'None', pv: 'Per-matter pinning' },
]

const QUOTES = [
  {
    body: 'We had a policy that banned public AI. We never had an architecture that replaced it. This does.',
    attr: 'Managing Partner — AmLaw 100 litigation boutique',
  },
  {
    body: 'The audit ledger alone got it through our ethics committee. The signed output was the part the GC asked about twice.',
    attr: 'CIO — National private client firm',
  },
  {
    body: 'It is the only platform my partners will actually use, because it looks like it was built by people who have read a privilege log.',
    attr: 'Director of Practice Innovation — Investigations practice',
  },
]

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* ─────────────────────── HERO ─────────────────────── */}
      <section className="relative">
        {/* Backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 grid-bg mask-fade-y opacity-60" />
          <div className="absolute inset-0 bg-vault-radial" />
          <div className="absolute inset-0 bg-vault-radial-gold" />
          <div className="noise-overlay" />
        </div>

        <div className="relative mx-auto max-w-[1200px] px-6 pt-24 pb-28 md:pt-32 md:pb-40">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
            {/* Left — copy */}
            <div className="lg:col-span-7 animate-rise-in">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-vault-border bg-vault-surface/60 px-3 py-1.5 backdrop-blur">
                <span className="seal-pulse-dot" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-vault-text-secondary">
                  § 01 · Private AI · Deployed inside your perimeter
                </span>
              </div>

              <h1 className="hero-display text-[clamp(2.75rem,6.2vw,5.25rem)] font-semibold text-vault-text">
                The private operating system for{' '}
                <span className="text-gradient-gold italic">privileged</span>{' '}
                <span className="text-gradient-silver">legal work.</span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-vault-text-secondary">
                Privilege Vault AI unifies matters, documents, intake, and AI inside a sealed environment your firm controls.
                Nothing trains on your data. Nothing leaves your perimeter. Every output is signed and auditable.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href="/demo">
                  <Button size="xl" className="gap-2">
                    Request a Private Demo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/security">
                  <Button variant="outline" size="xl" className="gap-2">
                    <Shield className="h-4 w-4" />
                    Security Architecture
                  </Button>
                </Link>
                <Link
                  href="/trust"
                  className="group inline-flex items-center gap-1.5 pl-2 text-sm text-vault-text-secondary hover:text-vault-text"
                >
                  Read the deployment brief
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <p className="mt-8 max-w-lg font-mono text-[11px] uppercase tracking-widest text-vault-faint">
                Deployed inside AmLaw IT environments · Private cloud VPCs · On-prem GPU clusters
              </p>
            </div>

            {/* Right — Seal */}
            <div className="relative hidden lg:col-span-5 lg:flex lg:items-center lg:justify-center">
              <div className="relative">
                <div className="absolute -inset-16 rounded-full bg-vault-gold/5 blur-3xl" />
                <div className="relative flex h-[320px] w-[320px] items-center justify-center rounded-full border border-vault-border-strong bg-vault-surface/40 backdrop-blur">
                  <div className="absolute inset-3 rounded-full border border-vault-border" />
                  <div className="absolute inset-6 rounded-full border border-vault-border/60" />
                  <Seal size={180} className="glow-seal rounded-full" />
                </div>
                {/* Floating caption */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-vault-border bg-vault-surface/80 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-vault-gold backdrop-blur">
                  Sealed · Signed · Audited
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="relative border-y border-vault-border bg-vault-surface/40 backdrop-blur">
          <div className="mx-auto max-w-[1200px] px-6 py-10">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { k: 'Audit coverage', v: '100%', sub: 'Every AI call logged' },
                { k: 'Vendor training', v: '0%', sub: 'Architectural, not policy' },
                { k: 'Median deploy', v: '17 days', sub: 'VPC or on-prem' },
                { k: 'Data retention', v: '0 bytes', sub: 'Outside your perimeter' },
              ].map((m) => (
                <div key={m.k}>
                  <div className="font-display text-3xl font-semibold text-vault-text">{m.v}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-vault-muted">
                    {m.k}
                  </div>
                  <div className="mt-0.5 text-xs text-vault-text-secondary">{m.sub}</div>
                </div>
              ))}
            </div>
            <div className="vault-divider my-8" />
            <div className="flex flex-wrap items-center justify-between gap-6">
              <p className="text-sm text-vault-text-secondary">
                Built for firms where a single leak ends a relationship.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {['SOC 2 Type II', 'ISO 27001', 'HIPAA-ready', 'CJIS-aligned', 'GDPR'].map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full border border-vault-border bg-vault-elevated px-3 py-1 text-[11px] font-medium text-vault-text-secondary"
                  >
                    <ShieldCheck className="h-3 w-3 text-vault-gold" />
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── § 02 — THE PROBLEM ───────────── */}
      <section className="relative border-b border-vault-border">
        <div className="mx-auto max-w-[1200px] px-6 py-28">
          <SectionMark number="02" label="The problem" />
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="display-serif text-4xl font-medium leading-[1.1] text-vault-text md:text-5xl">
                Public AI is a privilege problem in a{' '}
                <span className="italic text-vault-text-secondary">productivity wrapper.</span>
              </h2>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-vault-text-secondary">
                Every prompt to a public model is a potential disclosure. Every bolt-on SaaS tool is another vendor with a copy of your matter.
                Privilege Vault AI collapses that stack into a single sealed environment — where AI is a tool your firm owns, not a service it rents.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="hairline-card corner-frame relative space-y-4 p-6">
                {[
                  { x: true, t: 'Prompt logged on vendor infrastructure' },
                  { x: true, t: 'Ambiguous retention & training rights' },
                  { x: true, t: 'Cross-matter context bleed' },
                  { x: true, t: 'No reviewer signature on outputs' },
                  { x: true, t: 'Audit trail lives on someone else’s disk' },
                ].map((i) => (
                  <div key={i.t} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-vault-danger/40 bg-vault-danger/10">
                      <X className="h-3 w-3 text-vault-danger" />
                    </div>
                    <span className="text-sm text-vault-text-secondary">{i.t}</span>
                  </div>
                ))}
                <div className="vault-divider !my-5" />
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-vault-gold">
                  <CircleDot className="h-3 w-3" />
                  Privilege Vault AI closes every one of these.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── § 03 — WHY PRIVATE AI WINS ───────────── */}
      <section className="relative border-b border-vault-border">
        <div className="mx-auto max-w-[1200px] px-6 py-28">
          <div className="mb-14 flex items-end justify-between gap-8">
            <div>
              <SectionMark number="03" label="Why private AI wins" />
              <h2 className="display-serif max-w-2xl text-4xl font-medium leading-[1.1] text-vault-text md:text-5xl">
                Four principles. Non-negotiable.
              </h2>
            </div>
            <p className="hidden max-w-sm text-sm leading-relaxed text-vault-text-secondary md:block">
              Every feature on this platform exists to enforce one of these four principles — or it does not ship.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="hairline-card group relative flex h-full flex-col p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-vault-border bg-vault-elevated">
                    <p.icon className="h-4 w-4 text-vault-gold" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-vault-faint">
                    {p.mark}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-vault-text">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-vault-text-secondary">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── § 04 — THE OPERATING SYSTEM ───────────── */}
      <section className="relative border-b border-vault-border bg-vault-ink">
        <div className="mx-auto max-w-[1200px] px-6 py-28">
          <SectionMark number="04" label="The operating system" />
          <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h2 className="display-serif text-4xl font-medium leading-[1.1] text-vault-text md:text-5xl lg:col-span-7">
              One platform.{' '}
              <span className="text-gradient-silver">The full practice stack.</span>
            </h2>
            <p className="max-w-md text-base leading-relaxed text-vault-text-secondary lg:col-span-5">
              Intake, conflicts, matters, documents, discovery, deadlines, communications, time, and AI — unified under one permission model.
              Twelve modules. One audit ledger. One source of privilege truth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-vault-border bg-vault-border md:grid-cols-3 lg:grid-cols-6">
            {MODULES.map((m) => (
              <div
                key={m.label}
                className="group flex flex-col items-start gap-4 bg-vault-surface p-5 transition-colors hover:bg-vault-elevated"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded border border-vault-border bg-vault-elevated transition-colors group-hover:border-vault-gold/40">
                  <m.icon className="h-4 w-4 text-vault-text-secondary transition-colors group-hover:text-vault-gold" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-vault-text">{m.label}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-vault-faint">
                    Module
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── § 05 — HOW IT WORKS ───────────── */}
      <section className="relative border-b border-vault-border">
        <div className="mx-auto max-w-[1200px] px-6 py-28">
          <SectionMark number="05" label="How it works" />
          <div className="mb-14">
            <h2 className="display-serif max-w-3xl text-4xl font-medium leading-[1.1] text-vault-text md:text-5xl">
              Four steps from NDA to signed output.
            </h2>
          </div>

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="pointer-events-none absolute inset-x-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-vault-border-strong to-transparent lg:block" />
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="relative mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-vault-border bg-vault-surface">
                  <span className="font-mono text-[11px] font-semibold text-vault-gold">{s.n}</span>
                  {i === 0 && (
                    <span className="absolute -inset-1 rounded-full border border-vault-gold/30" />
                  )}
                </div>
                <h3 className="text-base font-semibold text-vault-text">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-vault-text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── § 06 — SECURITY ARCHITECTURE ───────────── */}
      <section className="relative border-b border-vault-border bg-vault-ink">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30 mask-fade-y" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-28">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionMark number="06" label="Security architecture" />
              <h2 className="display-serif max-w-2xl text-4xl font-medium leading-[1.1] text-vault-text md:text-5xl">
                Privilege{' '}
                <span className="italic text-gradient-gold">by architecture.</span>
              </h2>
            </div>
            <Link href="/security">
              <Button variant="outline" size="lg" className="gap-2">
                Full security brief
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SECURITY.map((s) => (
              <div key={s.title} className="hairline-card p-6">
                <div className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-md border border-vault-gold/30 bg-vault-gold/5">
                  <s.icon className="h-4 w-4 text-vault-gold" />
                </div>
                <h3 className="text-base font-semibold text-vault-text">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-vault-text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── § 07 — PRACTICE WORKFLOWS ───────────── */}
      <section className="relative border-b border-vault-border">
        <div className="mx-auto max-w-[1200px] px-6 py-28">
          <SectionMark number="07" label="Practice workflows" />
          <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h2 className="display-serif text-4xl font-medium leading-[1.1] text-vault-text md:text-5xl lg:col-span-7">
              Built for how lawyers actually work.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-vault-text-secondary lg:col-span-5">
              Not generic "AI workflows." Practice-specific playbooks, shaped by litigators, transactional leads, fiduciaries, and investigators.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {WORKFLOWS.map((w) => (
              <div key={w.label} className="hairline-card p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-vault-gold">
                    {w.label}
                  </span>
                  <Gavel className="h-3.5 w-3.5 text-vault-muted" />
                </div>
                <ul className="space-y-3">
                  {w.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-vault-gold" />
                      <span className="text-sm leading-relaxed text-vault-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── § 08 — INTELLIGENCE / DASHBOARD SHOWCASE ───────────── */}
      <section className="relative overflow-hidden border-b border-vault-border bg-vault-ink">
        <div className="pointer-events-none absolute inset-0 bg-vault-radial" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-28">
          <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionMark number="08" label="Document intelligence" />
              <h2 className="display-serif text-4xl font-medium leading-[1.1] text-vault-text md:text-5xl">
                Read a production the way{' '}
                <span className="italic text-gradient-silver">a first-year should</span> — in minutes.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-vault-text-secondary">
                Privilege detection, issue tagging, chronology construction, and citation-traced research — all inside the matter, all reviewable before anything is relied on.
                Every extraction is a card before it is a fact.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/intelligence">
                  <Button size="lg" className="gap-2">
                    See the workspace
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link
                  href="/platform/matters"
                  className="text-sm text-vault-text-secondary hover:text-vault-text"
                >
                  Inside a matter →
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: '340K', l: 'Documents indexed / matter', hint: 'Per-matter vectors' },
                  { v: '98.4%', l: 'Privilege recall', hint: 'Firm-tuned classifier' },
                  { v: '< 4s', l: 'Scoped search', hint: 'On-prem GPU median' },
                  { v: '100%', l: 'Outputs signed', hint: 'Hash + reviewer' },
                ].map((m) => (
                  <div key={m.l} className="hairline-card p-5">
                    <div className="font-display text-3xl font-semibold text-vault-text">{m.v}</div>
                    <div className="mt-1 text-xs font-semibold text-vault-text-secondary">{m.l}</div>
                    <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-vault-faint">
                      {m.hint}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-x-4 -top-8 -bottom-8 rounded-xl border border-vault-border/60 bg-vault-surface/30 backdrop-blur-sm" />
            <div className="relative">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── § 09 — COMPARISON ───────────── */}
      <section className="relative border-b border-vault-border">
        <div className="mx-auto max-w-[1200px] px-6 py-28">
          <SectionMark number="09" label="The difference" />
          <div className="mb-12">
            <h2 className="display-serif max-w-3xl text-4xl font-medium leading-[1.1] text-vault-text md:text-5xl">
              What "private AI" actually has to mean.
            </h2>
          </div>

          <div className="overflow-hidden rounded-md border border-vault-border bg-vault-surface">
            <div className="grid grid-cols-4 border-b border-vault-border bg-vault-elevated/60">
              <div className="px-5 py-4 text-[11px] font-semibold uppercase tracking-widest text-vault-muted">
                Capability
              </div>
              <div className="px-5 py-4 text-[11px] font-semibold uppercase tracking-widest text-vault-muted">
                Public AI chatbots
              </div>
              <div className="px-5 py-4 text-[11px] font-semibold uppercase tracking-widest text-vault-muted">
                Generic legal SaaS
              </div>
              <div className="border-l border-vault-gold/30 bg-vault-gold/5 px-5 py-4 text-[11px] font-semibold uppercase tracking-widest text-vault-gold">
                Privilege Vault AI
              </div>
            </div>
            {COMPARISON.map((r, i) => (
              <div
                key={r.row}
                className={`grid grid-cols-4 ${i !== COMPARISON.length - 1 ? 'border-b border-vault-border/60' : ''}`}
              >
                <div className="px-5 py-4 text-sm font-medium text-vault-text">{r.row}</div>
                <div className="px-5 py-4 text-sm text-vault-text-secondary">{r.pub}</div>
                <div className="px-5 py-4 text-sm text-vault-text-secondary">{r.saas}</div>
                <div className="flex items-center gap-2 border-l border-vault-gold/20 bg-vault-gold/[0.03] px-5 py-4 text-sm text-vault-text">
                  <Check className="h-3.5 w-3.5 text-vault-gold" />
                  {r.pv}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── § 10 — PROOF ───────────── */}
      <section className="relative border-b border-vault-border bg-vault-ink">
        <div className="mx-auto max-w-[1200px] px-6 py-28">
          <SectionMark number="10" label="Proof" />
          <div className="mb-12">
            <h2 className="display-serif max-w-2xl text-4xl font-medium leading-[1.1] text-vault-text md:text-5xl">
              Partners, CIOs, and GCs don't hedge.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {QUOTES.map((q) => (
              <figure key={q.attr} className="hairline-card flex h-full flex-col p-6">
                <div className="mb-5 text-vault-gold">
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor" aria-hidden="true">
                    <path d="M0 24V14.4C0 6.4 4.8 1.6 12 0l1.6 3.2c-4 1.6-6.4 4-6.4 8H12V24H0zM18.4 24V14.4c0-8 4.8-12.8 12-14.4L32 3.2c-4 1.6-6.4 4-6.4 8h4.8V24h-12z" />
                  </svg>
                </div>
                <blockquote className="flex-1 text-base leading-relaxed text-vault-text">
                  {q.body}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-vault-border pt-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-vault-gold/30 bg-vault-gold/5">
                    <Building2 className="h-3.5 w-3.5 text-vault-gold" />
                  </div>
                  <span className="text-xs text-vault-text-secondary">{q.attr}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── § 11 — FINAL CTA ───────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-vault-radial" />
          <div className="absolute inset-0 bg-vault-radial-gold" />
          <div className="absolute inset-0 grid-bg opacity-30 mask-fade-y" />
        </div>
        <div className="relative mx-auto max-w-[1200px] px-6 py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-10 flex justify-center">
              <Seal size={72} className="glow-seal rounded-full" />
            </div>
            <SectionMark number="11" label="The call" className="justify-center" />
            <h2 className="hero-display text-4xl font-semibold text-vault-text md:text-6xl">
              Your firm's AI should live{' '}
              <span className="italic text-gradient-gold">inside your firm.</span>
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-vault-text-secondary">
              Thirty minutes. Signed NDA. Your deployment questions answered by engineers — not sales.
              We'll walk through VPC, private cloud, or on-prem architecture for your environment.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/demo">
                <Button size="xl" className="gap-2">
                  Request a Private Demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="xl" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Talk to Security
                </Button>
              </Link>
            </div>
            <p className="mt-10 font-mono text-[11px] uppercase tracking-widest text-vault-faint">
              Private AI for privileged work · Sealed · Signed · Audited
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
