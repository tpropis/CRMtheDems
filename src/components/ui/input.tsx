import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-vault-border bg-vault-surface px-3 py-1.5 text-sm text-vault-text',
          'shadow-[inset_0_1px_2px_rgba(20,18,14,0.04)]',
          'placeholder:text-vault-muted/80',
          'hover:border-vault-border-strong',
          'focus:outline-none focus:ring-2 focus:ring-vault-accent/30 focus:border-vault-accent focus:bg-vault-surface',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-vault-elevated',
          'transition-all duration-150',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
