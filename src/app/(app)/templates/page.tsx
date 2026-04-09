import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { FileText, Wand2, Scale, Building2, Mail, FileCheck, Briefcase } from 'lucide-react'
import { DEFAULT_TEMPLATES } from '@/server/templates/defaults'

const CATEGORY_ICONS: Record<string, any> = { CORRESPONDENCE: Mail, LITIGATION: Scale, TRANSACTIONAL: Building2, INTERNAL: FileText, ADMINISTRATIVE: FileCheck }
const CATEGORY_LABELS: Record<string, string> = { CORRESPONDENCE: 'Correspondence', LITIGATION: 'Litigation', TRANSACTIONAL: 'Transactional', INTERNAL: 'Internal', ADMINISTRATIVE: 'Administrative' }

export default async function TemplatesPage() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId
  const savedTemplates = await db.template.findMany({ where: { firmId }, orderBy: { usageCount: 'desc' } })
  const grouped = DEFAULT_TEMPLATES.reduce((acc, t) => { if (!acc[t.category]) acc[t.category] = []; acc[t.category].push(t); return acc }, {} as Record<string, typeof DEFAULT_TEMPLATES>)

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Document Templates" description="Professional legal templates with AI-powered variable filling"
        actions={<Link href="/documents/generate"><Button size="sm"><Wand2 className="h-4 w-4" />Generate Document</Button></Link>} />

      <div className="vault-panel p-5 border-vault-accent/20 bg-vault-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-vault-accent/10 border border-vault-accent/20 p-3"><Wand2 className="h-5 w-5 text-vault-accent" /></div>
            <div>
              <h3 className="font-semibold text-vault-text">AI Document Generator</h3>
              <p className="text-sm text-vault-text-secondary">Select a template, describe what you need — AI fills matter details, parties, dates, and full body content. Export to PDF instantly.</p>
            </div>
          </div>
          <Link href="/documents/generate"><Button>Generate Now</Button></Link>
        </div>
      </div>

      {Object.entries(grouped).map(([category, templates]) => {
        const Icon = CATEGORY_ICONS[category] || FileText
        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-vault-muted" />
              <h2 className="text-sm font-semibold text-vault-text">{CATEGORY_LABELS[category] || category}</h2>
              <span className="text-xs text-vault-muted">({templates.length})</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {templates.map((t) => (
                <Link key={t.name} href={`/documents/generate?template=${encodeURIComponent(t.name)}`}>
                  <div className="vault-panel p-4 hover:border-vault-accent/40 hover:bg-vault-accent/5 transition-colors cursor-pointer group space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="rounded-md bg-vault-elevated border border-vault-border p-2"><FileText className="h-4 w-4 text-vault-muted group-hover:text-vault-accent transition-colors" /></div>
                      <span className="text-xs text-vault-muted px-2 py-0.5 rounded-full border border-vault-border bg-vault-elevated">Built-in</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-vault-text group-hover:text-vault-accent transition-colors">{t.name}</h3>
                      {t.practiceArea && <p className="text-xs text-vault-muted mt-0.5">{t.practiceArea}</p>}
                    </div>
                    <p className="text-xs text-vault-accent opacity-0 group-hover:opacity-100 transition-opacity">Generate with AI →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}

      {savedTemplates.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-vault-muted" /><h2 className="text-sm font-semibold text-vault-text">Firm Templates</h2><span className="text-xs text-vault-muted">({savedTemplates.length})</span></div>
          <div className="grid grid-cols-3 gap-3">
            {savedTemplates.map((t) => (
              <Link key={t.id} href={`/documents/generate?templateId=${t.id}`}>
                <div className="vault-panel p-4 hover:border-vault-accent/40 transition-colors cursor-pointer group space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="rounded-md bg-vault-elevated border border-vault-border p-2"><FileText className="h-4 w-4 text-vault-muted" /></div>
                    <span className="text-xs text-vault-accent px-2 py-0.5 rounded-full border border-vault-accent/30 bg-vault-accent/10">Custom</span>
                  </div>
                  <h3 className="text-sm font-medium text-vault-text">{t.name}</h3>
                  <p className="text-xs text-vault-muted">Used {t.usageCount} times</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
