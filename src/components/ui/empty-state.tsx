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
    <div className={cn('flex flex-col items-center justify-center py-20 px-6 text-center', className)}>
      {Icon && (
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-vault-gold/10 blur-xl" />
          <div className="relative rounded-full border border-vault-gold/30 bg-gradient-to-b from-vault-gold/10 to-vault-gold/5 p-4 shadow-vault-seal-sm">
            <Icon className="h-7 w-7 text-vault-gold" />
          </div>
        </div>
      )}
      <h3 className="display-serif text-[1.05rem] font-semibold text-vault-ink tracking-[-0.01em] mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-[13px] text-vault-text-secondary max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} size="sm" className="mt-5">
          {action.label}
        </Button>
      )}
    </div>
  )
}
