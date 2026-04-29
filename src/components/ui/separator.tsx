import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '@/lib/utils'

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & { faded?: boolean }
>(({ className, orientation = 'horizontal', decorative = true, faded = false, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0',
      orientation === 'horizontal'
        ? cn(
            'h-px w-full',
            faded
              ? 'bg-gradient-to-r from-transparent via-vault-border to-transparent'
              : 'bg-vault-border'
          )
        : cn(
            'h-full w-px',
            faded
              ? 'bg-gradient-to-b from-transparent via-vault-border to-transparent'
              : 'bg-vault-border'
          ),
      className
    )}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
