import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContactDetail from '@/components/contacts/ContactDetail'

export const revalidate = 0

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: contact } = await supabase
    .from('contacts')
    .select('*, assigned_user:profiles(id, full_name, email)')
    .eq('id', params.id)
    .single()

  if (!contact) notFound()

  const [
    { data: notes },
    { data: canvassResults },
    { data: tasks },
    { data: donations },
    { data: signRequests },
    { data: volunteer },
    { data: users },
  ] = await Promise.all([
    supabase.from('contact_notes').select('*, user:profiles(full_name)').eq('contact_id', params.id).order('created_at', { ascending: false }),
    supabase.from('canvass_results').select('*, user:profiles(full_name)').eq('contact_id', params.id).order('canvassed_at', { ascending: false }),
    supabase.from('tasks').select('*, assigned_user:profiles(full_name)').eq('linked_contact_id', params.id).order('created_at', { ascending: false }),
    supabase.from('donors').select('*').eq('contact_id', params.id).order('date', { ascending: false }),
    supabase.from('yard_sign_requests').select('*').eq('contact_id', params.id).order('request_date', { ascending: false }),
    supabase.from('volunteers').select('*').eq('contact_id', params.id).single(),
    supabase.from('profiles').select('id, full_name').eq('active', true),
  ])

  return (
    <ContactDetail
      contact={contact}
      notes={notes ?? []}
      canvassResults={canvassResults ?? []}
      tasks={tasks ?? []}
      donations={donations ?? []}
      signRequests={signRequests ?? []}
      volunteer={volunteer}
      users={users ?? []}
    />
  )
}
