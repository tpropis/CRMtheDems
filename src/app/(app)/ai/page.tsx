'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Wand2, Clock, FileText, BarChart3, Scale, Loader2,
  ChevronRight, Copy, CheckCircle2, AlertCircle, Sparkles,
  Calendar, DollarSign, Shield,
} from 'lucide-react'

type Tool = 'deadlines' | 'billing' | 'privilege' | 'status'

interface DeadlineResult {
  event: string
  rule: string
  deadline: string
  daysRemaining: number
  isUrgent: boolean
}

export default function AIParalegalPage() {
  const [activeTool, setActiveTool] = useState<Tool>('billing')

  // Billing narrative rewriter
  const [billingEntries, setBillingEntries] = useState('')
  const [billingResult, setBillingResult] = useState<string | null>(null)
  const [billingLoading, setBillingLoading] = useState(false)
  const [billingCopied, setBillingCopied] = useState(false)

  // Deadline calculator
  const [triggerEvent, setTriggerEvent] = useState('')
  const [triggerDate, setTriggerDate] = useState('')
  const [jurisdiction, setJurisdiction] = useState('Federal')
  const [deadlineResults, setDeadlineResults] = useState<DeadlineResult[] | null>(null)
  const [deadlineLoading, setDeadlineLoading] = useState(false)

  // Privilege log
  const [privilegeDocList, setPrivilegeDocList] = useState('')
  const [privilegeResult, setPrivilegeResult] = useState<string | null>(null)
  const [privilegeLoading, setPrivilegeLoading] = useState(false)

  // Status report
  const [statusMatterId, setStatusMatterId] = useState('')
  const [statusContext, setStatusContext] = useState('')
  const [statusResult, setStatusResult] = useState<string | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)

  async function handleBillingRewrite() {
    if (!billingEntries.trim()) return
    setBillingLoading(true); setBillingResult(null)
    try {
      const res = await fetch('/api/ai/paralegal/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: billingEntries }),
      })
      const data = await res.json()
      setBillingResult(data.content)
    } catch { setBillingResult('Generation failed. Please try again.') }
    finally { setBillingLoading(false) }
  }

  async function handleDeadlines() {
    if (!triggerEvent.trim() || !triggerDate) return
    setDeadlineLoading(true); setDeadlineResults(null)
    try {
      const res = await fetch('/api/ai/paralegal/deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerEvent, triggerDate, jurisdiction }),
      })
      const data = await res.json()
      setDeadlineResults(data.deadlines)
    } catch { setDeadlineResults([]) }
    finally { setDeadlineLoading(false) }
  }

  async function handlePrivilegeLog() {
    if (!privilegeDocList.trim()) return
    setPrivilegeLoading(true); setPrivilegeResult(null)
    try {
      const res = await fetch('/api/ai/paralegal/privilege', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: privilegeDocList }),
      })
      const data = await res.json()
      setPrivilegeResult(data.content)
    } catch { setPrivilegeResult('Generation failed.') }
    finally { setPrivilegeLoading(false) }
  }

  async function handleStatusReport() {
    setStatusLoading(true); setStatusResult(null)
    try {
      const res = await fetch('/api/ai/paralegal/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matterId: statusMatterId, context: statusContext }),
      })
      const data = await res.json()
      setStatusResult(data.content)
    } catch { setStatusResult('Generation failed.') }
    finally { setStatusLoading(false) }
  }

  function copyToClipboard(text: string, setter: (v: boolean) => void) {
    navigator.clipboard.writeText(text)
    setter(true)
    setTimeout(() => setter(false), 2000)
  }

  const TOOLS = [
    { id: 'billing' as Tool, label: 'Billing Narrative', icon: DollarSign, desc: 'Rewrite vague time entries into billable narratives' },
    { id: 'deadlines' as Tool, label: 'Deadline Calculator', icon: Calendar, desc: 'FRCP & local rules deadline chain from any trigger event' },
    { id: 'privilege' as Tool, label: 'Privilege Log', icon: Shield, desc: 'Generate formatted privilege log from document list' },
    { id: 'status' as Tool, label: 'Status Report', icon: BarChart3, desc: 'AI-drafted client status report from matter data' },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="AI Paralegal"
        description="Automate paralegal-level work — billing narratives, deadlines, privilege logs, and status reports"
      />

      {/* Tool selector */}
      <div className="grid grid-cols-4 gap-3">
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => setActiveTool(t.id)}
            className={`vault-panel p-4 text-left transition-colors ${activeTool === t.id ? 'border-vault-accent/50 bg-vault-accent/5' : 'hover:border-vault-border/80'}`}>
            <t.icon className={`h-5 w-5 mb-2 ${activeTool === t.id ? 'text-vault-accent' : 'text-vault-muted'}`} />
            <p className={`text-sm font-medium ${activeTool === t.id ? 'text-vault-accent-light' : 'text-vault-text'}`}>{t.label}</p>
            <p className="text-xs text-vault-muted mt-0.5 leading-snug">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* ── Billing Narrative Rewriter ──────────────────────── */}
      {activeTool === 'billing' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="vault-panel p-5 space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-vault-muted" />
              <h3 className="section-label">Time Entry Narratives</h3>
            </div>
            <p className="text-xs text-vault-text-secondary">Paste raw time entries (one per line or CSV). AI will rewrite them as professional, specific, billable narratives that pass client bill review.</p>
            <div className="space-y-1.5">
              <Label>Raw Time Entries</Label>
              <textarea
                className="w-full min-h-[200px] rounded-md border border-vault-border bg-vault-elevated px-3 py-2 text-sm text-vault-text placeholder:text-vault-muted focus:outline-none focus:ring-1 focus:ring-vault-accent resize-none font-mono"
                placeholder={`0.4 — reviewed docs\n1.2 — call w client re case\n0.8 — research\n2.0 — drafted motion`}
                value={billingEntries}
                onChange={e => setBillingEntries(e.target.value)}
              />
            </div>
            <Button onClick={handleBillingRewrite} disabled={billingLoading || !billingEntries.trim()} className="w-full">
              {billingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {billingLoading ? 'Rewriting...' : 'Rewrite Narratives'}
            </Button>
          </div>
          <div className="vault-panel p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-vault-muted" />
                <h3 className="section-label">Professional Narratives</h3>
              </div>
              {billingResult && (
                <Button variant="ghost" size="sm" className="text-vault-muted" onClick={() => copyToClipboard(billingResult, setBillingCopied)}>
                  {billingCopied ? <CheckCircle2 className="h-4 w-4 text-vault-success" /> : <Copy className="h-4 w-4" />}
                  {billingCopied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </div>
            {billingLoading && (
              <div className="flex items-center gap-3 text-sm text-vault-muted py-8 justify-center">
                <Loader2 className="h-5 w-5 animate-spin" /> Rewriting narratives...
              </div>
            )}
            {billingResult ? (
              <pre className="text-sm text-vault-text whitespace-pre-wrap leading-relaxed">{billingResult}</pre>
            ) : !billingLoading && (
              <div className="py-8 text-center text-vault-muted text-sm">Rewritten narratives will appear here</div>
            )}
          </div>
        </div>
      )}

      {/* ── Deadline Calculator ──────────────────────────────── */}
      {activeTool === 'deadlines' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="vault-panel p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-vault-muted" />
              <h3 className="section-label">Trigger Event</h3>
            </div>
            <div className="space-y-1.5">
              <Label>Event Description</Label>
              <Input value={triggerEvent} onChange={e => setTriggerEvent(e.target.value)}
                placeholder="e.g. Complaint served on defendant" />
            </div>
            <div className="space-y-1.5">
              <Label>Event Date</Label>
              <Input type="date" value={triggerDate} onChange={e => setTriggerDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Jurisdiction</Label>
              <select className="w-full rounded-md border border-vault-border bg-vault-elevated px-3 py-2 text-sm text-vault-text focus:outline-none focus:ring-1 focus:ring-vault-accent"
                value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}>
                <option>Federal</option>
                <option>California</option>
                <option>New York</option>
                <option>Texas</option>
                <option>Florida</option>
                <option>Illinois</option>
                <option>Pennsylvania</option>
                <option>Georgia</option>
              </select>
            </div>
            <Button onClick={handleDeadlines} disabled={deadlineLoading || !triggerEvent.trim() || !triggerDate} className="w-full">
              {deadlineLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
              {deadlineLoading ? 'Calculating...' : 'Calculate Deadlines'}
            </Button>
          </div>
          <div className="vault-panel p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-vault-muted" />
              <h3 className="section-label">Deadline Chain</h3>
            </div>
            {deadlineLoading && <div className="flex items-center gap-3 text-sm text-vault-muted py-8 justify-center"><Loader2 className="h-5 w-5 animate-spin" /> Calculating...</div>}
            {deadlineResults && deadlineResults.length === 0 && <div className="text-sm text-vault-muted py-4 text-center">No deadlines returned</div>}
            {deadlineResults && deadlineResults.length > 0 && (
              <div className="space-y-2">
                {deadlineResults.map((d, i) => (
                  <div key={i} className={`p-3 rounded-md border ${d.isUrgent ? 'border-red-500/30 bg-red-500/5' : 'border-vault-border bg-vault-elevated'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-vault-text">{d.event}</p>
                        <p className="text-xs text-vault-muted mt-0.5">{d.rule}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-semibold tabular-nums ${d.isUrgent ? 'text-red-400' : 'text-vault-text'}`}>{d.deadline}</p>
                        <p className={`text-xs ${d.isUrgent ? 'text-red-400' : 'text-vault-muted'}`}>{d.daysRemaining}d remaining</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!deadlineLoading && !deadlineResults && <div className="py-8 text-center text-vault-muted text-sm">Deadline chain will appear here</div>}
          </div>
        </div>
      )}

      {/* ── Privilege Log ────────────────────────────────────── */}
      {activeTool === 'privilege' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="vault-panel p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-vault-muted" />
              <h3 className="section-label">Document List</h3>
            </div>
            <p className="text-xs text-vault-text-secondary">Describe the documents to be privilege-logged. Include Bates numbers, dates, authors, recipients, and type if known.</p>
            <textarea
              className="w-full min-h-[220px] rounded-md border border-vault-border bg-vault-elevated px-3 py-2 text-sm text-vault-text placeholder:text-vault-muted focus:outline-none focus:ring-1 focus:ring-vault-accent resize-none"
              placeholder={`PVA0001 — Email 3/15/24 from Jane Smith (attorney) to client re litigation strategy\nPVA0002 — Draft motion prepared by associate, 4/1/24, work product\nPVA0003 — Internal memo re settlement valuation, 4/5/24, attorney-client`}
              value={privilegeDocList}
              onChange={e => setPrivilegeDocList(e.target.value)}
            />
            <Button onClick={handlePrivilegeLog} disabled={privilegeLoading || !privilegeDocList.trim()} className="w-full">
              {privilegeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              {privilegeLoading ? 'Generating...' : 'Generate Privilege Log'}
            </Button>
          </div>
          <div className="vault-panel p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-vault-muted" /><h3 className="section-label">Privilege Log</h3></div>
              {privilegeResult && (
                <Button variant="ghost" size="sm" className="text-vault-muted" onClick={() => navigator.clipboard.writeText(privilegeResult)}>
                  <Copy className="h-4 w-4" />Copy
                </Button>
              )}
            </div>
            {privilegeLoading && <div className="flex items-center gap-3 text-sm text-vault-muted py-8 justify-center"><Loader2 className="h-5 w-5 animate-spin" /> Generating...</div>}
            {privilegeResult ? (
              <pre className="text-xs text-vault-text whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">{privilegeResult}</pre>
            ) : !privilegeLoading && (
              <div className="py-8 text-center text-vault-muted text-sm">Formatted privilege log will appear here</div>
            )}
          </div>
        </div>
      )}

      {/* ── Status Report ────────────────────────────────────── */}
      {activeTool === 'status' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="vault-panel p-5 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-vault-muted" />
              <h3 className="section-label">Status Report Generator</h3>
            </div>
            <div className="space-y-1.5">
              <Label>Matter Number or Name <span className="text-vault-muted text-xs">(optional)</span></Label>
              <Input value={statusMatterId} onChange={e => setStatusMatterId(e.target.value)} placeholder="e.g. HTY-2024-001 or Smith v. Jones" />
            </div>
            <div className="space-y-1.5">
              <Label>Recent Activity & Context</Label>
              <textarea
                className="w-full min-h-[180px] rounded-md border border-vault-border bg-vault-elevated px-3 py-2 text-sm text-vault-text placeholder:text-vault-muted focus:outline-none focus:ring-1 focus:ring-vault-accent resize-none"
                placeholder={`Recent activity:\n— Filed motion for summary judgment 4/1\n— Deposition of expert witness 4/8\n— Discovery closes 5/15\n— Trial date 7/22\n\nOutstanding items: Client needs to sign supplemental interrogatory responses. Need insurance docs from client.`}
                value={statusContext}
                onChange={e => setStatusContext(e.target.value)}
              />
            </div>
            <Button onClick={handleStatusReport} disabled={statusLoading || !statusContext.trim()} className="w-full">
              {statusLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
              {statusLoading ? 'Drafting...' : 'Draft Status Report'}
            </Button>
          </div>
          <div className="vault-panel p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-vault-muted" /><h3 className="section-label">Draft Report</h3></div>
              {statusResult && (
                <Button variant="ghost" size="sm" className="text-vault-muted" onClick={() => navigator.clipboard.writeText(statusResult)}>
                  <Copy className="h-4 w-4" />Copy
                </Button>
              )}
            </div>
            {statusLoading && <div className="flex items-center gap-3 text-sm text-vault-muted py-8 justify-center"><Loader2 className="h-5 w-5 animate-spin" /> Drafting report...</div>}
            {statusResult ? (
              <div className="bg-white rounded-md p-5">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{statusResult}</pre>
              </div>
            ) : !statusLoading && (
              <div className="py-8 text-center text-vault-muted text-sm">Client-ready status report will appear here</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
