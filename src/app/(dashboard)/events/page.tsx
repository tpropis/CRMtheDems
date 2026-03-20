import { createClient } from '@/lib/supabase/server'
import EventsView from '@/components/events/EventsView'

export const revalidate = 0

export default async function EventsPage() {
  const supabase = createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*, organizer:profiles(id, full_name)')
    .order('start_datetime', { ascending: true })

  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('active', true)

  return <EventsView events={events ?? []} users={users ?? []} />
}
