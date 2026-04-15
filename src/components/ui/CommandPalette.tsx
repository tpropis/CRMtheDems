'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, Briefcase, Clock, Sparkles, Shield, UserPlus,
  LayoutDashboard, FolderOpen, CalendarDays, BarChart3, X,
} from 'lucide-react'

/* ── Types ──────────────────────────────────────────────────────────────── */
interface PaletteItem {
  id: string
  label: string
  sublabel?: string
  icon: React.ReactNode
  action: () => void
  shortcut?: string
  pill?: { text: string; color: string; bg: string }
  group: string
}

const RECENT_MATTERS = [
  { id: '1', name: 'Okafor v. Meridian Health Systems',  status: 'URGENT',  statusColor: '#E05252', statusBg: 'rgba(224,82,82,0.1)' },
  { id: '2', name: 'TechVentures IP Portfolio Defense',  status: 'ACTIVE',  statusColor: '#3B8FD4', statusBg: 'rgba(59,143,212,0.1)' },
  { id: '3', name: 'Chen Family Trust Restructuring',    status: 'ACTIVE',  statusColor: '#3B8FD4', statusBg: 'rgba(59,143,212,0.1)' },
  { id: '4', name: 'State v. Williams — Drug Charges',   status: 'ACTIVE',  statusColor: '#3B8FD4', statusBg: 'rgba(59,143,212,0.1)' },
]

/* ── CommandPalette ─────────────────────────────────────────────────────── */
export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const go = useCallback((path: string) => {
    router.push(path)
    onClose()
  }, [router, onClose])

  const allItems: PaletteItem[] = [
    // Quick actions
    { id: 'new-matter',   group: 'QUICK ACTIONS', label: 'New Matter',              icon: <Briefcase style={{ width: 15, height: 15 }} />,     action: () => go('/matters'),               shortcut: '⌘N' },
    { id: 'log-time',     group: 'QUICK ACTIONS', label: 'Log Time',                icon: <Clock style={{ width: 15, height: 15 }} />,          action: () => go('/timekeeping'),            shortcut: '⌘T' },
    { id: 'ai-research',  group: 'QUICK ACTIONS', label: 'Run AI Research',          icon: <Sparkles style={{ width: 15, height: 15 }} />,       action: () => go('/research'),               shortcut: '⌘R' },
    { id: 'priv-log',     group: 'QUICK ACTIONS', label: 'Generate Privilege Log',   icon: <Shield style={{ width: 15, height: 15 }} />,         action: () => go('/discovery'),              shortcut: '⌘P' },
    { id: 'new-client',   group: 'QUICK ACTIONS', label: 'New Client',               icon: <UserPlus style={{ width: 15, height: 15 }} />,       action: () => go('/clients'),                shortcut: '⌘C' },
    // Recent matters
    ...RECENT_MATTERS.map(m => ({
      id: `matter-${m.id}`,
      group: 'RECENT MATTERS',
      label: m.name,
      icon: <Briefcase style={{ width: 15, height: 15, color: 'var(--text-3)' }} />,
      action: () => go(`/matters`),
      pill: { text: m.status, color: m.statusColor, bg: m.statusBg },
    })),
    // Jump to
    { id: 'nav-dash',     group: 'JUMP TO', label: 'Dashboard',      icon: <LayoutDashboard style={{ width: 15, height: 15 }} />, action: () => go('/dashboard'),   shortcut: '⌘1' },
    { id: 'nav-matters',  group: 'JUMP TO', label: 'Matters',         icon: <Briefcase style={{ width: 15, height: 15 }} />,      action: () => go('/matters'),     shortcut: '⌘2' },
    { id: 'nav-cal',      group: 'JUMP TO', label: 'Calendar',        icon: <CalendarDays style={{ width: 15, height: 15 }} />,   action: () => go('/calendar'),    shortcut: '⌘3' },
    { id: 'nav-docs',     group: 'JUMP TO', label: 'Documents',       icon: <FolderOpen style={{ width: 15, height: 15 }} />,     action: () => go('/documents'),   shortcut: '⌘4' },
    { id: 'nav-time',     group: 'JUMP TO', label: 'Time & Billing',  icon: <Clock style={{ width: 15, height: 15 }} />,          action: () => go('/timekeeping'), shortcut: '⌘5' },
  ]

  const filtered = query.trim()
    ? allItems.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.group.toLowerCase().includes(query.toLowerCase())
      )
    : allItems

  const groups = Array.from(new Set(filtered.map(i => i.group)))

  const flatItems = groups.flatMap(g => filtered.filter(i => i.group === g))

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(i => Math.min(i + 1, flatItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      flatItems[selectedIdx]?.action()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 560,
          maxHeight: 480,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-mid)',
          borderRadius: 12,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKey}
      >
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 16px',
          borderBottom: '1px solid var(--border)',
          height: 52, flexShrink: 0,
        }}>
          <Search style={{ width: 18, height: 18, color: 'var(--text-3)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIdx(0) }}
            placeholder="Search matters, clients, run AI, create…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 16, color: 'var(--text-1)',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-3)', padding: 2, flexShrink: 0,
                display: 'flex', alignItems: 'center',
              }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          )}
          <span style={{
            fontSize: 11, color: 'var(--text-3)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-mid)',
            borderRadius: 4, padding: '2px 6px',
            flexShrink: 0,
          }}>ESC</span>
        </div>

        {/* Results */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {groups.map(group => {
            const items = filtered.filter(i => i.group === group)
            return (
              <div key={group}>
                <div style={{
                  fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.1em', color: 'var(--text-3)',
                  textTransform: 'uppercase',
                  padding: '10px 16px 4px',
                }}>
                  {group}
                </div>
                {items.map(item => {
                  const globalIdx = flatItems.indexOf(item)
                  const isSelected = globalIdx === selectedIdx
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIdx(globalIdx)}
                      style={{
                        width: '100%', height: 40,
                        padding: '0 16px',
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: isSelected ? 'var(--bg-elevated)' : 'transparent',
                        border: 'none', cursor: 'pointer',
                        borderRadius: 6,
                        color: isSelected ? 'var(--text-1)' : 'var(--text-2)',
                        margin: '0 4px', width: 'calc(100% - 8px)',
                        textAlign: 'left',
                        transition: 'background 0.1s ease',
                      }}
                    >
                      <span style={{ color: isSelected ? 'var(--gold)' : 'var(--text-3)', flexShrink: 0 }}>
                        {item.icon}
                      </span>
                      <span style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.label}
                      </span>
                      {item.pill && (
                        <span style={{
                          fontSize: 10, fontWeight: 600, borderRadius: 20,
                          padding: '2px 8px',
                          color: item.pill.color,
                          background: item.pill.bg,
                          border: `1px solid ${item.pill.color}33`,
                          flexShrink: 0,
                        }}>
                          {item.pill.text}
                        </span>
                      )}
                      {item.shortcut && (
                        <span style={{
                          fontSize: 11, color: 'var(--text-3)',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          borderRadius: 4, padding: '1px 5px',
                          flexShrink: 0,
                        }}>
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              No results for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
