'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, Search, ShieldCheck, ClipboardList, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

/* ── Privilege Shield with spinning ring ──────────────────────────────────── */
function PrivilegeShield() {
  const [show, setShow] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {/* Spinning ring wrapper */}
      <div className="shield-ring">
        <div className="shield-inner">
          <ShieldCheck style={{ width: 12, height: 12, color: 'var(--success)' }} />
        </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--success)', whiteSpace: 'nowrap' }}>
        Shield Active
      </span>

      {/* Tooltip */}
      {show && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-mid)',
          borderRadius: 8, padding: '10px 14px',
          width: 280, zIndex: 100,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}>
          <p style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>
            Attorney-client privilege protection active. All AI queries are ZDR-protected and logged
            to your firm's immutable audit trail.
          </p>
          {/* arrow */}
          <div style={{
            position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
            width: 8, height: 8, background: 'var(--bg-elevated)',
            border: '1px solid var(--border-mid)',
            borderTop: 'none', borderLeft: 'none',
            transform: 'translateX(-50%) rotate(45deg)',
          }} />
        </div>
      )}
    </div>
  )
}

/* ── Breadcrumb label from pathname ───────────────────────────────────────── */
function useBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const map: Record<string, string> = {
    dashboard:  'Dashboard',
    matters:    'Matters',
    research:   'AI Research',
    documents:  'Documents',
    discovery:  'Discovery',
    timekeeping:'Time & Billing',
    calendar:   'Calendar',
    clients:    'Clients',
    reports:    'Reports',
    admin:      'Settings',
  }
  const last = segments[segments.length - 1] || 'dashboard'
  return map[last] ?? last.charAt(0).toUpperCase() + last.slice(1)
}

/* ── TopBar ───────────────────────────────────────────────────────────────── */
export function TopBar({
  onMenuOpen,
  onSearchOpen,
  onAuditOpen,
}: {
  onMenuOpen?: () => void
  onSearchOpen?: () => void
  onAuditOpen?: () => void
}) {
  const breadcrumb = useBreadcrumb()

  return (
    <header style={{
      background: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border)',
      height: 56,
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      gap: 16,
    }}>

      {/* Left: hamburger (mobile) + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {/* Hamburger — mobile only */}
        <button
          className="hamburger"
          onClick={onMenuOpen}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 8, display: 'none', flexDirection: 'column',
            gap: 5, alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Open menu"
        >
          <span style={{ width: 22, height: 2, background: 'var(--text-1)', borderRadius: 1, display: 'block' }} />
          <span style={{ width: 22, height: 2, background: 'var(--text-1)', borderRadius: 1, display: 'block' }} />
          <span style={{ width: 22, height: 2, background: 'var(--text-1)', borderRadius: 1, display: 'block' }} />
        </button>

        {/* Breadcrumb */}
        <span style={{
          fontFamily: 'Georgia, serif',
          fontSize: 16,
          color: 'var(--text-1)',
          whiteSpace: 'nowrap',
        }}>
          {breadcrumb}
        </span>
      </div>

      {/* Center: search */}
      <div className="topbar-search-wide" style={{ flex: 1, maxWidth: 360 }}>
        <button
          onClick={onSearchOpen}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-base)',
            border: '1px solid var(--border-mid)',
            borderRadius: 8,
            height: 34, width: '100%',
            padding: '0 12px',
            cursor: 'text',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-mid)'
          }}
        >
          <Search style={{ width: 14, height: 14, color: 'var(--text-3)', flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 13, color: 'var(--text-3)', textAlign: 'left' }}>
            Search matters, clients, run AI…
          </span>
          <span style={{
            fontSize: 11, color: 'var(--text-3)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-mid)',
            borderRadius: 4, padding: '1px 5px',
            lineHeight: 1.4,
          }}>⌘K</span>
        </button>
      </div>

      {/* Right: ZDR + Shield + Bell + Audit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>

        {/* ZDR badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(46,173,110,0.1)',
          border: '1px solid rgba(46,173,110,0.3)',
          borderRadius: 20, padding: '3px 10px',
        }}>
          <div className="pulse-dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--success)', letterSpacing: '0.03em' }}>
            ZDR
          </span>
        </div>

        {/* Privilege Shield */}
        <div className="hide-mobile">
          <PrivilegeShield />
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'var(--border-mid)' }} />

        {/* Audit log trigger */}
        <button
          onClick={onAuditOpen}
          title="Audit Trail"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, borderRadius: 6,
            color: 'var(--text-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
        >
          <ClipboardList style={{ width: 17, height: 17 }} />
        </button>

        {/* Bell */}
        <button
          title="Notifications"
          style={{
            position: 'relative', background: 'none', border: 'none',
            cursor: 'pointer', padding: 4, borderRadius: 6,
            color: 'var(--text-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
        >
          <Bell style={{ width: 17, height: 17 }} />
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: 16, height: 16,
            background: 'var(--danger)', color: 'white',
            borderRadius: '50%', fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>3</span>
        </button>
      </div>
    </header>
  )
}
