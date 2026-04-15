'use client'
export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Briefcase, Clock, CalendarDays, ArrowRight } from 'lucide-react'

// ── Mock data ─────────────────────────────────────────────────────────────────

const REVENUE_DATA = [
  { month: 'Nov', invoiced: 142000, collected: 118000 },
  { month: 'Dec', invoiced: 168000, collected: 145000 },
  { month: 'Jan', invoiced: 155000, collected: 132000 },
  { month: 'Feb', invoiced: 189000, collected: 167000 },
  { month: 'Mar', invoiced: 204000, collected: 178000 },
  { month: 'Apr', invoiced: 221000, collected: 198000 },
]

const RECENT_MATTERS = [
  { id: '1', name: 'Okafor v. Meridian Health Systems',  client: 'James Okafor',     type: 'Personal Injury',  status: 'URGENT',  lastActivity: '2h ago',    hours: 124.5 },
  { id: '2', name: 'Chen Family Trust Restructuring',    client: 'Linda Chen',        type: 'Estate Planning',  status: 'ACTIVE',  lastActivity: '4h ago',    hours: 38.0  },
  { id: '3', name: 'Morrison Realty Acquisition',        client: 'Morrison Group',    type: 'Real Estate',      status: 'ACTIVE',  lastActivity: 'Yesterday', hours: 67.5  },
  { id: '4', name: 'State v. Williams (Criminal)',        client: 'D. Williams',       type: 'Criminal Defense', status: 'PENDING', lastActivity: 'Yesterday', hours: 89.0  },
  { id: '5', name: 'Nguyen Divorce Proceedings',         client: 'M. Nguyen',         type: 'Family Law',       status: 'ACTIVE',  lastActivity: '2d ago',    hours: 45.5  },
  { id: '6', name: 'TechVentures IP Portfolio',          client: 'TechVentures Inc.', type: 'IP/Patent',        status: 'ACTIVE',  lastActivity: '2d ago',    hours: 156.0 },
  { id: '7', name: 'Alvarez Slip & Fall v. Retail Co.',  client: 'Rosa Alvarez',      type: 'Personal Injury',  status: 'ACTIVE',  lastActivity: '3d ago',    hours: 52.0  },
  { id: '8', name: 'H-1B Renewal — Park',                client: 'Jin-Su Park',       type: 'Immigration',      status: 'PENDING', lastActivity: '3d ago',    hours: 12.0  },
]

const TICKER_ITEMS = [
  { matter: 'Okafor v. Meridian',    label: 'MSJ Filing',            countdown: '2h 15m',  urgency: 'red'   },
  { matter: 'Alvarez v. Retail Co.', label: 'Discovery Response',    countdown: '18h 30m', urgency: 'red'   },
  { matter: 'Chen Estate',           label: 'SOL Deadline',          countdown: '2d 4h',   urgency: 'amber' },
  { matter: 'Nguyen Divorce',        label: 'Client Follow-Up',      countdown: '3d',      urgency: 'amber' },
  { matter: 'TechVentures IP',       label: 'Deposition Notice',     countdown: '5d',      urgency: 'amber' },
  { matter: 'Torres Immigration',    label: 'Visa Renewal',          countdown: '47d 2h',  urgency: 'green' },
  { matter: 'Morrison Realty',       label: 'Closing Date',          countdown: '12d',     urgency: 'amber' },
  { matter: 'Washington v. City',    label: 'Pretrial Conference',   countdown: '8d 6h',   urgency: 'amber' },
]

const urgencyDot: Record<string, string> = {
  red:   '#E05252',
  amber: '#D4A017',
  green: '#2EAD6E',
}

