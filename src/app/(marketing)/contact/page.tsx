import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-vault-bg">
      <nav className="border-b border-vault-border bg-vault-surface/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo variant="dark" size="md" /></Link>
          <Link href="/login"><Button size="sm"><Lock className="h-3.5 w-3.5" />Sign In</Button></Link>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-vault-text tracking-tight mb-4">Contact Us</h1>
        <p className="text-vault-text-secondary mb-8">For enterprise inquiries, deployment questions, or security reviews, reach our team directly.</p>
        <div className="rounded-md border border-vault-border bg-vault-surface p-6">
          <p className="text-sm text-vault-text-secondary">Enterprise Sales & Deployments</p>
          <p className="text-sm font-medium text-vault-accent-light mt-1">enterprise@privilegevault.ai</p>
          <p className="text-xs text-vault-muted mt-4">We respond within one business day. All communications are confidential.</p>
        </div>
      </div>
    </div>
  )
}
