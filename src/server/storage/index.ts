// Storage abstraction — swap provider without touching feature code
// Current: local/public folder (served via Netlify CDN from GitHub)
// Future:  swap STORAGE_PROVIDER=supabase or s3 in env

export interface StorageProvider {
  upload(key: string, buffer: Buffer, mimeType: string): Promise<string>
  getUrl(key: string): string
  delete(key: string): Promise<void>
}

// ── Local provider (files in public/brand, committed to GitHub) ────────────
class LocalStorageProvider implements StorageProvider {
  async upload(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    const fs = await import('fs/promises')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'public', key)
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, buffer)
    return `/${key}`
  }
  getUrl(key: string): string {
    return `/${key}`
  }
  async delete(key: string): Promise<void> {
    const fs = await import('fs/promises')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'public', key)
    await fs.unlink(filePath).catch(() => {})
  }
}

// ── Supabase Storage provider (swap in when needed) ────────────────────────
class SupabaseStorageProvider implements StorageProvider {
  async upload(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    // TODO: implement when STORAGE_PROVIDER=supabase
    // const { createClient } = await import('@supabase/supabase-js')
    // const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    // await supabase.storage.from('brand').upload(key, buffer, { contentType: mimeType, upsert: true })
    // return supabase.storage.from('brand').getPublicUrl(key).data.publicUrl
    throw new Error('Supabase storage not yet configured')
  }
  getUrl(key: string): string {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/brand/${key}`
  }
  async delete(key: string): Promise<void> {
    throw new Error('Supabase storage not yet configured')
  }
}

export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER || 'local'
  if (provider === 'supabase') return new SupabaseStorageProvider()
  return new LocalStorageProvider()
}
