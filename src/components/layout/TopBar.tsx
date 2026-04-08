'use client'
import React from 'react'
import { Bell, Search, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TopBar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-vault-border bg-vault-surface px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" className="text-vault-muted">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" className="relative text-vault-muted">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-vault-accent" />
        </Button>
        <div className="flex items-center gap-1.5 ml-2 px-2 py-1 rounded-md border border-vault-border bg-vault-elevated">
          <Shield className="h-3 w-3 text-vault-success" />
          <span className="text-2xs font-medium text-vault-muted uppercase tracking-wider">Private</span>
        </div>
      </div>
    </header>
  )
}
