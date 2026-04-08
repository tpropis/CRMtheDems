import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Date formatting ──────────────────────────────────────────

export function formatDate(date: Date | string | null | undefined, fmt = 'MMM d, yyyy'): string {
  if (!date) return '—'
  return format(new Date(date), fmt)
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—'
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = new Date(date)
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatDeadline(date: Date | string | null | undefined): {
  label: string
  urgent: boolean
  overdue: boolean
} {
  if (!date) return { label: '—', urgent: false, overdue: false }
  const d = new Date(date)
  const overdue = isPast(d) && !isToday(d)
  const daysUntil = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const urgent = daysUntil <= 7 && !overdue
  return {
    label: overdue ? `Overdue ${formatRelative(date)}` : formatRelative(date),
    urgent,
    overdue,
  }
}

// ── Number formatting ────────────────────────────────────────

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(amount))
}

export function formatHours(hours: number | string | null | undefined): string {
  const h = Number(hours || 0)
  return `${h.toFixed(1)}h`
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// ── String utilities ─────────────────────────────────────────

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '…'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Matter / legal utilities ─────────────────────────────────

export function formatMatterNumber(n: number | string): string {
  return `M-${String(n).padStart(5, '0')}`
}

export function formatClientNumber(n: number | string): string {
  return `C-${String(n).padStart(4, '0')}`
}

export function formatBatesNumber(prefix: string, n: number): string {
  return `${prefix}${String(n).padStart(6, '0')}`
}

export function matterTypeLabel(type: string): string {
  const map: Record<string, string> = {
    LITIGATION: 'Litigation',
    CORPORATE: 'Corporate',
    EMPLOYMENT: 'Employment',
    REAL_ESTATE: 'Real Estate',
    FAMILY_LAW: 'Family Law',
    CRIMINAL_DEFENSE: 'Criminal Defense',
    IMMIGRATION: 'Immigration',
    INTELLECTUAL_PROPERTY: 'IP',
    BANKRUPTCY: 'Bankruptcy',
    TAX: 'Tax',
    ESTATE_PLANNING: 'Estate Planning',
    REGULATORY: 'Regulatory',
    OTHER: 'Other',
  }
  return map[type] || type
}

export function roleLabel(role: string): string {
  const map: Record<string, string> = {
    FIRM_OWNER: 'Firm Owner',
    MANAGING_PARTNER: 'Managing Partner',
    PARTNER: 'Partner',
    ASSOCIATE: 'Associate',
    PARALEGAL: 'Paralegal',
    LEGAL_ASSISTANT: 'Legal Assistant',
    INTAKE_COORDINATOR: 'Intake Coordinator',
    BILLING_ADMIN: 'Billing Admin',
    IT_ADMIN: 'IT Admin',
    READ_ONLY_AUDITOR: 'Auditor',
  }
  return map[role] || role
}

// ── Risk level ───────────────────────────────────────────────

export function riskColor(level: string): string {
  const map: Record<string, string> = {
    LOW: 'text-vault-success',
    MEDIUM: 'text-vault-warning',
    HIGH: 'text-orange-400',
    CRITICAL: 'text-vault-danger',
  }
  return map[level] || 'text-vault-text-secondary'
}

// ── Array utilities ──────────────────────────────────────────

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    return { ...groups, [group]: [...(groups[group] || []), item] }
  }, {} as Record<string, T[]>)
}
