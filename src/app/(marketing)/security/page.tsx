import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Shield, Lock, Database, Eye, Server, Key, CheckCircle2 } from 'lucide-react'

const SECURITY_PILLARS = [
  {
    icon: Server,
    title: 'Private Deployment',
    desc: 'Privilege Vault AI runs entirely within your firm\'s environment — on-prem, Azure private, or AWS private. There is no shared infrastructure. Your data never touches a public cloud service.',
  },
  {
    icon: Lock,
    title: 'Zero External AI Dependency',
    desc: 'AI inference runs on Ollama or vLLM, deployed locally on firm hardware. By default, zero query data, document content, or client information is sent to any third-party AI API.',
  },
  {
    icon: Shield,
    title: 'Privilege-First Architecture',
    desc: 'Every system design decision prioritizes privilege protection. Documents are tagged, AI output is labeled as draft work product, and the retrieval layer is permission-scoped.',
  },
  {
    icon: Database,
    title: 'Encryption at Rest & In Transit',
    desc: 'AES-256 encryption for stored files. TLS 1.3 required for all connections. Database encrypted at OS level. Secrets never committed to source control.',
  },
  {
    icon: Eye,
    title: 'Immutable Audit Trail',
    desc: 'Every user action, AI query, document access, and permission change is logged to a write-once audit table. Logs cannot be modified or deleted — even by firm admins.',
  },
  {
    icon: Key,
    title: 'Matter-Level RBAC',
    desc: 'Server-side enforcement of role-based access control. 10 role levels. Matter-scoped permissions. Document-level privilege groups. No client-side trust.',
  },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-vault-bg">
      <nav className="border-b border-vault-border bg-vault-surface/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo variant="dark" size="md" /></Link>
          <Link href="/login"><Button size="sm"><Lock className="h-3.5 w-3.5" />Sign In</Button></Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-vault-success/30 bg-vault-success/10 px-3 py-1.5 mb-6">
            <Shield className="h-3.5 w-3.5 text-vault-success" />
            <span className="text-xs text-vault-success font-medium">Security Architecture</span>
          </div>
          <h1 className="display-serif text-[2.4rem] font-semibold text-vault-ink tracking-tight mb-4">
            Built for privilege. Designed for trust.
          </h1>
          <p className="text-lg text-vault-text-secondary leading-relaxed">
            Privilege Vault AI is architected under the assumption that every byte it handles is subject to attorney-client privilege. Security is not a feature — it's the foundation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {SECURITY_PILLARS.map((p) => (
            <div key={p.title} className="section-card p-6">
              <div className="mb-4 inline-flex rounded-md border border-vault-border bg-vault-elevated p-2">
                <p.icon className="h-5 w-5 text-vault-accent-light" />
              </div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-vault-ink font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-vault-text-secondary leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="section-card p-8 mb-8">
          <h2 className="display-serif text-[1.4rem] font-semibold text-vault-ink mb-6">AI Data Flow</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {[
              'User Query',
              '→ Firm App Server',
              '→ Local Vector Search',
              '→ Local Ollama/vLLM',
              '→ Response',
              '→ User',
            ].map((step, i) => (
              <div key={i} className={`px-3 py-2 rounded-md border ${step.startsWith('→') ? 'border-vault-border text-vault-muted' : 'border-vault-accent/30 bg-vault-accent/10 text-vault-accent-light font-medium'}`}>
                {step}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-vault-text-secondary">
            No external network calls in default configuration. The entire inference pipeline runs within your firm's trust boundary.
          </p>
        </div>

        <div className="section-card p-8">
          <h2 className="display-serif text-[1.4rem] font-semibold text-vault-ink mb-6">Deployment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'On-Premises', desc: 'Deploy on your own Linux servers. Full hardware control. No cloud dependency. Maximum isolation.' },
              { title: 'Azure Private', desc: 'Azure Private Endpoints, private VNet, Azure OpenAI via private link if needed. Enterprise SLA.' },
              { title: 'AWS Private VPC', desc: 'Private subnets, VPN/Direct Connect only. RDS + S3 with encryption. EKS or EC2 deployment.' },
            ].map((opt) => (
              <div key={opt.title} className="rounded-md border border-vault-border bg-vault-elevated p-5">
                <h3 className="text-sm font-semibold text-vault-text mb-2">{opt.title}</h3>
                <p className="text-sm text-vault-text-secondary">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
