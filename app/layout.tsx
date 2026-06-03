import type { Metadata } from 'next'
import NavBar from '../components/NavBar'
import AlertBanner from '../components/AlertBanner'
import './globals.css'

export const metadata: Metadata = {
  title: 'WF Prices — Warframe Arcane Tracker',
  description: 'Live Warframe arcane prices, flip calculator and trade history',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>
        <NavBar />
        <AlertBanner />
        {children}
      </body>
    </html>
  )
}
