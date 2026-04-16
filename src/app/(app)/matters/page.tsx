'use client'
export const dynamic = 'force-dynamic'

import React, { useState, useMemo } from 'react'
import { Search, Plus, ChevronUp, ChevronDown, X, FileText, Clock, CalendarDays, Brain, Folder, List, GanttChartSquare } from 'lucide-react'

const MATTERS = [
  { id: '1',  number: 'MCL-2024-001', name: 'Okafor v. Meridian Health Systems',         client: 'James Okafor',       area: 'Personal Injury',  attorney: 'Sarah Morrison', status: 'URGENT',  opened: '2024-01-15', billed: 186500, hours: 124.5, health: 45, expectedClose: '2024-09-15' },
  { id: '2',  number: 'MCL-2024-002', name: 'Chen Family Trust Restructuring',            client: 'Linda Chen',         area: 'Estate Planning',  attorney: 'Thomas Chen',    status: 'ACTIVE',  opened: '2024-01-22', billed: 28500,  hours: 38.0,  health: 78, expectedClose: '2024-08-01' },
  { id: '3',  number: 'MCL-2024-003', name: 'Morrison Realty Portfolio Acquisition',      client: 'Morrison Group LLC', area: 'Real Estate',      attorney: 'Sarah Morrison', status: 'ACTIVE',  opened: '2024-02-01', billed: 84200,  hours: 67.5,  health: 92, expectedClose: '2024-07-20' },
  { id: '4',  number: 'MCL-2024-004', name: 'State v. Williams — Drug Charges',           client: 'D. Williams',        area: 'Criminal Defense', attorney: 'James Rowe',     status: 'ACTIVE',  opened: '2024-02-10', billed: 124000, hours: 89.0,  health: 88, expectedClose: '2024-10-01' },
  { id: '5',  number: 'MCL-2024-005', name: 'Nguyen v. Nguyen — Dissolution',             client: 'Michelle Nguyen',    area: 'Family Law',       attorney: 'Amy Kim',        status: 'ACTIVE',  opened: '2024-02-14', billed: 38500,  hours: 45.5,  health: 71, expectedClose: '2024-09-01' },
  { id: '6',  number: 'MCL-2024-006', name: 'TechVentures IP Portfolio Defense',          client: 'TechVentures Inc.',  area: 'IP/Patent',        attorney: 'Thomas Chen',    status: 'ACTIVE',  opened: '2024-02-20', billed: 245000, hours: 156.0, health: 95, expectedClose: '2024-11-15' },
  { id: '7',  number: 'MCL-2024-007', name: 'Alvarez v. Riverside Retail — Slip & Fall', client: 'Rosa Alvarez',       area: 'Personal Injury',  attorney: 'Sarah Morrison', status: 'ACTIVE',  opened: '2024-03-01', billed: 42500,  hours: 52.0,  health: 33, expectedClose: '2024-10-30' },
  { id: '8',  number: 'MCL-2024-008', name: 'H-1B Renewal — Park / Apex Corp',           client: 'Jin-Su Park',        area: 'Immigration',      attorney: 'Amy Kim',        status: 'PENDING', opened: '2024-03-05', billed: 8500,   hours: 12.0,  health: 82, expectedClose: '2024-06-30' },
  { id: '9',  number: 'MCL-2024-009', name: 'Rodriguez Business Formation',              client: 'Maria Rodriguez',    area: 'Corporate',        attorney: 'Thomas Chen',    status: 'ACTIVE',  opened: '2024-03-10', billed: 15000,  hours: 18.5,  health: 88, expectedClose: '2024-07-01' },
  { id: '10', number: 'MCL-2024-010', name: 'Estate of Harold Kim — Probate',            client: 'Kim Family',         area: 'Estate Planning',  attorney: 'James Rowe',     status: 'ACTIVE',  opened: '2024-03-15', billed: 32000,  hours: 28.0,  health: 71, expectedClose: '2024-12-01' },
  { id: '11', number: 'MCL-2024-011', name: 'Washington v. City of Riverside',           client: 'T. Washington',      area: 'Civil Litigation', attorney: 'Sarah Morrison', status: 'ACTIVE',  opened: '2024-03-20', billed: 68500,  hours: 74.0,  health: 78, expectedClose: '2025-01-15' },
  { id: '12', number: 'MCL-2024-012', name: 'Sunrise Apartments Eviction — Unit 12',     client: 'Sunrise Properties', area: 'Real Estate',      attorney: 'James Rowe',     status: 'CLOSED',  opened: '2024-01-10', billed: 5500,   hours: 8.0,   health: 95, expectedClose: '2024-04-01' },
  { id: '13', number: 'MCL-2024-013', name: 'Davidson Employment Dispute',               client: 'Carl Davidson',      area: 'Employment',       attorney: 'Amy Kim',        status: 'PENDING', opened: '2024-04-01', billed: 12000,  hours: 14.5,  health: 45, expectedClose: '2024-10-01' },
  { id: '14', number: 'MCL-2024-014', name: 'Patel Green Card — EB-2',                   client: 'Priya Patel',        area: 'Immigration',      attorney: 'Amy Kim',        status: 'ACTIVE',  opened: '2024-04-05', billed: 6800,   hours: 9.0,   health: 88, expectedClose: '2024-09-30' },
  { id: '15', number: 'MCL-2024-015', name: 'Chen v. Former Employer — Wrongful Term.',  client: 'David Chen',         area: 'Employment',       attorney: 'Amy Kim',        status: 'ACTIVE',  opened: '2024-04-08', billed: 18500,  hours: 22.0,  health: 71, expectedClose: '2024-11-01' },
]

