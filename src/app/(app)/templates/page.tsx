export const dynamic = 'force-dynamic'
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
  const savedTemplates = await db.template.findMany({ where: { firmId }, orderBy: { usageCount: 'desc' } }).catch(() => [] as any[])
  const grouped = DEFAULT_TEMPLATES.reduce((acc, t) => { if (!acc[t.category]) acc[t.category] = []; acc[t.category].push(t); return acc }, {} as Record<string, typeof DEFAULT_TEMPLATES>)

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Document Templates" description="Professional legal templates with AI-powered variable filling"
        actions={<Link href="/documents/generate"><Button size="sm" className="gap-1.5"><Wand2 className="h-3.5 w-3.5" />Generate Document</Button></Link>} />

      <div className="section-card overflow-hidden">
        <div className="h-[3px] w-full bg-gradient-to-r from-vault-accent to-vault-accent/40" />
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gradient-to-b from-vault-accent/10 to-vault-accent/5 border border-vault-accent/25 p-3 shadow-[0_1px_3px_rgba(45,89,69,0.08)]">
              <Wand2 className="h-5 w-5 text-vault-accent" />
            </div>
            <div>
              <h3 className="display-serif text-[15px] font-semibold text-vault-ink tracking-[-0.01em]">AI Document Generator</h3>
              <p className="text-[13px] text-vault-text-secondary mt-0.5">Select a template, describe what you need — AI fills matter details, parties, dates, and full body content. Export to PDF instantly.</p>
            </div>
          </div>
          <Link href="/documents/generate"><Button className="gap-1.5">Generate Now</Button></Link>
        </div>
      </div>

      {Object.entries(grouped).map(([category, templates]) => {
        const Icon = CATEGORY_ICONS[category] || FileText
        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-3">
              <Icon className="h-3.5 w-3.5 text-vault-gold" />
              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-vault-muted">{CATEGORY_LABELS[category] || category}</h2>
              <span className="font-mono text-[10px] text-vault-faint">({templates.length})</span>
              <div className="flex-1 h-px bg-gradient-to-r from-vault-border to-transparent" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {templates.map((t) => (
                <Link key={t.name} href={`/documents/generate?template=${encodeURIComponent(t.name)}`}>
                  <div className="section-card p-4 cursor-pointer group space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="rounded-md bg-gradient-to-b from-vault-elevated to-vault-elevated/60 border border-vault-border p-2 transition-colors group-hover:border-vault-accent/30">
                        <FileText className="h-4 w-4 text-vault-muted group-hover:text-vault-accent transition-colors" />
                      </div>
                      <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.15em] text-vault-muted px-2 py-0.5 rounded border border-vault-border bg-vault-elevated">Built-in</span>
                    </div>
                    <div>
                      <h3 className="text-[13.5px] font-medium text-vault-ink group-hover:text-vault-accent transition-colors">{t.name}</h3>
                      {t.practiceArea && <p className="font-mono text-[11px] text-vault-muted mt-0.5">{t.practiceArea}</p>}
                    </div>
                    <p className="font-mono text-[11px] text-vault-accent opacity-0 group-hover:opacity-100 transition-opacity">Generate with AI →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}

      {savedTemplates.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Briefcase className="h-3.5 w-3.5 text-vault-gold" />
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-vault-muted">Firm Templates</h2>
            <span className="font-mono text-[10px] text-vault-faint">({savedTemplates.length})</span>
            <div className="flex-1 h-px bg-gradient-to-r from-vault-border to-transparent" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {savedTemplates.map((t) => (
              <Link key={t.id} href={`/documents/generate?templateId=${t.id}`}>
                <div className="section-card p-4 cursor-pointer group space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div className="rounded-md bg-gradient-to-b from-vault-elevated to-vault-elevated/60 border border-vault-border p-2">
                      <FileText className="h-4 w-4 text-vault-muted group-hover:text-vault-accent transition-colors" />
                    </div>
                    <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.15em] text-vault-accent px-2 py-0.5 rounded border border-vault-accent/30 bg-vault-accent/10">Custom</span>
                  </div>
                  <h3 className="text-[13.5px] font-medium text-vault-ink group-hover:text-vault-accent transition-colors">{t.name}</h3>
                  <p className="font-mono text-[11px] text-vault-muted">Used {t.usageCount} times</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
