import Link from 'next/link'
import { PageHeader } from '@/components/ui/page-header'
import { Users, Shield, Settings, Key } from 'lucide-react'

const ADMIN_SECTIONS = [
  { href: '/admin/users', icon: Users, title: 'User Management', desc: 'Invite, manage, and deactivate firm users. Assign roles and offices.' },
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
          <Link key={s.href} href={s.href} className="rounded-md border border-vault-border bg-vault-surface p-6 hover:border-vault-border-strong transition-colors block">
            <div className="flex items-start gap-4">
              <div className="rounded-md border border-vault-border bg-vault-elevated p-2">
                <s.icon className="h-5 w-5 text-vault-accent-light" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-vault-text mb-1">{s.title}</h3>
                <p className="text-sm text-vault-text-secondary">{s.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
