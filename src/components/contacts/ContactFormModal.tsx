'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { SUPPORT_STATUS_LABELS, CONTACT_TYPE_LABELS } from '@/lib/constants'
import type { Contact } from '@/types'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess?: (contact: Contact) => void
  contact?: Contact
  users?: { id: string; full_name: string | null }[]
}

export default function ContactFormModal({ open, onClose, onSuccess, contact, users = [] }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    first_name: contact?.first_name ?? '',
    last_name: contact?.last_name ?? '',
    phone: contact?.phone ?? '',
    email: contact?.email ?? '',
    address: contact?.address ?? '',
    city: contact?.city ?? '',
    state: contact?.state ?? 'NH',
    zip: contact?.zip ?? '',
    precinct: contact?.precinct ?? '',
    neighborhood: contact?.neighborhood ?? '',
    support_status: contact?.support_status ?? 'not_contacted',
    contact_type: contact?.contact_type ?? 'voter',
    preferred_contact_method: contact?.preferred_contact_method ?? '',
    notes: contact?.notes ?? '',
    assigned_user_id: contact?.assigned_user_id ?? '',
    next_follow_up: contact?.next_follow_up?.slice(0, 10) ?? '',
  })

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.first_name.trim() || !form.last_name.trim()) {
      toast.error('First and last name are required')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const payload = {
      ...form,
      full_name: `${form.first_name.trim()} ${form.last_name.trim()}`,
      assigned_user_id: form.assigned_user_id || null,
      next_follow_up: form.next_follow_up || null,
      preferred_contact_method: form.preferred_contact_method || null,
      updated_at: new Date().toISOString(),
    }

    let result
    if (contact?.id) {
      result = await supabase
        .from('contacts')
        .update(payload)
        .eq('id', contact.id)
        .select('*, assigned_user:profiles(id, full_name)')
        .single()
    } else {
      result = await supabase
        .from('contacts')
        .insert(payload)
        .select('*, assigned_user:profiles(id, full_name)')
        .single()
    }

    setLoading(false)

    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success(contact?.id ? 'Contact updated' : 'Contact created')
      onSuccess?.(result.data as Contact)
      onClose()
    }
  }

  const statusOptions = Object.entries(SUPPORT_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))
  const typeOptions = Object.entries(CONTACT_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))
  const userOptions = users.map((u) => ({ value: u.id, label: u.full_name ?? u.id }))
  const contactMethodOptions = [
    { value: 'phone', label: 'Phone' },
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'door', label: 'Door' },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={contact?.id ? 'Edit Contact' : 'Add Contact'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={handleSubmit}>
            {contact?.id ? 'Save Changes' : 'Create Contact'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First Name" value={form.first_name} onChange={(e) => set('first_name', e.target.value)} required />
          <Input label="Last Name" value={form.last_name} onChange={(e) => set('last_name', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
        <Input label="Address" value={form.address} onChange={(e) => set('address', e.target.value)} />
        <div className="grid grid-cols-3 gap-3">
          <Input label="City" value={form.city} onChange={(e) => set('city', e.target.value)} />
          <Input label="State" value={form.state} onChange={(e) => set('state', e.target.value)} />
          <Input label="Zip" value={form.zip} onChange={(e) => set('zip', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Precinct" value={form.precinct} onChange={(e) => set('precinct', e.target.value)} />
          <Input label="Neighborhood" value={form.neighborhood} onChange={(e) => set('neighborhood', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Support Status" value={form.support_status} onChange={(e) => set('support_status', e.target.value)} options={statusOptions} />
          <Select label="Contact Type" value={form.contact_type} onChange={(e) => set('contact_type', e.target.value)} options={typeOptions} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Preferred Contact" value={form.preferred_contact_method} onChange={(e) => set('preferred_contact_method', e.target.value)} options={contactMethodOptions} placeholder="Not set" />
          <Select label="Assigned To" value={form.assigned_user_id} onChange={(e) => set('assigned_user_id', e.target.value)} options={userOptions} placeholder="Unassigned" />
        </div>
        <Input label="Next Follow Up" type="date" value={form.next_follow_up} onChange={(e) => set('next_follow_up', e.target.value)} />
        <Textarea label="Notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} />
      </form>
    </Modal>
  )
}
