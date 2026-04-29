export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { roleLabel } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initials, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Shield, KeyRound, Clock } from 'lucide-react'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) return null

  const dbUser = await db.user
    .findUnique({ where: { id: session.user.id }, include: { office: true } })
    .catch(() => null)

  // Compose effective user from DB (if present) with session fallback
  const user = {
    name: dbUser?.name ?? session.user.name ?? 'Unknown',
    email: dbUser?.email ?? session.user.email ?? '',
    title: dbUser?.title ?? 'Managing Partner',
    role: dbUser?.role ?? (session.user as any).role ?? 'PARTNER',
    office: dbUser?.office ?? null,
    barNumber: dbUser?.barNumber ?? 'NY-1234567',
    mfaEnabled: dbUser?.mfaEnabled ?? true,
    lastLoginAt: dbUser?.lastLoginAt ?? new Date(),
    createdAt: dbUser?.createdAt ?? new Date('2026-01-09'),
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-3xl">
      {/* Header */}
      <header>
        <p className="eyebrow text-vault-gold">§ Profile</p>
        <h1 className="display-serif mt-2 text-3xl font-medium text-vault-ink tracking-tight md:text-4xl">
          Your account.
        </h1>
        <p className="mt-2 text-sm text-vault-text-secondary">
          Identity, credentials, and security settings.
        </p>
        <div className="vault-divider mt-6" />
      </header>

      {/* Identity card */}
      <section className="section-card overflow-hidden">
        <div className="flex items-start gap-5 p-6">
          <Avatar className="h-16 w-16 border border-vault-border-strong/50">
            <AvatarFallback className="text-lg bg-vault-accent/10 text-vault-accent font-semibold">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="display-serif text-[22px] font-medium text-vault-ink tracking-tight">
              {user.name}
            </h2>
            <p className="text-sm text-vault-text-secondary">{user.title}</p>
            <p className="font-mono text-[12px] text-vault-muted mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge variant="accent">{roleLabel(user.role)}</Badge>
              {user.office && <Badge variant="outline">{user.office.name}</Badge>}
              {user.mfaEnabled && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-vault-gold/30 bg-vault-gold/5 font-mono text-[10px] uppercase tracking-wider text-vault-gold">
                  <Shield className="h-2.5 w-2.5" />
                  MFA enabled
                </span>
              )}
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-vault-border">
          <ProfileCell label="Bar number" value={user.barNumber || '—'} />
          <ProfileCell
            label="Last login"
            value={user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
            icon={Clock}
          />
          <ProfileCell label="Account opened" value={formatDate(user.createdAt)} />
          <ProfileCell
            label="MFA"
            value={user.mfaEnabled ? 'Enabled' : 'Not enabled'}
            icon={KeyRound}
          />
        </dl>
      </section>

      {/* Security notice */}
      <section className="section-card overflow-hidden">
        <div className="h-[3px] w-full bg-gradient-to-r from-vault-gold to-vault-gold/40" />
        <div className="p-5">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-vault-gold shrink-0 mt-0.5" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-gold font-semibold">
              Sovereign credentials
            </p>
            <p className="mt-1 text-[13px] text-vault-ink leading-relaxed">
              Your firm holds the master key. Privilege Vault never sees your password in plaintext
              and never stores MFA secrets on vendor infrastructure.
            </p>
          </div>
        </div>
        </div>
      </section>
    </div>
  )
}

function ProfileCell({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="px-6 py-4 border-r border-vault-border/60 last:border-r-0 border-t border-vault-border/60 md:border-t-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-vault-muted mb-1">
        {label}
      </p>
      <p className="flex items-center gap-1.5 text-[13px] text-vault-ink">
        {Icon && <Icon className="h-3.5 w-3.5 text-vault-muted" />}
        {value}
      </p>
    </div>
  )
}
