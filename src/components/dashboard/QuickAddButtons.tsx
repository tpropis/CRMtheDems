'use client'

import { useState } from 'react'
import { Plus, UserPlus, DollarSign, Heart, CheckSquare, SignpostBig } from 'lucide-react'
import Button from '@/components/ui/Button'
import ContactFormModal from '@/components/contacts/ContactFormModal'
import TaskFormModal from '@/components/tasks/TaskFormModal'

export default function QuickAddButtons() {
  const [showContactForm, setShowContactForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        onClick={() => setMenuOpen(!menuOpen)}
        size="sm"
      >
        <Plus className="h-4 w-4" />
        Quick Add
      </Button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
            <button
              onClick={() => { setShowContactForm(true); setMenuOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <UserPlus className="h-4 w-4 text-slate-400" />
              New Contact
            </button>
            <button
              onClick={() => { setShowTaskForm(true); setMenuOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <CheckSquare className="h-4 w-4 text-slate-400" />
              New Task
            </button>
          </div>
        </>
      )}

      <ContactFormModal
        open={showContactForm}
        onClose={() => setShowContactForm(false)}
      />
      <TaskFormModal
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
      />
    </div>
  )
}
