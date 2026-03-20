import { createClient } from '@/lib/supabase/server'
import VolunteersView from '@/components/volunteers/VolunteersView'

export const revalidate = 0

export default async function VolunteersPage() {
  const supabase = createClient()

  const { data: volunteers } = await supabase
    .from('volunteers')
    .select('*, contact:contacts(id, full_name, phone, email, address)')
    .order('created_at', { ascending: false })

  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, full_name')
    .order('last_name')

  return <VolunteersView volunteers={volunteers ?? []} contacts={contacts ?? []} />
}
