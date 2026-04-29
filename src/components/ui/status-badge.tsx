import { cn } from '@/lib/utils'
import { Badge } from './badge'
import type { BadgeProps } from './badge'

type StatusType = 'ACTIVE' | 'INACTIVE' | 'CLOSED' | 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED' | string

const STATUS_MAP: Record<string, { variant: BadgeProps['variant']; label: string; dot?: boolean }> = {
  ACTIVE:             { variant: 'active',   label: 'Active',          dot: true  },
  ON_HOLD:            { variant: 'warning',  label: 'On Hold',         dot: true  },
  CLOSED:             { variant: 'inactive', label: 'Closed'                      },
  ARCHIVED:           { variant: 'inactive', label: 'Archived'                    },
  INTAKE:             { variant: 'accent',   label: 'Intake'                      },
  DRAFT:              { variant: 'default',  label: 'Draft'                       },
  FINAL:              { variant: 'active',   label: 'Final',           dot: true  },
  NEW:                { variant: 'accent',   label: 'New'                         },
  SCREENING:          { variant: 'warning',  label: 'Screening',       dot: true  },
  CONFLICT_CHECK:     { variant: 'warning',  label: 'Conflict Check',  dot: true  },
  APPROVED:           { variant: 'active',   label: 'Approved',        dot: true  },
  REJECTED:           { variant: 'danger',   label: 'Rejected',        dot: true  },
  CONVERTED:          { variant: 'active',   label: 'Converted',       dot: true  },
  PENDING:            { variant: 'warning',  label: 'Pending',         dot: true  },
  IN_PROGRESS:        { variant: 'accent',   label: 'In Progress',     dot: true  },
  REVIEW:             { variant: 'warning',  label: 'Review',          dot: true  },
  TODO:               { variant: 'default',  label: 'Todo'                        },
  DONE:               { variant: 'active',   label: 'Done',            dot: true  },
  CANCELLED:          { variant: 'inactive', label: 'Cancelled'                   },
  CLEAR:              { variant: 'active',   label: 'Clear',           dot: true  },
  POTENTIAL_CONFLICT: { variant: 'warning',  label: 'Potential',       dot: true  },
  CONFLICT_CONFIRMED: { variant: 'danger',   label: 'Conflict',        dot: true  },
  WAIVED:             { variant: 'gold',     label: 'Waived'                      },
  SENT:               { variant: 'accent',   label: 'Sent'                        },
  PAID:               { variant: 'active',   label: 'Paid',            dot: true  },
  PARTIAL:            { variant: 'warning',  label: 'Partial',         dot: true  },
  OVERDUE:            { variant: 'danger',   label: 'Overdue',         dot: true  },
  VOID:               { variant: 'inactive', label: 'Void'                        },
  UNREVIEWED:         { variant: 'default',  label: 'Unreviewed'                  },
  REVIEWED:           { variant: 'active',   label: 'Reviewed',        dot: true  },
}

const dotColorMap: Partial<Record<NonNullable<BadgeProps['variant']>, string>> = {
  active:   'bg-vault-success',
  warning:  'bg-vault-warning',
  danger:   'bg-vault-danger',
  accent:   'bg-vault-accent',
  gold:     'bg-vault-gold',
}

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] || { variant: 'default' as const, label: status }
  const dotColor = config.dot && config.variant ? dotColorMap[config.variant] : undefined

  return (
    <Badge variant={config.variant} className={dotColor ? 'pl-1.5' : undefined}>
      {dotColor && (
        <span className={cn('inline-block h-1.5 w-1.5 rounded-full mr-1 shrink-0', dotColor)} />
      )}
      {config.label}
    </Badge>
  )
}
