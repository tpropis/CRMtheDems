import { MarketingNav } from '@/components/marketing/Nav'
import { MarketingFooter } from '@/components/marketing/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-vault-ink text-vault-text">
      <MarketingNav />
      <main className="relative">{children}</main>
      <MarketingFooter />
    </div>
  )
}
