'use client'
export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Briefcase,
  Clock,
  CalendarDays,
  ArrowRight,
} from 'lucide-react'

// ── Mock data ────────────────────────────────────────────────────────────────

const REVENUE_DATA = [
  { month: 'Nov', invoiced: 142000, collected: 118000 },
  { month: 'Dec', invoiced: 168000, collected: 145000 },
  { month: 'Jan', invoiced: 155000, collected: 132000 },
  { month: 'Feb', invoiced: 189000, collected: 167000 },
  { month: 'Mar', invoiced: 204000, collected: 178000 },
  { month: 'Apr', invoiced: 221000, collected: 198000 },
]

const RECENT_MATTERS = [
  { id: '1', name: 'Okafor v. Meridian Health Systems',   client: 'James Okafor',    type: 'Personal Injury',   status: 'URGENT',  lastActivity: '2h ago',   hours: 124.5 },
  { id: '2', name: 'Chen Family Trust Restructuring',     client: 'Linda Chen',       type: 'Estate Planning',   status: 'ACTIVE',  lastActivity: '4h ago',   hours: 38.0  },
  { id: '3', name: 'Morrison Realty Acquisition',         client: 'Morrison Group',   type: 'Real Estate',       status: 'ACTIVE',  lastActivity: 'Yesterday', hours: 67.5 },
  { id: '4', name: 'State v. Williams (Criminal)',         client: 'D. Williams',      type: 'Criminal Defense',  status: 'PENDING', lastActivity: 'Yesterday', hours: 89.0 },
  { id: '5', name: 'Nguyen Divorce Proceedings',          client: 'M. Nguyen',        type: 'Family Law',        status: 'ACTIVE',  lastActivity: '2d ago',   hours: 45.5  },
  { id: '6', name: 'TechVentures IP Portfolio',           client: 'TechVentures Inc.',type: 'IP/Patent',         status: 'ACTIVE',  lastActivity: '2d ago',   hours: 156.0 },
  { id: '7', name: 'Alvarez Slip & Fall v. Retail Co.',   client: 'Rosa Alvarez',     type: 'Personal Injury',   status: 'ACTIVE',  lastActivity: '3d ago',   hours: 52.0  },
  { id: '8', name: 'H-1B Renewal — Park',                 client: 'Jin-Su Park',      type: 'Immigration',       status: 'PENDING', lastActivity: '3d ago',   hours: 12.0  },
]

const DEADLINES = [
  { id: '1', name: 'Motion for Summary Judgment', matter: 'Okafor v. Meridian',   due: '2h 15m', urgency: 'critical' },
  { id: '2', name: 'Discovery Response Due',       matter: 'Alvarez v. Retail Co.', due: '18h 30m', urgency: 'urgent'  },
  { id: '3', name: 'SOL Deadline',                 matter: 'Chen Estate Matter',    due: '2d 4h',   urgency: 'warning' },
  { id: '4', name: 'Client Follow-Up Required',    matter: 'Nguyen Divorce',        due: '3d',      urgency: 'normal'  },
  { id: '5', name: 'Deposition Notice',            matter: 'TechVentures IP',       due: '5d',      urgency: 'normal'  },
]

const AI_FEED = [
  { initials: 'SM', name: 'Sarah M.',   action: 'ran Discovery analysis',        matter: 'Okafor v. Meridian',   time: '4 min ago',  color: '#2B7CC1' },
  { initials: 'JR', name: 'James R.',   action: 'generated Demand Letter',        matter: 'Alvarez v. Retail Co.', time: '12 min ago', color: '#1E8A4A' },
  { initials: 'AK', name: 'Amy K.',     action: 'ran case law research',          matter: 'State v. Williams',     time: '28 min ago', color: '#C9A84C' },
  { initials: 'TM', name: 'Thomas M.', action: 'reviewed privilege log',          matter: 'TechVentures IP',       time: '41 min ago', color: '#2B7CC1' },
  { initials: 'SM', name: 'Sarah M.',   action: 'drafted motion to dismiss',      matter: 'Morrison Realty',       time: '1h ago',     color: '#2B7CC1' },
  { initials: 'JR', name: 'James R.',   action: 'analyzed deposition transcript', matter: 'Nguyen Divorce',        time: '2h ago',     color: '#1E8A4A' },
  { initials: 'AK', name: 'Amy K.',     action: 'ran conflict check',             matter: 'New Intake #22',        time: '3h ago',     color: '#C9A84C' },
  { initials: 'TM', name: 'Thomas M.', action: 'summarized production docs',      matter: 'Okafor v. Meridian',    time: '4h ago',     color: '#2B7CC1' },
]