const HEALTH_TOOLTIPS: Record<number, string> = {
  45: '✓ Deadlines current (+25)\n⚠ Invoice overdue 15 days (-15)\n⚠ No time logged this week (-20)\n✓ Documents up to date (+20)\n⚠ Last client contact > 14 days (-15)\nScore: 45/100',
  78: '✓ Deadlines current (+25)\n✓ Time logged this week (+20)\n⚠ Invoice overdue 7 days (-10)\n✓ Documents up to date (+20)\n✓ Last client contact < 7 days (+20)\nScore: 78/100',
  92: '✓ Deadlines current (+25)\n✓ Time logged this week (+20)\n✓ Invoice current (+5)\n✓ Documents up to date (+20)\n✓ Last client contact < 7 days (+20)\nScore: 92/100',
  88: '✓ Deadlines current (+25)\n✓ Time logged this week (+20)\n⚠ Invoice overdue 3 days (-5)\n✓ Documents up to date (+20)\n✓ Last client contact < 7 days (+20)\nScore: 88/100',
  71: '✓ Deadlines current (+25)\n✓ Time logged this week (+20)\n⚠ Invoice overdue 10 days (-12)\n✓ Documents up to date (+20)\n⚠ Last client contact 10 days (-8)\nScore: 71/100',
  95: '✓ Deadlines current (+25)\n✓ Time logged this week (+20)\n✓ Invoice current (+5)\n✓ Documents up to date (+20)\n✓ Last client contact < 3 days (+20)\nScore: 95/100',
  33: '✓ Deadlines current (+25)\n⚠ No time logged this week (-20)\n⚠ Invoice overdue 30 days (-20)\n⚠ Missing key documents (-15)\n⚠ No client contact in 21 days (-15)\nScore: 33/100',
  82: '✓ Deadlines current (+25)\n✓ Time logged this week (+20)\n✓ Invoice current (+5)\n✓ Documents up to date (+20)\n⚠ Last client contact 8 days (-8)\nScore: 82/100',
}

