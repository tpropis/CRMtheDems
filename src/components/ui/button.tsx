import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-vault-bg disabled:pointer-events-none disabled:opacity-40 select-none active:translate-y-[0.5px]',
  {
    variants: {
      variant: {
        default:
          'bg-vault-accent text-[#FBF6EA] hover:bg-vault-accent-light border border-vault-accent-dim/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(20,18,14,0.12),0_1px_3px_rgba(20,18,14,0.06)]',
        destructive:
          'bg-vault-danger text-[#FBF6EA] hover:bg-vault-danger-dim border border-vault-danger-dim/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(20,18,14,0.12),0_1px_3px_rgba(20,18,14,0.06)]',
        outline:
          'border border-vault-border-strong bg-transparent text-vault-text hover:bg-vault-elevated hover:border-vault-accent/40 hover:text-vault-ink',
        secondary:
          'bg-vault-elevated text-vault-text hover:bg-vault-raised border border-vault-border hover:border-vault-border-strong',
        ghost:
          'text-vault-text-secondary hover:bg-vault-elevated hover:text-vault-text',
        link:
          'text-vault-accent underline-offset-4 hover:underline',
        premium:
          'bg-gradient-to-b from-[#C89B4A] to-[#9F7528] text-[#FBF6EA] hover:from-[#D4AC5F] hover:to-[#B68A3E] shadow-vault-lg border border-[#8A6A2D]/40',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-7 px-3 text-xs',
        lg: 'h-11 px-6',
        xl: 'h-12 px-8 text-base',
        icon: 'h-9 w-9',
        'icon-sm': 'h-7 w-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
