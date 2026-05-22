export const runtime = 'edge'
import { NextResponse } from 'next/server'

const TOP_SLUGS = [
  'arcane_energize','arcane_grace','arcane_barrier',
  'arcane_avenger','arcane_fury','arcane_guardian',
  'arcane_velocity','arcane_acceleration','molt_augmented',
  'arcane_aegis','cascadia_empower','melee_influence',
]

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function fetchStats(slug: string) {
  try {
    const res = await fetch(`https://api.warframe.market/v1/items/${slug}/statistics`, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    })
    if (!res.ok) return null
    const data = await res.json()
    const live: any[] = data?.payload?.statistics_live?.['48hours'] ?? []
    if (!live.length) return null

    const maxRank = Math.max(...live.map((e: any) => e.mod_rank ?? 0))
    const atMax = live.filter((e: any) => (e.mod_rank ?? 0) === maxRank)
    atMax.sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

    const recent = atMax.slice(-4)
    const prices = recent.map((e: any) => e.median ?? e.avg_price).filter(Boolean).sort((a: number, b: number) => a - b)
    if (!prices.length) return null
    const mid = Math.floor(prices.length / 2)
    const price = prices.length % 2 !== 0 ? prices[mid] : Math.round((prices[mid-1]+prices[mid])/2)

    const yesterday = atMax.filter((e: any) => {
      const t = new Date(e.datetime).getTime()
      return t >= Date.now() - 48*3600000 && t < Date.now() - 24*3600000
    })
    let change24h = null
    if (yesterday.length) {
      const yp = yesterday.map((e: any) => e.median ?? e.avg_price).filter(Boolean)
      if (yp.length) {
        const yPrice = yp.reduce((a: number, b: number) => a + b, 0) / yp.length
        change24h = Math.round(((price - yPrice) / yPrice) * 100)
      }
    }
    const volume = atMax.slice(-6).reduce((sum: number, e: any) => sum + (e.volume ?? 0), 0)
    return { slug, price, change24h, volume }
  } catch { return null }
}

export async function GET() {
  const results = []
  for (let i = 0; i < TOP_SLUGS.length; i += 3) {
    const batch = TOP_SLUGS.slice(i, i + 3)
    const res = await Promise.all(batch.map(fetchStats))
    results.push(...res.filter(Boolean))
    if (i + 3 < TOP_SLUGS.length) await sleep(300)
  }

  const valid = results.filter((r): r is NonNullable<typeof r> => r !== null && r.price !== null)
  const mostExpensive = [...valid].sort((a, b) => b.price - a.price).slice(0, 5)
  const topGainers = [...valid].filter(r => r.change24h !== null).sort((a, b) => (b.change24h ?? 0) - (a.change24h ?? 0)).slice(0, 5)
  const topLosers = [...valid].filter(r => r.change24h !== null).sort((a, b) => (a.change24h ?? 0) - (b.change24h ?? 0)).slice(0, 3)
  const avgPrice = valid.length ? Math.round(valid.reduce((s, r) => s + r.price, 0) / valid.length) : 0

  return NextResponse.json({ mostExpensive, topGainers, topLosers, avgPrice, tracked: valid.length })
}
