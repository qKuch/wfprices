import PersonalHistory from '../../components/PersonalHistory'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Istoric — WF Prices',
  description: 'Istoricul personal de tranzacții cu arcane Warframe',
}

export default function HistoryPage() { return <PersonalHistory /> }
