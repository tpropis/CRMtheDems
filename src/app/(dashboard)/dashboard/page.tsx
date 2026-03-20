import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatTimeAgo } from '@/lib/utils'
import { SUPPORT_STATUS_COLORS, SUPPORT_STATUS_LABELS, CANVASS_RESULT_COLORS, CANVASS_RESULT_LABELS } from '@/lib/constants'
import StatCard from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import DashboardCharts from '@/components/dashboard/DashboardCharts'
import QuickAddButtons from '@/components/dashboard/QuickAddButtons'
import Link from 'next/link'
import {
  Users,
  ThumbsUp,
  HelpCircle,
  Heart,
  DollarSign,
  SignpostBig,
  CheckSquare,
  AlertCircle,
  Activity,
  Calendar,
} from 'lucide-react'

export const revalidate = 60

export default async function DashboardPage() {
  const supabase = createClient()

  // Fetch all stats in parallel
  const [
    { count: totalContacts },
    { count: supporters },
    { count: undecided },
    { count: volunteers },
    { count: totalDonors },
    { data: donationSum },
    { count: signsRequested },
    { count: signsDelivered },
    { count: openTasks },
    { count: overdueTasks },
    { data: recentActivity },
    { data: upcomingEvents },
    { data: recentCanvassing },
    { data: supportBreakdown },
  ] = await Promise.all([
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true })
      .in('support_status', ['strong_support', 'lean_support']),
    supabase.from('contacts').select('*', { count: 'exact', head: true })
      .eq('support_status', 'undecided'),
    supabase.from('volunteers').select('*', { count: 'exact', head: true })
      .eq('active', true),
    supabase.from('donors').select('*', { count: 'exact', head: true }),
    supabase.from('donors').select('amount'),
    supabase.from('yard_sign_requests').select('*', { count: 'exact', head: true }),
    supabase.from('yard_sign_requests').select('*', { count: 'exact', head: true })
      .in('delivery_status', ['delivered', 'installed']),
    supabase.from('tasks').select('*', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress']),
    supabase.from('tasks').select('*', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress'])
      .lt('due_date', new Date().toISOString()),
    supabase.from('activity_log').select('*, user:profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('events').select('*')
      .gte('start_datetime', new Date().toISOString())
      .order('start_datetime')
      .limit(4),
    supabase.from('canvass_results').select('result, created_at, contact:contacts(full_name)')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('contacts').select('support_status'),
  ])

  const totalRaised = donationSum?.reduce((sum, d) => sum + (d.amount ?? 0), 0) ?? 0

  // Build support breakdown for chart
  const statusCounts: Record<string, number> = {}
  supportBreakdown?.forEach((c) => {
    statusCounts[c.support_status] = (statusCounts[c.support_status] ?? 0) + 1
  })

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: SUPPORT_STATUS_LABELS[status as keyof typeof SUPPORT_STATUS_LABELS] ?? status,
    value: count,
    status,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Operations Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Campaign overview and field status</p>
        </div>
        <QuickAddButtons />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Contacts"
          value={totalContacts ?? 0}
          icon={Users}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
        />
        <StatCard
          label="Supporters"
          value={supporters ?? 0}
          icon={ThumbsUp}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          highlight
        />
        <StatCard
          label="Undecided"
          value={undecided ?? 0}
          icon={HelpCircle}
          iconBg="bg-yellow-50"
          iconColor="text-yellow-600"
        />
        <StatCard
          label="Active Volunteers"
          value={volunteers ?? 0}
          icon={Heart}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
        />
        <StatCard
          label="Total Raised"
          value={formatCurrency(totalRaised)}
          icon={DollarSign}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Signs Requested"
          value={signsRequested ?? 0}
          icon={SignpostBig}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Signs Delivered"
          value={signsDelivered ?? 0}
          icon={SignpostBig}
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
        />
        <StatCard
          label="Open Tasks"
          value={openTasks ?? 0}
          icon={CheckSquare}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          label="Overdue"
          value={overdueTasks ?? 0}
          icon={AlertCircle}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Breakdown Chart */}
        <div className="lg:col-span-2">
          <DashboardCharts chartData={chartData} />
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <Link href="/events" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
              View all →
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event: Record<string, unknown>) => (
                <div key={event.id as string} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 text-center">
                    <p className="text-xs text-slate-500 leading-tight">
                      {new Date(event.start_datetime as string).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p className="text-base font-bold text-slate-900 leading-tight">
                      {new Date(event.start_datetime as string).getDate()}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{event.title as string}</p>
                    <p className="text-xs text-slate-500 truncate">{event.location as string ?? 'TBD'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No upcoming events</p>
            )}
          </div>
        </Card>
      </div>

      {/* Activity Feed and Recent Canvassing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-400" />
                Recent Activity
              </span>
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((log: Record<string, unknown>) => (
                <div key={log.id as string} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-slate-700">
                      <span className="font-medium">{(log.user as Record<string, string>)?.full_name ?? 'System'}</span>
                      {' '}{(log.action as string).replace(/_/g, ' ')}
                    </span>
                    <p className="text-xs text-slate-400">{formatTimeAgo(log.created_at as string)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No recent activity</p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Canvassing</CardTitle>
            <Link href="/canvassing" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
              View all →
            </Link>
          </CardHeader>
          <div className="space-y-2">
            {recentCanvassing && recentCanvassing.length > 0 ? (
              recentCanvassing.map((r: Record<string, unknown>) => (
                <div key={r.id as string} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 truncate flex-1">
                    {(r.contact as Record<string, string>)?.full_name ?? 'Unknown'}
                  </span>
                  <Badge className={CANVASS_RESULT_COLORS[r.result as string]}>
                    {CANVASS_RESULT_LABELS[r.result as string] ?? r.result as string}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No canvassing results yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
