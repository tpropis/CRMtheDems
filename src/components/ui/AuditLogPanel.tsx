'use client'

import React, { useState } from 'react'
import {
  X, Sparkles, FileText, LogIn, Briefcase, Clock,
  DollarSign, Download, Shield,
} from 'lucide-react'

type AuditTab = 'all' | 'ai' | 'docs'

interface AuditEntry {
  id: string
  type: 'ai' | 'doc' | 'access' | 'matter' | 'time' | 'invoice'
  icon: React.ReactNode
  borderColor: string
  primary: string
  secondary: string
  time: string
  zdr?: boolean
}

const ENTRIES: AuditEntry[] = [
  { id: '1',  type: 'ai',      icon: <Sparkles style={{ width: 14, height: 14 }} />,  borderColor: 'var(--gold)',    primary: 'AI Research query ran',                        secondary: 'Sarah M.',    time: '2m ago',  zdr: true },
  { id: '2',  type: 'doc',     icon: <FileText style={{ width: 14, height: 14 }} />,  borderColor: 'var(--accent)', primary: 'Document uploaded to Okafor matter',           secondary: 'James C.',    time: '5m ago' },
  { id: '3',  type: 'ai',      icon: <Sparkles style={{ width: 14, height: 14 }} />,  borderColor: 'var(--gold)',    primary: 'Privilege log generated',                      secondary: 'Sarah M.',    time: '12m ago', zdr: true },
  { id: '4',  type: 'access',  icon: <LogIn style={{ width: 14, height: 14 }} />,     borderColor: 'var(--success)','primary': 'Margaret H. signed in',                     secondary: 'System',      time: '18m ago' },
  { id: '5',  type: 'matter',  icon: <Briefcase style={{ width: 14, height: 14 }} />, borderColor: 'var(--accent)', primary: 'New matter created: Chen Medical Malpractice', secondary: 'James C.',    time: '34m ago' },
  { id: '6',  type: 'time',    icon: <Clock style={{ width: 14, height: 14 }} />,     borderColor: '#9B59B6',       primary: 'Time entry logged: 2.5h — Okafor research',   secondary: 'Alicia P.',   time: '1h ago' },
  { id: '7',  type: 'ai',      icon: <Sparkles style={{ width: 14, height: 14 }} />,  borderColor: 'var(--gold)',    primary: 'Document drafted: Motion to Dismiss',          secondary: 'Sarah M.',    time: '1h ago',  zdr: true },
  { id: '8',  type: 'invoice', icon: <DollarSign style={{ width: 14, height: 14 }} />,borderColor: 'var(--warning)','primary': 'Invoice #INV-0042 sent to Henderson Trust',  secondary: 'System',      time: '2h ago' },
  { id: '9',  type: 'doc',     icon: <FileText style={{ width: 14, height: 14 }} />,  borderColor: 'var(--accent)', primary: 'Deposition transcript uploaded',                secondary: 'Alicia P.',   time: '2h ago' },
  { id: '10', type: 'ai',      icon: <Sparkles style={{ width: 14, height: 14 }} />,  borderColor: 'var(--gold)',    primary: 'Case law research: damages cap analysis',      secondary: 'Thomas M.',   time: '3h ago',  zdr: true },
  { id: '11', type: 'access',  icon: <LogIn style={{ width: 14, height: 14 }} />,     borderColor: 'var(--success)','primary': 'James C. signed in',                        secondary: 'System',      time: '4h ago' },
  { id: '12', type: 'matter',  icon: <Briefcase style={{ width: 14, height: 14 }} />, borderColor: 'var(--accent)', primary: 'Matter status updated: Nguyen — Trial set',     secondary: 'Amy K.',      time: '4h ago' },
  { id: '13', type: 'time',    icon: <Clock style={{ width: 14, height: 14 }} />,     borderColor: '#9B59B6',       primary: 'Time entry logged: 1.0h — Client call',        secondary: 'Thomas M.',   time: '5h ago' },
  { id: '14', type: 'doc',     icon: <FileText style={{ width: 14, height: 14 }} />,  borderColor: 'var(--accent)', primary: 'Expert report added to TechVentures IP',       secondary: 'Sarah M.',    time: '6h ago' },
  { id: '15', type: 'ai',      icon: <Sparkles style={{ width: 14, height: 14 }} />,  borderColor: 'var(--gold)',    primary: 'Conflict check completed — no conflicts',      secondary: 'System',      time: '7h ago',  zdr: true },
]

export function AuditLogPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<AuditTab>('all')

  const filtered = ENTRIES.filter(e => {
    if (tab === 'ai')   return e.type === 'ai'
    if (tab === 'docs') return e.type === 'doc'
    return true
  })

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 48,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed', right: 0, top: 0,
          width: 360, height: '100vh',
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-mid)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
          zIndex: 49,
          display: 'flex', flexDirection: 'column',
          animation: 'slide-in-right 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 16px 12px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield style={{ width: 15, height: 15, color: 'var(--gold)' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>Audit Trail</span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-3)', padding: 4, borderRadius: 4,
                display: 'flex', alignItems: 'center',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {([
              { key: 'all', label: 'All Activity' },
              { key: 'ai',  label: 'AI Queries' },
              { key: 'docs',label: 'Documents' },
            ] as { key: AuditTab; label: string }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 12, fontWeight: 500,
                  cursor: 'pointer',
                  border: tab === t.key ? '1px solid var(--border-mid)' : '1px solid transparent',
                  background: tab === t.key ? 'var(--bg-elevated)' : 'transparent',
                  color: tab === t.key ? 'var(--text-1)' : 'var(--text-3)',
                  transition: 'all 0.15s ease',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map(entry => (
              <div
                key={entry.id}
                style={{
                  display: 'flex', gap: 12,
                  padding: '10px 12px',
                  borderRadius: 8,
                  borderLeft: `2px solid ${entry.borderColor}`,
                  background: 'var(--bg-elevated)',
                  marginBottom: 4,
                }}
              >
                <span style={{ color: entry.borderColor, flexShrink: 0, marginTop: 1 }}>
                  {entry.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)', lineHeight: 1.4 }}>
                      {entry.primary}
                    </span>
                    {entry.zdr && (
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        color: 'var(--gold)',
                        background: 'var(--gold-dim)',
                        border: '1px solid var(--gold-border)',
                        borderRadius: 10, padding: '1px 5px',
                        letterSpacing: '0.05em',
                      }}>ZDR</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                    {entry.secondary} · {entry.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export button */}
        <div style={{ borderTop: '1px solid var(--border)', padding: 16, flexShrink: 0 }}>
          <button
            style={{
              width: '100%', height: 36,
              background: 'transparent',
              border: '1px solid var(--border-mid)',
              borderRadius: 8,
              color: 'var(--text-2)',
              fontSize: 13, fontWeight: 500,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--text-1)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--text-2)'
            }}
          >
            <Download style={{ width: 14, height: 14 }} />
            Export Full Audit Log
          </button>
        </div>
      </div>
    </>
  )
}
