'use client'

import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const IMPORT_TYPES = [
  { value: 'contacts', label: 'Voter Contacts', desc: 'First Name, Last Name, Phone, Address, City, Zip, Party, Voter ID' },
  { value: 'donors', label: 'Donors', desc: 'First Name, Last Name, Email, Phone, Amount, Date, Method' },
  { value: 'volunteers', label: 'Volunteers', desc: 'First Name, Last Name, Email, Phone, Availability' },
]

export default function ImportPage() {
  const [type, setType] = useState('contacts')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ inserted: number; errors: string[]; total: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleImport() {
    if (!file) return
    setLoading(true)
    setResult(null)

    const form = new FormData()
    form.append('file', file)
    form.append('type', type)

    const res = await fetch('/api/import', { method: 'POST', body: form })
    const data = await res.json()
    setResult(data)
    setLoading(false)
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const selected = IMPORT_TYPES.find((t) => t.value === type)!

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Import Data</h1>
        <p className="text-sm text-slate-500 mt-0.5">Upload .xlsx files to import voters, donors, or volunteers</p>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-3 gap-3">
        {IMPORT_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              type === t.value
                ? 'border-brand-600 bg-brand-50'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <p className={`text-sm font-semibold ${type === t.value ? 'text-brand-700' : 'text-slate-800'}`}>
              {t.label}
            </p>
          </button>
        ))}
      </div>

      {/* Expected columns */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Expected columns</p>
        <p className="text-sm text-slate-700">{selected.desc}</p>
        <p className="text-xs text-slate-400 mt-2">Column names are flexible — common variations are recognized automatically.</p>
      </div>

      {/* File upload */}
      <div
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          file ? 'border-brand-400 bg-brand-50' : 'border-slate-300 hover:border-brand-400 bg-white'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-brand-600" />
            <div className="text-left">
              <p className="text-sm font-semibold text-brand-700">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700">Click to select .xlsx file</p>
            <p className="text-xs text-slate-400 mt-1">or drag and drop</p>
          </>
        )}
      </div>

      {/* Import button */}
      <button
        onClick={handleImport}
        disabled={!file || loading}
        className="w-full h-11 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Import {selected.label}
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <div className={`rounded-lg p-4 border ${result.errors.length ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            {result.errors.length ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            )}
            <p className={`text-sm font-semibold ${result.errors.length ? 'text-red-700' : 'text-emerald-700'}`}>
              {result.errors.length
                ? `Import failed`
                : `Successfully imported ${result.inserted} of ${result.total} records`}
            </p>
          </div>
          {result.errors.map((e, i) => (
            <p key={i} className="text-xs text-red-600 mt-1">{e}</p>
          ))}
        </div>
      )}
    </div>
  )
}