const AI_FEED = [
  { initials: 'SM', name: 'Sarah M.',  action: 'ran Discovery analysis',        matter: 'Okafor v. Meridian',    time: '4 min ago',  color: '#3B8FD4' },
  { initials: 'JR', name: 'James R.',  action: 'generated Demand Letter',       matter: 'Alvarez v. Retail Co.', time: '12 min ago', color: '#2EAD6E' },
  { initials: 'AK', name: 'Amy K.',    action: 'ran case law research',         matter: 'State v. Williams',     time: '28 min ago', color: '#C9A84C' },
  { initials: 'TM', name: 'Thomas M.', action: 'reviewed privilege log',        matter: 'TechVentures IP',       time: '41 min ago', color: '#3B8FD4' },
  { initials: 'SM', name: 'Sarah M.',  action: 'drafted motion to dismiss',     matter: 'Morrison Realty',       time: '1h ago',     color: '#3B8FD4' },
  { initials: 'JR', name: 'James R.',  action: 'analyzed deposition transcript',matter: 'Nguyen Divorce',        time: '2h ago',     color: '#2EAD6E' },
  { initials: 'AK', name: 'Amy K.',    action: 'ran conflict check',            matter: 'New Intake #22',        time: '3h ago',     color: '#C9A84C' },
]

const UNBILLED = [
  { matter: 'TechVentures IP Portfolio',   hours: 12.5, amount: 5625 },
  { matter: 'Okafor v. Meridian Health',   hours: 8.0,  amount: 3600 },
  { matter: 'Morrison Realty Acquisition', hours: 6.5,  amount: 2925 },
]

