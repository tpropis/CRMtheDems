export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { formatCurrency, formatDate, formatDeadline, matterTypeLabel } from '@/lib/utils'
import { StatCard } from '@/components/ui/stat-card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import {
  Briefcase, ClipboardList, AlertTriangle, Clock,
  FileText, Bot, ArrowRight, Plus, Calendar,
  TrendingUp, Users, Receipt,
} from 'lucide-react'

async function getDashboardData(firmId: string) {
  const [
    activeMatters,
    newIntake,
    urgentDeadlines,
    pendingTime,
    recentMatters,
    upcomingDeadlines,
    recentAIJobs,
    tasksDueToday,
  ] = await Promise.all([
    db.matter.count({ where: { firmId, status: 'ACTIVE' } }),
    db.intakeLead.count({ where: { firmId, status: { in: ['NEW', 'SCREENING', 'CONFLICT_CHECK'] } } }),
    db.deadline.count({
      where: {
        firmId,
        isCompleted: false,
        dueAt: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    db.timeEntry.aggregate({
      where: { firmId, status: 'DRAFT' },
      _sum: { amount: true },
    }),
    db.matter.findMany({
      where: { firmId, status: { in: ['ACTIVE', 'INTAKE'] } },
      take: 8,
      orderBy: { updatedAt: 'desc' },
      include: {
        client: { select: { name: true } },
        parties: {
          where: { role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
          include: { user: { select: { name: true } } },
          take: 1,
        },
      },
    }),
    db.deadline.findMany({
      where: {
        firmId,
        isCompleted: false,
        dueAt: { gte: new Date() },
      },
      take: 6,
      orderBy: { dueAt: 'asc' },
      include: { matter: { select: { name: true, matterNumber: true } } },
    }),
    db.aIJob.findMany({
      where: { firmId, status: { in: ['COMPLETE', 'PROCESSING'] } },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    db.task.count({
      where: {
        firmId,
        status: { in: ['TODO', 'IN_PROGRESS'] },
        dueAt: { lte: new Date(new Date().setHours(23, 59, 59, 999)) },
      },
    }),
  ])

  return {
    activeMatters,
    newIntake,
    urgentDeadlines,
    pendingTime: Number(pendingTime._sum.amount || 0),
    recentMatters,
    upcomingDeadlines,
    recentAIJobs,
    tasksDueToday,
  }
}

const EMPTY_DATA = {
  activeMatters: 0,
  newIntake: 0,
  urgentDeadlines: 0,
  pendingTime: 0,
  recentMatters: [] as any[],
  upcomingDeadlines: [] as any[],
  recentAIJobs: [] as any[],
  tasksDueToday: 0,
}

export default async function DashboardPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const data = firmId === 'demo-firm'
    ? EMPTY_DATA
    : await getDashboardData(firmId).catch(() => EMPTY_DATA)

  const stats = [
    {
      label: 'Active Matters',
      value: data.activeMatters,
      icon: Briefcase,
      color: 'accent' as const,
      change: '+3 this month',
      trend: 'up' as const,
    },
    {
      label: 'Intake Queue',
      value: data.newIntake,
      icon: ClipboardList,
      color: data.newIntake > 5 ? 'warning' as const : 'default' as const,
      change: 'Requires attention',
      trend: 'neutral' as const,
    },
    {
      label: 'Urgent Deadlines',
      value: data.urgentDeadlines,
      icon: AlertTriangle,
      color: data.urgentDeadlines > 3 ? 'danger' as const : 'warning' as const,
      change: 'Next 7 days',
      trend: 'neutral' as const,
    },
    {
      label: 'Unbilled WIP',
      value: formatCurrency(data.pendingTime),
      icon: Receipt,
      color: 'success' as const,
      change: 'Draft entries',
      trend: 'up' as const,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Good morning, ${session?.user?.name?.split(' ')[0]}.`}
        description="Here's what requires your attention today."
        actions={
          <div className="flex gap-2">
            <Link href="/intake/new">
              <Button size="sm">
                <Plus className="h-4 w-4" />
                New Intake
              </Button>
            </Link>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active matters */}
        <div className="lg:col-span-2 rounded-md border border-vault-border bg-vault-surface overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-vault-border">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-vault-muted" />
              <h2 className="text-sm font-semibold text-vault-text">Active Matters</h2>
            </div>
            <Link href="/matters">
              <Button variant="ghost" size="sm" className="text-xs">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-vault-border/50">
            {data.recentMatters.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-vault-text-secondary">
                No active matters.{' '}
                <Link href="/intake/new" className="text-vault-accent-light hover:underline">Create one</Link>
              </div>
            ) : (
              data.recentMatters.map((matter) => {
                const attorney = matter.parties[0]?.user?.name || '—'
                return (
                  <Link
                    key={matter.id}
                    href={`/app/matters/${matter.id}/overview`}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-vault-elevated transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-vault-muted">{matter.matterNumber}</span>
                        <StatusBadge status={matter.status} />
                      </div>
                      <p className="text-sm font-medium text-vault-text truncate">{matter.name}</p>
                      <p className="text-xs text-vault-text-secondary mt-0.5">
                        {matter.client.name} · {attorney}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs text-vault-muted">{matterTypeLabel(matter.type)}</span>
                      <div className={`text-xs mt-0.5 font-medium ${
                        matter.riskLevel === 'CRITICAL' ? 'text-vault-danger' :
                        matter.riskLevel === 'HIGH' ? 'text-orange-400' :
                        matter.riskLevel === 'MEDIUM' ? 'text-vault-warning' : 'text-vault-success'
                      }`}>
                        {matter.riskLevel} RISK
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Right column: deadlines + AI */}
        <div className="space-y-4">
          {/* Upcoming deadlines */}
          <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-vault-border">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-vault-muted" />
                <h2 className="text-sm font-semibold text-vault-text">Deadlines</h2>
              </div>
              <Link href="/calendar">
                <Button variant="ghost" size="sm" className="text-xs">All</Button>
              </Link>
            </div>
            <div className="divide-y divide-vault-border/50">
              {data.upcomingDeadlines.length === 0 ? (
                <p className="px-4 py-6 text-sm text-center text-vault-text-secondary">No upcoming deadlines</p>
              ) : (
                data.upcomingDeadlines.map((dl) => {
                  const { label, urgent, overdue } = formatDeadline(dl.dueAt)
                  return (
                    <div key={dl.id} className="px-4 py-3">
                      <p className="text-sm text-vault-text font-medium truncate">{dl.title}</p>
                      <p className="text-xs text-vault-text-secondary truncate mb-1">
                        {dl.matter.name}
                      </p>
                      <span className={`text-xs font-medium ${
                        overdue ? 'text-vault-danger' : urgent ? 'text-vault-warning' : 'text-vault-text-secondary'
                      }`}>
                        {label}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* AI Activity */}
          <div className="rounded-md border border-vault-border bg-vault-surface overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-vault-border">
              <Bot className="h-4 w-4 text-vault-muted" />
              <h2 className="text-sm font-semibold text-vault-text">Recent AI Activity</h2>
            </div>
            <div className="divide-y divide-vault-border/50">
              {data.recentAIJobs.length === 0 ? (
                <p className="px-4 py-6 text-sm text-center text-vault-text-secondary">No recent AI jobs</p>
              ) : (
                data.recentAIJobs.map((job) => (
                  <div key={job.id} className="px-4 py-3 flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${
                      job.status === 'COMPLETE' ? 'bg-vault-success' :
                      job.status === 'PROCESSING' ? 'bg-vault-warning animate-pulse' :
                      'bg-vault-danger'
                    }`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-vault-text truncate capitalize">
                        {job.type.toLowerCase().replace(/_/g, ' ')}
                      </p>
                      <p className="text-2xs text-vault-muted">
                        {job.model || 'Local model'} · {formatDate(job.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-vault-success shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-vault-text">Research thread saved</p>
                    <p className="text-2xs text-vault-muted">Ollama llama3.1 · Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
