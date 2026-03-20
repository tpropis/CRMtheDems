import { createClient } from '@/lib/supabase/server'
import ContactsTable from '@/components/contacts/ContactsTable'
import PageHeader from '@/components/ui/PageHeader'

export const revalidate = 0

export default async function ContactsPage() {
  const supabase = createClient()

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*, assigned_user:profiles(id, full_name)')
    .order('created_at', { ascending: false })

  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('active', true)

  return (
    <div>
      <ContactsTable
        initialContacts={contacts ?? []}
        users={users ?? []}
      />
    </div>
  )
}
