import { cn } from '@/lib/utils'

export function SectionMark({
  number,
  label,
  className,
}: {
  number: string
  label: string
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-3 mb-6', className)}>
      <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-vault-gold">
        § {number}
      </span>
      <span className="h-px w-12 bg-gradient-to-r from-vault-gold/70 via-vault-gold/30 to-transparent" />
      <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-vault-muted">
        {label}
      </span>
    </div>
  )
}

export function Eyebrow({
  children,
  tone = 'muted',
  className,
}: {
  children: React.ReactNode
  tone?: 'muted' | 'gold' | 'accent'
  className?: string
}) {
  const toneClass =
    tone === 'gold'
      ? 'text-vault-gold'
      : tone === 'accent'
      ? 'text-vault-accent-light'
      : 'text-vault-muted'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em]',
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  )
}
