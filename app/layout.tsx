import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Warframe Arcane Prices',
  description: 'Live arcane prices from warframe.market',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body style={{ margin: 0, padding: 0, background: '#0d0d0f', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
