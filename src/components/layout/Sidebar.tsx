'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { initials, roleLabel } from '@/lib/utils'
import {
  Shield,
  LayoutDashboard,
  Briefcase,
  Brain,
  FileEdit,
  Clock,
  FolderOpen,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { Session } from 'next-auth'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    href: '/dashboard',          icon: LayoutDashboard, exact: true },
  { label: 'Matters',      href: '/matters',             icon: Briefcase,       badge: '47' },
  { label: 'AI Research',  href: '/research',            icon: Brain },
  { label: 'AI Drafting',  href: '/documents/generate',  icon: FileEdit },
  { label: 'Discovery',    href: '/discovery',           icon: Shield },
  { label: 'Time & Billing', href: '/timekeeping',       icon: Clock },
  { label: 'Documents',    href: '/documents',           icon: FolderOpen },
  { label: 'Calendar',     href: '/calendar',            icon: CalendarDays },
  { label: 'Clients',      href: '/clients',             icon: Users },
  { label: 'Reports',      href: '/reports',             icon: BarChart3 },
  { label: 'Settings',     href: '/admin',               icon: Settings },
]

function NavLink({
  item,
  collapsed,
}: {
  item: NavItem
  collapsed: boolean
}) {
  const pathname = usePathname()
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        'relative flex items-center gap-3 py-2 text-sm transition-all duration-150 w-full rounded-md',
        collapsed ? 'justify-center px-0' : 'px-3',
        isActive
          ? 'text-vault-gold-light bg-vault-gold/8'
          : 'text-vault-text-secondary hover:bg-vault-elevated/80 hover:text-vault-text'
      )}
      style={
        isActive && !collapsed
          ? { borderLeft: '2px solid #C9A84C', paddingLeft: 'calc(0.75rem - 2px)' }
          : isActive && collapsed
          ? { borderLeft: '2px solid #C9A84C' }
          : undefined
      }
    >
      <item.icon
        className={cn(
          'shrink-0 h-4 w-4',
          isActive ? 'text-vault-gold' : 'text-vault-muted'
        )}
      />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span className="text-xs bg-vault-accent/20 text-vault-accent-light rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center leading-none">
              {item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && item.badge !== undefined && (
        <span className="absolute top-0.5 right-0.5 h-4 w-4 text-2xs bg-vault-accent text-white rounded-full flex items-center justify-center leading-none">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function Sidebar({ session }: { session: Session }) {
  const user = session.user
  const userInitials = initials((user.name || user.email || 'U').toString())

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar-collapsed')
      return stored === 'true'
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed))
  }, [collapsed])

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col border-r border-vault-border bg-vault-surface transition-all duration-200 ease-in-out shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={cn(
          'absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-vault-border bg-vault-elevated text-vault-muted hover:text-vault-text transition-colors shadow-vault'
        )}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Logo */}
      <div
        className={cn(
          'flex h-14 items-center border-b border-vault-border shrink-0',
          collapsed ? 'justify-center px-0' : 'px-4 gap-2'
        )}
      >
        <Shield className="h-7 w-7 text-vault-gold shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-serif text-sm font-bold text-vault-text leading-tight truncate">
              Privilege Vault AI
            </p>
            <p className="text-2xs text-vault-muted truncate">Morrison &amp; Chen LLP</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav
        className={cn(
          'flex-1 overflow-y-auto py-3 space-y-0.5',
          collapsed ? 'px-1' : 'px-2'
        )}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-vault-border shrink-0">
        {/* New Matter CTA */}
        {!collapsed ? (
          <div className="px-3 pt-3">
            <button className="btn-gold w-full justify-center">
              <Plus className="h-4 w-4" />
              New Matter
            </button>
          </div>
        ) : (
          <div className="flex justify-center pt-3">
            <button
              title="New Matter"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-vault-gold text-vault-bg hover:bg-vault-gold-light transition-colors shadow-vault-gold-glow"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* User row */}
        <div
          className={cn(
            'flex items-center py-3 gap-2',
            collapsed ? 'flex-col px-1' : 'px-3'
          )}
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vault-elevated border border-vault-border text-xs font-semibold text-vault-text-secondary select-none">
              {userInitials}
            </div>
          </div>

          {/* Name + role (expanded only) */}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-vault-text truncate">{user.name}</p>
              <p className="text-2xs text-vault-muted truncate">
                {roleLabel((user as any).role || '')}
              </p>
            </div>
          )}

          {/* Bell with badge */}
          <button
            title="Notifications"
            className="relative shrink-0 rounded p-1 text-vault-muted hover:text-vault-text transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-0 right-0 h-3.5 w-3.5 text-2xs bg-vault-danger text-white rounded-full flex items-center justify-center leading-none">
              3
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
