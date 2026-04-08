import type { UserRole, MatterStatus, MatterType, InvoiceStatus, TaskStatus, TaskPriority, PrivilegeTag } from '@prisma/client'

// ── Session types ─────────────────────────────────────────────

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string | null
      firmId: string
      role: UserRole
    }
  }
}

// ── UI types ──────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number | string
  children?: NavItem[]
  requiredRole?: UserRole[]
}

export interface StatCardData {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ComponentType<{ className?: string }>
  color?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

// ── Matter types ─────────────────────────────────────────────

export interface MatterSummary {
  id: string
  matterNumber: string
  name: string
  status: MatterStatus
  type: MatterType
  clientName: string
  responsibleAttorney: string
  riskLevel: string
  nextDeadline?: Date | null
  totalBilled?: number
  lastActivityAt?: Date | null
  createdAt: Date
}

// ── Filter types ──────────────────────────────────────────────

export interface MatterFilters {
  status?: MatterStatus[]
  type?: MatterType[]
  riskLevel?: string[]
  assignedTo?: string[]
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export interface DocumentFilters {
  matterId?: string
  status?: string[]
  isPrivileged?: boolean
  search?: string
  tags?: string[]
  page?: number
  pageSize?: number
}

// ── API response types ────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ── AI types ──────────────────────────────────────────────────

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIResponse {
  content: string
  sources: AISource[]
  confidence: number
  model: string
  tokens: number
  latencyMs: number
  citations?: AICitation[]
}

export interface AISource {
  id: string
  title: string
  excerpt: string
  documentId?: string
  relevance: number
  pageNumber?: number
}

export interface AICitation {
  caseTitle: string
  citation: string
  court?: string
  year?: number
  isVerified: boolean
}

export interface ModelProvider {
  id: string
  name: string
  type: 'ollama' | 'vllm' | 'azure_openai' | 'openai'
  isDefault: boolean
  isAvailable: boolean
}

// ── Privilege types ───────────────────────────────────────────

export interface PrivilegeAnalysis {
  hasPrivilegeIndicators: boolean
  confidence: number
  suggestedTag: PrivilegeTag | null
  indicators: string[]
  reasoning: string
  requiresReview: boolean
}
