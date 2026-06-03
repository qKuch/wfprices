import { Suspense } from 'react'
import ModTracker from '../../components/ModTracker'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mods — WF Prices',
  description: 'Prețuri live pentru modurile Warframe valoroase',
}

export default function ModsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', color: '#555', textAlign: 'center' }}>Se încarcă...</div>}>
      <ModTracker />
    </Suspense>
  )
}
