import type { Metadata } from 'next'
import NavBar from '../components/NavBar'

export const metadata: Metadata = {
  title: 'WF Prices — Warframe Arcane Tracker',
  description: 'Live Warframe arcane prices, flip calculator and trade history',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body style={{ margin: 0, padding: 0, background: '#0d0d0f', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
