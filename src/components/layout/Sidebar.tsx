'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/brand/Logo'
import {
  LayoutDashboard, Inbox, ClipboardList, Users, Briefcase,
  Calendar, FileText, Search, Database, Clock, Receipt,
  BarChart3, Settings, Shield, UserCheck, AlertTriangle,
  ChevronDown, ChevronRight, Bot, FolderOpen, LogOut,
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
    ],
  },
  {
    label: 'AI Tools',
    items: [
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
      { label: 'Audit',        href: '/admin/audit', icon: Shield },
    ],
  },
]

function NavItem({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors w-full',
        isActive
          ? 'bg-vault-accent/10 text-vault-accent-light border-l-2 border-vault-accent pl-[10px]'
          : 'text-vault-text-secondary hover:bg-vault-elevated hover:text-vault-text'
      )}
    >
      <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-vault-accent-light' : 'text-vault-muted')} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span className="text-xs bg-vault-accent/20 text-vault-accent-light rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function Sidebar({ session }: { session: Session }) {
  const user = session.user
  return (
    <aside className="flex h-full w-56 flex-col border-r border-vault-border bg-vault-surface">
      <div className="flex h-14 items-center border-b border-vault-border px-4">
        <Link href="/dashboard" className="flex items-center">
          <Logo variant="dark" size="sm" />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map((section, si) => (
          <div key={si} className="space-y-0.5">
            {section.label && (
              <p className="text-2xs font-semibold uppercase tracking-widest text-vault-muted px-3 mb-1">{section.label}</p>
            )}
            {section.items.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        ))}
      </nav>
      <div className="px-3 py-2 border-t border-vault-border">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-vault-elevated">
          <Bot className="h-3.5 w-3.5 text-vault-success shrink-0" />
          <div className="min-w-0">
            <p className="text-2xs text-vault-muted uppercase tracking-wider">AI Engine</p>
            <p className="text-xs text-vault-text truncate">Local · Private</p>
          </div>
          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-vault-success shrink-0" />
        </div>
      </div>
      <div className="border-t border-vault-border p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-2xs">{initials(user.name || user.email)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-vault-text truncate">{user.name}</p>
            <p className="text-2xs text-vault-muted truncate">{roleLabel((user as any).role)}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="shrink-0 rounded p-1 text-vault-muted hover:text-vault-text transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
