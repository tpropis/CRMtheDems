'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import StatCard from '@/components/ui/StatCard'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { SIGN_STATUS_LABELS, SIGN_STATUS_COLORS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { Plus, SignpostBig, Search, Package, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { SignStatus } from '@/types'

interface Props {
  signRequests: Record<string, unknown>[]
  contacts: { id: string; full_name: string; address?: string | null; neighborhood?: string | null }[]
}

export default function YardSignsView({ signRequests: initialRequests, contacts }: Props) {
  const router = useRouter()
  const [requests, setRequests] = useState(initialRequests)
  const [showForm, setShowForm] = useState(false)
  const [editReq, setEditReq] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterNeighborhood, setFilterNeighborhood] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    contact_id: '',
    quantity: '1',
    delivery_status: 'requested' as SignStatus,
    delivery_date: '',
    installation_status: false,
    installer_name: '',
    address: '',
    neighborhood: '',
    notes: '',
    request_date: new Date().toISOString().slice(0, 10),
  })

  function resetForm(req?: Record<string, unknown>) {
    if (req) {
      setForm({
        contact_id: req.contact_id as string,
        quantity: req.quantity?.toString() ?? '1',
        delivery_status: req.delivery_status as SignStatus,
        delivery_date: (req.delivery_date as string)?.slice(0, 10) ?? '',
        installation_status: req.installation_status as boolean,
        installer_name: req.installer_name as string ?? '',
        address: req.address as string ?? '',
        neighborhood: req.neighborhood as string ?? '',
        notes: req.notes as string ?? '',
        request_date: (req.request_date as string)?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      })
    } else {
      setForm({
        contact_id: '',
        quantity: '1',
        delivery_status: 'requested',
        delivery_date: '',
        installation_status: false,
        installer_name: '',
        address: '',
        neighborhood: '',
        notes: '',
        request_date: new Date().toISOString().slice(0, 10),
      })
    }
  }

  const neighborhoods = useMemo(() => {
    const ns = Array.from(new Set(requests.map((r) => r.neighborhood).filter(Boolean)))
    return ns as string[]
  }, [requests])

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const contact = r.contact as { full_name: string } | null
      const q = search.toLowerCase()
      const matchSearch = !q || contact?.full_name?.toLowerCase().includes(q) || (r.address as string)?.toLowerCase().includes(q)
      const matchStatus = !filterStatus || r.delivery_status === filterStatus
      const matchNeighborhood = !filterNeighborhood || r.neighborhood === filterNeighborhood
      return matchSearch && matchStatus && matchNeighborhood
    })
  }, [requests, search, filterStatus, filterNeighborhood])

  const stats = {
    requested: requests.filter((r) => r.delivery_status === 'requested').length,
    delivered: requests.filter((r) => ['delivered', 'installed'].includes(r.delivery_status as string)).length,
    installed: requests.filter((r) => r.delivery_status === 'installed').length,
    total: requests.reduce((s, r) => s + ((r.quantity as number) ?? 0), 0),
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.contact_id) { toast.error('Contact required'); return }
    setLoading(true)
    const supabase = createClient()

    const payload = {
      ...form,
      quantity: parseInt(form.quantity),
      delivery_date: form.delivery_date || null,
      installer_name: form.installer_name || null,
      address: form.address || null,
      neighborhood: form.neighborhood || null,
      notes: form.notes || null,
      updated_at: new Date().toISOString(),
    }

    let result
    if (editReq?.id) {
      result = await supabase.from('yard_sign_requests').update(payload).eq('id', editReq.id as string)
        .select('*, contact:contacts(id, full_name, phone)').single()
    } else {
      result = await supabase.from('yard_sign_requests').insert(payload)
        .select('*, contact:contacts(id, full_name, phone)').single()
    }

    setLoading(false)
    if (result.error) {
      toast.error(result.error.message)
    } else {
      const data = result.data as Record<string, unknown>
      setRequests((prev) => {
        const idx = prev.findIndex((r) => r.id === data.id)
        if (idx >= 0) { const next = [...prev]; next[idx] = data; return next }
        return [data, ...prev]
      })
      toast.success(editReq ? 'Updated' : 'Request created')
      setShowForm(false)
      setEditReq(null)
    }
  }

  function openEdit(req: Record<string, unknown>) {
    setEditReq(req)
    resetForm(req)
    setShowForm(true)
  }

  const contactOptions = contacts.map((c) => ({
    value: c.id,
    label: `${c.full_name}${c.address ? ' — ' + c.address : ''}`,
  }))
  const statusOptions = Object.entries(SIGN_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Yard Signs"
        description="Track sign requests, delivery, and installation"
        actions={
          <Button size="sm" onClick={() => { setEditReq(null); resetForm(); setShowForm(true) }}>
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Signs" value={stats.total} icon={SignpostBig} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Requested" value={stats.requested} icon={Package} iconBg="bg-orange-50" iconColor="text-orange-600" />
        <StatCard label="Delivered" value={stats.delivered} icon={CheckCircle} iconBg="bg-teal-50" iconColor="text-teal-600" />
        <StatCard label="Installed" value={stats.installed} icon={CheckCircle} iconBg="bg-emerald-50" iconColor="text-emerald-600" highlight />
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
              className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="">All Statuses</option>
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {neighborhoods.length > 0 && (
          <select value={filterNeighborhood} onChange={(e) => setFilterNeighborhood(e.target.value)}
            className="border border-slate-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">All Neighborhoods</option>
            {neighborhoods.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Address</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Qty</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Delivery</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Neighborhood</th>
                <th className="w-16" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400">No sign requests found</td></tr>
              ) : (
                filtered.map((r) => {
                  const contact = r.contact as { full_name: string; phone?: string } | null
                  return (
                    <tr key={r.id as string} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{contact?.full_name ?? '—'}</p>
                        {contact?.phone && <p className="text-xs text-slate-400">{contact.phone}</p>}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-slate-600 text-xs">{r.address as string ?? '—'}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-900">{r.quantity as number}</td>
                      <td className="px-4 py-3">
                        <Badge className={SIGN_STATUS_COLORS[r.delivery_status as SignStatus]}>
                          {SIGN_STATUS_LABELS[r.delivery_status as SignStatus]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-600 text-xs">
                        {formatDate(r.delivery_date as string)}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-slate-600 text-xs">
                        {r.neighborhood as string ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditReq(null) }}
        title={editReq ? 'Edit Sign Request' : 'New Sign Request'}
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditReq(null) }}>Cancel</Button>
            <Button loading={loading} onClick={handleSubmit}>{editReq ? 'Save' : 'Create Request'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Contact" value={form.contact_id} onChange={(e) => {
            const contact = contacts.find((c) => c.id === e.target.value)
            setForm((f) => ({
              ...f,
              contact_id: e.target.value,
              address: contact?.address ?? f.address,
              neighborhood: contact?.neighborhood ?? f.neighborhood,
            }))
          }} options={contactOptions} placeholder="Select contact…" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Quantity" type="number" min="1" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} />
            <Input label="Request Date" type="date" value={form.request_date} onChange={(e) => setForm((f) => ({ ...f, request_date: e.target.value }))} />
          </div>
          <Select label="Status" value={form.delivery_status} onChange={(e) => setForm((f) => ({ ...f, delivery_status: e.target.value as SignStatus }))} options={statusOptions} />
          <Input label="Delivery Date" type="date" value={form.delivery_date} onChange={(e) => setForm((f) => ({ ...f, delivery_date: e.target.value }))} />
          <Input label="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          <Input label="Neighborhood" value={form.neighborhood} onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))} />
          <Input label="Installer Name" value={form.installer_name} onChange={(e) => setForm((f) => ({ ...f, installer_name: e.target.value }))} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.installation_status} onChange={(e) => setForm((f) => ({ ...f, installation_status: e.target.checked }))} className="rounded border-slate-300 text-brand-600" />
            <span className="text-sm text-slate-700">Installed</span>
          </label>
          <Textarea label="Notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
        </form>
      </Modal>
    </div>
  )
}
