'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logActivity(
  action: string,
  entityType: string,
  entityId: string,
  details?: Record<string, unknown>
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('activity_log').insert({
    user_id: user.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details: details ?? null,
  })
}

export async function updateContactSupportStatus(contactId: string, status: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('contacts')
    .update({ support_status: status, updated_at: new Date().toISOString() })
    .eq('id', contactId)

  if (error) throw new Error(error.message)
  await logActivity('updated_support_status', 'contact', contactId, { status })
  revalidatePath('/contacts')
  revalidatePath(`/contacts/${contactId}`)
}

export async function addContactNote(contactId: string, note: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('contact_notes').insert({
    contact_id: contactId,
    user_id: user.id,
    note,
  })

  if (error) throw new Error(error.message)
  await logActivity('added_note', 'contact', contactId)
  revalidatePath(`/contacts/${contactId}`)
}

export async function markTaskComplete(taskId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('tasks')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', taskId)

  if (error) throw new Error(error.message)
  await logActivity('completed_task', 'task', taskId)
  revalidatePath('/tasks')
}

export async function submitCanvassResult(data: {
  contact_id: string
  walk_list_id: string | null
  result: string
  note: string | null
  follow_up_needed: boolean
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('canvass_results').insert({
    ...data,
    user_id: user.id,
    canvassed_at: new Date().toISOString(),
  })

  if (error) throw new Error(error.message)

  // Update contact support status from canvass result
  const statusMap: Record<string, string> = {
    strong_support: 'strong_support',
    lean_support: 'lean_support',
    undecided: 'undecided',
    opposed: 'strong_oppose',
  }
  if (statusMap[data.result]) {
    await supabase
      .from('contacts')
      .update({ support_status: statusMap[data.result] })
      .eq('id', data.contact_id)
  }

  await logActivity('canvass_result', 'contact', data.contact_id, { result: data.result })
  revalidatePath('/canvassing')
}
