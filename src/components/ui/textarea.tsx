import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-vault-border bg-vault-elevated px-3 py-2 text-sm text-vault-text',
          'placeholder:text-vault-muted',
          'focus:outline-none focus:ring-1 focus:ring-vault-accent focus:border-vault-accent',
          'disabled:cursor-not-allowed disabled:opacity-50 resize-y',
          'transition-colors',
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
