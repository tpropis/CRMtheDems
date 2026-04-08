import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { formatDate, formatCurrency, formatDeadline, matterTypeLabel } from '@/lib/utils'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, CheckSquare, FileText, AlertTriangle, Users, Scale, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function MatterOverviewPage({ params }: { params: { matterId: string } }) {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const matter = await db.matter.findFirst({
    where: { id: params.matterId, firmId },
    include: {
      client: true,
      parties: { include: { user: { select: { name: true, title: true, role: true } }, contact: { select: { firstName: true, lastName: true } } } },
      deadlines: { where: { isCompleted: false }, orderBy: { dueAt: 'asc' }, take: 5 },
      tasks: { where: { status: { in: ['TODO', 'IN_PROGRESS'] } }, orderBy: { dueAt: 'asc' }, take: 5, include: { assignee: { select: { name: true } } } },
      documents: { orderBy: { createdAt: 'desc' }, take: 5 },
      timeEntries: { where: { status: { in: ['DRAFT', 'SUBMITTED', 'APPROVED'] } }, select: { amount: true } },
    },
  })

  if (!matter) notFound()

  const wipTotal = matter.timeEntries.reduce((sum, e) => sum + Number(e.amount), 0)
  const attorneys = matter.parties.filter((p) => ['RESPONSIBLE_ATTORNEY', 'BILLING_ATTORNEY', 'ASSOCIATE', 'PARTNER'].includes(p.role))

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Tasks" value={matter.tasks.length} icon={CheckSquare} color="accent" />
        <StatCard label="Documents" value={matter.documents.length} icon={FileText} color="default" />
        <StatCard label="Deadlines" value={matter.deadlines.length} icon={AlertTriangle} color={matter.deadlines.length > 3 ? 'warning' : 'default'} />
        <StatCard label="WIP" value={formatCurrency(wipTotal)} icon={Clock} color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Matter details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Info card */}
          <div className="rounded-md border border-vault-border bg-vault-surface">
            <div className="px-5 py-4 border-b border-vault-border">
              <h2 className="text-sm font-semibold text-vault-text flex items-center gap-2">
                <Scale className="h-4 w-4 text-vault-muted" />
                Matter Details
              </h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: 'Practice Area', value: matterTypeLabel(matter.type) },
                { label: 'Jurisdiction', value: matter.jurisdiction || '—' },
                { label: 'Court', value: matter.courtName || '—' },
                { label: 'Case Number', value: matter.caseNumber || '—' },
                { label: 'Judge', value: matter.judgeAssigned || '—' },
                { label: 'Opposing Counsel', value: matter.opposingCounsel || '—' },
                { label: 'Billing Type', value: matter.billingType },
                { label: 'Opened', value: formatDate(matter.openedAt) },
                { label: 'Stat of Lim.', value: matter.statOfLimDate ? formatDate(matter.statOfLimDate) : '—' },
                { label: 'Risk Level', value: matter.riskLevel },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-vault-muted uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm text-vault-text">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="rounded-md border border-vault-border bg-vault-surface">
            <div className="px-5 py-4 border-b border-vault-border">
              <h2 className="text-sm font-semibold text-vault-text flex items-center gap-2">
                <Users className="h-4 w-4 text-vault-muted" />
                Matter Team
              </h2>
            </div>
            <div className="divide-y divide-vault-border/50">
              {attorneys.map((p) => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-vault-text">{p.user?.name || `${p.contact?.firstName} ${p.contact?.lastName}`}</p>
                    <p className="text-xs text-vault-text-secondary">{p.role.replace(/_/g, ' ')}</p>
                  </div>
                  {p.isPrimary && <Badge variant="accent">Primary</Badge>}
                </div>
              ))}
              {attorneys.length === 0 && (
                <p className="px-5 py-4 text-sm text-vault-text-secondary">No team members assigned.</p>
              )}
            </div>
          </div>

          {/* Recent documents */}
          <div className="rounded-md border border-vault-border bg-vault-surface">
            <div className="flex items-center justify-between px-5 py-4 border-b border-vault-border">
              <h2 className="text-sm font-semibold text-vault-text flex items-center gap-2">
                <FileText className="h-4 w-4 text-vault-muted" />
                Recent Documents
              </h2>
              <Link href={`/app/matters/${matter.id}/documents`}>
                <Button variant="ghost" size="sm" className="text-xs">All</Button>
              </Link>
            </div>
            <div className="divide-y divide-vault-border/50">
              {matter.documents.map((doc) => (
                <div key={doc.id} className="px-5 py-3 flex items-center gap-3">
                  <FileText className="h-4 w-4 text-vault-muted shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-vault-text truncate">{doc.name}</p>
                    <p className="text-xs text-vault-muted">{formatDate(doc.createdAt)}</p>
                  </div>
                  {doc.isPrivileged && <Badge variant="gold">Privileged</Badge>}
                </div>
              ))}
              {matter.documents.length === 0 && (
                <p className="px-5 py-4 text-sm text-vault-text-secondary">No documents uploaded.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: deadlines + tasks */}
        <div className="space-y-4">
          <div className="rounded-md border border-vault-border bg-vault-surface">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-vault-border">
              <h2 className="text-sm font-semibold text-vault-text flex items-center gap-2">
                <Calendar className="h-4 w-4 text-vault-muted" />
                Deadlines
              </h2>
            </div>
            <div className="divide-y divide-vault-border/50">
              {matter.deadlines.map((dl) => {
                const { label, urgent, overdue } = formatDeadline(dl.dueAt)
                return (
                  <div key={dl.id} className="px-4 py-3">
                    <p className="text-sm text-vault-text font-medium">{dl.title}</p>
                    <p className={`text-xs mt-0.5 font-medium ${overdue ? 'text-vault-danger' : urgent ? 'text-vault-warning' : 'text-vault-text-secondary'}`}>
                      {overdue && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                      {label}
                    </p>
                  </div>
                )
              })}
              {matter.deadlines.length === 0 && (
                <p className="px-4 py-6 text-sm text-center text-vault-text-secondary">No open deadlines.</p>
              )}
            </div>
          </div>

          <div className="rounded-md border border-vault-border bg-vault-surface">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-vault-border">
              <h2 className="text-sm font-semibold text-vault-text flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-vault-muted" />
                Open Tasks
              </h2>
              <Link href={`/app/matters/${matter.id}/tasks`}>
                <Button variant="ghost" size="sm" className="text-xs">All</Button>
              </Link>
            </div>
            <div className="divide-y divide-vault-border/50">
              {matter.tasks.map((task) => (
                <div key={task.id} className="px-4 py-3 flex items-start gap-2">
                  <div className="h-4 w-4 rounded border border-vault-border mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-vault-text">{task.title}</p>
                    <p className="text-xs text-vault-text-secondary">
                      {task.assignee?.name || 'Unassigned'}
                      {task.dueAt && ` · ${formatDate(task.dueAt)}`}
                    </p>
                  </div>
                </div>
              ))}
              {matter.tasks.length === 0 && (
                <p className="px-4 py-6 text-sm text-center text-vault-text-secondary">No open tasks.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
