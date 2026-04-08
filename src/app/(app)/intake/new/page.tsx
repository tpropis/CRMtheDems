'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { ArrowLeft, User, Building2, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'

const MATTER_TYPES = [
  { value: 'LITIGATION', label: 'Litigation' },
  { value: 'CORPORATE', label: 'Corporate' },
  { value: 'EMPLOYMENT', label: 'Employment' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'FAMILY_LAW', label: 'Family Law' },
  { value: 'CRIMINAL_DEFENSE', label: 'Criminal Defense' },
  { value: 'IMMIGRATION', label: 'Immigration' },
  { value: 'INTELLECTUAL_PROPERTY', label: 'Intellectual Property' },
  { value: 'BANKRUPTCY', label: 'Bankruptcy' },
  { value: 'TAX', label: 'Tax' },
  { value: 'ESTATE_PLANNING', label: 'Estate Planning' },
  { value: 'REGULATORY', label: 'Regulatory' },
  { value: 'OTHER', label: 'Other' },
]

const SOURCES = [
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'WEBSITE', label: 'Website' },
  { value: 'COLD_CALL', label: 'Cold Call' },
  { value: 'DIRECTORY', label: 'Directory Listing' },
  { value: 'RETURNING_CLIENT', label: 'Returning Client' },
  { value: 'OTHER', label: 'Other' },
]

export default function NewIntakePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [conflictResult, setConflictResult] = useState<any>(null)

  const [form, setForm] = useState({
    prospectName: '',
    prospectEmail: '',
    prospectPhone: '',
    prospectOrg: '',
    matterType: '',
    source: '',
    urgency: 'NORMAL',
    jurisdiction: '',
    opposingParties: '',
    notes: '',
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          opposingParties: form.opposingParties
            ? form.opposingParties.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create intake lead')
      setConflictResult(data.conflictCheck)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-10 space-y-6 animate-fade-in">
        <div className="vault-panel p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-vault-success/10 border border-vault-success/20 p-4">
              <CheckCircle2 className="h-8 w-8 text-vault-success" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-vault-text">Lead Created</h2>
          <p className="text-vault-text-secondary text-sm">
            The intake lead has been created and a conflict check has been initiated.
          </p>

          {conflictResult && (
            <div className={`rounded-md border p-4 text-left text-sm space-y-1 ${
              conflictResult.status === 'CLEAR'
                ? 'border-vault-success/30 bg-vault-success/10'
                : conflictResult.status === 'POTENTIAL_CONFLICT'
                ? 'border-yellow-500/30 bg-yellow-500/10'
                : 'border-vault-danger/30 bg-vault-danger/10'
            }`}>
              <p className="font-semibold text-vault-text">
                Conflict Check: {conflictResult.status.replace(/_/g, ' ')}
              </p>
              {conflictResult.summary && (
                <p className="text-vault-text-secondary">{conflictResult.summary}</p>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-center pt-2">
            <Link href="/intake">
              <Button variant="outline">View Pipeline</Button>
            </Link>
            <Button onClick={() => { setSuccess(false); setForm({ prospectName: '', prospectEmail: '', prospectPhone: '', prospectOrg: '', matterType: '', source: '', urgency: 'NORMAL', jurisdiction: '', opposingParties: '', notes: '' }) }}>
              Add Another
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/intake">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-vault-text">New Intake Lead</h1>
          <p className="text-sm text-vault-text-secondary">A conflict check will run automatically on submission.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Prospect Info */}
        <div className="vault-panel p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-vault-muted" />
            <h2 className="text-sm font-semibold text-vault-text uppercase tracking-wider section-label">Prospect Information</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="prospectName">Full Name *</Label>
              <Input id="prospectName" required value={form.prospectName} onChange={(e) => set('prospectName', e.target.value)} placeholder="Jane Smith" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prospectEmail">Email</Label>
              <Input id="prospectEmail" type="email" value={form.prospectEmail} onChange={(e) => set('prospectEmail', e.target.value)} placeholder="jane@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prospectPhone">Phone</Label>
              <Input id="prospectPhone" value={form.prospectPhone} onChange={(e) => set('prospectPhone', e.target.value)} placeholder="+1 (212) 555-0100" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-vault-muted" />
              <Label htmlFor="prospectOrg">Organization</Label>
            </div>
            <Input id="prospectOrg" value={form.prospectOrg} onChange={(e) => set('prospectOrg', e.target.value)} placeholder="Acme Corp" />
          </div>
        </div>

        {/* Matter Details */}
        <div className="vault-panel p-5 space-y-4">
          <h2 className="text-sm font-semibold text-vault-text uppercase tracking-wider section-label">Matter Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="matterType">Matter Type</Label>
              <select
                id="matterType"
                value={form.matterType}
                onChange={(e) => set('matterType', e.target.value)}
                className="w-full h-9 rounded-md border border-vault-border bg-vault-surface px-3 text-sm text-vault-text focus:outline-none focus:ring-1 focus:ring-vault-accent"
              >
                <option value="">Select type...</option>
                {MATTER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="urgency">Urgency</Label>
              <select
                id="urgency"
                value={form.urgency}
                onChange={(e) => set('urgency', e.target.value)}
                className="w-full h-9 rounded-md border border-vault-border bg-vault-surface px-3 text-sm text-vault-text focus:outline-none focus:ring-1 focus:ring-vault-accent"
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="source">Source</Label>
              <select
                id="source"
                value={form.source}
                onChange={(e) => set('source', e.target.value)}
                className="w-full h-9 rounded-md border border-vault-border bg-vault-surface px-3 text-sm text-vault-text focus:outline-none focus:ring-1 focus:ring-vault-accent"
              >
                <option value="">Select source...</option>
                {SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jurisdiction">Jurisdiction</Label>
              <Input id="jurisdiction" value={form.jurisdiction} onChange={(e) => set('jurisdiction', e.target.value)} placeholder="S.D.N.Y." />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="opposingParties">
              Opposing Parties
              <span className="text-vault-muted text-xs ml-1.5">(comma-separated — used for conflict check)</span>
            </Label>
            <Input id="opposingParties" value={form.opposingParties} onChange={(e) => set('opposingParties', e.target.value)} placeholder="Acme Corp, John Doe" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Brief description of the matter and any relevant background..." rows={4} />
          </div>
        </div>

        {/* Conflict check notice */}
        <div className="flex items-start gap-3 rounded-md border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-xs text-vault-text-secondary">
            Submitting this form will automatically run a conflict check against all existing clients, contacts, and matters. Results will appear immediately.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-vault-danger/30 bg-vault-danger/10 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-vault-danger shrink-0" />
            <p className="text-sm text-vault-danger">{error}</p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Link href="/intake">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading || !form.prospectName}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Running Conflict Check...</> : 'Submit & Run Conflict Check'}
          </Button>
        </div>
      </form>
    </div>
  )
}
