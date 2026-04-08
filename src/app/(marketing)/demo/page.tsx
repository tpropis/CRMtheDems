import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Lock, Calendar } from 'lucide-react'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-vault-bg">
      <nav className="border-b border-vault-border bg-vault-surface/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo variant="dark" size="md" /></Link>
          <Link href="/login"><Button size="sm"><Lock className="h-3.5 w-3.5" />Sign In</Button></Link>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <Calendar className="h-10 w-10 text-vault-accent-light mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-vault-text tracking-tight mb-4">Request a Private Demo</h1>
        <p className="text-vault-text-secondary mb-8">
          We walk through the platform with your team in a secure, private session. No recorded demos. No public webinars. We take privacy seriously.
        </p>
        <Link href="/login">
          <Button size="xl">Access Demo Environment →</Button>
        </Link>
        <p className="mt-4 text-xs text-vault-muted">Use demo credentials: admin@hartleyandassoc.com / PrivilegeVault2024!</p>
      </div>
    </div>
  )
}
