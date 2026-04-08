import { Suspense } from 'react'
import { LoginForm } from './LoginForm'
import { Logo } from '@/components/brand/Logo'
import { Shield } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-vault-bg flex">
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <Logo variant="dark" size="lg" />
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-vault-text tracking-tight">Secure Access</h1>
            <p className="mt-1.5 text-sm text-vault-text-secondary">Sign in to your firm's private workspace.</p>
          </div>
          <Suspense fallback={<div className="h-64 skeleton rounded-md" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>

      <div className="hidden lg:flex w-96 flex-col justify-between border-l border-vault-border bg-vault-surface p-10">
        <div />
        <div className="space-y-8">
          <div className="rounded-lg border border-vault-border bg-vault-elevated p-5">
            <Shield className="h-6 w-6 text-vault-accent mb-3" />
            <h3 className="text-sm font-semibold text-vault-text mb-1">Zero-Trust Architecture</h3>
            <p className="text-xs text-vault-text-secondary leading-relaxed">
              All AI inference runs locally within your firm's environment. No client data, privileged communications, or work product ever leaves your control.
            </p>
          </div>
          <div className="space-y-3">
            {[
              'AES-256 encryption at rest and in transit',
              'Matter-level access controls enforced server-side',
              'Immutable audit log for every action',
              'No third-party AI API dependency by default',
              'SOC 2 compliant architecture',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-vault-success shrink-0" />
                <span className="text-xs text-vault-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-vault-border pt-6">
          <p className="text-2xs text-vault-muted">© 2026 Privilege Vault AI. Built for AmLaw firms that demand security.</p>
        </div>
      </div>
    </div>
  )
}
