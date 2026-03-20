'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { submitCanvassResult } from '@/lib/actions'
import { CANVASS_RESULT_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const RESULT_BUTTON_COLORS: Record<string, string> = {
  strong_support: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600',
  lean_support: 'bg-green-500 hover:bg-green-600 text-white border-green-500',
  undecided: 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-yellow-400',
  not_home: 'bg-slate-400 hover:bg-slate-500 text-white border-slate-400',
  opposed: 'bg-red-600 hover:bg-red-700 text-white border-red-600',
  wrong_address: 'bg-orange-400 hover:bg-orange-500 text-white border-orange-400',
  moved: 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500',
  callback_requested: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500',
}

interface Props {
  open: boolean
  onClose: () => void
  walkLists: Record<string, unknown>[]
  contacts: Record<string, unknown>[]
  defaultWalkListId?: string | null
  onSuccess?: () => void
}

export default function CanvassResultForm({ open, onClose, walkLists, contacts, defaultWalkListId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [contactId, setContactId] = useState('')
  const [walkListId, setWalkListId] = useState(defaultWalkListId ?? '')
  const [result, setResult] = useState('')
  const [note, setNote] = useState('')
  const [followUp, setFollowUp] = useState(false)

  async function handleSubmit() {
    if (!contactId || !result) {
      toast.error('Select a contact and result')
      return
    }
    setLoading(true)
    try {
      await submitCanvassResult({
        contact_id: contactId,
        walk_list_id: walkListId || null,
        result,
        note: note || null,
        follow_up_needed: followUp,
      })
      toast.success('Result logged')
      setContactId('')
      setResult('')
      setNote('')
      setFollowUp(false)
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error('Failed to log result')
    } finally {
      setLoading(false)
    }
  }

  const contactOptions = contacts.map((c) => ({
    value: c.id as string,
    label: `${c.full_name as string}${c.address ? ' — ' + c.address : ''}`,
  }))

  const walkListOptions = walkLists.map((w) => ({
    value: w.id as string,
    label: w.name as string,
  }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log Canvass Result"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={handleSubmit} disabled={!contactId || !result}>
            Log Result
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Contact"
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
          options={contactOptions}
          placeholder="Search and select contact…"
        />

        {walkListOptions.length > 0 && (
          <Select
            label="Walk List (optional)"
            value={walkListId}
            onChange={(e) => setWalkListId(e.target.value)}
            options={walkListOptions}
            placeholder="None"
          />
        )}

        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Result</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CANVASS_RESULT_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setResult(key)}
                className={cn(
                  'py-2.5 px-3 rounded-md text-sm font-medium border-2 transition-all',
                  result === key
                    ? RESULT_BUTTON_COLORS[key]
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any details about this interaction…"
          rows={2}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={followUp}
            onChange={(e) => setFollowUp(e.target.checked)}
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm text-slate-700">Flag for follow-up</span>
        </label>
      </div>
    </Modal>
  )
}
