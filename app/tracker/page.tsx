import { Suspense } from 'react'
import PriceTracker from '../../components/PriceTracker'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tracker — WF Prices',
  description: 'Prețuri live pentru arcanele Warframe, actualizate la fiecare 4 ore',
}

export default function TrackerPage() {
  return (
    <Suspense fallback={<div style={{padding:'2rem',color:'#555',textAlign:'center'}}>Se încarcă...</div>}>
      <PriceTracker />
    </Suspense>
  )
}
