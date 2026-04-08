import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      {Icon && (
        <div className="mb-4 rounded-lg border border-vault-border bg-vault-elevated p-3">
          <Icon className="h-6 w-6 text-vault-muted" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-vault-text mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-vault-text-secondary max-w-sm">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} size="sm" className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  )
}
