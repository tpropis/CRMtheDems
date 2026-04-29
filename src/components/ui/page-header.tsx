import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  eyebrow?: string
  className?: string
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
  eyebrow,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-7', className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mb-2 flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-vault-muted">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight className="h-2.5 w-2.5 text-vault-faint" />}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-vault-text-secondary transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span
                      className={
                        i === breadcrumbs.length - 1 ? 'text-vault-text-secondary' : ''
                      }
                    >
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
          {eyebrow && (
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-px w-3 bg-vault-gold/60" />
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-vault-gold">
                {eyebrow}
              </p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <h1 className="display-serif text-[1.65rem] font-semibold text-vault-ink tracking-[-0.02em] leading-tight truncate">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="mt-2 text-[13px] text-vault-text-secondary leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      <div className="vault-divider mt-5" />
    </div>
  )
}
