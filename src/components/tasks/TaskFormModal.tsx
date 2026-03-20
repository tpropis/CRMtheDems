'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { TASK_PRIORITY_LABELS } from '@/lib/constants'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Props {
  open: boolean
  onClose: () => void
  task?: Record<string, unknown>
  users?: { id: string; full_name: string | null }[]
  contacts?: { id: string; full_name: string }[]
  linkedContactId?: string
  linkedContactName?: string
  onSuccess?: (task: Record<string, unknown>) => void
}

export default function TaskFormModal({
  open,
  onClose,
  task,
  users = [],
  contacts = [],
  linkedContactId,
  linkedContactName,
  onSuccess,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: (task?.title as string) ?? '',
    description: (task?.description as string) ?? '',
    task_type: (task?.task_type as string) ?? 'follow_up',
    linked_contact_id: (task?.linked_contact_id as string) ?? linkedContactId ?? '',
    assigned_to: (task?.assigned_to as string) ?? '',
    due_date: (task?.due_date as string)?.slice(0, 10) ?? '',
    priority: (task?.priority as string) ?? 'medium',
    notes: (task?.notes as string) ?? '',
  })

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title required'); return }
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      ...form,
      assigned_to: form.assigned_to || null,
      linked_contact_id: form.linked_contact_id || null,
      due_date: form.due_date || null,
      created_by: user!.id,
      status: task?.status ?? 'open',
      updated_at: new Date().toISOString(),
    }

    let result
    if (task?.id) {
      result = await supabase.from('tasks').update(payload).eq('id', task.id as string)
        .select('*, assigned_user:profiles(id, full_name), linked_contact:contacts(id, full_name)').single()
    } else {
      result = await supabase.from('tasks').insert(payload)
        .select('*, assigned_user:profiles(id, full_name), linked_contact:contacts(id, full_name)').single()
    }

    setLoading(false)
    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success(task?.id ? 'Task updated' : 'Task created')
      onSuccess?.(result.data as Record<string, unknown>)
      router.refresh()
      onClose()
    }
  }

  const taskTypeOptions = [
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'call', label: 'Phone Call' },
    { value: 'door_knock', label: 'Door Knock' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'data_entry', label: 'Data Entry' },
    { value: 'other', label: 'Other' },
  ]
  const priorityOptions = Object.entries(TASK_PRIORITY_LABELS).map(([v, l]) => ({ value: v, label: l }))
  const userOptions = users.map((u) => ({ value: u.id, label: u.full_name ?? u.id }))
  const contactOptions = contacts.map((c) => ({ value: c.id, label: c.full_name }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task?.id ? 'Edit Task' : 'New Task'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={handleSubmit}>{task?.id ? 'Save' : 'Create Task'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="e.g. Follow up with Sarah about donation" />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Type" value={form.task_type} onChange={(e) => set('task_type', e.target.value)} options={taskTypeOptions} />
          <Select label="Priority" value={form.priority} onChange={(e) => set('priority', e.target.value)} options={priorityOptions} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Assign To" value={form.assigned_to} onChange={(e) => set('assigned_to', e.target.value)} options={userOptions} placeholder="Unassigned" />
          <Input label="Due Date" type="date" value={form.due_date} onChange={(e) => set('due_date', e.target.value)} />
        </div>
        {contacts.length > 0 && !linkedContactId && (
          <Select label="Linked Contact" value={form.linked_contact_id} onChange={(e) => set('linked_contact_id', e.target.value)} options={contactOptions} placeholder="None" />
        )}
        {linkedContactName && (
          <div className="text-sm text-slate-600 bg-slate-50 rounded-md px-3 py-2">
            Linked to: <span className="font-medium">{linkedContactName}</span>
          </div>
        )}
        <Textarea label="Description" value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} />
        <Textarea label="Notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} />
      </form>
    </Modal>
  )
}
