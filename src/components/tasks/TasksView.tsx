'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import StatCard from '@/components/ui/StatCard'
import TaskFormModal from './TaskFormModal'
import {
  TASK_STATUS_LABELS, TASK_STATUS_COLORS,
  TASK_PRIORITY_LABELS, TASK_PRIORITY_COLORS,
} from '@/lib/constants'
import { formatDate, isOverdue } from '@/lib/utils'
import { Plus, CheckSquare, AlertCircle, Search, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  tasks: Record<string, unknown>[]
  users: { id: string; full_name: string | null }[]
  contacts: { id: string; full_name: string }[]
  currentUserId: string
  isVolunteer: boolean
}

export default function TasksView({ tasks: initialTasks, users, contacts, currentUserId, isVolunteer }: Props) {
  const router = useRouter()
  const [tasks, setTasks] = useState(initialTasks)
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState<Record<string, unknown> | null>(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterAssignee, setFilterAssignee] = useState('')
  const [filterOverdue, setFilterOverdue] = useState(false)
  const [filterMine, setFilterMine] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const q = search.toLowerCase()
      const matchSearch = !q || (t.title as string)?.toLowerCase().includes(q)
      const matchStatus = !filterStatus || t.status === filterStatus
      const matchPriority = !filterPriority || t.priority === filterPriority
      const matchAssignee = !filterAssignee || t.assigned_to === filterAssignee
      const matchOverdue = !filterOverdue || (isOverdue(t.due_date as string) && !['completed', 'canceled'].includes(t.status as string))
      const matchMine = !filterMine || t.assigned_to === currentUserId
      return matchSearch && matchStatus && matchPriority && matchAssignee && matchOverdue && matchMine
    })
  }, [tasks, search, filterStatus, filterPriority, filterAssignee, filterOverdue, filterMine, currentUserId])

  const openCount = tasks.filter((t) => ['open', 'in_progress'].includes(t.status as string)).length
  const overdueCount = tasks.filter((t) => isOverdue(t.due_date as string) && !['completed', 'canceled'].includes(t.status as string)).length
  const myCount = tasks.filter((t) => t.assigned_to === currentUserId && ['open', 'in_progress'].includes(t.status as string)).length

  async function handleComplete(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('tasks').update({ status: 'completed', updated_at: new Date().toISOString() }).eq('id', id)
    if (error) { toast.error('Failed to update'); return }
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: 'completed' } : t))
    toast.success('Task completed')
  }

  function onFormSuccess(task: Record<string, unknown>) {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === task.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = task; return next }
      return [task, ...prev]
    })
    setShowForm(false)
    setEditTask(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks & Follow-ups"
        description="Manage campaign action items"
        actions={
          !isVolunteer ? (
            <Button size="sm" onClick={() => { setEditTask(null); setShowForm(true) }}>
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Open Tasks" value={openCount} icon={CheckSquare} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Overdue" value={overdueCount} icon={AlertCircle} iconBg="bg-red-50" iconColor="text-red-600" />
        <StatCard label="My Tasks" value={myCount} icon={CheckSquare} iconBg="bg-purple-50" iconColor="text-purple-600" />
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…"
            className="block w-44 pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="">All Statuses</option>
          {Object.entries(TASK_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
          className="border border-slate-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="">All Priorities</option>
          {Object.entries(TASK_PRIORITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        {!isVolunteer && (
          <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}
            className="border border-slate-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">All Assignees</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.full_name}</option>)}
          </select>
        )}
        <button
          onClick={() => setFilterOverdue(!filterOverdue)}
          className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${filterOverdue ? 'bg-red-50 border-red-300 text-red-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
        >
          Overdue Only
        </button>
        <button
          onClick={() => setFilterMine(!filterMine)}
          className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${filterMine ? 'bg-brand-50 border-brand-300 text-brand-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
        >
          My Tasks
        </button>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">No tasks found</div>
        )}
        {filtered.map((task) => {
          const overdue = isOverdue(task.due_date as string) && !['completed', 'canceled'].includes(task.status as string)
          const contact = task.linked_contact as { id: string; full_name: string } | null
          const assignedUser = task.assigned_user as { full_name: string } | null
          const isCompleted = task.status === 'completed'

          return (
            <div
              key={task.id as string}
              className={`bg-white border rounded-lg px-4 py-3 flex items-start gap-4 ${
                overdue ? 'border-red-200 bg-red-50/30' : 'border-slate-200'
              } ${isCompleted ? 'opacity-60' : ''}`}
            >
              {/* Complete button */}
              {!isVolunteer && !isCompleted && (
                <button
                  onClick={() => handleComplete(task.id as string)}
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 transition-colors flex items-center justify-center"
                  title="Mark complete"
                />
              )}
              {isCompleted && (
                <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="h-3 w-3 text-emerald-600" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-medium ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {task.title as string}
                  </span>
                  <Badge className={TASK_PRIORITY_COLORS[task.priority as keyof typeof TASK_PRIORITY_COLORS]}>
                    {TASK_PRIORITY_LABELS[task.priority as keyof typeof TASK_PRIORITY_LABELS]}
                  </Badge>
                  <Badge className={TASK_STATUS_COLORS[task.status as keyof typeof TASK_STATUS_COLORS]}>
                    {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}
                  </Badge>
                </div>
                {task.description ? (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{task.description as string}</p>
                ) : null}
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 flex-wrap">
                  {assignedUser ? <span>→ {assignedUser.full_name}</span> : null}
                  {contact && (
                    <Link href={`/contacts/${contact.id}`} className="text-brand-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                      {contact.full_name}
                    </Link>
                  )}
                  {task.due_date ? (
                    <span className={overdue ? 'text-red-500 font-medium' : ''}>
                      Due {formatDate(task.due_date as string)}
                    </span>
                  ) : null}
                </div>
              </div>

              {!isVolunteer && (
                <Button size="sm" variant="ghost" onClick={() => { setEditTask(task); setShowForm(true) }}>
                  Edit
                </Button>
              )}
            </div>
          )
        })}
      </div>

      <TaskFormModal
        open={showForm}
        onClose={() => { setShowForm(false); setEditTask(null) }}
        task={editTask ?? undefined}
        users={users}
        contacts={contacts}
        onSuccess={onFormSuccess}
      />
    </div>
  )
}
