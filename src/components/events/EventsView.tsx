'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { EVENT_TYPE_LABELS } from '@/lib/constants'
import { formatDateTime } from '@/lib/utils'
import { Plus, Calendar, MapPin, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import type { EventType } from '@/types'

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  fundraiser: 'bg-green-100 text-green-800',
  coffee_meet: 'bg-amber-100 text-amber-800',
  canvass_launch: 'bg-blue-100 text-blue-800',
  volunteer_shift: 'bg-purple-100 text-purple-800',
  community_event: 'bg-teal-100 text-teal-800',
  sign_wave: 'bg-orange-100 text-orange-800',
  other: 'bg-slate-100 text-slate-600',
}

interface Props {
  events: Record<string, unknown>[]
  users: { id: string; full_name: string | null }[]
}

export default function EventsView({ events: initialEvents, users }: Props) {
  const router = useRouter()
  const [events, setEvents] = useState(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [editEvent, setEditEvent] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    event_type: 'community_event' as EventType,
    description: '',
    location: '',
    start_datetime: '',
    end_datetime: '',
    organizer_id: '',
    notes: '',
  })

  function resetForm(ev?: Record<string, unknown>) {
    if (ev) {
      setForm({
        title: ev.title as string ?? '',
        event_type: ev.event_type as EventType ?? 'other',
        description: ev.description as string ?? '',
        location: ev.location as string ?? '',
        start_datetime: (ev.start_datetime as string)?.slice(0, 16) ?? '',
        end_datetime: (ev.end_datetime as string)?.slice(0, 16) ?? '',
        organizer_id: ev.organizer_id as string ?? '',
        notes: ev.notes as string ?? '',
      })
    } else {
      setForm({ title: '', event_type: 'community_event', description: '', location: '', start_datetime: '', end_datetime: '', organizer_id: '', notes: '' })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.start_datetime) { toast.error('Title and start time required'); return }
    setLoading(true)
    const supabase = createClient()

    const payload = {
      ...form,
      organizer_id: form.organizer_id || null,
      end_datetime: form.end_datetime || null,
      description: form.description || null,
      location: form.location || null,
      notes: form.notes || null,
      updated_at: new Date().toISOString(),
    }

    let result
    if (editEvent?.id) {
      result = await supabase.from('events').update(payload).eq('id', editEvent.id as string)
        .select('*, organizer:profiles(id, full_name)').single()
    } else {
      result = await supabase.from('events').insert(payload)
        .select('*, organizer:profiles(id, full_name)').single()
    }

    setLoading(false)
    if (result.error) {
      toast.error(result.error.message)
    } else {
      const data = result.data as Record<string, unknown>
      setEvents((prev) => {
        const idx = prev.findIndex((ev) => ev.id === data.id)
        if (idx >= 0) { const next = [...prev]; next[idx] = data; return next }
        return [data, ...prev].sort((a, b) =>
          new Date(a.start_datetime as string).getTime() - new Date(b.start_datetime as string).getTime()
        )
      })
      toast.success(editEvent ? 'Event updated' : 'Event created')
      setShowForm(false)
      setEditEvent(null)
    }
  }

  const now = new Date()
  const upcoming = events.filter((e) => new Date(e.start_datetime as string) >= now)
  const past = events.filter((e) => new Date(e.start_datetime as string) < now)

  const typeOptions = Object.entries(EVENT_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))
  const userOptions = users.map((u) => ({ value: u.id, label: u.full_name ?? u.id }))

  function renderEvent(ev: Record<string, unknown>, isPast = false) {
    const organizer = ev.organizer as { full_name: string } | null
    return (
      <div key={ev.id as string} className={`bg-white border border-slate-200 rounded-lg p-4 ${isPast ? 'opacity-70' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={EVENT_TYPE_COLORS[ev.event_type as EventType]}>
                {EVENT_TYPE_LABELS[ev.event_type as EventType]}
              </Badge>
            </div>
            <h3 className="font-semibold text-slate-900">{ev.title as string}</h3>
            {ev.description ? <p className="text-sm text-slate-600 mt-0.5">{ev.description as string}</p> : null}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateTime(ev.start_datetime as string)}
                {ev.end_datetime ? ` → ${formatDateTime(ev.end_datetime as string)}` : ''}
              </span>
              {ev.location ? (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {ev.location as string}
                </span>
              ) : null}
              {organizer ? (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {organizer.full_name}
                </span>
              ) : null}
            </div>
            {ev.notes ? <p className="text-xs text-slate-400 mt-1 italic">{ev.notes as string}</p> : null}
          </div>
          <Button size="sm" variant="ghost" onClick={() => { setEditEvent(ev); resetForm(ev); setShowForm(true) }}>Edit</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description={`${upcoming.length} upcoming · ${past.length} past`}
        actions={
          <Button size="sm" onClick={() => { setEditEvent(null); resetForm(); setShowForm(true) }}>
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        }
      />

      {upcoming.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map((ev) => renderEvent(ev))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Past Events</h2>
          <div className="space-y-3">
            {past.map((ev) => renderEvent(ev, true))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center py-16 text-slate-400">No events yet</div>
      )}

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditEvent(null) }}
        title={editEvent ? 'Edit Event' : 'New Event'}
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditEvent(null) }}>Cancel</Button>
            <Button loading={loading} onClick={handleSubmit}>{editEvent ? 'Save' : 'Create Event'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          <Select label="Event Type" value={form.event_type} onChange={(e) => setForm((f) => ({ ...f, event_type: e.target.value as EventType }))} options={typeOptions} />
          <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date/Time" type="datetime-local" value={form.start_datetime} onChange={(e) => setForm((f) => ({ ...f, start_datetime: e.target.value }))} required />
            <Input label="End Date/Time" type="datetime-local" value={form.end_datetime} onChange={(e) => setForm((f) => ({ ...f, end_datetime: e.target.value }))} />
          </div>
          <Select label="Organizer" value={form.organizer_id} onChange={(e) => setForm((f) => ({ ...f, organizer_id: e.target.value }))} options={userOptions} placeholder="None" />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
          <Textarea label="Notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
        </form>
      </Modal>
    </div>
  )
}
