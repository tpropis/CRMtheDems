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
  default: 'text-vault-ink',
  accent:  'text-vault-accent',
  success: 'text-vault-success',
  warning: 'text-vault-warning',
  danger:  'text-vault-danger',
}

const stripeMap = {
  default: 'bg-gradient-to-r from-vault-border-strong to-vault-border-strong/30',
  accent:  'bg-gradient-to-r from-vault-accent to-vault-accent/40',
  success: 'bg-gradient-to-r from-vault-success to-vault-success/40',
  warning: 'bg-gradient-to-r from-vault-warning to-vault-warning/40',
  danger:  'bg-gradient-to-r from-vault-danger to-vault-danger/40',
}

const iconTintMap = {
  default: 'text-vault-accent bg-vault-accent/8 border-vault-accent/20',
  accent:  'text-vault-accent bg-vault-accent/8 border-vault-accent/25',
  success: 'text-vault-success bg-vault-success/10 border-vault-success/25',
  warning: 'text-vault-warning bg-vault-warning/10 border-vault-warning/25',
  danger:  'text-vault-danger bg-vault-danger/10 border-vault-danger/25',
}

export function StatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  color = 'default',
  className,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={cn('stat-card', onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      <div className={cn('h-[3px] w-full', stripeMap[color])} />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted">
            {label}
          </p>
          {Icon && (
            <div className={cn('flex h-7 w-7 items-center justify-center rounded border shrink-0', iconTintMap[color])}>
              <Icon className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
        <p className={cn('mt-3 font-display text-[1.85rem] font-bold tabular-nums leading-none tracking-tight', colorMap[color])}>
          {value}
        </p>
        {change && (
          <div className="mt-2.5 flex items-center gap-1">
            {trend === 'up' && <TrendingUp className="h-3 w-3 text-vault-success" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3 text-vault-danger" />}
            {trend === 'neutral' && <Minus className="h-3 w-3 text-vault-muted" />}
            <span
              className={cn(
                'text-[11px] font-mono tabular-nums',
                trend === 'up' && 'text-vault-success',
                trend === 'down' && 'text-vault-danger',
                trend === 'neutral' && 'text-vault-muted',
                !trend && 'text-vault-text-secondary'
              )}
            >
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