const UNBILLED = [
  { matter: 'TechVentures IP Portfolio',    hours: 12.5, amount: 5625 },
  { matter: 'Okafor v. Meridian Health',    hours: 8.0,  amount: 3600 },
  { matter: 'Morrison Realty Acquisition',  hours: 6.5,  amount: 2925 },
]

const UPCOMING_EVENTS = [
  { id: '1', name: 'Status Hearing',              matter: 'Okafor v. Meridian',   datetime: 'Apr 15 · 9:00 AM' },
  { id: '2', name: 'Deposition — Dr. Reynolds',   matter: 'Alvarez v. Retail Co.', datetime: 'Apr 16 · 10:30 AM' },
  { id: '3', name: 'Client Strategy Call',         matter: 'TechVentures IP',      datetime: 'Apr 17 · 2:00 PM'  },
  { id: '4', name: 'Summary Judgment Filing',      matter: 'State v. Williams',    datetime: 'Apr 18 · 5:00 PM'  },
  { id: '5', name: 'Pretrial Conference',          matter: 'Morrison Realty',      datetime: 'Apr 22 · 11:00 AM' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtDollars(n: number) {
  return `$${(n / 1000).toFixed(0)}k`
}

function fmtDollarsFull(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function StatusPill({ status }: { status: string }) {
  const cls: Record<string, string> = {
    URGENT:  'bg-vault-danger/15 text-vault-danger  border border-vault-danger/25',
    ACTIVE:  'bg-vault-accent/15 text-[#4A9DD4]    border border-vault-accent/25',
    PENDING: 'bg-vault-warning/15 text-vault-warning border border-vault-warning/25',
    CLOSED:  'bg-vault-muted/20 text-vault-muted    border border-vault-muted/25',
  }
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-2xs font-semibold uppercase tracking-wide ${cls[status] ?? cls.CLOSED}`}>
      {status}
    </span>
  )
}

const urgencyBorder: Record<string, string> = {
  critical: 'border-vault-danger',
  urgent:   'border-amber-500',
  warning:  'border-yellow-500',
  normal:   'border-vault-success',
}
const urgencyText: Record<string, string> = {
  critical: 'text-vault-danger',
  urgent:   'text-amber-400',
  warning:  'text-yellow-400',
  normal:   'text-vault-success',
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-vault-elevated border border-vault-border rounded-lg p-3 shadow-vault-lg text-xs">
      <p className="text-vault-text-secondary font-semibold mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-vault-muted capitalize">{p.name}:</span>
          <span className="text-vault-text font-medium">{fmtDollarsFull(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

// ── Circular progress ring ────────────────────────────────────────────────────
function CircleProgress({ value, max, size = 44 }: { value: number; max: number; size?: number }) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  const dash = pct * circ
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1A3560" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#C9A84C" strokeWidth={4}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const userName = 'Sarah'

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-vault-text">Dashboard</h1>
          <p className="text-sm text-vault-text-secondary mt-0.5">
            Good morning, {userName} — Morrison &amp; Chen LLP
          </p>
        </div>
      </div>

      {/* Top stat row */}
      <div className="grid grid-cols-4 gap-4">

        {/* 1: Active Matters */}
        <div className="stat-card">
          <p className="stat-label">Active Matters</p>
          <p className="stat-value">47</p>
          <p className="text-xs text-vault-success flex items-center gap-1 mt-1">
            ↑ 12% this month
          </p>
        </div>

        {/* 2: Hours This Week */}
        <div className="stat-card">
          <p className="stat-label">Hours This Week</p>
          <div className="flex items-center gap-3 mt-1">
            <CircleProgress value={38.5} max={40} />
            <div>
              <p className="font-serif text-3xl font-bold text-vault-text leading-none">38.5</p>
              <p className="text-2xs text-vault-muted mt-0.5">of 40h target</p>
            </div>
          </div>
        </div>

        {/* 3: Outstanding */}
        <div className="stat-card">
          <p className="stat-label">Outstanding</p>
          <p className="font-serif text-3xl font-bold text-vault-gold mt-1">$84,200</p>
          <p className="text-xs text-vault-muted mt-1">Awaiting payment</p>
        </div>

        {/* 4: AI Queries Today */}
        <div className="stat-card">
          <p className="stat-label">AI Queries Today</p>
          <p className="stat-value">156</p>
          <p className="text-xs text-vault-muted mt-1">Across firm</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-5 gap-5">

        {/* Left col: Recent Matters */}
        <div className="col-span-3 vault-panel p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-vault-border">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-vault-muted" />
              <h2 className="text-sm font-semibold text-vault-text">Recent Matters</h2>
            </div>
            <Link href="/matters" className="flex items-center gap-1 text-xs text-vault-accent-light hover:text-vault-text transition-colors">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Matter</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Last Activity</th>
                  <th className="text-right">Hours</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_MATTERS.map((m, i) => (
                  <tr
                    key={m.id}
                    className={i % 2 === 0 ? '' : 'bg-vault-elevated/20'}
                  >
                    <td>
                      <p className="font-medium text-vault-text text-sm leading-tight">{m.name}</p>
                    </td>
                    <td className="text-vault-text-secondary text-sm">{m.client}</td>
                    <td className="text-vault-muted text-xs">{m.type}</td>
                    <td><StatusPill status={m.status} /></td>
                    <td className="text-vault-muted text-xs">{m.lastActivity}</td>
                    <td className="text-right text-vault-text-secondary text-sm font-mono">{m.hours.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right col */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Deadlines */}
          <div className="vault-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-vault-text">Today&apos;s Deadlines</h2>
              <Clock className="h-4 w-4 text-vault-muted" />
            </div>
            <div className="space-y-2">
              {DEADLINES.map((dl) => (
                <div
                  key={dl.id}
                  className={`flex items-start gap-3 rounded-md bg-vault-elevated/40 px-3 py-2.5 border-l-2 ${urgencyBorder[dl.urgency]}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-vault-text leading-tight">{dl.name}</p>
                    <p className="text-2xs text-vault-muted mt-0.5">{dl.matter}</p>
                  </div>
                  <span className={`text-2xs font-semibold uppercase tracking-wide shrink-0 ${urgencyText[dl.urgency]}`}>
                    {dl.due}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Activity */}
          <div className="vault-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-vault-text">AI Activity</h2>
              <span className="text-2xs font-bold uppercase tracking-widest bg-vault-gold/15 text-vault-gold border border-vault-gold/30 rounded px-1.5 py-0.5">
                LIVE
              </span>
            </div>
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-0.5">
              {AI_FEED.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="h-6 w-6 rounded-full flex items-center justify-center text-2xs font-bold text-white shrink-0"
                    style={{ background: item.color }}
                  >
                    {item.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-vault-text leading-snug">
                      <span className="font-medium">{item.name}</span>{' '}
                      <span className="text-vault-text-secondary">{item.action}</span>{' '}
                      <span className="text-vault-accent-light">— {item.matter}</span>
                    </p>
                    <p className="text-2xs text-vault-muted mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unbilled Time */}
          <div className="vault-panel p-4">
            <h2 className="text-sm font-semibold text-vault-text mb-3">Unbilled Time</h2>
            <div className="space-y-2">
              {UNBILLED.map((row) => (
                <div key={row.matter} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-vault-text truncate">{row.matter}</p>
                    <p className="text-2xs text-vault-muted">{row.hours}h · {fmtDollarsFull(row.amount)}</p>
                  </div>
                  <button className="shrink-0 text-2xs font-semibold bg-vault-gold/15 text-vault-gold border border-vault-gold/30 rounded px-2 py-1 hover:bg-vault-gold/25 transition-colors">
                    Invoice
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-5 gap-5">

        {/* Revenue chart */}
        <div className="col-span-3 vault-panel p-5">
          <h2 className="text-sm font-semibold text-vault-text mb-4">Revenue — Last 6 Months</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={REVENUE_DATA} barSize={16} barGap={4}>
              <CartesianGrid vertical={false} stroke="#2B4A7A" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#7A8899', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#7A8899', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => fmtDollars(v)}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(43,74,122,0.3)' }} />
              <Bar dataKey="invoiced" name="invoiced" fill="#C9A84C" radius={[3, 3, 0, 0]} />
              <Bar dataKey="collected" name="collected" fill="#2B7CC1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-5 mt-2 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-vault-muted">
              <span className="inline-block h-2 w-2 rounded-full bg-vault-gold" /> Invoiced
            </span>
            <span className="flex items-center gap-1.5 text-xs text-vault-muted">
              <span className="inline-block h-2 w-2 rounded-full bg-vault-accent" /> Collected
            </span>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="col-span-2 vault-panel p-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-4 w-4 text-vault-muted" />
            <h2 className="text-sm font-semibold text-vault-text">Upcoming Events</h2>
          </div>
          <div className="space-y-3">
            {UPCOMING_EVENTS.map((ev) => (
              <div key={ev.id} className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 flex h-7 w-7 items-center justify-center rounded bg-vault-elevated border border-vault-border">
                  <CalendarDays className="h-3.5 w-3.5 text-vault-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-vault-text leading-tight">{ev.name}</p>
                  <p className="text-2xs text-vault-muted mt-0.5">{ev.matter}</p>
                  <p className="text-2xs text-vault-accent-light mt-0.5">{ev.datetime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
