'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Link2, RefreshCw, CheckCircle2, XCircle, Loader2,
  ArrowRight, Zap, Shield, Clock, AlertCircle, ExternalLink,
} from 'lucide-react'

interface Integration {
  id: string
  type: string
  name: string
  isActive: boolean
  lastSyncAt: string | null
  config: {
    connected?: boolean
    connectedAt?: string
    syncedMatters?: number
    syncedContacts?: number
    syncedTimeEntries?: number
  }
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/integrations')
      .then(r => r.json())
      .then(data => { setIntegrations(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const clio = integrations.find(i => i.type === 'CLIO')

  async function handleClioConnect() {
    const res = await fetch('/api/integrations/clio/authorize')
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  async function handleSync() {
    if (!clio) return
    setSyncing(clio.id)
    try {
      const res = await fetch('/api/integrations/clio/sync', { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        setIntegrations(prev => prev.map(i => i.id === clio.id
          ? { ...i, lastSyncAt: new Date().toISOString(), config: { ...i.config, ...data.stats } }
          : i
        ))
      }
    } finally {
      setSyncing(null)
    }
  }

  async function handleDisconnect() {
    if (!clio || !confirm('Disconnect Clio? Synced data will remain in Privilege Vault.')) return
    setDisconnecting(clio.id)
    await fetch(`/api/integrations/${clio.id}`, { method: 'DELETE' })
    setIntegrations(prev => prev.filter(i => i.id !== clio.id))
    setDisconnecting(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Integrations"
        description="Connect Privilege Vault AI with your existing tools"
      />

      {/* Clio Integration Card */}
      <div className="section-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-vault-border bg-vault-elevated p-3">
              <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#0E4FA0" />
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontFamily="Arial" fontWeight="bold">C</text>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-vault-text">Clio</h3>
                {clio?.isActive ? (
                  <Badge variant="success" className="text-xs">Connected</Badge>
                ) : (
                  <Badge className="text-xs bg-vault-elevated text-vault-muted border-vault-border">Not Connected</Badge>
                )}
              </div>
              <p className="text-sm text-vault-text-secondary mt-1">Industry-leading legal practice management software. Sync matters, contacts, time entries, and documents bidirectionally with AI enrichment on import.</p>

              {clio?.isActive && clio.config && (
                <div className="flex items-center gap-6 mt-3">
                  {clio.config.syncedMatters !== undefined && (
                    <div className="text-xs text-vault-muted"><span className="font-semibold text-vault-text">{clio.config.syncedMatters}</span> matters</div>
                  )}
                  {clio.config.syncedContacts !== undefined && (
                    <div className="text-xs text-vault-muted"><span className="font-semibold text-vault-text">{clio.config.syncedContacts}</span> contacts</div>
                  )}
                  {clio.config.syncedTimeEntries !== undefined && (
                    <div className="text-xs text-vault-muted"><span className="font-semibold text-vault-text">{clio.config.syncedTimeEntries}</span> time entries</div>
                  )}
                  {clio.lastSyncAt && (
                    <div className="flex items-center gap-1 text-xs text-vault-muted">
                      <Clock className="h-3 w-3" />
                      Last sync {new Date(clio.lastSyncAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {clio?.isActive ? (
              <>
                <Button variant="outline" size="sm" onClick={handleSync} disabled={!!syncing}>
                  {syncing === clio.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Sync Now
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={handleDisconnect} disabled={!!disconnecting}>
                  {disconnecting === clio?.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  Disconnect
                </Button>
              </>
            ) : (
              <Button onClick={handleClioConnect}>
                <Link2 className="h-4 w-4" />
                Connect Clio
              </Button>
            )}
          </div>
        </div>

        {/* Feature bullets */}
        <div className="mt-5 pt-5 border-t border-vault-border grid grid-cols-3 gap-4">
          {[
            { icon: RefreshCw, label: 'Bidirectional Sync', desc: 'Matters, contacts, and time entries sync automatically' },
            { icon: Zap, label: 'AI Enrichment', desc: 'AI tags, summarizes, and privilege-reviews imported documents' },
            { icon: Shield, label: 'Webhook Live Sync', desc: 'Changes in Clio reflect instantly via secure webhooks' },
          ].map(f => (
            <div key={f.label} className="flex items-start gap-3">
              <div className="rounded-md bg-vault-elevated border border-vault-border p-1.5 mt-0.5">
                <f.icon className="h-3.5 w-3.5 text-vault-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-vault-text">{f.label}</p>
                <p className="text-xs text-vault-muted mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Setup instructions when not connected */}
        {!clio?.isActive && (
          <div className="mt-5 pt-5 border-t border-vault-border">
            <div className="flex items-start gap-3 p-4 rounded-md bg-vault-elevated border border-vault-border/50">
              <AlertCircle className="h-4 w-4 text-vault-muted mt-0.5 shrink-0" />
              <div className="text-xs text-vault-text-secondary space-y-1">
                <p className="font-medium text-vault-text">Setup Requirements</p>
                <p>1. Add your Clio App credentials to environment variables: <code className="font-mono bg-vault-surface px-1 rounded">CLIO_CLIENT_ID</code> and <code className="font-mono bg-vault-surface px-1 rounded">CLIO_CLIENT_SECRET</code></p>
                <p>2. In your Clio developer app settings, add this callback URL:</p>
                <p className="font-mono bg-vault-surface px-2 py-1 rounded text-vault-accent">{typeof window !== 'undefined' ? window.location.origin : ''}/api/integrations/clio/callback</p>
                <p>3. Required Clio scopes: <code className="font-mono bg-vault-surface px-1 rounded">matters:read contacts:read time_entries:read documents:read calendar_entries:read tasks:read bills:read</code></p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coming soon integrations */}
      <div className="space-y-3">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-vault-muted font-semibold">More Integrations — Coming Soon</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'MyCase', desc: 'Practice management + client portal' },
            { name: 'PracticePanther', desc: 'Legal billing and case management' },
            { name: 'Westlaw', desc: 'Legal research with AI cite-checking' },
            { name: 'Lexis+', desc: 'Case law and statute research' },
            { name: 'DocuSign', desc: 'E-signature for generated documents' },
            { name: 'QuickBooks', desc: 'Sync billing and invoice data' },
          ].map(i => (
            <div key={i.name} className="section-card p-4 opacity-60">
              <p className="text-sm font-medium text-vault-text">{i.name}</p>
              <p className="text-xs text-vault-muted mt-0.5">{i.desc}</p>
              <Badge className="mt-2 text-xs bg-vault-elevated text-vault-muted border-vault-border">Coming Soon</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
