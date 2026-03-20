'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  onClose: () => void
  users: { id: string; full_name: string | null }[]
  onSuccess?: () => void
}

export default function WalkListForm({ open, onClose, users, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    neighborhood: '',
    assigned_user_id: '',
  })

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Name is required')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('walk_lists').insert({
      name: form.name,
      description: form.description || null,
      neighborhood: form.neighborhood || null,
      assigned_user_id: form.assigned_user_id || null,
      created_by: user!.id,
      active: true,
    })

    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Walk list created')
      setForm({ name: '', description: '', neighborhood: '', assigned_user_id: '' })
      onSuccess?.()
      onClose()
    }
  }

  const userOptions = users.map((u) => ({ value: u.id, label: u.full_name ?? u.id }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Walk List"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={handleSubmit}>Create Walk List</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="List Name" value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="e.g. Precinct 4 North" />
        <Input label="Neighborhood" value={form.neighborhood} onChange={(e) => set('neighborhood', e.target.value)} placeholder="Optional" />
        <Select label="Assign To" value={form.assigned_user_id} onChange={(e) => set('assigned_user_id', e.target.value)} options={userOptions} placeholder="Unassigned" />
        <Textarea label="Description" value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} placeholder="Optional notes about this list" />
      </form>
    </Modal>
  )
}
