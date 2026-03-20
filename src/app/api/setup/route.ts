import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Check if tommy already exists
  const { data: existing } = await supabase.auth.admin.listUsers()
  const alreadyExists = existing?.users?.find(u => u.email === 'tommy@campaign.com')

  if (alreadyExists) {
    return NextResponse.json({ message: 'User tommy@campaign.com already exists' })
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: 'tommy@campaign.com',
    password: 'Tommy2024!',
    email_confirm: true,
    user_metadata: { full_name: 'Tommy', role: 'admin' }
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, user: data.user?.email })
}