type Matter = typeof MATTERS[number]
type SortKey = keyof Matter
type FilterTab = 'ALL' | 'ACTIVE' | 'PENDING' | 'CLOSED' | 'URGENT'
type ViewMode = 'table' | 'timeline'

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatusPill({ status }: { status: string }) {
  const s: Record<string, { bg: string; color: string; border: string }> = {
    URGENT:  { bg: 'rgba(224,82,82,0.1)',   color: '#E05252', border: 'rgba(224,82,82,0.3)'   },
    ACTIVE:  { bg: 'rgba(59,143,212,0.1)',  color: '#3B8FD4', border: 'rgba(59,143,212,0.3)'  },
    PENDING: { bg: 'rgba(212,160,23,0.1)',  color: '#D4A017', border: 'rgba(212,160,23,0.3)'  },
    CLOSED:  { bg: 'rgba(78,100,128,0.15)', color: '#4E6480', border: 'rgba(78,100,128,0.25)' },
  }
  const st = s[status] ?? s.CLOSED
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase', background:st.bg, color:st.color, border:`1px solid ${st.border}`, whiteSpace:'nowrap' }}>
      {status}
    </span>
  )
}

function healthColor(score: number) {
  if (score >= 80) return '#2EAD6E'
  if (score >= 60) return '#D4A017'
  return '#E05252'
}

