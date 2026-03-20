'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DONATION_SOURCE_LABELS } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/ui/PageHeader'
import StatCard from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import DonorFormModal from './DonorFormModal'
import { Plus, Search, DollarSign, Users, TrendingUp, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  donors: Record<string, unknown>[]
  contacts: { id: string; full_name: string }[]
  users: { id: string; full_name: string | null }[]
}

export default function DonorsView({ donors: initialDonors, contacts, users }: Props) {
  const router = useRouter()
  const [donors, setDonors] = useState(initialDonors)
  const [showForm, setShowForm] = useState(false)
  const [editDonor, setEditDonor] = useState<Record<string, unknown> | null>(null)
  const [search, setSearch] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [filterThankYou, setFilterThankYou] = useState('')

  const filtered = useMemo(() => {
    return donors.filter((d) => {
      const contact = d.contact as { full_name: string } | null
      const q = search.toLowerCase()
      const matchSearch = !q || contact?.full_name?.toLowerCase().includes(q)
      const matchSource = !filterSource || d.source === filterSource
      const matchThankYou = filterThankYou === '' ? true :
        filterThankYou === 'sent' ? !!d.thank_you_sent :
        !d.thank_you_sent
      return matchSearch && matchSource && matchThankYou
    })
  }, [donors, search, filterSource, filterThankYou])

  const totalRaised = donors.reduce((s, d) => s + ((d.amount as number) ?? 0), 0)
  const avgDonation = donors.length > 0 ? totalRaised / donors.length : 0
  const uniqueDonors = new Set(donors.map((d) => d.contact_id)).size
  const pendingThankYou = donors.filter((d) => !d.thank_you_sent).length

  async function handleMarkThankYou(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('donors')
      .update({ thank_you_sent: true, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update')
    } else {
      setDonors((prev) => prev.map((d) => d.id === id ? { ...d, thank_you_sent: true } : d))
      toast.success('Marked as sent')
    }
  }

  function onFormSuccess(donor: Record<string, unknown>) {
    setDonors((prev) => {
      const idx = prev.findIndex((d) => d.id === donor.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = donor
        return next
      }
      return [donor, ...prev]
    })
    setShowForm(false)
    setEditDonor(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donors & Fundraising"
        description="Track donations and donor relationships"
        actions={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Add Donation
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Raised" value={formatCurrency(totalRaised)} icon={DollarSign} iconBg="bg-green-50" iconColor="text-green-600" highlight />
        <StatCard label="Unique Donors" value={uniqueDonors} icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Avg. Donation" value={formatCurrency(avgDonation)} icon={TrendingUp} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard label="Thank-Yous Pending" value={pendingThankYou} icon={Heart} iconBg="bg-orange-50" iconColor="text-orange-600" />
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by donor name…"
              className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="border border-slate-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Sources</option>
          {Object.entries(DONATION_SOURCE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={filterThankYou}
          onChange={(e) => setFilterThankYou(e.target.value)}
          className="border border-slate-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Thank-Yous</option>
          <option value="pending">Thank-You Pending</option>
          <option value="sent">Thank-You Sent</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Donor</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Flags</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Thank You</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">No donations found</td>
                </tr>
              ) : (
                filtered.map((d) => {
                  const contact = d.contact as { full_name: string } | null
                  return (
                    <tr key={d.id as string} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{contact?.full_name ?? '—'}</p>
                        {d.recurring ? <span className="text-xs text-blue-600 font-medium">Recurring</span> : null}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-700">
                        {formatCurrency(d.amount as number)}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-slate-600">
                        {formatDate(d.date as string)}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-slate-600">
                          {DONATION_SOURCE_LABELS[d.source as keyof typeof DONATION_SOURCE_LABELS] ?? d.source as string}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex gap-1">
                          {d.pledge ? <Badge className="bg-purple-100 text-purple-700">Pledge</Badge> : null}
                          {d.recurring ? <Badge className="bg-blue-100 text-blue-700">Recurring</Badge> : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {d.thank_you_sent ? (
                          <Badge className="bg-emerald-100 text-emerald-700">Sent</Badge>
                        ) : (
                          <button
                            onClick={() => handleMarkThankYou(d.id as string)}
                            className="text-xs text-orange-600 hover:text-orange-700 font-medium border border-orange-200 rounded px-2 py-0.5 hover:bg-orange-50"
                          >
                            Mark Sent
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" onClick={() => { setEditDonor(d); setShowForm(true) }}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DonorFormModal
        open={showForm}
        onClose={() => { setShowForm(false); setEditDonor(null) }}
        contacts={contacts}
        users={users}
        donation={editDonor ?? undefined}
        onSuccess={onFormSuccess}
      />
    </div>
  )
}
