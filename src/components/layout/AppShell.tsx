'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { AIAssistant } from '@/components/ui/AIAssistant'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { AuditLogPanel } from '@/components/ui/AuditLogPanel'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Briefcase, CalendarDays, Sparkles, MoreHorizontal,
} from 'lucide-react'
import type { Session } from 'next-auth'

/* ── Mobile bottom nav ────────────────────────────────────────────────────── */
function MobileBottomNav({ onAIOpen }: { onAIOpen: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const tabs = [
    { label: 'Dashboard', href: '/dashboard',  icon: LayoutDashboard },
    { label: 'Matters',   href: '/matters',     icon: Briefcase },
    { label: 'AI',        href: null,           icon: Sparkles, center: true },
    { label: 'Calendar',  href: '/calendar',    icon: CalendarDays },
    { label: 'More',      href: null,           icon: MoreHorizontal },
  ]

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 64,
        background: 'var(--bg-sidebar)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 30,
        alignItems: 'stretch',
        display: 'none', // shown by CSS media query
      }}
    >
      {tabs.map(tab => {
        const isActive = tab.href ? pathname.startsWith(tab.href) : false
        const Icon = tab.icon

        if (tab.center) {
          return (
            <button
              key="ai"
              onClick={onAIOpen}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <div style={{
                width: 48, height: 48,
                borderRadius: '50%',
                background: 'var(--gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(201,168,76,0.4)',
                marginBottom: -6,
              }}>
                <Icon style={{ width: 22, height: 22, color: 'var(--bg-base)' }} />
              </div>
            </button>
          )
        }

        return (
          <button
            key={tab.label}
            onClick={() => tab.href && router.push(tab.href)}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              color: isActive ? 'var(--gold)' : 'var(--text-3)',
              transition: 'color 0.15s ease',
            }}
          >
            <Icon style={{ width: 20, height: 20 }} />
            {isActive && (
              <span style={{ fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

/* ── AppShell ─────────────────────────────────────────────────────────────── */
export function AppShell({
  session,
  children,
}: {
  session: Session
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen]       = useState(false)
  const [paletteOpen, setPaletteOpen]     = useState(false)
  const [auditOpen, setAuditOpen]         = useState(false)
  const [aiOpen, setAiOpen]               = useState(false)

  // Global Cmd+K shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(o => !o)
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false)
        setAuditOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'var(--bg-base)',
    }}>
      <Sidebar
        session={session}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar
          onMenuOpen={() => setMobileOpen(true)}
          onSearchOpen={() => setPaletteOpen(true)}
          onAuditOpen={() => setAuditOpen(o => !o)}
        />
        <main style={{
          flex: 1, overflowY: 'auto',
          padding: 24,
        }}>
          {children}
        </main>
      </div>

      {/* WOW features */}
      <AIAssistant />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <AuditLogPanel open={auditOpen} onClose={() => setAuditOpen(false)} />

      {/* Mobile bottom nav */}
      <MobileBottomNav onAIOpen={() => setAiOpen(o => !o)} />
    </div>
  )
}
