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
import { Plus, Phone, Mail, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  volunteers: Record<string, unknown>[]
  contacts: { id: string; full_name: string }[]
}

export default function VolunteersView({ volunteers: initialVolunteers, contacts }: Props) {
  const router = useRouter()
  const [volunteers, setVolunteers] = useState(initialVolunteers)
  const [showForm, setShowForm] = useState(false)
  const [editVol, setEditVol] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    contact_id: '',
    availability: '',
    skills: '',
    preferred_tasks: '',
    assigned_neighborhoods: '',
    notes: '',
    active: true,
  })

  function resetForm(vol?: Record<string, unknown>) {
    if (vol) {
      setForm({
        contact_id: (vol.contact_id as string) ?? '',
        availability: (vol.availability as string) ?? '',
        skills: ((vol.skills as string[]) ?? []).join(', '),
        preferred_tasks: ((vol.preferred_tasks as string[]) ?? []).join(', '),
        assigned_neighborhoods: ((vol.assigned_neighborhoods as string[]) ?? []).join(', '),
        notes: (vol.notes as string) ?? '',
        active: (vol.active as boolean) ?? true,
      })
    } else {
      setForm({ contact_id: '', availability: '', skills: '', preferred_tasks: '', assigned_neighborhoods: '', notes: '', active: true })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.contact_id) {
      toast.error('Contact is required')
      return
    }
    setLoading(true)
    const supabase = createClient()

    const payload = {
      contact_id: form.contact_id,
      availability: form.availability || null,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      preferred_tasks: form.preferred_tasks.split(',').map((s) => s.trim()).filter(Boolean),
      assigned_neighborhoods: form.assigned_neighborhoods.split(',').map((s) => s.trim()).filter(Boolean),
      notes: form.notes || null,
      active: form.active,
      updated_at: new Date().toISOString(),
    }

    let result
    if (editVol?.id) {
      result = await supabase.from('volunteers').update(payload).eq('id', editVol.id as string)
        .select('*, contact:contacts(id, full_name, phone, email, address)').single()
    } else {
      result = await supabase.from('volunteers').insert(payload)
        .select('*, contact:contacts(id, full_name, phone, email, address)').single()
    }

    setLoading(false)
    if (result.error) {
      toast.error(result.error.message)
    } else {
      const data = result.data as Record<string, unknown>
      setVolunteers((prev) => {
        const idx = prev.findIndex((v) => v.id === data.id)
        if (idx >= 0) { const next = [...prev]; next[idx] = data; return next }
        return [data, ...prev]
      })
      toast.success(editVol ? 'Updated' : 'Volunteer added')
      setShowForm(false)
      setEditVol(null)
    }
  }

  function openEdit(vol: Record<string, unknown>) {
    setEditVol(vol)
    resetForm(vol)
    setShowForm(true)
  }

  const activeCount = volunteers.filter((v) => v.active).length
  const contactOptions = contacts.map((c) => ({ value: c.id, label: c.full_name }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteers"
        description={`${activeCount} active · ${volunteers.length} total`}
        actions={
          <Button size="sm" onClick={() => { setEditVol(null); resetForm(); setShowForm(true) }}>
            <Plus className="h-4 w-4" />
            Add Volunteer
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {volunteers.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-400">No volunteers yet</div>
        )}
        {volunteers.map((vol) => {
          const contact = vol.contact as Record<string, string> | null
          return (
            <div key={vol.id as string} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-900">{contact?.full_name ?? '—'}</p>
                  <Badge className={(vol.active as boolean) ? 'bg-emerald-100 text-emerald-700 mt-1' : 'bg-slate-100 text-slate-500 mt-1'}>
                    {(vol.active as boolean) ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Button size="sm" variant="ghost" onClick={() => openEdit(vol)}>Edit</Button>
              </div>

              {contact?.phone && (
                <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {contact.phone}
                </div>
              )}
              {contact?.email && (
                <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {contact.email}
                </div>
              )}

              {vol.availability ? (
                <p className="text-xs text-slate-500 mt-2">
                  <span className="font-medium">Available:</span> {vol.availability as string}
                </p>
              ) : null}

              {(vol.skills as string[])?.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-2">
                  {(vol.skills as string[]).slice(0, 3).map((skill) => (
                    <span key={skill} className="text-xs bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{skill}</span>
                  ))}
                </div>
              ) : null}

              {(vol.assigned_neighborhoods as string[])?.length > 0 ? (
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                  <MapPin className="h-3 w-3" />
                  {(vol.assigned_neighborhoods as string[]).join(', ')}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditVol(null) }}
        title={editVol ? 'Edit Volunteer' : 'Add Volunteer'}
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditVol(null) }}>Cancel</Button>
            <Button loading={loading} onClick={handleSubmit}>{editVol ? 'Save' : 'Add Volunteer'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Contact" value={form.contact_id} onChange={(e) => setForm((f) => ({ ...f, contact_id: e.target.value }))} options={contactOptions} placeholder="Select contact…" />
          <Input label="Availability" value={form.availability} onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))} placeholder="e.g. Weekends, evenings" />
          <Input label="Skills (comma-separated)" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} placeholder="e.g. Canvassing, Data Entry, Phone Banking" />
          <Input label="Preferred Tasks (comma-separated)" value={form.preferred_tasks} onChange={(e) => setForm((f) => ({ ...f, preferred_tasks: e.target.value }))} placeholder="e.g. Canvassing, Events" />
          <Input label="Assigned Neighborhoods (comma-separated)" value={form.assigned_neighborhoods} onChange={(e) => setForm((f) => ({ ...f, assigned_neighborhoods: e.target.value }))} />
          <Textarea label="Notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="rounded border-slate-300 text-brand-600" />
            <span className="text-sm text-slate-700">Active volunteer</span>
          </label>
        </form>
      </Modal>
    </div>
  )
}
