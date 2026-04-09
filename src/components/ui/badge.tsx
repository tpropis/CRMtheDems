import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border transition-colors',
  {
    variants: {
      variant: {
        default:   'bg-vault-elevated border-vault-border text-vault-text-secondary',
        active:    'bg-vault-success/15 border-vault-success/25 text-vault-success',
        inactive:  'bg-vault-muted/10 border-vault-muted/20 text-vault-muted',
        warning:   'bg-vault-warning/15 border-vault-warning/25 text-vault-warning',
        danger:    'bg-vault-danger/15 border-vault-danger/25 text-vault-danger',
        accent:    'bg-vault-accent/15 border-vault-accent/25 text-vault-accent-light',
        gold:      'bg-amber-500/10 border-amber-500/25 text-amber-400',
        outline:   'border-vault-border text-vault-text-secondary bg-transparent',
        success:   'bg-vault-success/15 border-vault-success/25 text-vault-success',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
