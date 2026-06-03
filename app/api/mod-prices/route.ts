export const runtime = 'edge'
import { NextResponse } from 'next/server'
import { MODS } from '../../../lib/mods'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function fetchModPrice(slug: string, maxRank: number) {
  try {
    const res = await fetch(`https://api.warframe.market/v1/items/${slug}/statistics`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })
    if (!res.ok) return null
    const data = await res.json()
    const live: any[] = data?.payload?.statistics_live?.['48hours'] ?? []
    if (!live.length) return null

    // filter by max rank
    const atMax = live.filter((e: any) => (e.mod_rank ?? 0) === maxRank)
    const entries = atMax.length ? atMax : live
    entries.sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

    const recent = entries.slice(-4)
    const prices = recent.map((e: any) => e.median ?? e.avg_price).filter(Boolean).sort((a: number, b: number) => a - b)
    if (!prices.length) return null
    const mid = Math.floor(prices.length / 2)
    const price = prices.length % 2 !== 0 ? prices[mid] : Math.round((prices[mid - 1] + prices[mid]) / 2)

    const yesterday = entries.filter((e: any) => {
      const t = new Date(e.datetime).getTime()
      return t >= Date.now() - 48 * 3600000 && t < Date.now() - 24 * 3600000
    })
    let change24h = null
    if (yesterday.length) {
      const yp = yesterday.map((e: any) => e.median ?? e.avg_price).filter(Boolean)
      if (yp.length) {
        const yPrice = yp.reduce((a: number, b: number) => a + b, 0) / yp.length
        change24h = Math.round(((price - yPrice) / yPrice) * 100)
      }
    }
    const volume = entries.slice(-6).reduce((sum: number, e: any) => sum + (e.volume ?? 0), 0)
    const history = entries.slice(-12).map((e: any) => ({ t: e.datetime, v: e.median ?? e.avg_price ?? 0 }))

    return { slug, price, change24h, volume, history }
  } catch { return null }
}

export async function GET() {
  const results: Record<string, any> = {}
  const slugs = Array.from(new Set(MODS.map(m => m.slug)))
  const maxRankMap = Object.fromEntries(MODS.map(m => [m.slug, m.maxRank]))

  for (let i = 0; i < slugs.length; i += 4) {
    const batch = slugs.slice(i, i + 4)
    const res = await Promise.all(batch.map(slug => fetchModPrice(slug, maxRankMap[slug] ?? 0)))
    res.forEach((r, j) => { if (r) results[batch[j]] = r })
    if (i + 4 < slugs.length) await sleep(300)
  }

  return NextResponse.json(results)
}
