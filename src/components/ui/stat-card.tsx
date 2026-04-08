import * as React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ComponentType<{ className?: string }>
  color?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
  className?: string
  onClick?: () => void
}

const colorMap = {
  default: 'text-vault-text-secondary',
  accent: 'text-vault-accent-light',
  success: 'text-vault-success',
  warning: 'text-vault-warning',
  danger: 'text-vault-danger',
}

export function StatCard({ label, value, change, trend, icon: Icon, color = 'default', className, onClick }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-vault-border bg-vault-surface p-5 transition-colors',
        onClick && 'cursor-pointer hover:bg-vault-elevated',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-vault-muted">{label}</p>
          <p className={cn('text-2xl font-bold tabular-nums tracking-tight', colorMap[color])}>
            {value}
          </p>
        </div>
        {Icon && (
          <div className="rounded-md border border-vault-border bg-vault-elevated p-2">
            <Icon className={cn('h-4 w-4', colorMap[color])} />
          </div>
        )}
      </div>
      {change && (
        <div className="mt-3 flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="h-3 w-3 text-vault-success" />}
          {trend === 'down' && <TrendingDown className="h-3 w-3 text-vault-danger" />}
          {trend === 'neutral' && <Minus className="h-3 w-3 text-vault-muted" />}
          <span className={cn(
            'text-xs',
            trend === 'up' && 'text-vault-success',
            trend === 'down' && 'text-vault-danger',
            trend === 'neutral' && 'text-vault-muted'
          )}>
            {change}
          </span>
        </div>
      )}
    </div>
  )
}
