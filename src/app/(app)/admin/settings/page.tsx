import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bot, Database, Server, Shield } from 'lucide-react'

export default function SettingsPage() {
  const aiProvider = process.env.AI_PROVIDER || 'ollama'
  const storageProvider = process.env.STORAGE_PROVIDER || 'local'

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <PageHeader title="Firm Settings" description="Platform configuration and integrations" />

      <div className="section-card">
        <div className="px-5 py-3.5 border-b border-vault-border bg-gradient-to-b from-vault-elevated/80 to-vault-elevated/40">
          <h2 className="display-serif text-[14px] font-semibold text-vault-ink tracking-[-0.01em] flex items-center gap-2">
            <Bot className="h-4 w-4 text-vault-muted" />AI Model Provider
          </h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-md border border-vault-border bg-gradient-to-b from-vault-elevated to-vault-elevated/60">
            <div>
              <p className="font-medium text-vault-ink capitalize">{aiProvider === 'ollama' ? 'Ollama (Local Inference)' : aiProvider}</p>
              <p className="text-[13px] text-vault-text-secondary mt-0.5">
                {aiProvider === 'ollama' ? 'All inference runs locally. Zero external API calls.' : 'External provider configured.'}
              </p>
            </div>
            <Badge variant={aiProvider === 'ollama' ? 'active' : 'warning'}>
              {aiProvider === 'ollama' ? 'Private' : 'External'}
            </Badge>
          </div>
          <p className="text-xs text-vault-muted">
            Change AI provider via <code className="text-vault-accent-light bg-vault-elevated px-1 rounded">AI_PROVIDER</code> environment variable. Options: ollama, vllm, azure_openai, openai.
          </p>
        </div>
      </div>

      <div className="section-card">
        <div className="px-5 py-3.5 border-b border-vault-border bg-gradient-to-b from-vault-elevated/80 to-vault-elevated/40">
          <h2 className="display-serif text-[14px] font-semibold text-vault-ink tracking-[-0.01em] flex items-center gap-2">
            <Database className="h-4 w-4 text-vault-muted" />File Storage
          </h2>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between p-4 rounded-md border border-vault-border bg-gradient-to-b from-vault-elevated to-vault-elevated/60">
            <div>
              <p className="font-medium text-vault-ink capitalize">{storageProvider === 'local' ? 'Local Filesystem' : 'S3-Compatible'}</p>
              <p className="text-[13px] text-vault-text-secondary mt-0.5">{storageProvider === 'local' ? 'Files stored on server disk.' : 'Cloud storage configured.'}</p>
            </div>
            <Badge variant={storageProvider === 'local' ? 'default' : 'accent'}>{storageProvider}</Badge>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="px-5 py-3.5 border-b border-vault-border bg-gradient-to-b from-vault-elevated/80 to-vault-elevated/40">
          <h2 className="display-serif text-[14px] font-semibold text-vault-ink tracking-[-0.01em] flex items-center gap-2">
            <Shield className="h-4 w-4 text-vault-muted" />Security Posture
          </h2>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: 'Audit Logging', status: true },
            { label: 'Session Expiry (8h)', status: true },
            { label: 'RBAC Enforcement', status: true },
            { label: 'Legal Hold Support', status: true },
            { label: 'MFA (Optional)', status: true },
            { label: 'SSO / SAML', status: false, note: 'Roadmap' },
          ].map(({ label, status, note }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-vault-text-secondary">{label}</span>
              <div className="flex items-center gap-2">
                {note && <span className="text-xs text-vault-muted">{note}</span>}
                <div className={`h-2 w-2 rounded-full ${status ? 'bg-vault-success shadow-[0_0_4px_rgba(45,89,69,0.4)]' : 'bg-vault-muted'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
