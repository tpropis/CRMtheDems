'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { DONATION_SOURCE_LABELS } from '@/lib/constants'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  onClose: () => void
  contacts: { id: string; full_name: string }[]
  users: { id: string; full_name: string | null }[]
  donation?: Record<string, unknown>
  onSuccess?: (d: Record<string, unknown>) => void
}

export default function DonorFormModal({ open, onClose, contacts, users, donation, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    contact_id: (donation?.contact_id as string) ?? '',
    amount: donation?.amount?.toString() ?? '',
    date: (donation?.date as string)?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    source: (donation?.source as string) ?? 'personal',
    notes: (donation?.notes as string) ?? '',
    recurring: (donation?.recurring as boolean) ?? false,
    pledge: (donation?.pledge as boolean) ?? false,
    thank_you_sent: (donation?.thank_you_sent as boolean) ?? false,
    assigned_owner_id: (donation?.assigned_owner_id as string) ?? '',
  })

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.contact_id || !form.amount) {
      toast.error('Contact and amount are required')
      return
    }
    setLoading(true)
    const supabase = createClient()

    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      assigned_owner_id: form.assigned_owner_id || null,
      updated_at: new Date().toISOString(),
    }

    let result
    if (donation?.id) {
      result = await supabase.from('donors').update(payload).eq('id', donation.id as string)
        .select('*, contact:contacts(id, full_name), assigned_owner:profiles(id, full_name)').single()
    } else {
      result = await supabase.from('donors').insert(payload)
        .select('*, contact:contacts(id, full_name), assigned_owner:profiles(id, full_name)').single()
    }

    setLoading(false)
    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success(donation?.id ? 'Donation updated' : 'Donation recorded')
      onSuccess?.(result.data as Record<string, unknown>)
      onClose()
    }
  }

  const contactOptions = contacts.map((c) => ({ value: c.id, label: c.full_name }))
  const sourceOptions = Object.entries(DONATION_SOURCE_LABELS).map(([v, l]) => ({ value: v, label: l }))
  const userOptions = users.map((u) => ({ value: u.id, label: u.full_name ?? u.id }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={donation?.id ? 'Edit Donation' : 'Record Donation'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={handleSubmit}>
            {donation?.id ? 'Save' : 'Record Donation'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select label="Donor (Contact)" value={form.contact_id} onChange={(e) => set('contact_id', e.target.value)} options={contactOptions} placeholder="Select contact…" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Amount ($)" type="number" step="0.01" min="0" value={form.amount} onChange={(e) => set('amount', e.target.value)} required />
          <Input label="Date" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} required />
        </div>
        <Select label="Source" value={form.source} onChange={(e) => set('source', e.target.value)} options={sourceOptions} />
        <Select label="Assigned Owner" value={form.assigned_owner_id} onChange={(e) => set('assigned_owner_id', e.target.value)} options={userOptions} placeholder="Unassigned" />
        <Textarea label="Notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} />
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.recurring} onChange={(e) => set('recurring', e.target.checked)} className="rounded border-slate-300 text-brand-600" />
            <span className="text-sm text-slate-700">Recurring donation</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.pledge} onChange={(e) => set('pledge', e.target.checked)} className="rounded border-slate-300 text-brand-600" />
            <span className="text-sm text-slate-700">This is a pledge</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.thank_you_sent} onChange={(e) => set('thank_you_sent', e.target.checked)} className="rounded border-slate-300 text-brand-600" />
            <span className="text-sm text-slate-700">Thank-you sent</span>
          </label>
        </div>
      </form>
    </Modal>
  )
}
