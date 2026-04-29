import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'

const FOOTER = {
  Platform: [
    { label: 'Matter Operations', href: '/platform/matters' },
    { label: 'Document Intelligence', href: '/intelligence' },
    { label: 'Intake & Conflicts', href: '/platform/intake' },
    { label: 'Communications', href: '/platform/communications' },
    { label: 'AI Operator', href: '/platform/ai' },
  ],
  Security: [
    { label: 'Architecture', href: '/security' },
    { label: 'Deployment modes', href: '/security/deployment' },
    { label: 'Compliance', href: '/security/compliance' },
    { label: 'Audit', href: '/security/audit' },
    { label: 'Trust Center', href: '/trust' },
  ],
  Workflows: [
    { label: 'Litigation', href: '/workflows/litigation' },
    { label: 'Transactional', href: '/workflows/transactional' },
    { label: 'Private Client', href: '/workflows/private-client' },
    { label: 'Investigations', href: '/workflows/investigations' },
  ],
  Firm: [
    { label: 'About', href: '/about' },
    { label: 'Customers', href: '/customers' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact sales', href: '/contact' },
    { label: 'Request demo', href: '/demo' },
  ],
}

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-vault-border-strong bg-gradient-to-b from-vault-elevated to-vault-elevated/70">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-vault-gold to-transparent" />
      <div className="absolute inset-x-0 top-px h-px bg-gradient-to-r from-transparent via-vault-gold/20 to-transparent" />
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Logo variant="dark" size="sm" />
            <p className="mt-6 max-w-xs text-[13.5px] leading-relaxed text-vault-text-secondary">
              Private AI for privileged work. Deployed inside your perimeter. Signed, scoped, and auditable by architecture.
            </p>
            <div className="mt-7 flex items-center gap-3">
              <span className="seal-pulse-dot" />
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-vault-muted">
                Sealed · Signed · Audited
              </span>
            </div>
          </div>
          {Object.entries(FOOTER).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-vault-gold/90">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[13px] text-vault-text-secondary transition-colors duration-150 hover:text-vault-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="vault-divider mt-16" />

        <div className="mt-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-vault-faint">
            © 2026 Privilege Vault · All rights reserved
          </p>
          <div className="flex items-center gap-6 font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-vault-muted">
            <Link href="/trust" className="transition-colors hover:text-vault-accent">Trust</Link>
            <Link href="/security/compliance" className="transition-colors hover:text-vault-accent">DPA</Link>
            <Link href="/security/compliance" className="transition-colors hover:text-vault-accent">Sub-processors</Link>
            <Link href="/contact" className="transition-colors hover:text-vault-accent">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
