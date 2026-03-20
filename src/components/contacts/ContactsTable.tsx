'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import {
  SUPPORT_STATUS_LABELS,
  SUPPORT_STATUS_COLORS,
  CONTACT_TYPE_LABELS,
} from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/ui/PageHeader'
import ContactFormModal from './ContactFormModal'
import { Search, Plus, Filter, Download, Upload, ChevronRight } from 'lucide-react'
import type { Contact } from '@/types'
import toast from 'react-hot-toast'

interface Props {
  initialContacts: Contact[]
  users: { id: string; full_name: string | null }[]
}

export default function ContactsTable({ initialContacts, users }: Props) {
  const router = useRouter()
  const [contacts, setContacts] = useState(initialContacts)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterUser, setFilterUser] = useState('')
  const [filterPrecinct, setFilterPrecinct] = useState('')

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.address?.toLowerCase().includes(q) ||
        c.precinct?.toLowerCase().includes(q)

      const matchStatus = !filterStatus || c.support_status === filterStatus
      const matchType = !filterType || c.contact_type === filterType
      const matchUser = !filterUser || c.assigned_user_id === filterUser
      const matchPrecinct = !filterPrecinct || c.precinct === filterPrecinct

      return matchSearch && matchStatus && matchType && matchUser && matchPrecinct
    })
  }, [contacts, search, filterStatus, filterType, filterUser, filterPrecinct])

  const precincts = useMemo(() => {
    const ps = Array.from(new Set(contacts.map((c) => c.precinct).filter(Boolean)))
    return ps as string[]
  }, [contacts])

  async function handleDelete(id: string) {
    if (!confirm('Delete this contact?')) return
    const supabase = createClient()
    const { error } = await supabase.from('contacts').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete contact')
    } else {
      setContacts((prev) => prev.filter((c) => c.id !== id))
      toast.success('Contact deleted')
    }
  }

  function handleExportCSV() {
    const headers = ['Full Name', 'Phone', 'Email', 'Address', 'City', 'State', 'Zip', 'Precinct', 'Support Status', 'Contact Type']
    const rows = filtered.map((c) => [
      c.full_name,
      c.phone ?? '',
      c.email ?? '',
      c.address ?? '',
      c.city ?? '',
      c.state ?? '',
      c.zip ?? '',
      c.precinct ?? '',
      SUPPORT_STATUS_LABELS[c.support_status],
      CONTACT_TYPE_LABELS[c.contact_type],
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contacts.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function onFormSuccess(contact: Contact) {
    setContacts((prev) => {
      const idx = prev.findIndex((c) => c.id === contact.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = contact
        return next
      }
      return [contact, ...prev]
    })
    setShowForm(false)
  }

  return (
    <div>
      <PageHeader
        title="Contacts"
        description={`${contacts.length} total contacts · ${filtered.length} shown`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </>
        }
      />

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, address…"
              className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Statuses</option>
          {Object.entries(SUPPORT_STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-slate-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Types</option>
          {Object.entries(CONTACT_TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        {precincts.length > 0 && (
          <select
            value={filterPrecinct}
            onChange={(e) => setFilterPrecinct(e.target.value)}
            className="border border-slate-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Precincts</option>
            {precincts.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        )}

        {(search || filterStatus || filterType || filterPrecinct) && (
          <button
            onClick={() => { setSearch(''); setFilterStatus(''); setFilterType(''); setFilterPrecinct('') }}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Address</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Precinct</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Follow Up</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    No contacts found
                  </td>
                </tr>
              ) : (
                filtered.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => router.push(`/contacts/${contact.id}`)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{contact.full_name}</p>
                      {contact.assigned_user && (
                        <p className="text-xs text-slate-400">{(contact.assigned_user as unknown as { full_name: string }).full_name}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-slate-700">{contact.phone ?? '—'}</p>
                      <p className="text-slate-400 text-xs">{contact.email ?? ''}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-slate-600 text-xs">
                        {[contact.address, contact.city, contact.state].filter(Boolean).join(', ') || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={SUPPORT_STATUS_COLORS[contact.support_status]}>
                        {SUPPORT_STATUS_LABELS[contact.support_status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-slate-600">{CONTACT_TYPE_LABELS[contact.contact_type]}</span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell text-slate-600">
                      {contact.precinct ?? '—'}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell text-slate-600 text-xs">
                      {formatDate(contact.next_follow_up)}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ContactFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={onFormSuccess}
        users={users}
      />
    </div>
  )
}
