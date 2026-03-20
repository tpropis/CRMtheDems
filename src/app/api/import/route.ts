import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'


const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nacouyntrjwmfprbdpjy.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: NextRequest) {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const formData = await req.formData()
  const file = formData.get('file') as File
  const type = formData.get('type') as string // 'contacts' | 'donors' | 'volunteers'

  if (!file || !type) {
    return NextResponse.json({ error: 'Missing file or type' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  if (rows.length === 0) {
    return NextResponse.json({ error: 'No data found in file' }, { status: 400 })
  }

  let inserted = 0
  let errors: string[] = []

  async function batchInsert(table: string, records: Record<string, unknown>[]) {
    const CHUNK = 500
    for (let i = 0; i < records.length; i += CHUNK) {
      const chunk = records.slice(i, i + CHUNK)
      const { data, error } = await supabase.from(table).insert(chunk).select('id')
      if (error) errors.push(`Rows ${i + 1}–${i + chunk.length}: ${error.message}`)
      else inserted += data?.length ?? 0
    }
  }

  if (type === 'contacts') {
    const records = rows.map((r) => ({
      first_name: String(r['First Name'] || r['first_name'] || r['FIRST_NAME'] || r['FirstName'] || '').trim(),
      last_name: String(r['Last Name'] || r['last_name'] || r['LAST_NAME'] || r['LastName'] || '').trim(),
      email: String(r['Email'] || r['email'] || r['EMAIL'] || '').trim() || null,
      phone: String(r['Phone'] || r['phone'] || r['PHONE'] || r['Cell'] || r['cell'] || '').trim() || null,
      address: String(r['Address'] || r['address'] || r['Street'] || r['street'] || '').trim() || null,
      city: String(r['City'] || r['city'] || '').trim() || null,
      state: String(r['State'] || r['state'] || 'GA').trim() || 'GA',
      zip: String(r['Zip'] || r['zip'] || r['ZIP'] || r['Zipcode'] || '').trim() || null,
      precinct: String(r['Precinct'] || r['precinct'] || '').trim() || null,
      party: String(r['Party'] || r['party'] || r['Party Affiliation'] || '').trim() || null,
      voter_id: String(r['Voter ID'] || r['voter_id'] || r['VoterID'] || r['Voter Id'] || '').trim() || null,
      age: parseInt(String(r['Age'] || r['age'] || '')) || null,
      support_status: 'unknown',
    })).filter((r) => r.first_name && r.last_name)

    await batchInsert('contacts', records)

  } else if (type === 'donors') {
    const records = rows.map((r) => ({
      first_name: String(r['First Name'] || r['first_name'] || r['FirstName'] || '').trim(),
      last_name: String(r['Last Name'] || r['last_name'] || r['LastName'] || '').trim(),
      email: String(r['Email'] || r['email'] || '').trim() || null,
      phone: String(r['Phone'] || r['phone'] || '').trim() || null,
      amount: parseFloat(String(r['Amount'] || r['amount'] || r['Donation'] || '0').replace(/[$,]/g, '')) || 0,
      donation_date: String(r['Date'] || r['date'] || r['Donation Date'] || '').trim() || null,
      method: String(r['Method'] || r['method'] || r['Payment Method'] || '').trim() || null,
      notes: String(r['Notes'] || r['notes'] || '').trim() || null,
    })).filter((r) => r.first_name && r.last_name)

    await batchInsert('donors', records)

  } else if (type === 'volunteers') {
    const records = rows.map((r) => ({
      first_name: String(r['First Name'] || r['first_name'] || r['FirstName'] || '').trim(),
      last_name: String(r['Last Name'] || r['last_name'] || r['LastName'] || '').trim(),
      email: String(r['Email'] || r['email'] || '').trim() || null,
      phone: String(r['Phone'] || r['phone'] || '').trim() || null,
      availability: String(r['Availability'] || r['availability'] || '').trim() || null,
      notes: String(r['Notes'] || r['notes'] || '').trim() || null,
      active: true,
    })).filter((r) => r.first_name && r.last_name)

    await batchInsert('volunteers', records)
  }

  return NextResponse.json({ inserted, errors, total: rows.length })
}
