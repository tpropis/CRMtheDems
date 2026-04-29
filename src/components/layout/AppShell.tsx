'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { Session } from 'next-auth'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

/**
 * Client-side wrapper that owns the mobile drawer state.
 * - lg+ : sidebar is static in the flow (240px)
 * - <lg : sidebar is a fixed drawer, hidden by default,
 *         slides in via transform on menu-button click.
 */
export function AppShell({
  session,
  children,
}: {
  session: Session
  children: React.ReactNode
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  // Auto-close drawer on navigation
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  // Lock body scroll when drawer open (mobile only)
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <div className="flex h-screen overflow-hidden bg-vault-bg">
      {/* Backdrop (mobile only) */}
      {drawerOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-vault-ink/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar — static on lg+, drawer below */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-200 ease-out
          lg:static lg:translate-x-0 lg:z-auto
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar session={session} onNavigate={() => setDrawerOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
    </div>
  )
}
