'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatDateTime, formatTimeAgo, formatCurrency } from '@/lib/utils'
import {
  SUPPORT_STATUS_LABELS, SUPPORT_STATUS_COLORS,
  CONTACT_TYPE_LABELS, CANVASS_RESULT_LABELS, CANVASS_RESULT_COLORS,
  TASK_STATUS_COLORS, TASK_STATUS_LABELS, SIGN_STATUS_LABELS, SIGN_STATUS_COLORS,
} from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import ContactFormModal from './ContactFormModal'
import TaskFormModal from '@/components/tasks/TaskFormModal'
import {
  ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, User, Calendar,
  MessageSquare, Plus, CheckSquare, DollarSign, SignpostBig, Activity,
} from 'lucide-react'
import type { Contact } from '@/types'
import toast from 'react-hot-toast'
import { addContactNote, updateContactSupportStatus } from '@/lib/actions'

interface Props {
  contact: Contact
  notes: Record<string, unknown>[]
  canvassResults: Record<string, unknown>[]
  tasks: Record<string, unknown>[]
  donations: Record<string, unknown>[]
  signRequests: Record<string, unknown>[]
  volunteer: Record<string, unknown> | null
  users: { id: string; full_name: string | null }[]
}

export default function ContactDetail({ contact: initialContact, notes, canvassResults, tasks, donations, signRequests, volunteer, users }: Props) {
  const router = useRouter()
  const [contact, setContact] = useState(initialContact)
  const [showEdit, setShowEdit] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [noteLoading, setNoteLoading] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this contact? This cannot be undone.')) return
    const supabase = createClient()
    const { error } = await supabase.from('contacts').delete().eq('id', contact.id)
    if (error) {
      toast.error('Failed to delete')
    } else {
      toast.success('Contact deleted')
      router.push('/contacts')
    }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return
    setNoteLoading(true)
    try {
      await addContactNote(contact.id, newNote.trim())
      setNewNote('')
      toast.success('Note added')
      router.refresh()
    } catch {
      toast.error('Failed to add note')
    } finally {
      setNoteLoading(false)
    }
  }

  async function handleStatusUpdate(status: string) {
    setUpdatingStatus(true)
    try {
      await updateContactSupportStatus(contact.id, status)
      setContact({ ...contact, support_status: status as Contact['support_status'] })
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const totalDonated = donations.reduce((s, d) => s + ((d.amount as number) ?? 0), 0)

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/contacts" className="text-slate-400 hover:text-slate-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{contact.full_name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={SUPPORT_STATUS_COLORS[contact.support_status]}>
                {SUPPORT_STATUS_LABELS[contact.support_status]}
              </Badge>
              <Badge className="bg-slate-100 text-slate-600">
                {CONTACT_TYPE_LABELS[contact.contact_type]}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          {/* Contact Info */}
          <Card>
            <CardTitle className="mb-3">Contact Info</CardTitle>
            <div className="space-y-2.5 text-sm">
              {contact.phone && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {contact.phone}
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {contact.email}
                </div>
              )}
              {contact.address && (
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                  <span>
                    {contact.address}<br />
                    {[contact.city, contact.state, contact.zip].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              {contact.precinct && (
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-slate-400 text-xs font-medium">Precinct:</span>
                  {contact.precinct}
                </div>
              )}
              {contact.neighborhood && (
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-slate-400 text-xs font-medium">Neighborhood:</span>
                  {contact.neighborhood}
                </div>
              )}
              {contact.assigned_user && (
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="h-4 w-4 text-slate-400" />
                  Assigned to {(contact.assigned_user as unknown as { full_name: string }).full_name}
                </div>
              )}
              {contact.next_follow_up && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Follow up: {formatDate(contact.next_follow_up)}
                </div>
              )}
            </div>
          </Card>

          {/* Quick Status Update */}
          <Card>
            <CardTitle className="mb-3">Update Status</CardTitle>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(SUPPORT_STATUS_LABELS).map(([status, label]) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={updatingStatus || contact.support_status === status}
                  className={`text-xs py-1.5 px-2 rounded border transition-colors ${
                    contact.support_status === status
                      ? SUPPORT_STATUS_COLORS[status as keyof typeof SUPPORT_STATUS_COLORS] + ' border-transparent font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  } disabled:opacity-60`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Card>

          {/* Summary stats */}
          {(donations.length > 0 || signRequests.length > 0 || volunteer) && (
            <Card>
              <CardTitle className="mb-3">Activity Summary</CardTitle>
              <div className="space-y-2 text-sm">
                {donations.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-green-500" />
                      Total Donated
                    </span>
                    <span className="font-semibold text-slate-900">{formatCurrency(totalDonated)}</span>
                  </div>
                )}
                {signRequests.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <SignpostBig className="h-3.5 w-3.5 text-blue-500" />
                      Sign Requests
                    </span>
                    <span className="font-semibold text-slate-900">{signRequests.length}</span>
                  </div>
                )}
                {volunteer && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Volunteer</span>
                    <Badge className={(volunteer.active as boolean) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}>
                      {(volunteer.active as boolean) ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                Notes
              </CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setShowTaskForm(true)}>
                <Plus className="h-3.5 w-3.5" />
                Task
              </Button>
            </CardHeader>

            <div className="mb-3 flex gap-2">
              <input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a quick note…"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button size="sm" loading={noteLoading} onClick={handleAddNote}>Add</Button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notes.length === 0 && <p className="text-sm text-slate-400">No notes yet</p>}
              {notes.map((note) => (
                <div key={note.id as string} className="flex gap-3 text-sm">
                  <div className="flex-shrink-0 w-1 bg-slate-200 rounded-full" />
                  <div>
                    <p className="text-slate-700">{note.note as string}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {(note.user as { full_name: string } | null)?.full_name} · {formatTimeAgo(note.created_at as string)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Canvassing History */}
          {canvassResults.length > 0 && (
            <Card>
              <CardTitle className="mb-3">Canvassing History</CardTitle>
              <div className="space-y-2">
                {canvassResults.map((r) => (
                  <div key={r.id as string} className="flex items-center justify-between text-sm">
                    <div>
                      <Badge className={CANVASS_RESULT_COLORS[r.result as string]}>
                        {CANVASS_RESULT_LABELS[r.result as string]}
                      </Badge>
                      {r.note ? <span className="ml-2 text-slate-600">{r.note as string}</span> : null}
                    </div>
                    <span className="text-xs text-slate-400">
                      {(r.user as { full_name: string } | null)?.full_name} · {formatDate(r.canvassed_at as string)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Tasks */}
          {tasks.length > 0 && (
            <Card>
              <CardTitle className="mb-3 flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-slate-400" />
                Linked Tasks
              </CardTitle>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id as string} className="flex items-center justify-between text-sm">
                    <Link href={`/tasks`} className="text-slate-700 hover:text-brand-600 truncate flex-1">
                      {task.title as string}
                    </Link>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <Badge className={TASK_STATUS_COLORS[task.status as keyof typeof TASK_STATUS_COLORS]}>
                        {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}
                      </Badge>
                      {task.due_date ? (
                        <span className="text-xs text-slate-400">{formatDate(task.due_date as string)}</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Donations */}
          {donations.length > 0 && (
            <Card>
              <CardTitle className="mb-3">Donation History</CardTitle>
              <div className="space-y-2">
                {donations.map((d) => (
                  <div key={d.id as string} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-semibold text-emerald-700">{formatCurrency(d.amount as number)}</span>
                      {d.source ? <span className="ml-2 text-slate-500 text-xs capitalize">{d.source as string}</span> : null}
                    </div>
                    <span className="text-xs text-slate-400">{formatDate(d.date as string)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Yard Signs */}
          {signRequests.length > 0 && (
            <Card>
              <CardTitle className="mb-3">Yard Sign Requests</CardTitle>
              <div className="space-y-2">
                {signRequests.map((s) => (
                  <div key={s.id as string} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">Qty: {s.quantity as number}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={SIGN_STATUS_COLORS[s.delivery_status as keyof typeof SIGN_STATUS_COLORS]}>
                        {SIGN_STATUS_LABELS[s.delivery_status as keyof typeof SIGN_STATUS_LABELS]}
                      </Badge>
                      <span className="text-xs text-slate-400">{formatDate(s.request_date as string)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <ContactFormModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        contact={contact}
        onSuccess={(updated) => { setContact(updated); setShowEdit(false) }}
        users={users}
      />

      <TaskFormModal
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        linkedContactId={contact.id}
        linkedContactName={contact.full_name}
      />
    </div>
  )
}
