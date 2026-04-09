'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Upload, Eye, Building2, Palette, Layout, CheckCircle2, Loader2 } from 'lucide-react'

const LETTERHEAD_STYLES = [
  { value: 'classic', label: 'Classic', desc: 'Logo left, firm name right, rule below' },
  { value: 'centered', label: 'Centered', desc: 'Centered logo + name, full-width rule' },
  { value: 'minimal', label: 'Minimal', desc: 'Slim bar with logo only, address in footer' },
  { value: 'court', label: 'Court Filing', desc: 'Caption-ready, no decorative elements' },
]

export default function BrandPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [firm, setFirm] = useState({
    name: '', address: '', city: '', state: '', zipCode: '', phone: '', website: '', barNumber: '',
  })
  const [brand, setBrand] = useState({
    logoUrl: '', primaryColor: '#2563EB', secondaryColor: '#1E2535',
    tagline: '', letterheadStyle: 'classic', footerText: '',
    showBarNumber: true, showWebsite: true,
  })

  useEffect(() => {
    fetch('/api/brand').then(r => r.json()).then(data => {
      if (!data) return
      const s = (data.settings as any) || {}
      setFirm({ name: data.name || '', address: data.address || '', city: data.city || '', state: data.state || '', zipCode: data.zipCode || '', phone: data.phone || '', website: data.website || '', barNumber: data.barNumber || '' })
      setBrand({ logoUrl: s.logoUrl || '', primaryColor: s.primaryColor || '#2563EB', secondaryColor: s.secondaryColor || '#1E2535', tagline: s.tagline || '', letterheadStyle: s.letterheadStyle || 'classic', footerText: s.footerText || '', showBarNumber: s.showBarNumber ?? true, showWebsite: s.showWebsite ?? true })
      if (s.logoUrl) setLogoPreview(s.logoUrl)
    })
  }, [])

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    const fd = new FormData()
    fd.append('logo', file)
    const res = await fetch('/api/brand', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.logoUrl) setBrand(b => ({ ...b, logoUrl: data.logoUrl }))
    setUploading(false)
  }

  async function handleSave() {
    setLoading(true)
    await fetch('/api/brand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...firm, brandSettings: brand }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setLoading(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Firm Brand" description="Logo, letterhead, and document styling applied to all generated documents" actions={
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4 text-vault-success" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved' : 'Save Changes'}
        </Button>
      } />

      <div className="grid grid-cols-3 gap-6">
        {/* Left: settings */}
        <div className="col-span-2 space-y-5">

          {/* Logo */}
          <div className="vault-panel p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Upload className="h-4 w-4 text-vault-muted" />
              <h2 className="section-label">Firm Logo</h2>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-lg border border-vault-border bg-vault-elevated flex items-center justify-center overflow-hidden">
                {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" /> : <Building2 className="h-8 w-8 text-vault-muted" />}
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'Uploading...' : 'Upload Logo'}
                </Button>
                <p className="text-xs text-vault-muted">PNG or SVG recommended. Max 2MB.<br />Stored in GitHub repo, served via CDN.</p>
                <input ref={fileRef} type="file" accept="image/png,image/svg+xml,image/jpeg" className="hidden" onChange={handleLogoUpload} />
              </div>
            </div>
          </div>

          {/* Firm Info */}
          <div className="vault-panel p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-vault-muted" />
              <h2 className="section-label">Firm Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5"><Label>Firm Name</Label><Input value={firm.name} onChange={e => setFirm(f => ({ ...f, name: e.target.value }))} placeholder="Hartley & Associates LLP" /></div>
              <div className="col-span-2 space-y-1.5"><Label>Street Address</Label><Input value={firm.address} onChange={e => setFirm(f => ({ ...f, address: e.target.value }))} placeholder="350 Park Avenue, 21st Floor" /></div>
              <div className="space-y-1.5"><Label>City</Label><Input value={firm.city} onChange={e => setFirm(f => ({ ...f, city: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5"><Label>State</Label><Input value={firm.state} onChange={e => setFirm(f => ({ ...f, state: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>ZIP</Label><Input value={firm.zipCode} onChange={e => setFirm(f => ({ ...f, zipCode: e.target.value }))} /></div>
              </div>
              <div className="space-y-1.5"><Label>Phone</Label><Input value={firm.phone} onChange={e => setFirm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Website</Label><Input value={firm.website} onChange={e => setFirm(f => ({ ...f, website: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Bar Number / Registration</Label><Input value={firm.barNumber} onChange={e => setFirm(f => ({ ...f, barNumber: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Tagline</Label><Input value={brand.tagline} onChange={e => setBrand(b => ({ ...b, tagline: e.target.value }))} placeholder="Confidential. Privileged. Protected." /></div>
            </div>
          </div>

          {/* Letterhead Style */}
          <div className="vault-panel p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Layout className="h-4 w-4 text-vault-muted" />
              <h2 className="section-label">Letterhead Style</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {LETTERHEAD_STYLES.map(s => (
                <button key={s.value} onClick={() => setBrand(b => ({ ...b, letterheadStyle: s.value }))}
                  className={`text-left p-3 rounded-md border transition-colors ${brand.letterheadStyle === s.value ? 'border-vault-accent bg-vault-accent/10' : 'border-vault-border bg-vault-elevated hover:border-vault-border/80'}`}>
                  <p className="text-sm font-medium text-vault-text">{s.label}</p>
                  <p className="text-xs text-vault-muted mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label>Footer Text <span className="text-vault-muted text-xs ml-1">(appears on every page)</span></Label>
              <Input value={brand.footerText} onChange={e => setBrand(b => ({ ...b, footerText: e.target.value }))} placeholder="Confidential — Attorney-Client Privileged Communication" />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={brand.showBarNumber} onChange={e => setBrand(b => ({ ...b, showBarNumber: e.target.checked }))} className="rounded border-vault-border" />
                <span className="text-sm text-vault-text-secondary">Show bar number on documents</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={brand.showWebsite} onChange={e => setBrand(b => ({ ...b, showWebsite: e.target.checked }))} className="rounded border-vault-border" />
                <span className="text-sm text-vault-text-secondary">Show website on documents</span>
              </label>
            </div>
          </div>

          {/* Colors */}
          <div className="vault-panel p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Palette className="h-4 w-4 text-vault-muted" />
              <h2 className="section-label">Brand Colors</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Primary Color <span className="text-vault-muted text-xs">(headers, accents)</span></Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={brand.primaryColor} onChange={e => setBrand(b => ({ ...b, primaryColor: e.target.value }))} className="h-9 w-12 rounded border border-vault-border bg-vault-elevated cursor-pointer" />
                  <Input value={brand.primaryColor} onChange={e => setBrand(b => ({ ...b, primaryColor: e.target.value }))} className="font-mono" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Secondary Color <span className="text-vault-muted text-xs">(rules, borders)</span></Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={brand.secondaryColor} onChange={e => setBrand(b => ({ ...b, secondaryColor: e.target.value }))} className="h-9 w-12 rounded border border-vault-border bg-vault-elevated cursor-pointer" />
                  <Input value={brand.secondaryColor} onChange={e => setBrand(b => ({ ...b, secondaryColor: e.target.value }))} className="font-mono" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: live preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-vault-muted" />
            <h2 className="section-label">Live Preview</h2>
          </div>
          <div className="vault-panel p-4 sticky top-4">
            {/* Letterhead preview */}
            <div className="bg-white rounded shadow-sm overflow-hidden" style={{ aspectRatio: '8.5/11', fontSize: '7px' }}>
              {/* Header */}
              <div className="p-4" style={{ borderBottom: `2px solid ${brand.primaryColor}` }}>
                {brand.letterheadStyle === 'centered' ? (
                  <div className="text-center">
                    {logoPreview && <img src={logoPreview} alt="" className="h-8 mx-auto mb-1 object-contain" />}
                    <div style={{ color: brand.primaryColor, fontWeight: 700, fontSize: '10px' }}>{firm.name || 'Your Firm Name'}</div>
                    {brand.tagline && <div style={{ color: '#666', fontSize: '6px' }}>{brand.tagline}</div>}
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {logoPreview && <img src={logoPreview} alt="" className="h-8 object-contain" />}
                      <div>
                        <div style={{ color: brand.primaryColor, fontWeight: 700, fontSize: '9px' }}>{firm.name || 'Your Firm Name'}</div>
                        {brand.tagline && <div style={{ color: '#888', fontSize: '6px' }}>{brand.tagline}</div>}
                      </div>
                    </div>
                    <div className="text-right" style={{ color: '#555', lineHeight: 1.4 }}>
                      <div>{firm.address}</div>
                      <div>{firm.city}{firm.city && firm.state ? ', ' : ''}{firm.state} {firm.zipCode}</div>
                      <div>{firm.phone}</div>
                      {brand.showWebsite && <div>{firm.website}</div>}
                    </div>
                  </div>
                )}
              </div>
              {/* Body placeholder */}
              <div className="p-4 space-y-1.5">
                <div className="h-1 bg-gray-200 rounded w-1/3" />
                <div className="h-1 bg-gray-100 rounded w-full" />
                <div className="h-1 bg-gray-100 rounded w-full" />
                <div className="h-1 bg-gray-100 rounded w-4/5" />
                <div className="mt-3 h-1 bg-gray-100 rounded w-full" />
                <div className="h-1 bg-gray-100 rounded w-full" />
                <div className="h-1 bg-gray-100 rounded w-3/4" />
              </div>
              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-2 text-center" style={{ borderTop: `1px solid ${brand.secondaryColor}`, color: '#888' }}>
                {brand.footerText || 'Confidential — Attorney-Client Privileged'}
              </div>
            </div>
            <p className="text-xs text-vault-muted text-center mt-2">Applied to all generated documents</p>
          </div>
        </div>
      </div>
    </div>
  )
}
