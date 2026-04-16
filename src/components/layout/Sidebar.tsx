'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { initials, roleLabel } from '@/lib/utils'
import {
  LayoutDashboard, Briefcase, Brain, FileEdit, Shield,
  Clock, FolderOpen, CalendarDays, Users, BarChart3,
  Settings, Bell, Plus, ChevronLeft, ChevronRight,
} from 'lucide-react'
import type { Session } from 'next-auth'

/* ── Pillar Logo SVG ─────────────────────────────────────────────────────── */
function PillarLogo({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 52" width={size} height={Math.round(size * 52 / 48)}
      xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect x="4"  y="2"  width="40" height="5"  rx="1"   fill="currentColor" />
      <rect x="10" y="7"  width="28" height="3"  rx="0.5" fill="currentColor" opacity="0.7" />
      <rect x="10" y="10" width="8"  height="32" rx="1"   fill="currentColor" />
      <rect x="30" y="10" width="8"  height="32" rx="1"   fill="currentColor" />
      <rect x="11" y="13" width="6"  height="2"  rx="0.5" fill="#1A2942" />
      <rect x="11" y="17" width="6"  height="2"  rx="0.5" fill="#1A2942" />
      <rect x="11" y="13" width="2"  height="6"  rx="0.5" fill="#1A2942" />
      <polygon points="18,10 30,10 26,42 22,42" fill="currentColor" opacity="0.5" />
      <rect x="8"  y="42" width="32" height="4"  rx="1"   fill="currentColor" />
      <rect x="4"  y="46" width="40" height="4"  rx="1"   fill="currentColor" />
    </svg>
  )
}

/* ── Nav items config ────────────────────────────────────────────────────── */
interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  badge?: string | number
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',      href: '/dashboard',         icon: LayoutDashboard, exact: true },
  { label: 'Matters',        href: '/matters',            icon: Briefcase,       badge: '47' },
  { label: 'AI Research',    href: '/research',           icon: Brain },
  { label: 'AI Drafting',    href: '/documents/generate', icon: FileEdit },
  { label: 'Discovery',      href: '/discovery',          icon: Shield },
  { label: 'Time & Billing', href: '/timekeeping',        icon: Clock },
  { label: 'Documents',      href: '/documents',          icon: FolderOpen },
  { label: 'Calendar',       href: '/calendar',           icon: CalendarDays },
  { label: 'Clients',        href: '/clients',            icon: Users },
  { label: 'Reports',        href: '/reports',            icon: BarChart3 },
  { label: 'Settings',       href: '/admin',              icon: Settings },
]

