import { createClient } from '@/lib/supabase/server'
import TasksView from '@/components/tasks/TasksView'

export const revalidate = 0

export default async function TasksPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  const isVolunteer = profile?.role === 'volunteer'

  let query = supabase
    .from('tasks')
    .select('*, assigned_user:profiles(id, full_name), linked_contact:contacts(id, full_name)')
    .order('due_date', { ascending: true, nullsFirst: false })

  if (isVolunteer) {
    query = query.eq('assigned_to', user!.id)
  }

  const { data: tasks } = await query

  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('active', true)

  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, full_name')
    .order('last_name')

  return (
    <TasksView
      tasks={tasks ?? []}
      users={users ?? []}
      contacts={contacts ?? []}
      currentUserId={user!.id}
      isVolunteer={isVolunteer}
    />
  )
}
