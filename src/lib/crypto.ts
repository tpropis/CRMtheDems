// AES-256-GCM encryption for storing OAuth tokens at rest
import crypto from 'crypto'

const ALGO = 'aes-256-gcm'
const KEY_LEN = 32

function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-insecure-key-change-in-production'
  // Derive a 32-byte key from whatever secret we have
  return crypto.createHash('sha256').update(secret).digest()
}

export function encrypt(plaintext: string): string {
  const key = getKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGO, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  // Format: iv(12):tag(16):ciphertext — all hex
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(ciphertext: string): string {
  const key = getKey()
  const parts = ciphertext.split(':')
  if (parts.length !== 3) throw new Error('Invalid ciphertext format')
  const [ivHex, tagHex, encHex] = parts
  const iv = Buffer.from(ivHex, 'hex')
  const tag = Buffer.from(tagHex, 'hex')
  const encrypted = Buffer.from(encHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGO, key, iv)
  decipher.setAuthTag(tag)
  return decipher.update(encrypted).toString('utf8') + decipher.final('utf8')
}
