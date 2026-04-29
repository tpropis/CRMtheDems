import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Lock, ArrowRight } from 'lucide-react'

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-vault-border bg-vault-bg/85 backdrop-blur-xl shadow-[0_1px_3px_rgba(20,18,14,0.04)]">
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-vault-gold/60 to-transparent" />
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center transition-opacity hover:opacity-85">
          <Logo variant="dark" size="sm" />
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          <NavLink href="/#platform">Platform</NavLink>
          <NavLink href="/security">Security</NavLink>
          <NavLink href="/#workflows">Workflows</NavLink>
          <NavLink href="/#intelligence">AI</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden items-center rounded-md px-3 py-1.5 text-[13px] font-medium text-vault-text-secondary transition-colors hover:text-vault-accent md:inline-flex"
          >
            <Lock className="mr-1.5 h-3.5 w-3.5" />
            Sign in
          </Link>
          <Link href="/demo">
            <Button size="sm" className="gap-1.5">
              Request Demo
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-[13px] font-medium tracking-[0.005em] text-vault-text-secondary transition-colors duration-200 hover:text-vault-ink after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:bg-gradient-to-r after:from-vault-gold after:to-vault-accent after:transition-all after:duration-300 hover:after:w-full"
    >
      {children}
    </Link>
  )
}
