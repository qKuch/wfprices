export const runtime = 'edge'
import { NextRequest, NextResponse } from 'next/server'
import { MODS } from '../../../lib/mods'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function fetchModPrice(slug: string, maxRank: number, rankMode: 'max' | 'min') {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://api.warframe.market/v1/items/${slug}/statistics`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
      })
      if (res.status === 429) { await sleep(800 * (attempt + 1)); continue }
      if (!res.ok) return null
      const data = await res.json()
      const live: any[] = data?.payload?.statistics_live?.['48hours'] ?? []
      if (!live.length) {
        // fallback to closed stats
        const closed: any[] = data?.payload?.statistics_closed?.['90days'] ?? []
        if (!closed.length) return null
        return processEntries(closed, slug, maxRank, rankMode)
      }
      return processEntries(live, slug, maxRank, rankMode)
    } catch {
      if (attempt < 2) await sleep(400)
    }
  }
  return null
}

function processEntries(entries: any[], slug: string, maxRank: number, rankMode: 'max' | 'min') {
  const targetRank = rankMode === 'max' ? maxRank : 0
  const atRank = entries.filter((e: any) => (e.mod_rank ?? 0) === targetRank)
  const pool = atRank.length ? atRank : entries
  pool.sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

  const recent = pool.slice(-4)
  const prices = recent.map((e: any) => e.median ?? e.avg_price).filter(Boolean).sort((a: number, b: number) => a - b)
  if (!prices.length) return null
  const mid = Math.floor(prices.length / 2)
  const price = prices.length % 2 !== 0 ? prices[mid] : Math.round((prices[mid - 1] + prices[mid]) / 2)

  const yesterday = pool.filter((e: any) => {
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
  const volume = pool.slice(-6).reduce((sum: number, e: any) => sum + (e.volume ?? 0), 0)
  const history = pool.slice(-12).map((e: any) => ({ t: e.datetime, v: e.median ?? e.avg_price ?? 0 }))

  return { slug, price, change24h, volume, history }
}

export async function POST(req: NextRequest) {
  const { slugs, rankMode = 'max' } = await req.json()
  if (!slugs || !Array.isArray(slugs)) return NextResponse.json({ error: 'Invalid slugs' }, { status: 400 })

  const maxRankMap = Object.fromEntries(MODS.map(m => [m.slug, m.maxRank]))
  const results: Record<string, any> = {}

  // Sequential within a batch to avoid rate limiting
  for (const slug of slugs) {
    const r = await fetchModPrice(slug, maxRankMap[slug] ?? 0, rankMode as 'max' | 'min')
    if (r) results[slug] = r
    await sleep(200)
  }

  return NextResponse.json({ prices: results })
}
