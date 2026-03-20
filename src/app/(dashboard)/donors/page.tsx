import { createClient } from '@/lib/supabase/server'
import DonorsView from '@/components/donors/DonorsView'

export const revalidate = 0

export default async function DonorsPage() {
  const supabase = createClient()

  const { data: donors } = await supabase
    .from('donors')
    .select('*, contact:contacts(id, full_name, phone, email), assigned_owner:profiles(id, full_name)')
    .order('date', { ascending: false })

  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, full_name')
    .order('last_name')

  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('active', true)

  return (
    <DonorsView
      donors={donors ?? []}
      contacts={contacts ?? []}
      users={users ?? []}
    />
  )
}
