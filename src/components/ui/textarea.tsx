import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[88px] w-full rounded-md border border-vault-border bg-vault-surface px-3 py-2 text-sm text-vault-text',
          'shadow-[inset_0_1px_2px_rgba(20,18,14,0.04)]',
          'placeholder:text-vault-muted/80',
          'hover:border-vault-border-strong',
          'focus:outline-none focus:ring-2 focus:ring-vault-accent/30 focus:border-vault-accent',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-vault-elevated resize-y',
          'transition-all duration-150',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
