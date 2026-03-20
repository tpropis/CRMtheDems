import { createClient } from '@/lib/supabase/server'
import CanvassingView from '@/components/canvassing/CanvassingView'

export const revalidate = 0

export default async function CanvassingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  const isVolunteer = profile?.role === 'volunteer'

  let walkListsQuery = supabase
    .from('walk_lists')
    .select('*, assigned_user:profiles(id, full_name), contact_count:walk_list_contacts(count)')
    .eq('active', true)

  if (isVolunteer) {
    walkListsQuery = walkListsQuery.eq('assigned_user_id', user!.id)
  }

  const { data: walkLists } = await walkListsQuery.order('created_at', { ascending: false })

  const { data: recentResults } = await supabase
    .from('canvass_results')
    .select('*, contact:contacts(full_name, address), user:profiles(full_name)')
    .order('canvassed_at', { ascending: false })
    .limit(50)

  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('active', true)

  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, full_name, address, city, support_status')
    .order('last_name')

  // Stats
  const { data: statsData } = await supabase
    .from('canvass_results')
    .select('result')

  return (
    <CanvassingView
      walkLists={walkLists ?? []}
      recentResults={recentResults ?? []}
      users={users ?? []}
      contacts={contacts ?? []}
      statsData={statsData ?? []}
      isVolunteer={isVolunteer}
    />
  )
}
