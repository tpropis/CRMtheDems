'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/constants'
import { formatTimeAgo, getInitials } from '@/lib/utils'
import { Users, Activity, UserPlus, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import type { UserRole } from '@/types'

interface Props {
  users: Record<string, unknown>[]
  activityLog: Record<string, unknown>[]
}

export default function AdminView({ users: initialUsers, activityLog }: Props) {
  const [users, setUsers] = useState(initialUsers)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState<UserRole>('field')
  const [activeTab, setActiveTab] = useState<'users' | 'log'>('users')

  async function handleRoleChange(userId: string, role: UserRole) {
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
    if (error) { toast.error(error.message); return }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u))
    toast.success('Role updated')
  }

  async function handleToggleActive(userId: string, active: boolean) {
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ active: !active }).eq('id', userId)
    if (error) { toast.error(error.message); return }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, active: !active } : u))
    toast.success(active ? 'User deactivated' : 'User activated')
  }

  async function handleInviteUser(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail || !inviteName) { toast.error('Email and name required'); return }
    setInviteLoading(true)

    // Create user via Supabase Admin (requires service role) — here we insert profile directly
    // In production, use a server action with the service role key
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: inviteEmail,
      password: Math.random().toString(36).slice(-12),
      options: {
        data: { full_name: inviteName, role: inviteRole },
      },
    })

    setInviteLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Invitation sent — user can sign in and reset their password')
      setShowInvite(false)
      setInviteEmail('')
      setInviteName('')
    }
  }

  const roleOptions = Object.entries(ROLE_LABELS).map(([v, l]) => ({ value: v, label: l }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin"
        description="User management and system audit"
        actions={
          <Button size="sm" onClick={() => setShowInvite(true)}>
            <UserPlus className="h-4 w-4" />
            Invite User
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'users' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Users ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'log' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center gap-1.5"><Activity className="h-4 w-4" /> Audit Log</span>
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Joined</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id as string} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-brand-700 text-xs font-semibold">
                          {getInitials(u.full_name as string)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{u.full_name as string ?? 'No name'}</p>
                        <p className="text-xs text-slate-500">{u.email as string}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role as string}
                      onChange={(e) => handleRoleChange(u.id as string, e.target.value as UserRole)}
                      className="border border-slate-200 rounded text-xs px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      {roleOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={(u.active as boolean) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}>
                      {(u.active as boolean) ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-500">
                    {formatTimeAgo(u.created_at as string)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(u.id as string, u.active as boolean)}
                      className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                    >
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'log' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Entity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">When</th>
              </tr>
            </thead>
            <tbody>
              {activityLog.length === 0 && (
                <tr><td colSpan={4} className="text-center py-8 text-slate-400">No activity logged</td></tr>
              )}
              {activityLog.map((log) => {
                const logUser = log.user as { full_name: string; email: string } | null
                return (
                  <tr key={log.id as string} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-700">{logUser?.full_name ?? logUser?.email ?? '—'}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-slate-700">{(log.action as string).replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell text-slate-500 text-xs">
                      {log.entity_type as string} / {(log.entity_id as string).slice(0, 8)}…
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">
                      {formatTimeAgo(log.created_at as string)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={showInvite}
        onClose={() => setShowInvite(false)}
        title="Invite New User"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button loading={inviteLoading} onClick={handleInviteUser}>Send Invite</Button>
          </>
        }
      >
        <form onSubmit={handleInviteUser} className="space-y-4">
          <Input label="Full Name" value={inviteName} onChange={(e) => setInviteName(e.target.value)} required />
          <Input label="Email Address" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required />
          <Select label="Role" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as UserRole)} options={roleOptions} />
          <div className="text-xs text-slate-500 bg-slate-50 rounded-md p-3">
            The user will receive a sign-up email and can set their own password.
          </div>
        </form>
      </Modal>
    </div>
  )
}
