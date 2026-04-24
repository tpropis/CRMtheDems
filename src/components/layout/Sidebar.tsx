'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/brand/Logo'
import {
  LayoutDashboard, Inbox, ClipboardList, Users, Briefcase,
  Calendar, FileText, Search, Database, Clock, Receipt,
  BarChart3, Settings, Shield, UserCheck, AlertTriangle,
  Bot, FolderOpen, LogOut, Wand2, Link2, Sparkles,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import { roleLabel, initials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface NavSection {
  label?: string
  items: NavItem[]
}
interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  exact?: boolean
}

const NAV: NavSection[] = [
  {
    items: [
      { label: 'Dashboard',    href: '/dashboard',   icon: LayoutDashboard, exact: true },
      { label: 'Inbox',        href: '/inbox',       icon: Inbox },
    ],
  },
  {
    label: 'Clients & Matters',
    items: [
      { label: 'Intake',       href: '/intake',      icon: ClipboardList },
      { label: 'Conflicts',    href: '/conflicts',   icon: AlertTriangle },
      { label: 'Clients',      href: '/clients',     icon: Users },
      { label: 'Contacts',     href: '/contacts',    icon: UserCheck },
      { label: 'Matters',      href: '/matters',     icon: Briefcase },
    ],
  },
  {
    label: 'Work Product',
    items: [
      { label: 'Calendar',     href: '/calendar',    icon: Calendar },
      { label: 'Documents',    href: '/documents',   icon: FileText },
      { label: 'Templates',    href: '/templates',   icon: FolderOpen },
      { label: 'Generate Doc', href: '/documents/generate', icon: Wand2 },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { label: 'AI Paralegal', href: '/ai',          icon: Sparkles },
      { label: 'Research',     href: '/research',    icon: Search },
      { label: 'Discovery',    href: '/discovery',   icon: Database },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Timekeeping',  href: '/timekeeping', icon: Clock },
      { label: 'Billing',      href: '/billing',     icon: Receipt },
      { label: 'Reports',      href: '/reports',     icon: BarChart3 },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Admin',        href: '/admin',       icon: Settings },
      { label: 'Brand',        href: '/admin/brand', icon: BarChart3 },
      { label: 'Integrations', href: '/admin/integrations', icon: Link2 },
      { label: 'Audit',        href: '/admin/audit', icon: Shield },
    ],
  },
]

function NavItem({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname()
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-1.5 rounded-sm text-[13px] transition-colors w-full',
        isActive
          ? 'bg-vault-accent/[0.08] text-vault-accent font-medium'
          : 'text-vault-text-secondary hover:bg-vault-elevated hover:text-vault-ink'
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-full bg-vault-accent" />
      )}
      <item.icon
        className={cn(
          'h-4 w-4 shrink-0',
          isActive ? 'text-vault-accent' : 'text-vault-muted group-hover:text-vault-text-secondary'
        )}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span className="text-[10px] bg-vault-gold/15 text-vault-gold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center font-mono">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function Sidebar({ session, onNavigate }: { session: Session; onNavigate?: () => void }) {
  const user = session.user
  return (
    <aside className="relative flex h-full w-60 flex-col border-r border-vault-border bg-vault-surface">
      {/* Logo header */}
      <div className="relative flex h-14 items-center border-b border-vault-border px-4">
        <Link href="/dashboard" className="flex items-center">
          <Logo variant="dark" size="sm" />
        </Link>
        <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-vault-gold/50 to-transparent" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
        {NAV.map((section, si) => (
          <div key={si} className="space-y-0.5">
            {section.label && (
              <p className="px-3 mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-vault-muted">
                {section.label}
              </p>
            )}
            {section.items.map((item) => (
              <NavItem key={item.href} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>

      {/* Private AI indicator */}
      <div className="px-3 pt-2 pb-2">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-md border border-vault-gold/30 bg-vault-gold/5">
          <Bot className="h-3.5 w-3.5 text-vault-gold shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[9px] text-vault-muted uppercase tracking-[0.18em]">AI Engine</p>
            <p className="text-[11px] text-vault-ink font-medium truncate">Private · Sealed</p>
          </div>
          <span className="live-dot" />
        </div>
      </div>

      {/* User footer */}
      <div className="border-t border-vault-border p-3 bg-vault-elevated/40">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-vault-border-strong/50">
            <AvatarFallback className="text-[10px] bg-vault-accent/10 text-vault-accent font-semibold">
              {initials(user.name || user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-vault-ink truncate">{user.name}</p>
            <p className="font-mono text-[9px] text-vault-muted truncate uppercase tracking-wider">
              {roleLabel((user as any).role)}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="shrink-0 rounded p-1.5 text-vault-muted hover:bg-vault-surface hover:text-vault-danger transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