function HealthRing({ score }: { score: number }) {
  const [show, setShow] = useState(false)
  const r = 14, size = 36, circ = 2 * Math.PI * r
  const color = healthColor(score)
  const tooltip = HEALTH_TOOLTIPS[score] ?? `Score: ${score}/100`
  return (
    <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)', flexShrink:0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth={3.5}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3.5}
          strokeDasharray={`${(score/100)*circ} ${circ}`} strokeLinecap="round"/>
      </svg>
      <span style={{ position:'absolute', fontFamily:'Georgia,serif', fontSize:9, fontWeight:700, color, lineHeight:1 }}>
        {score}
      </span>
      {show && (
        <div style={{ position:'absolute', bottom:'calc(100% + 8px)', left:'50%', transform:'translateX(-50%)', background:'var(--bg-elevated)', border:'1px solid var(--border-mid)', borderRadius:8, padding:'10px 14px', zIndex:50, width:240, boxShadow:'0 8px 32px rgba(0,0,0,0.5)', pointerEvents:'none' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'var(--text-1)', margin:'0 0 6px' }}>Health Score Factors</p>
          {tooltip.split('\n').map((line, i) => (
            <p key={i} style={{ fontSize:11, color: line.startsWith('⚠') ? 'var(--warning)' : line.startsWith('Score') ? color : 'var(--success)', margin:'2px 0', fontFamily:'monospace' }}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

const AREA_COLORS: Record<string, string> = {
  'Personal Injury': '#E05252', 'Estate Planning': '#C9A84C', 'Real Estate': '#2EAD6E',
  'Criminal Defense': '#9B59B6', 'Family Law': '#3B8FD4', 'IP/Patent': '#D4A017',
  'Immigration': '#1ABC9C', 'Corporate': '#E67E22', 'Civil Litigation': '#E05252',
  'Employment': '#3B8FD4',
}

function TimelineView({ matters }: { matters: Matter[] }) {
  const today = new Date('2024-05-01')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const year = 2024
  const cols = 12

  function dateToCol(dateStr: string) {
    const d = new Date(dateStr)
    return Math.max(0, Math.min(cols, (d.getFullYear() - year) * 12 + d.getMonth()))
  }
  const todayCol = dateToCol(today.toISOString())

  return (
    <div style={{ overflowX:'auto' }}>
      <div style={{ minWidth: 900 }}>
        {/* Month header */}
        <div style={{ display:'flex', paddingLeft:200, borderBottom:'1px solid var(--border)', marginBottom:4 }}>
          {months.map((m, i) => (
            <div key={m} style={{ flex:1, textAlign:'center', fontSize:10, fontWeight:600, color:'var(--text-3)', padding:'8px 0', letterSpacing:'0.05em', position:'relative', background: i === todayCol ? 'rgba(224,82,82,0.05)' : undefined }}>
              {m}
            </div>
          ))}
        </div>
        {/* Today line */}
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', top:0, bottom:0, left:`calc(200px + ${(todayCol / cols) * 100}%)`, width:2, background:'var(--danger)', zIndex:10, opacity:0.7 }}>
            <span style={{ position:'absolute', top:-18, left:-14, fontSize:9, fontWeight:700, color:'var(--danger)', whiteSpace:'nowrap', background:'var(--bg-base)', padding:'0 4px' }}>TODAY</span>
          </div>
          {/* Matter rows */}
          {matters.map(m => {
            const startCol = dateToCol(m.opened)
            const endCol = dateToCol(m.expectedClose)
            const color = AREA_COLORS[m.area] ?? 'var(--accent)'
            const left = `${(startCol / cols) * 100}%`
            const width = `${Math.max(3, ((endCol - startCol) / cols) * 100)}%`
            return (
              <div key={m.id} style={{ display:'flex', alignItems:'center', height:44, borderBottom:'1px solid var(--border)' }}>
                <div style={{ width:200, flexShrink:0, padding:'0 12px', overflow:'hidden' }}>
                  <p style={{ fontSize:12, fontWeight:500, color:'var(--text-1)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.name}</p>
                  <p style={{ fontSize:10, color:'var(--text-3)', margin:'2px 0 0' }}>{m.attorney}</p>
                </div>
                <div style={{ flex:1, position:'relative', height:44, display:'flex', alignItems:'center' }}>
                  <div style={{ position:'absolute', left, width, height:22, borderRadius:4, background:`${color}22`, border:`1px solid ${color}66`, display:'flex', alignItems:'center', paddingLeft:8, cursor:'pointer', transition:'all 0.15s ease', overflow:'hidden' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}44` }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${color}22` }}>
                    <span style={{ fontSize:10, color, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.area}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const MOCK_ACTIVITY = [
  { label:'Document uploaded', detail:'Medical records batch', time:'2h ago' },
  { label:'AI Research query', detail:'Case law on damages caps', time:'4h ago' },
  { label:'Time entry added', detail:'2.5h — Deposition prep', time:'Yesterday' },
]
const MOCK_DOCUMENTS = [
  { name:'Complaint — Filed.pdf', size:'284 KB', date:'Jan 16, 2024' },
  { name:'Medical Records — Batch 1.pdf', size:'4.2 MB', date:'Feb 2, 2024' },
  { name:'Demand Letter — Draft 2.docx', size:'56 KB', date:'Mar 4, 2024' },
]
const MOCK_TIMELINE_DATA = [
  { date:'Apr 10, 2024', event:'Motion for Summary Judgment filed' },
  { date:'Mar 20, 2024', event:'Deposition of J. Okafor completed' },
  { date:'Mar 4, 2024', event:'Demand letter sent to defendant' },
  { date:'Jan 16, 2024', event:'Complaint filed — Superior Court' },
]
const MOCK_AI = [
  { query:'What is the statute of limitations for personal injury in CA?', result:'2 years per CCP § 335.1', time:'Apr 10 · 2:14 PM' },
  { query:'Summarize Exhibit 12 — medical records', result:'Generated 3-page summary', time:'Mar 22 · 10:05 AM' },
]

type DetailTab = 'overview' | 'documents' | 'timeline' | 'ai'

function DetailPanel({ matter, onClose }: { matter: Matter; onClose: () => void }) {
  const [tab, setTab] = useState<DetailTab>('overview')
  const tabs: { key: DetailTab; label: string; icon: React.ReactNode }[] = [
    { key:'overview',  label:'Overview',   icon:<FileText className="h-3.5 w-3.5" /> },
    { key:'documents', label:'Documents',  icon:<Folder className="h-3.5 w-3.5" /> },
    { key:'timeline',  label:'Timeline',   icon:<CalendarDays className="h-3.5 w-3.5" /> },
    { key:'ai',        label:'AI History', icon:<Brain className="h-3.5 w-3.5" /> },
  ]
  return (
    <div style={{ position:'absolute', inset:'0 0 0 auto', width:480, background:'var(--bg-card)', borderLeft:'1px solid var(--border-mid)', display:'flex', flexDirection:'column', zIndex:20, boxShadow:'-8px 0 40px rgba(0,0,0,0.4)', animation:'slide-in-right 0.3s ease-out' }}>
      <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
          <div style={{ minWidth:0 }}>
            <h2 style={{ fontFamily:'Georgia,serif', fontSize:16, fontWeight:'normal', color:'var(--text-1)', margin:0, lineHeight:1.3 }}>{matter.name}</h2>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
              <span style={{ fontSize:11, fontFamily:'monospace', color:'var(--text-3)' }}>{matter.number}</span>
              <StatusPill status={matter.status} />
              <HealthRing score={matter.health} />
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', padding:6, borderRadius:6, flexShrink:0, display:'flex' }}
            onMouseEnter={e => (e.currentTarget.style.color='var(--text-1)')} onMouseLeave={e => (e.currentTarget.style.color='var(--text-3)')}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div style={{ display:'flex', gap:4, marginTop:12 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', border: tab===t.key ? '1px solid var(--border-mid)' : '1px solid transparent', background: tab===t.key ? 'var(--bg-elevated)' : 'transparent', color: tab===t.key ? 'var(--text-1)' : 'var(--text-3)', transition:'all 0.15s ease' }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:20 }}>
        {tab === 'overview' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
              {[{ label:'Total Billed', value:fmtCurrency(matter.billed), color:'var(--gold)' },{ label:'Hours Logged', value:`${matter.hours}h`, color:'var(--text-1)' },{ label:'Health Score', value:`${matter.health}/100`, color:healthColor(matter.health) }].map(s => (
                <div key={s.label} style={{ background:'var(--bg-elevated)', borderRadius:8, padding:'10px 12px', textAlign:'center' }}>
                  <p style={{ fontSize:10, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 4px' }}>{s.label}</p>
                  <p style={{ fontFamily:'Georgia,serif', fontSize:16, color:s.color, margin:0 }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div style={{ background:'var(--bg-elevated)', borderRadius:8, padding:'14px 16px' }}>
              <p style={{ fontSize:10, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 12px' }}>Key Facts</p>
              {[{ label:'Client', value:matter.client },{ label:'Practice Area', value:matter.area },{ label:'Lead Attorney', value:matter.attorney },{ label:'Opened', value:fmtDate(matter.opened) }].map(f => (
                <div key={f.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <span style={{ fontSize:12, color:'var(--text-3)' }}>{f.label}</span>
                  <span style={{ fontSize:12, fontWeight:500, color:'var(--text-1)' }}>{f.value}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 10px' }}>Recent Activity</p>
              {MOCK_ACTIVITY.map((a, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)', flexShrink:0, marginTop:4 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12, fontWeight:500, color:'var(--text-1)', margin:0 }}>{a.label}</p>
                    <p style={{ fontSize:11, color:'var(--text-3)', margin:'2px 0 0' }}>{a.detail}</p>
                  </div>
                  <span style={{ fontSize:10, color:'var(--text-3)', flexShrink:0 }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'documents' && (
          <div>
            <p style={{ fontSize:10, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 12px' }}>Documents</p>
            {MOCK_DOCUMENTS.map((d, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, background:'var(--bg-elevated)', borderRadius:8, padding:'10px 12px', marginBottom:6, cursor:'pointer' }}>
                <FileText style={{ width:15, height:15, color:'var(--accent)', flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:500, color:'var(--text-1)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.name}</p>
                  <p style={{ fontSize:11, color:'var(--text-3)', margin:'2px 0 0' }}>{d.size} · {d.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'timeline' && (
          <div>
            <p style={{ fontSize:10, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 16px' }}>Matter Timeline</p>
            <div style={{ position:'relative', paddingLeft:20 }}>
              <div style={{ position:'absolute', left:6, top:0, bottom:0, width:1, background:'var(--border)' }} />
              {MOCK_TIMELINE_DATA.map((e, i) => (
                <div key={i} style={{ position:'relative', marginBottom:18 }}>
                  <div style={{ position:'absolute', left:-14, top:4, width:10, height:10, borderRadius:'50%', border:'2px solid var(--accent)', background:'var(--bg-card)' }} />
                  <p style={{ fontSize:12, fontWeight:500, color:'var(--text-1)', margin:0 }}>{e.event}</p>
                  <p style={{ fontSize:11, color:'var(--text-3)', margin:'2px 0 0' }}>{e.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'ai' && (
          <div>
            <p style={{ fontSize:10, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 12px' }}>AI Query History</p>
            {MOCK_AI.map((a, i) => (
              <div key={i} style={{ background:'var(--bg-elevated)', borderRadius:8, padding:'12px 14px', marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                  <Brain style={{ width:13, height:13, color:'var(--gold)', flexShrink:0, marginTop:1 }} />
                  <p style={{ fontSize:12, fontWeight:500, color:'var(--text-1)', margin:0, lineHeight:1.4 }}>{a.query}</p>
                </div>
                <p style={{ fontSize:11, color:'var(--success)', margin:'6px 0 0 21px' }}>{a.result}</p>
                <p style={{ fontSize:10, color:'var(--text-3)', margin:'3px 0 0 21px' }}>{a.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MattersPage() {
  const [search, setSearch] = useState('')
  const [filterTab, setFilterTab] = useState<FilterTab>('ALL')
  const [sortKey, setSortKey] = useState<SortKey>('opened')
  const [sortAsc, setSortAsc] = useState(false)
  const [selected, setSelected] = useState<Matter | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const filtered = useMemo(() => {
    let rows = [...MATTERS]
    if (filterTab !== 'ALL') rows = rows.filter(m => m.status === filterTab)
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(m => m.name.toLowerCase().includes(q) || m.client.toLowerCase().includes(q) || m.number.toLowerCase().includes(q) || m.area.toLowerCase().includes(q) || m.attorney.toLowerCase().includes(q))
    }
    rows.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sortAsc ? cmp : -cmp
    })
    return rows
  }, [search, filterTab, sortKey, sortAsc])

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(a => !a)
    else { setSortKey(key); setSortAsc(true) }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronDown style={{ width:11, height:11, opacity:0.3 }} />
    return sortAsc ? <ChevronUp style={{ width:11, height:11, color:'var(--gold)' }} /> : <ChevronDown style={{ width:11, height:11, color:'var(--gold)' }} />
  }

  const filterTabs: FilterTab[] = ['ALL','ACTIVE','PENDING','CLOSED','URGENT']
  const tabCounts = { ALL:MATTERS.length, ACTIVE:MATTERS.filter(m=>m.status==='ACTIVE').length, PENDING:MATTERS.filter(m=>m.status==='PENDING').length, CLOSED:MATTERS.filter(m=>m.status==='CLOSED').length, URGENT:MATTERS.filter(m=>m.status==='URGENT').length }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', gap:20, animation:'fade-slide-up 0.25s ease forwards', position:'relative' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontFamily:'Georgia,serif', fontSize:24, fontWeight:'normal', color:'var(--text-1)', margin:0 }}>Matters</h1>
          <p style={{ fontSize:13, color:'var(--text-3)', margin:'3px 0 0' }}>
            {filtered.length} of {MATTERS.length} matters
          </p>
        </div>
        <button className="btn-gold"><Plus className="h-4 w-4" />New Matter</button>
      </div>

      {/* Search + filters + view toggle */}
      <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:240, maxWidth:320 }}>
          <Search style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', width:14, height:14, color:'var(--text-3)', pointerEvents:'none' }} />
          <input className="vault-input" style={{ paddingLeft:32 }} placeholder="Search matters, clients, attorneys…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {filterTabs.map(ft => (
            <button key={ft} onClick={() => setFilterTab(ft)} style={{ display:'flex', alignItems:'center', gap:6, padding:'0 12px', height:34, borderRadius:8, fontSize:12, fontWeight:500, cursor:'pointer', border:'1px solid', transition:'all 0.15s ease', background: filterTab===ft ? 'var(--gold)' : 'var(--bg-elevated)', borderColor: filterTab===ft ? 'var(--gold)' : 'var(--border-mid)', color: filterTab===ft ? 'var(--bg-base)' : 'var(--text-2)', boxShadow: filterTab===ft ? '0 0 16px rgba(201,168,76,0.3)' : 'none' }}>
              {ft==='ALL' ? 'All' : ft.charAt(0)+ft.slice(1).toLowerCase()}
              <span style={{ borderRadius:20, padding:'1px 6px', fontSize:10, lineHeight:1.4, background: filterTab===ft ? 'rgba(0,0,0,0.2)' : 'var(--border)', color: filterTab===ft ? 'var(--bg-base)' : 'var(--text-3)' }}>
                {tabCounts[ft]}
              </span>
            </button>
          ))}
        </div>
        {/* View toggle */}
        <div style={{ display:'flex', gap:4, marginLeft:'auto', background:'var(--bg-elevated)', border:'1px solid var(--border-mid)', borderRadius:8, padding:3 }}>
          {([{ mode:'table', icon:<List style={{ width:15, height:15 }} />, label:'Table' },{ mode:'timeline', icon:<GanttChartSquare style={{ width:15, height:15 }} />, label:'Timeline' }] as {mode:ViewMode, icon:React.ReactNode, label:string}[]).map(v => (
            <button key={v.mode} onClick={() => setViewMode(v.mode)} title={v.label} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:6, border:'none', cursor:'pointer', fontSize:12, fontWeight:500, transition:'all 0.15s ease', background: viewMode===v.mode ? 'var(--bg-hover)' : 'transparent', color: viewMode===v.mode ? 'var(--text-1)' : 'var(--text-3)' }}>
              {v.icon}{v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', position:'relative' }}>

        {viewMode === 'timeline' ? (
          <TimelineView matters={filtered} />
        ) : (
          <div style={{ overflowX:'auto', overflowY:'auto', height:'100%' }}>
            <table className="data-table">
              <thead style={{ position:'sticky', top:0, zIndex:10, background:'var(--bg-sidebar)' }}>
                <tr>
                  {([{ key:'number', label:'Matter #' },{ key:'name', label:'Matter Name' },{ key:'client', label:'Client' },{ key:'area', label:'Practice Area' },{ key:'attorney', label:'Attorney' },{ key:'status', label:'Status' },{ key:'health', label:'Health' },{ key:'opened', label:'Opened' },{ key:'billed', label:'Billed' },{ key:'hours', label:'Hours' }] as {key:SortKey, label:string}[]).map(({ key, label }) => (
                    <th key={key} onClick={() => handleSort(key)} style={{ cursor:'pointer', userSelect:'none' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:4 }}>{label}<SortIcon col={key} /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} style={{ textAlign:'center', padding:'48px 0', color:'var(--text-3)' }}>No matters match your search.</td></tr>
                ) : filtered.map(m => (
                  <tr key={m.id} onClick={() => setSelected(m.id === selected?.id ? null : m)} style={{ background: selected?.id === m.id ? 'rgba(201,168,76,0.06)' : undefined, borderLeft: selected?.id === m.id ? '2px solid var(--gold)' : '2px solid transparent' }}>
                    <td><span style={{ fontFamily:'monospace', fontSize:11, color:'var(--text-3)' }}>{m.number}</span></td>
                    <td><span style={{ fontSize:13, fontWeight:600, color:'var(--text-1)' }}>{m.name}</span></td>
                    <td style={{ color:'var(--text-2)', fontSize:13 }}>{m.client}</td>
                    <td><span style={{ fontSize:11, color:'var(--text-3)' }}>{m.area}</span></td>
                    <td style={{ color:'var(--text-2)', fontSize:13 }}>{m.attorney}</td>
                    <td><StatusPill status={m.status} /></td>
                    <td><HealthRing score={m.health} /></td>
                    <td style={{ color:'var(--text-3)', fontSize:12 }}>{fmtDate(m.opened)}</td>
                    <td><span style={{ fontFamily:'monospace', fontSize:13, color:'var(--text-1)' }}>{fmtCurrency(m.billed)}</span></td>
                    <td><span style={{ fontFamily:'monospace', fontSize:13, color:'var(--text-2)' }}>{m.hours.toFixed(1)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected && viewMode === 'table' && (
          <>
            <div style={{ position:'absolute', inset:0, zIndex:10, background:'rgba(7,14,26,0.4)' }} onClick={() => setSelected(null)} />
            <DetailPanel matter={selected} onClose={() => setSelected(null)} />
          </>
        )}
      </div>
    </div>
  )
}
