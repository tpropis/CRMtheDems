import { Badge } from './badge'
import type { BadgeProps } from './badge'

type StatusType = 'ACTIVE' | 'INACTIVE' | 'CLOSED' | 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED' | string

const STATUS_MAP: Record<string, { variant: BadgeProps['variant']; label: string }> = {
  ACTIVE:           { variant: 'active', label: 'Active' },
  ON_HOLD:          { variant: 'warning', label: 'On Hold' },
  CLOSED:           { variant: 'inactive', label: 'Closed' },
  ARCHIVED:         { variant: 'inactive', label: 'Archived' },
  INTAKE:           { variant: 'accent', label: 'Intake' },
  DRAFT:            { variant: 'default', label: 'Draft' },
  FINAL:            { variant: 'active', label: 'Final' },
  NEW:              { variant: 'accent', label: 'New' },
  SCREENING:        { variant: 'warning', label: 'Screening' },
  CONFLICT_CHECK:   { variant: 'warning', label: 'Conflict Check' },
  APPROVED:         { variant: 'active', label: 'Approved' },
  REJECTED:         { variant: 'danger', label: 'Rejected' },
  CONVERTED:        { variant: 'active', label: 'Converted' },
  PENDING:          { variant: 'warning', label: 'Pending' },
  IN_PROGRESS:      { variant: 'accent', label: 'In Progress' },
  REVIEW:           { variant: 'warning', label: 'Review' },
  TODO:             { variant: 'default', label: 'Todo' },
  DONE:             { variant: 'active', label: 'Done' },
  CANCELLED:        { variant: 'inactive', label: 'Cancelled' },
  CLEAR:            { variant: 'active', label: 'Clear' },
  POTENTIAL_CONFLICT: { variant: 'warning', label: 'Potential' },
  CONFLICT_CONFIRMED: { variant: 'danger', label: 'Conflict' },
  WAIVED:           { variant: 'gold', label: 'Waived' },
  SENT:             { variant: 'accent', label: 'Sent' },
  PAID:             { variant: 'active', label: 'Paid' },
  PARTIAL:          { variant: 'warning', label: 'Partial' },
  OVERDUE:          { variant: 'danger', label: 'Overdue' },
  VOID:             { variant: 'inactive', label: 'Void' },
  UNREVIEWED:       { variant: 'default', label: 'Unreviewed' },
  REVIEWED:         { variant: 'active', label: 'Reviewed' },
}

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] || { variant: 'default' as const, label: status }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
