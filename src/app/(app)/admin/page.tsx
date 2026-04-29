import Link from 'next/link'
import { PageHeader } from '@/components/ui/page-header'
import { Users, Shield, Settings, Key, Palette, Link2 } from 'lucide-react'

const ADMIN_SECTIONS = [
  { href: '/admin/users', icon: Users, title: 'User Management', desc: 'Invite, manage, and deactivate firm users. Assign roles and offices.' },
  { href: '/admin/brand', icon: Palette, title: 'Firm Brand', desc: 'Logo, letterhead style, colors, and document footer applied to all generated PDFs.' },
  { href: '/admin/integrations', icon: Link2, title: 'Integrations', desc: 'Connect Clio and other practice management tools with bidirectional AI sync.' },
  { href: '/admin/audit', icon: Shield, title: 'Audit Log', desc: 'Immutable record of all firm activity. Exportable for compliance review.' },
  { href: '/admin/settings', icon: Settings, title: 'Firm Settings', desc: 'Configure AI providers, billing rules, retention policies, and integrations.' },
  { href: '/admin/roles', icon: Key, title: 'Roles & Permissions', desc: 'Manage role-based access control and permission matrices.' },
]

export default function AdminPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Administration" description="Firm configuration, users, security, and compliance" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ADMIN_SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="section-card block p-6 group">
            <div className="flex items-start gap-4">
              <div className="rounded-md border border-vault-accent/20 bg-gradient-to-b from-vault-accent/10 to-vault-accent/5 p-2.5 shadow-[0_1px_3px_rgba(45,89,69,0.08)] shrink-0 transition-colors group-hover:border-vault-accent/35">
                <s.icon className="h-5 w-5 text-vault-accent" />
              </div>
              <div>
                <h3 className="display-serif text-[14px] font-semibold text-vault-ink tracking-[-0.01em] mb-1.5 group-hover:text-vault-accent transition-colors">
                  {s.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-vault-text-secondary">{s.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
