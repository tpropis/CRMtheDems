import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDate, formatDateTime } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar, AlertTriangle, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function CalendarPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId

  const now = new Date()
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const [events, deadlines] = await Promise.all([
    db.calendarEvent.findMany({
      where: { firmId, startAt: { gte: now, lte: thirtyDays } },
      orderBy: { startAt: 'asc' },
      include: { matter: { select: { name: true, matterNumber: true } } },
      take: 50,
    }),
    db.deadline.findMany({
      where: {
        firmId,
        isCompleted: false,
        dueAt: { gte: now, lte: thirtyDays },
      },
      orderBy: { dueAt: 'asc' },
      include: { matter: { select: { name: true, matterNumber: true } } },
      take: 30,
    }),
  ])

  const EVENT_COLORS: Record<string, string> = {
    HEARING: 'text-vault-accent-light bg-vault-accent/10 border-vault-accent/30',
    TRIAL: 'text-vault-danger bg-vault-danger/10 border-vault-danger/30',
    DEADLINE: 'text-vault-warning bg-vault-warning/10 border-vault-warning/30',
    DEPOSITION: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    MEETING: 'text-vault-text-secondary bg-vault-elevated border-vault-border',
    DEFAULT: 'text-vault-text-secondary bg-vault-elevated border-vault-border',
  }

  // Group by date
  const grouped: Record<string, (typeof events[0] | { _type: 'deadline' } & typeof deadlines[0])[]> = {}
  events.forEach((e) => {
    const key = formatDate(e.startAt, 'yyyy-MM-dd')
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(e as any)
  })
  deadlines.forEach((d) => {
    const key = formatDate(d.dueAt, 'yyyy-MM-dd')
    if (!grouped[key]) grouped[key] = []
    grouped[key].push({ ...d, _type: 'deadline' } as any)
  })

  const sortedDates = Object.keys(grouped).sort()

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Calendar"
        description="Events, hearings, deadlines — next 30 days"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Timeline view */}
        <div className="lg:col-span-2 space-y-4">
          {sortedDates.length === 0 ? (
            <div className="rounded-md border border-vault-border bg-vault-surface p-12 text-center">
              <Calendar className="h-8 w-8 text-vault-muted mx-auto mb-3" />
              <p className="text-sm text-vault-text-secondary">No events in the next 30 days.</p>
            </div>
          ) : (
            sortedDates.map((date) => {
              const items = grouped[date]
              const dateObj = new Date(date + 'T00:00:00')
              const isToday = formatDate(dateObj) === formatDate(now)
              return (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`text-sm font-semibold ${isToday ? 'text-vault-accent-light' : 'text-vault-text'}`}>
                      {formatDate(dateObj, 'EEEE, MMMM d')}
                    </div>
                    {isToday && <Badge variant="accent">Today</Badge>}
                    <div className="flex-1 h-px bg-vault-border" />
                  </div>
                  <div className="space-y-2 ml-2">
                    {items.map((item: any) => {
                      const isDeadline = item._type === 'deadline'
                      const colorClass = isDeadline
                        ? 'text-vault-warning bg-vault-warning/10 border-vault-warning/30'
                        : (EVENT_COLORS[item.eventType] || EVENT_COLORS.DEFAULT)
                      return (
                        <div
                          key={item.id}
                          className={`rounded-md border px-4 py-3 flex items-start gap-3 ${colorClass}`}
                        >
                          {isDeadline ? (
                            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                          ) : (
                            <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs opacity-70">
                              {item.matter?.name} · {item.matter?.matterNumber}
                            </p>
                            {!isDeadline && item.startAt && (
                              <p className="text-xs opacity-70 mt-0.5">{formatDateTime(item.startAt)}</p>
                            )}
                          </div>
                          <div className="ml-auto shrink-0">
                            <Badge variant="outline" className="text-2xs border-current">
                              {isDeadline ? 'DEADLINE' : item.eventType}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Stats sidebar */}
        <div className="space-y-4">
          <div className="rounded-md border border-vault-border bg-vault-surface p-5">
            <h3 className="text-sm font-semibold text-vault-text mb-4">Next 30 Days</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-vault-text-secondary">Total Events</span>
                <span className="text-sm font-semibold text-vault-text">{events.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-vault-text-secondary">Deadlines</span>
                <span className="text-sm font-semibold text-vault-warning">{deadlines.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-vault-text-secondary">Hearings/Trials</span>
                <span className="text-sm font-semibold text-vault-accent-light">
                  {events.filter((e) => ['HEARING', 'TRIAL', 'STATUS_CONFERENCE'].includes(e.eventType)).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
