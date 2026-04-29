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
        <div className="flex items-center gap-2.5 rounded-md border border-vault-danger/30 bg-vault-danger/[0.07] px-4 py-3 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-vault-danger shrink-0" />
          <p className="text-[13px] text-vault-danger">{error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[12px] font-medium text-vault-text-secondary">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder="attorney@firm.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-[12px] font-medium text-vault-text-secondary">
            Password
          </Label>
          <a href="#" className="text-[11px] text-vault-accent-light hover:text-vault-accent hover:underline underline-offset-2 transition-colors">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-muted hover:text-vault-text-secondary transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full mt-1" size="lg" loading={loading}>
        <Lock className="h-4 w-4" />
        Sign in securely
      </Button>

      {/* Demo credentials */}
      <div className="relative rounded-md border border-vault-gold/30 bg-vault-gold/[0.05] p-4">
        <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-md bg-gradient-to-r from-transparent via-vault-gold/50 to-transparent" />
        <p className="font-mono text-[9.5px] font-semibold text-vault-gold/70 uppercase tracking-[0.2em] mb-2.5">
          Demo Access
        </p>
        <div className="space-y-1.5 text-[12px] font-mono">
          <div className="flex items-center gap-2">
            <span className="text-vault-muted w-10 shrink-0">email</span>
            <span className="text-vault-text-secondary">admin@hartleyandassoc.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-vault-muted w-10 shrink-0">pass</span>
            <span className="text-vault-text-secondary">PrivilegeVault2024!</span>
          </div>
        </div>
      </div>
    </form>
  )
}
