'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { DEFAULT_TEMPLATES } from '@/server/templates/defaults'
import {
  Wand2, FileText, Download, ChevronLeft, Loader2,
  Briefcase, Search, CheckCircle2, Eye, Code2, Sparkles,
} from 'lucide-react'
import Link from 'next/link'

interface Matter {
  id: string
  name: string
  matterNumber: string
  type: string
  client: { name: string }
}

export default function GenerateDocumentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const templateName = searchParams.get('template')
  const templateId = searchParams.get('templateId')

  const [step, setStep] = useState<'pick' | 'configure' | 'preview'>('pick')
  const [selectedTemplate, setSelectedTemplate] = useState<typeof DEFAULT_TEMPLATES[0] | null>(null)
  const [matters, setMatters] = useState<Matter[]>([])
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null)
  const [matterSearch, setMatterSearch] = useState('')
  const [instructions, setInstructions] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<{ content: string; model: string; tokens: number } | null>(null)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [view, setView] = useState<'preview' | 'raw'>('preview')

  // Load template from URL param
  useEffect(() => {
    if (templateName) {
      const t = DEFAULT_TEMPLATES.find(t => t.name === templateName)
      if (t) { setSelectedTemplate(t); setStep('configure') }
    }
  }, [templateName])

  // Load matters
  useEffect(() => {
    fetch('/api/matters?status=ACTIVE&limit=100')
      .then(r => r.json())
      .then(data => setMatters(Array.isArray(data) ? data : (data.data || data.matters || [])))
      .catch(() => {})
  }, [])

  const filteredMatters = matters.filter(m =>
    m.name.toLowerCase().includes(matterSearch.toLowerCase()) ||
    m.matterNumber.toLowerCase().includes(matterSearch.toLowerCase()) ||
    m.client?.name?.toLowerCase().includes(matterSearch.toLowerCase())
  )

  async function handleGenerate() {
    if (!selectedTemplate) return
    setGenerating(true)
    try {
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateName: selectedTemplate.name,
          templateContent: selectedTemplate.content,
          matterId: selectedMatter?.id,
          instructions,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setGenerated(data)
      setStep('preview')
    } catch (err: any) {
      alert(err.message || 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  async function handleExportPdf() {
    if (!generated || !selectedTemplate) return
    setExportingPdf(true)
    try {
      const res = await fetch('/api/documents/generate/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: generated.content,
          title: selectedTemplate.name,
          matterId: selectedMatter?.id,
        }),
      })
      if (!res.ok) throw new Error('PDF export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedTemplate.name.replace(/\s+/g, '_')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setExportingPdf(false)
    }
  }

  // ── Step 1: Pick template ────────────────────────────────────
  if (step === 'pick') {
    const grouped = DEFAULT_TEMPLATES.reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = []
      acc[t.category].push(t)
      return acc
    }, {} as Record<string, typeof DEFAULT_TEMPLATES>)

    return (
      <div className="space-y-5 animate-fade-in">
        <PageHeader
          title="Generate Document"
          description="Choose a template to get started"
          actions={<Link href="/templates"><Button variant="outline" size="sm"><ChevronLeft className="h-4 w-4" />Templates</Button></Link>}
        />
        {Object.entries(grouped).map(([cat, templates]) => (
          <div key={cat} className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vault-muted px-1">{cat}</p>
            <div className="grid grid-cols-3 gap-3">
              {templates.map(t => (
                <button key={t.name} onClick={() => { setSelectedTemplate(t); setStep('configure') }}
                  className="section-card p-4 text-left hover:border-vault-accent/40 transition-colors group space-y-2">
                  <div className="rounded-md bg-gradient-to-b from-vault-elevated to-vault-elevated/60 border border-vault-border p-2 w-fit">
                    <FileText className="h-4 w-4 text-vault-muted group-hover:text-vault-accent transition-colors" />
                  </div>
                  <p className="text-[13px] font-medium text-vault-ink group-hover:text-vault-accent transition-colors">{t.name}</p>
                  {t.practiceArea && <p className="text-xs text-vault-muted">{t.practiceArea}</p>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── Step 2: Configure ────────────────────────────────────────
  if (step === 'configure') {
    return (
      <div className="space-y-5 animate-fade-in">
        <PageHeader
          title={selectedTemplate?.name || 'Generate Document'}
          description="Select matter context and add AI instructions"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep('pick')}><ChevronLeft className="h-4 w-4" />Back</Button>
              <Button onClick={handleGenerate} disabled={generating}>
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                {generating ? 'Generating...' : 'Generate with AI'}
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-3 gap-5">
          {/* Left: config */}
          <div className="col-span-2 space-y-4">
            {/* Matter picker */}
            <div className="section-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-vault-muted" />
                <h3 className="section-label">Link to Matter <span className="text-vault-muted font-normal">(optional)</span></h3>
              </div>
              <p className="text-xs text-vault-text-secondary">Linking a matter auto-fills client name, case number, attorney, and all matter variables.</p>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-vault-muted" />
                <Input className="pl-9" placeholder="Search matters..." value={matterSearch} onChange={e => setMatterSearch(e.target.value)} />
              </div>
              {selectedMatter && (
                <div className="flex items-center justify-between p-3 rounded-md bg-vault-accent/10 border border-vault-accent/30">
                  <div>
                    <p className="text-sm font-medium text-vault-accent-light">{selectedMatter.name}</p>
                    <p className="text-xs text-vault-muted">{selectedMatter.client?.name} · {selectedMatter.matterNumber}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-vault-muted" onClick={() => setSelectedMatter(null)}>Remove</Button>
                </div>
              )}
              {matterSearch && !selectedMatter && (
                <div className="border border-vault-border rounded-md overflow-hidden max-h-48 overflow-y-auto">
                  {filteredMatters.length === 0 ? (
                    <div className="p-3 text-sm text-vault-muted text-center">No matters found</div>
                  ) : (
                    filteredMatters.slice(0, 8).map(m => (
                      <button key={m.id} onClick={() => { setSelectedMatter(m); setMatterSearch('') }}
                        className="w-full text-left p-3 hover:bg-vault-elevated transition-colors border-b border-vault-border/50 last:border-0">
                        <p className="text-sm text-vault-text">{m.name}</p>
                        <p className="text-xs text-vault-muted">{m.client?.name} · {m.matterNumber}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* AI Instructions */}
            <div className="section-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-vault-muted" />
                <h3 className="section-label">AI Instructions</h3>
              </div>
              <p className="text-xs text-vault-text-secondary">Describe any specific requirements, tone, facts, or customizations. AI will fill all template variables and expand the document.</p>
              <textarea
                className="w-full min-h-[120px] rounded-md border border-vault-border bg-vault-elevated px-3 py-2 text-sm text-vault-text placeholder:text-vault-muted focus:outline-none focus:ring-1 focus:ring-vault-accent resize-none"
                placeholder={`E.g.: "Settlement demand for slip-and-fall at 123 Main St. Client suffered broken wrist, $45,000 in medical bills. Defendant is aware — their insurance adjuster responded last week. Tone should be firm but professional."`}
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
              />
            </div>
          </div>

          {/* Right: template preview */}
          <div className="space-y-3">
            <h3 className="section-label flex items-center gap-2"><Eye className="h-4 w-4 text-vault-muted" /> Template</h3>
            <div className="section-card p-4 max-h-[500px] overflow-y-auto">
              <pre className="text-xs text-vault-text-secondary whitespace-pre-wrap font-mono leading-relaxed">{selectedTemplate?.content.slice(0, 1200)}{(selectedTemplate?.content.length || 0) > 1200 ? '\n...' : ''}</pre>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 3: Preview ──────────────────────────────────────────
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title={selectedTemplate?.name || 'Generated Document'}
        description={generated ? `Generated · ${generated.model} · ${generated.tokens?.toLocaleString()} tokens` : ''}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setStep('configure')}><ChevronLeft className="h-4 w-4" />Edit</Button>
            <Button variant="outline" size="sm" onClick={() => setView(v => v === 'preview' ? 'raw' : 'preview')}>
              {view === 'preview' ? <Code2 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {view === 'preview' ? 'Raw Text' : 'Preview'}
            </Button>
            <Button onClick={handleExportPdf} disabled={exportingPdf}>
              {exportingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {exportingPdf ? 'Exporting...' : 'Export PDF'}
            </Button>
          </div>
        }
      />

      {generated && (
        <div className="section-card p-6">
          {view === 'preview' ? (
            <div className="bg-white rounded-md p-8 shadow-sm max-w-3xl mx-auto">
              <pre className="font-sans text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{generated.content}</pre>
            </div>
          ) : (
            <pre className="text-xs text-vault-text-secondary whitespace-pre-wrap font-mono leading-relaxed">{generated.content}</pre>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-vault-muted">
        <CheckCircle2 className="h-3.5 w-3.5 text-vault-success" />
        Document generated and saved to vault
        {selectedMatter && <><span>·</span><Briefcase className="h-3.5 w-3.5" />{selectedMatter.name}</>}
      </div>
    </div>
  )
}
