'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useRole } from '@/hooks/useRole'
import {
  LayoutDashboard,
  Users,
  MapPin,
  DollarSign,
  Heart,
  SignpostBig,
  CheckSquare,
  Calendar,
  Settings,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'manager', 'field', 'volunteer'],
  },
  {
    label: 'Contacts',
    href: '/contacts',
    icon: Users,
    roles: ['admin', 'manager', 'field'],
  },
  {
    label: 'Canvassing',
    href: '/canvassing',
    icon: MapPin,
    roles: ['admin', 'manager', 'field', 'volunteer'],
  },
  {
    label: 'Donors',
    href: '/donors',
    icon: DollarSign,
    roles: ['admin', 'manager'],
  },
  {
    label: 'Volunteers',
    href: '/volunteers',
    icon: Heart,
    roles: ['admin', 'manager', 'field'],
  },
  {
    label: 'Yard Signs',
    href: '/yard-signs',
    icon: SignpostBig,
    roles: ['admin', 'manager', 'field'],
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
    roles: ['admin', 'manager', 'field', 'volunteer'],
  },
  {
    label: 'Events',
    href: '/events',
    icon: Calendar,
    roles: ['admin', 'manager', 'field', 'volunteer'],
  },
  {
    label: 'Admin',
    href: '/admin',
    icon: Settings,
    roles: ['admin'],
  },
]

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

export default function Sidebar({ mobile, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { role } = useRole()

  const visible = navItems.filter((item) =>
    item.roles.includes(role)
  )

  return (
    <div className={cn(
      'flex flex-col h-full bg-slate-900 text-white',
      mobile ? 'w-full' : 'w-60'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/60">
        <div className="w-8 h-8 rounded-md bg-brand-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">CC</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">Campaign</p>
          <p className="text-xs text-slate-400 leading-tight">Command Center</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visible.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700/60">
        <p className="text-xs text-slate-500">v1.0 · District Campaign</p>
      </div>
    </div>
  )
}
