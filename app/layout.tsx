import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'WF Prices — Warframe Arcane Tracker',
  description: 'Live Warframe arcane prices, flip calculator and trade history',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body style={{ margin: 0, padding: 0, background: '#0d0d0f', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <nav style={{ borderBottom: '1px solid #1e1e22', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: 0, height: 48, position: 'sticky', top: 0, background: '#0d0d0f', zIndex: 100 }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: 15, color: '#fff', textDecoration: 'none', marginRight: 24, letterSpacing: '-0.3px' }}>
            ⚡ WFPrices
          </Link>
          {[
            { href: '/tracker', label: 'Prețuri' },
            { href: '/history', label: 'Istoric' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{ fontSize: 13, color: '#888', textDecoration: 'none', padding: '0 14px', height: 48, display: 'flex', alignItems: 'center', borderBottom: '2px solid transparent', transition: 'color 0.15s' }}
              onMouseOver={e => (e.currentTarget.style.color = '#fff')}
              onMouseOut={e => (e.currentTarget.style.color = '#888')}
            >{label}</Link>
          ))}
        </nav>
        {children}
      </body>
    </html>
  )
}
