import { Suspense } from 'react'
import { LoginForm } from './LoginForm'
import { Logo } from '@/components/brand/Logo'
import { Seal } from '@/components/marketing/Seal'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-vault-bg flex">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-vault-gold/60 to-transparent" />

      {/* Subtle grid backdrop on left side */}
      <div
        className="absolute inset-0 lg:right-[420px] opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,190,159,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,190,159,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 80%)',
        }}
      />

      {/* Left — form */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <Logo variant="dark" size="md" />
          </div>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-4 bg-vault-gold/60" />
              <p className="eyebrow text-vault-gold tracking-[0.2em]">Secure Access</p>
            </div>
            <h1 className="display-serif text-[2rem] font-semibold text-vault-ink tracking-[-0.025em] leading-tight">
              Welcome back.
            </h1>
            <p className="mt-2.5 text-[13px] text-vault-text-secondary leading-relaxed">
              Sign in to your firm&apos;s private workspace. Every action here is sealed, signed, and audited.
            </p>
          </div>
          <Suspense fallback={<div className="h-64 skeleton rounded-md" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>

      {/* Right — editorial panel */}
      <div className="relative hidden lg:flex w-[420px] flex-col justify-between border-l border-vault-border bg-vault-elevated p-10 overflow-hidden">
        <div className="absolute inset-y-8 -left-px w-px bg-gradient-to-b from-transparent via-vault-gold/50 to-transparent" />
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(182,138,62,0.10), transparent 70%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <Seal size={40} />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-vault-muted">
              Est. MMXXVI
            </p>
            <p className="text-[13px] text-vault-text font-medium">
              Privilege Vault Trust
            </p>
          </div>
        </div>

        <div className="relative space-y-8">
          <blockquote className="border-l-2 border-vault-gold pl-5">
            <p className="display-serif text-xl leading-snug text-vault-ink">
              &ldquo;We stopped asking whether AI was safe to use on client work. The architecture answers for us.&rdquo;
            </p>
            <footer className="mt-4 text-xs text-vault-text-secondary">
              <span className="font-medium text-vault-ink">Managing Partner</span>
              <span className="mx-2 text-vault-faint">·</span>
              AmLaw 100 litigation firm
            </footer>
          </blockquote>

          <div className="space-y-2.5">
            {[
              'AES-256 encryption at rest and in transit',
              'Matter-level access, enforced server-side',
              'Immutable, hash-chained audit log',
              'Zero third-party AI API dependency',
              'SOC 2 compliant architecture',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-[5px] w-[5px] rounded-full bg-vault-gold shrink-0" />
                <span className="text-[13px] text-vault-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative border-t border-vault-border pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-vault-faint">
            © 2026 · Built for firms that demand provable custody
          </p>
        </div>
      </div>
    </div>
  )
}
