'use client'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        setError('Invalid credentials. Please verify your email and password.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2.5 rounded-md border border-vault-danger/30 bg-vault-danger/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-vault-danger shrink-0" />
          <p className="text-sm text-vault-danger">{error}</p>
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" autoComplete="email" required placeholder="attorney@firm.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-xs text-vault-accent-light hover:underline">Forgot password?</a>
        </div>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-muted hover:text-vault-text-secondary">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full" size="lg" loading={loading}>
        <Lock className="h-4 w-4" />
        Sign in securely
      </Button>
      <div className="rounded-md border border-vault-border bg-vault-elevated p-4">
        <p className="text-xs font-semibold text-vault-muted uppercase tracking-wider mb-2">Demo Access</p>
        <div className="space-y-1 text-xs text-vault-text-secondary font-mono">
          <div><span className="text-vault-muted">email:</span> admin@hartleyandassoc.com</div>
          <div><span className="text-vault-muted">pass:</span> PrivilegeVault2024!</div>
        </div>
      </div>
    </form>
  )
}