/* ── NavLink ─────────────────────────────────────────────────────────────── */
function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname()
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn('group flex items-center gap-2.5 transition-colors', isActive && 'pointer-events-none')}
      style={{
        height: 38,
        padding: collapsed ? '0 8px' : '0 12px 0 13px',
        borderRadius: 7,
        margin: '1px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 13,
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--gold)' : 'var(--text-2)',
        textDecoration: 'none',
        position: 'relative',
        justifyContent: collapsed ? 'center' : undefined,
        background: isActive ? 'var(--gold-dim)' : 'transparent',
        borderLeft: isActive && !collapsed ? '3px solid var(--gold)' : '3px solid transparent',
        paddingLeft: isActive && !collapsed ? 13 : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--text-1)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--text-2)'
        }
      }}
    >
      <item.icon
        className="shrink-0 h-[15px] w-[15px]"
        style={{ color: isActive ? 'var(--gold)' : 'var(--text-3)' }}
      />
      {!collapsed && (
        <>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.label}
          </span>
          {item.badge !== undefined && (
            <span style={{
              background: 'var(--accent-dim)', color: 'var(--accent)',
              fontSize: 10, fontWeight: 600,
              borderRadius: 20, padding: '2px 7px',
              border: '1px solid var(--accent-border)',
              lineHeight: 1,
            }}>
              {item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && item.badge !== undefined && (
        <span style={{
          position: 'absolute', top: 2, right: 2,
          width: 14, height: 14,
          background: 'var(--accent)', color: 'white',
          borderRadius: '50%', fontSize: 8, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {item.badge}
        </span>
      )}
    </Link>
  )
}

/* ── Sidebar inner content (shared desktop + mobile) ─────────────────────── */
function SidebarInner({
  collapsed,
  setCollapsed,
  userInitials,
  user,
  showToggle,
}: {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  userInitials: string
  user: any
  showToggle: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Toggle button */}
      {showToggle && (
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            position: 'absolute', right: -12, top: 22, zIndex: 10,
            width: 24, height: 24, borderRadius: '50%',
            border: '1px solid var(--border-mid)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      )}

      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: collapsed ? 0 : 10,
        padding: collapsed ? '20px 0 16px' : '20px 16px 16px',
        justifyContent: collapsed ? 'center' : undefined,
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ color: 'var(--gold)' }}>
          <PillarLogo size={collapsed ? 26 : 34} />
        </div>
        {!collapsed && (
          <div>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: 13, fontWeight: 700,
              letterSpacing: '0.15em',
              color: 'var(--text-1)', lineHeight: 1.1,
            }}>PRIVILEGE VAULT</div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.2em',
              color: 'var(--accent)', marginTop: 1,
            }}>AI</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {NAV_ITEMS.map(item => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* AI Engine section */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '12px 16px',
        flexShrink: 0,
      }}>
        {!collapsed && (
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
            color: 'var(--text-3)', textTransform: 'uppercase',
            marginBottom: 8,
          }}>AI Engine</div>
        )}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          justifyContent: collapsed ? 'center' : undefined,
        }}>
          <div className="pulse-dot" />
          {!collapsed && (
            <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>
              Local · Private
            </span>
          )}
        </div>
        {!collapsed && (
          <p style={{ fontSize: 10, color: 'var(--text-3)', margin: '4px 0 0' }}>
            ZDR-protected · Audit logged
          </p>
        )}
      </div>

      {/* New Matter CTA */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: collapsed ? '10px 0' : '10px 12px',
        display: 'flex', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {!collapsed ? (
          <button className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
            <Plus className="h-4 w-4" />
            New Matter
          </button>
        ) : (
          <button
            title="New Matter"
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--gold)', color: 'var(--bg-base)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 1px rgba(201,168,76,0.5), 0 0 16px rgba(201,168,76,0.2)',
            }}
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* User row */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: collapsed ? '12px 0' : '12px 16px',
        display: 'flex', alignItems: 'center',
        gap: 10, flexShrink: 0,
        justifyContent: collapsed ? 'center' : undefined,
        flexDirection: collapsed ? 'column' : 'row',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-mid)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: 'var(--text-1)',
          flexShrink: 0, userSelect: 'none',
        }}>
          {userInitials}
        </div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 13, fontWeight: 500, color: 'var(--text-1)',
              margin: 0, lineHeight: 1.2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user.name}
            </p>
            <p style={{
              fontSize: 11, color: 'var(--text-3)', margin: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {roleLabel((user as any).role || '')}
            </p>
          </div>
        )}
        {!collapsed && (
          <button
            title="Notifications"
            style={{
              position: 'relative', flexShrink: 0,
              background: 'none', border: 'none',
              padding: 4, borderRadius: 6, cursor: 'pointer',
              color: 'var(--text-3)', transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
          >
            <Bell className="h-4 w-4" />
            <span style={{
              position: 'absolute', top: 0, right: 0,
              width: 14, height: 14,
              background: 'var(--danger)', color: 'white',
              borderRadius: '50%', fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>3</span>
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Sidebar exported component ──────────────────────────────────────────── */
export function Sidebar({
  session,
  mobileOpen,
  onMobileClose,
}: {
  session: Session
  mobileOpen?: boolean
  onMobileClose?: () => void
}) {
  const user = session.user
  const userInitials = initials((user.name || user.email || 'U').toString())

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed))
  }, [collapsed])

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 39,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Mobile sidebar (slide in from left) */}
      <aside
        className="pv-sidebar md:hidden"
        style={{
          position: 'fixed', left: 0, top: 0,
          width: 280, height: '100vh',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 40,
          overflow: 'hidden',
        }}
      >
        <SidebarInner
          collapsed={false}
          setCollapsed={setCollapsed}
          userInitials={userInitials}
          user={user}
          showToggle={false}
        />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="pv-sidebar sidebar-desktop hidden md:flex flex-col"
        style={{
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border)',
          width: collapsed ? 64 : 240,
          height: '100vh',
          flexShrink: 0,
          position: 'relative',
          transition: 'width 0.2s ease',
          overflowX: 'hidden',
        }}
      >
        <SidebarInner
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          userInitials={userInitials}
          user={user}
          showToggle
        />
      </aside>
    </>
  )
}
