'use client'
import React from 'react'
import { Bell, Search, Shield, Command, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="relative flex h-14 items-center justify-between border-b border-vault-border bg-vault-surface px-3 md:px-5">
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile menu button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-md text-vault-text-secondary hover:bg-vault-elevated hover:text-vault-ink transition-colors"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        )}

        {/* Command search pill */}
        <button
          type="button"
          className="group hidden sm:inline-flex h-8 items-center gap-2 rounded-md border border-vault-border bg-vault-elevated px-3 text-[12px] text-vault-muted hover:border-vault-border-strong hover:text-vault-text-secondary transition-colors w-[280px] text-left"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1">Search matters, docs, contacts&hellip;</span>
          <span className="ml-auto flex items-center gap-0.5">
            <span className="kbd">
              <Command className="h-2.5 w-2.5" />
            </span>
            <span className="kbd">K</span>
          </span>
        </button>

        {/* Mobile search icon */}
        <button
          type="button"
          aria-label="Search"
          className="sm:hidden flex h-9 w-9 items-center justify-center rounded-md text-vault-text-secondary hover:bg-vault-elevated hover:text-vault-ink transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Deployment indicator (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 h-7 rounded-md border border-vault-gold/30 bg-vault-gold/5">
          <span
            className="live-dot !bg-vault-gold"
            style={{ boxShadow: '0 0 0 0 rgba(182,138,62,0.45)' }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-gold">
            Deployment · Private
          </span>
        </div>

        {/* Audit indicator (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 h-7 rounded-md border border-vault-border bg-vault-elevated">
          <Shield className="h-3 w-3 text-vault-accent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-text-secondary">
            Sealed
          </span>
        </div>

        {/* Mobile sealed chip (icon-only) */}
        <div className="md:hidden flex items-center justify-center h-9 w-9 rounded-md text-vault-gold bg-vault-gold/5 border border-vault-gold/30">
          <Shield className="h-3.5 w-3.5" />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-vault-text-secondary hover:text-vault-ink"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-vault-gold" />
        </Button>
      </div>
    </header>
  )
}
