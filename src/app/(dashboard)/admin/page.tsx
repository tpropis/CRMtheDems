import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminView from '@/components/admin/AdminView'

export const revalidate = 0

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/unauthorized')
  }

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: activityLog } = await supabase
    .from('activity_log')
    .select('*, user:profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(100)

  return <AdminView users={users ?? []} activityLog={activityLog ?? []} />
}
