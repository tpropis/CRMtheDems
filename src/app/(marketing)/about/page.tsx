import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-vault-bg">
      <nav className="border-b border-vault-border bg-vault-surface/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo variant="dark" size="md" /></Link>
          <Link href="/login"><Button size="sm"><Lock className="h-3.5 w-3.5" />Sign In</Button></Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-vault-text tracking-tight mb-6">About Privilege Vault AI</h1>
        <p className="text-lg text-vault-text-secondary leading-relaxed mb-6">
          Privilege Vault AI is a private AI platform purpose-built for law firms that take privilege, security, and professional responsibility seriously.
        </p>
        <p className="text-vault-text-secondary leading-relaxed mb-6">
          We built this platform because we believe legal work deserves better than retrofitted generic SaaS tools. Privilege is foundational to the legal system. The software that handles it should be too.
        </p>
        <p className="text-vault-text-secondary leading-relaxed">
          Our architecture keeps all AI inference local, all data within the firm's control, and all outputs clearly labeled as draft work product requiring attorney review. We believe the AI can assist, but the attorney always decides.
        </p>
      </div>
    </div>
  )
}
