import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-[4px] px-2 py-[3px] font-mono text-[10px] font-semibold uppercase tracking-[0.1em] border',
  {
    variants: {
      variant: {
        default:   'bg-vault-elevated border-vault-border text-vault-text-secondary',
        active:    'bg-vault-success/12 border-vault-success/25 text-vault-success',
        inactive:  'bg-vault-muted/10 border-vault-muted/20 text-vault-muted',
        warning:   'bg-vault-warning/12 border-vault-warning/25 text-vault-warning',
        danger:    'bg-vault-danger/10 border-vault-danger/25 text-vault-danger',
        accent:    'bg-vault-accent/10 border-vault-accent/25 text-vault-accent',
        gold:      'bg-vault-gold/10 border-vault-gold/30 text-vault-gold',
        outline:   'border-vault-border-strong text-vault-text-secondary bg-transparent',
        success:   'bg-vault-success/12 border-vault-success/25 text-vault-success',
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
