import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import {
  Shield, Lock, Bot, FileText, Search, Database, Clock,
  ChevronRight, CheckCircle2, ArrowRight, Scale, Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const FEATURES = [
  {
    icon: Bot,
    title: 'Private AI Research',
    desc: 'Query your matter documents and legal knowledge base with full source traceability. All inference runs locally — no data leaves your firm.',
  },
  {
    icon: FileText,
    title: 'AI Document Drafting',
    desc: 'Draft motions, contracts, discovery requests, and engagement letters from structured templates with clause libraries and version history.',
  },
  {
    icon: Database,
    title: 'Discovery Intelligence',
    desc: 'Upload productions, auto-tag for relevance and privilege, build chronologies, and generate privilege logs with attorney-level accuracy.',
  },
  {
    icon: Scale,
    title: 'Matter Operations Core',
    desc: 'Complete intake-to-close workflow: conflict checks, matter management, calendaring, tasks, timekeeping, and billing in one platform.',
  },
  {
    icon: Lock,
    title: 'Privilege-First Architecture',
    desc: 'Every design decision protects privilege. Matter-scoped permissions, encrypted storage, and audit trails purpose-built for privileged work.',
  },
  {
    icon: Zap,
    title: 'Deadline Intelligence',
    desc: 'Statute of limitations tracking, court deadline calculation, escalation rules, and integrated legal calendaring across matters.',
  },
]

const TRUST = [
  'Zero external AI API dependency by default',
  'Deploy in your own VPC, Azure private environment, or on-prem Linux server',
  'AES-256 encryption at rest and in transit',
  'Immutable audit trail for every user and AI action',
  'Matter-level and document-level access controls',
  'SOC 2 compliant architecture with legal hold support',
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-vault-bg">
      {/* Nav */}
      <nav className="border-b border-vault-border bg-vault-surface/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo variant="dark" size="md" />
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-sm text-vault-text-secondary">
              <Link href="/platform" className="hover:text-vault-text transition-colors">Platform</Link>
              <Link href="/security" className="hover:text-vault-text transition-colors">Security</Link>
              <Link href="/pricing" className="hover:text-vault-text transition-colors">Pricing</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/demo">
                <Button variant="outline" size="sm">Request Demo</Button>
              </Link>
              <Link href="/login">
                <Button size="sm">
                  <Lock className="h-3.5 w-3.5" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-36">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-vault-border bg-vault-elevated px-3 py-1.5 mb-8">
            <div className="h-1.5 w-1.5 rounded-full bg-vault-success" />
            <span className="text-xs text-vault-text-secondary font-medium">Private AI · No data leaves your firm</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-vault-text leading-[1.08] tracking-tight mb-6">
            The operating system for{' '}
            <span className="text-gradient-blue">privileged legal work.</span>
          </h1>

          <p className="text-lg text-vault-text-secondary leading-relaxed mb-10 max-w-2xl">
            Privilege Vault AI is a private AI platform built exclusively for law firms.
            Research, draft, and review with enterprise AI — entirely within your own environment.
            No privilege waiver risk. No data exposure. No compromise.
          </p>

          <div className="flex flex-wrap items-center gap-4">
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
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="border-y border-vault-border bg-vault-surface">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-vault-muted mb-8 text-center">
            Built for firms where trust is non-negotiable
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRUST.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-vault-success mt-0.5 shrink-0" />
                <span className="text-sm text-vault-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-vault-text tracking-tight mb-3">
            Every tool privileged legal work demands.
          </h2>
          <p className="text-vault-text-secondary max-w-xl">
            Six AI-powered modules built into one secure platform — designed for how firms actually work, not how SaaS companies think they do.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-md border border-vault-border bg-vault-surface p-6 hover:border-vault-border-strong transition-colors"
            >
              <div className="mb-4 inline-flex rounded-md border border-vault-border bg-vault-elevated p-2">
                <f.icon className="h-5 w-5 text-vault-accent-light" />
              </div>
              <h3 className="text-sm font-semibold text-vault-text mb-2">{f.title}</h3>
              <p className="text-sm text-vault-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-vault-border bg-vault-surface">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-vault-text tracking-tight mb-3">
            Ready to secure your practice?
          </h2>
          <p className="text-vault-text-secondary mb-8 max-w-lg mx-auto">
            Schedule a private demo with our team. We'll walk through deployment options for your firm's environment.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/demo">
              <Button size="xl">Request Private Demo</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="xl">Contact Sales</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-vault-border">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo variant="dark" size="sm" />
          <div className="flex items-center gap-6 text-xs text-vault-muted">
            <Link href="/security" className="hover:text-vault-text-secondary">Security</Link>
            <Link href="/about" className="hover:text-vault-text-secondary">About</Link>
            <Link href="/contact" className="hover:text-vault-text-secondary">Contact</Link>
          </div>
          <p className="text-xs text-vault-muted">© 2026 Privilege Vault AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
