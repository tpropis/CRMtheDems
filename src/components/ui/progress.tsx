import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  color?: 'accent' | 'success' | 'warning' | 'danger' | 'gold'
}

const colorMap = {
  accent:  'from-vault-accent/80 to-vault-accent',
  success: 'from-vault-success/80 to-vault-success',
  warning: 'from-vault-warning/80 to-vault-warning',
  danger:  'from-vault-danger/80 to-vault-danger',
  gold:    'from-vault-gold/70 to-vault-gold',
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, color = 'accent', ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-1.5 w-full overflow-hidden rounded-full',
      'bg-vault-elevated shadow-[inset_0_1px_2px_rgba(20,18,14,0.08)]',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        'h-full w-full flex-1 rounded-full bg-gradient-to-r transition-all duration-500 ease-out',
        colorMap[color]
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