const UPCOMING_EVENTS = [
  { id: '1', name: 'Status Hearing',             matter: 'Okafor v. Meridian',    datetime: 'Apr 15 · 9:00 AM'  },
  { id: '2', name: 'Deposition — Dr. Reynolds',  matter: 'Alvarez v. Retail Co.', datetime: 'Apr 16 · 10:30 AM' },
  { id: '3', name: 'Client Strategy Call',        matter: 'TechVentures IP',       datetime: 'Apr 17 · 2:00 PM'  },
  { id: '4', name: 'Summary Judgment Filing',     matter: 'State v. Williams',     datetime: 'Apr 18 · 5:00 PM'  },
  { id: '5', name: 'Pretrial Conference',         matter: 'Morrison Realty',       datetime: 'Apr 22 · 11:00 AM' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDollars(n: number) { return `$${(n / 1000).toFixed(0)}k` }

function fmtDollarsFull(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    URGENT:  { bg: 'rgba(224,82,82,0.1)',   color: '#E05252', border: 'rgba(224,82,82,0.3)'   },
    ACTIVE:  { bg: 'rgba(59,143,212,0.1)',  color: '#3B8FD4', border: 'rgba(59,143,212,0.3)'  },
    PENDING: { bg: 'rgba(212,160,23,0.1)',  color: '#D4A017', border: 'rgba(212,160,23,0.3)'  },
    CLOSED:  { bg: 'rgba(78,100,128,0.15)', color: '#4E6480', border: 'rgba(78,100,128,0.25)' },
  }
  const s = styles[status] ?? styles.CLOSED
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 20,
      fontSize: 10, fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase',
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: 'var(--text-2)', fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '3px 0' }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: p.fill }} />
          <span style={{ color: 'var(--text-3)', textTransform: 'capitalize' }}>{p.name}:</span>
          <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{fmtDollarsFull(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

// ── Deadline Ticker ───────────────────────────────────────────────────────────

function DeadlineTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS] // duplicate for seamless loop

  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '0 28px',
              borderRight: '1px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: urgencyDot[item.urgency],
              flexShrink: 0,
              boxShadow: `0 0 6px ${urgencyDot[item.urgency]}`,
            }} />
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
              {item.matter}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>—</span>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{item.label}:</span>
            <span style={{
              fontFamily: 'JetBrains Mono, Courier New, monospace',
              fontSize: 12, fontWeight: 700,
              color: urgencyDot[item.urgency],
            }}>
              {item.countdown}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 4 }}>remaining</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Stat card component ───────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accentClass, children,
}: {
  label: string
  value?: string
  sub?: React.ReactNode
  accentClass?: string
  children?: React.ReactNode
}) {
  return (
    <div className={`stat-card ${accentClass ?? ''}`}>
      <p className="stat-label">{label}</p>
      {value && <p className="stat-value">{value}</p>}
      {children}
      {sub && <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-3)' }}>{sub}</div>}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fade-slide-up 0.25s ease forwards' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 'normal', color: 'var(--text-1)', margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 3 }}>
            Good morning, Sarah — Morrison &amp; Chen LLP
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Active Matters" value="47" accentClass="accent-gold"
          sub={<span style={{ color: 'var(--success)' }}>↑ 12% this month</span>} />

        <StatCard label="Hours This Week" accentClass="">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            {/* Mini ring */}
            <svg width={44} height={44} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
              <circle cx={22} cy={22} r={18} fill="none" stroke="var(--bg-elevated)" strokeWidth={4} />
              <circle cx={22} cy={22} r={18} fill="none" stroke="var(--gold)" strokeWidth={4}
                strokeDasharray={`${(38.5 / 40) * 2 * Math.PI * 18} ${2 * Math.PI * 18}`}
                strokeLinecap="round" />
            </svg>
            <div>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 30, color: 'var(--text-1)', margin: 0, lineHeight: 1 }}>38.5</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)', margin: '3px 0 0' }}>of 40h target</p>
            </div>
          </div>
        </StatCard>

        <StatCard label="Outstanding" accentClass="accent-warning"
          sub="Awaiting payment">
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 30, color: 'var(--gold)', margin: '6px 0 0', lineHeight: 1 }}>
            $84,200
          </p>
        </StatCard>

        <StatCard label="AI Queries Today" value="156" accentClass="accent-success"
          sub="Across firm" />
      </div>

      {/* Deadline Ticker */}
      <DeadlineTicker />

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>

        {/* Recent Matters table */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase style={{ width: 15, height: 15, color: 'var(--text-3)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Recent Matters</span>
            </div>
            <Link href="/matters" style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 12, color: 'var(--accent)', textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}>
              View All <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Matter</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Last Activity</th>
                  <th style={{ textAlign: 'right' }}>Hours</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_MATTERS.map(m => (
                  <tr key={m.id}>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>{m.name}</span>
                    </td>
                    <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{m.client}</td>
                    <td style={{ color: 'var(--text-3)', fontSize: 11 }}>{m.type}</td>
                    <td><StatusPill status={m.status} /></td>
                    <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{m.lastActivity}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-2)' }}>
                      {m.hours.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* AI Activity */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>AI Activity</span>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                background: 'var(--gold-dim)', color: 'var(--gold)',
                border: '1px solid var(--gold-border)',
                borderRadius: 20, padding: '2px 8px',
              }}>LIVE</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 220, overflowY: 'auto' }}>
              {AI_FEED.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: item.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: 'white', flexShrink: 0,
                  }}>
                    {item.initials}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 12, color: 'var(--text-1)', margin: 0, lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>{' '}
                      <span style={{ color: 'var(--text-2)' }}>{item.action}</span>{' '}
                      <span style={{ color: 'var(--accent)' }}>— {item.matter}</span>
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--text-3)', margin: '2px 0 0' }}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unbilled Time */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', display: 'block', marginBottom: 12 }}>
              Unbilled Time
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {UNBILLED.map(row => (
                <div key={row.matter} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.matter}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)', margin: '2px 0 0' }}>
                      {row.hours}h · {fmtDollarsFull(row.amount)}
                    </p>
                  </div>
                  <button style={{
                    flexShrink: 0, fontSize: 11, fontWeight: 600,
                    background: 'var(--gold-dim)', color: 'var(--gold)',
                    border: '1px solid var(--gold-border)',
                    borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}>
                    Invoice
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>

        {/* Revenue chart */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', display: 'block', marginBottom: 16 }}>
            Revenue — Last 6 Months
          </span>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={REVENUE_DATA} barSize={14} barGap={4}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-3)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={fmtDollars} width={48} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="invoiced"  name="invoiced"  fill="#C9A84C" radius={[3,3,0,0]} />
              <Bar dataKey="collected" name="collected" fill="#3B8FD4" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 8, justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-3)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
              Invoiced
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-3)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B8FD4', display: 'inline-block' }} />
              Collected
            </span>
          </div>
        </div>

        {/* Upcoming Events */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <CalendarDays style={{ width: 15, height: 15, color: 'var(--text-3)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Upcoming Events</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {UPCOMING_EVENTS.map(ev => (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CalendarDays style={{ width: 14, height: 14, color: 'var(--accent)' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', margin: 0, lineHeight: 1.3 }}>{ev.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-3)', margin: '2px 0 0' }}>{ev.matter}</p>
                  <p style={{ fontSize: 11, color: 'var(--accent)', margin: '2px 0 0' }}>{ev.datetime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
