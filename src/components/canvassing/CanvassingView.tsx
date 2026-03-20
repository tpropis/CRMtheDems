'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDate, formatTimeAgo } from '@/lib/utils'
import { CANVASS_RESULT_LABELS, CANVASS_RESULT_COLORS, SUPPORT_STATUS_COLORS, SUPPORT_STATUS_LABELS } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import PageHeader from '@/components/ui/PageHeader'
import CanvassResultForm from './CanvassResultForm'
import WalkListForm from './WalkListForm'
import { Plus, MapPin, Users, ThumbsUp, Phone, List } from 'lucide-react'

interface Props {
  walkLists: Record<string, unknown>[]
  recentResults: Record<string, unknown>[]
  users: { id: string; full_name: string | null }[]
  contacts: Record<string, unknown>[]
  statsData: { result: string }[]
  isVolunteer: boolean
}

export default function CanvassingView({ walkLists, recentResults, users, contacts, statsData, isVolunteer }: Props) {
  const [showResultForm, setShowResultForm] = useState(false)
  const [showWalkListForm, setShowWalkListForm] = useState(false)
  const [selectedWalkList, setSelectedWalkList] = useState<string | null>(null)
  const router = useRouter()

  // Calculate stats
  const totalAttempted = statsData.length
  const reached = statsData.filter((r) => !['not_home', 'wrong_address', 'moved'].includes(r.result)).length
  const supporters = statsData.filter((r) => ['strong_support', 'lean_support'].includes(r.result)).length
  const callbacks = statsData.filter((r) => r.result === 'callback_requested').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Canvassing"
        description="Field operations and walk lists"
        actions={
          <div className="flex gap-2">
            {!isVolunteer && (
              <Button variant="outline" size="sm" onClick={() => setShowWalkListForm(true)}>
                <List className="h-4 w-4" />
                New Walk List
              </Button>
            )}
            <Button size="sm" onClick={() => setShowResultForm(true)}>
              <Plus className="h-4 w-4" />
              Log Result
            </Button>
          </div>
        }
      />

      {/* Stats */}
      {!isVolunteer && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Doors Knocked" value={totalAttempted} icon={MapPin} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <StatCard label="Contacts Reached" value={reached} icon={Users} iconBg="bg-teal-50" iconColor="text-teal-600" />
          <StatCard label="Supporters Found" value={supporters} icon={ThumbsUp} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
          <StatCard label="Callbacks Requested" value={callbacks} icon={Phone} iconBg="bg-orange-50" iconColor="text-orange-600" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Walk Lists */}
        <Card>
          <CardHeader>
            <CardTitle>Walk Lists</CardTitle>
            <span className="text-xs text-slate-500">{walkLists.length} active</span>
          </CardHeader>
          <div className="space-y-2">
            {walkLists.length === 0 && (
              <p className="text-sm text-slate-400 py-4 text-center">No walk lists assigned</p>
            )}
            {walkLists.map((wl) => (
              <div
                key={wl.id as string}
                className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer"
                onClick={() => setSelectedWalkList(selectedWalkList === (wl.id as string) ? null : (wl.id as string))}
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{wl.name as string}</p>
                  <p className="text-xs text-slate-500">
                    {wl.neighborhood as string ?? 'No neighborhood'} ·{' '}
                    Assigned to {(wl.assigned_user as { full_name: string } | null)?.full_name ?? 'Unassigned'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedWalkList(wl.id as string)
                      setShowResultForm(true)
                    }}
                  >
                    Log Result
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
            <span className="text-xs text-slate-500">{recentResults.length} entries</span>
          </CardHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentResults.length === 0 && (
              <p className="text-sm text-slate-400 py-4 text-center">No results yet</p>
            )}
            {recentResults.map((r) => (
              <div key={r.id as string} className="flex items-start justify-between text-sm gap-3 p-2 hover:bg-slate-50 rounded">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">
                    {(r.contact as { full_name: string } | null)?.full_name ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {(r.contact as { address: string } | null)?.address ?? ''} · {(r.user as { full_name: string } | null)?.full_name}
                  </p>
                  {r.note ? <p className="text-xs text-slate-500 mt-0.5 truncate italic">{r.note as string}</p> : null}
                </div>
                <div className="flex-shrink-0 text-right">
                  <Badge className={CANVASS_RESULT_COLORS[r.result as string]}>
                    {CANVASS_RESULT_LABELS[r.result as string]}
                  </Badge>
                  <p className="text-xs text-slate-400 mt-0.5">{formatTimeAgo(r.canvassed_at as string)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Result Form Modal */}
      <CanvassResultForm
        open={showResultForm}
        onClose={() => { setShowResultForm(false); setSelectedWalkList(null) }}
        walkLists={walkLists}
        contacts={contacts}
        defaultWalkListId={selectedWalkList}
        onSuccess={() => { router.refresh() }}
      />

      {!isVolunteer && (
        <WalkListForm
          open={showWalkListForm}
          onClose={() => setShowWalkListForm(false)}
          users={users}
          onSuccess={() => { router.refresh() }}
        />
      )}
    </div>
  )
}
