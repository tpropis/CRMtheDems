import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Privilege Vault AI',
    template: '%s | Privilege Vault AI',
  },
  description: 'Private AI platform for privileged legal work. Built for law firms that demand security, precision, and control.',
  robots: 'noindex, nofollow',
}

export const viewport: Viewport = {
  themeColor: '#080B12',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-vault-bg text-vault-text">
        {children}
      </body>
    </html>
  )
}
