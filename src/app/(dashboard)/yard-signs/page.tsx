import { createClient } from '@/lib/supabase/server'
import YardSignsView from '@/components/yard-signs/YardSignsView'

export const revalidate = 0

export default async function YardSignsPage() {
  const supabase = createClient()

  const { data: signRequests } = await supabase
    .from('yard_sign_requests')
    .select('*, contact:contacts(id, full_name, phone)')
    .order('request_date', { ascending: false })

  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, full_name, address, neighborhood')
    .order('last_name')

  return <YardSignsView signRequests={signRequests ?? []} contacts={contacts ?? []} />
}
