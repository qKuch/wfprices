export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'

function processStats(entries: any[]): {
  price: number | null
  min: number | null
  max: number | null
  entries: number
  history: { t: string; v: number }[]
  change24h: number | null
} {
  if (!entries.length) return { price: null, min: null, max: null, entries: 0, history: [], change24h: null }

  const maxRank = Math.max(...entries.map((e: any) => e.mod_rank ?? 0))
  const atMax = entries.filter((e: any) => (e.mod_rank ?? 0) === maxRank)
  if (!atMax.length) return { price: null, min: null, max: null, entries: 0, history: [], change24h: null }

  atMax.sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

  // Full history for chart (all points at max rank)
  const history = atMax.map((e: any) => ({
    t: e.datetime,
    v: e.median ?? e.avg_price ?? 0,
  })).filter((p: any) => p.v > 0)

  // Current price = median of last 4h
  const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000
  const recent = atMax.filter((e: any) => new Date(e.datetime).getTime() >= fourHoursAgo)
  const pool = recent.length > 0 ? recent : atMax.slice(-3)

  const prices = pool
    .map((e: any) => e.median ?? e.avg_price)
    .filter((p: any): p is number => p !== null && p !== undefined)
    .sort((a: number, b: number) => a - b)

  if (!prices.length) return { price: null, min: null, max: null, entries: 0, history, change24h: null }

  const mid = Math.floor(prices.length / 2)
  const price = prices.length % 2 !== 0 ? prices[mid] : Math.round((prices[mid - 1] + prices[mid]) / 2)

  // 24h ago price
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
  const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000
  const yesterday = atMax.filter((e: any) => {
    const t = new Date(e.datetime).getTime()
    return t >= twoDaysAgo && t < oneDayAgo
  })
  let change24h: number | null = null
  if (yesterday.length > 0) {
    const yPrices = yesterday.map((e: any) => e.median ?? e.avg_price).filter((p: any) => p)
    if (yPrices.length) {
      const yMid = Math.floor(yPrices.length / 2)
      const yPrice = yPrices.length % 2 !== 0 ? yPrices[yMid] : (yPrices[yMid - 1] + yPrices[yMid]) / 2
      change24h = Math.round(((price - yPrice) / yPrice) * 100)
    }
  }

  return {
    price,
    min: prices[0],
    max: prices[prices.length - 1],
    entries: pool.length,
    history,
    change24h,
  }
}

export async function POST(req: NextRequest) {
  const { slugs } = await req.json()
  if (!slugs || !Array.isArray(slugs)) {
    return NextResponse.json({ error: 'Invalid slugs' }, { status: 400 })
  }

  const results: Record<string, any> = {}

  await Promise.all(
    slugs.map(async (slug: string) => {
      try {
        const res = await fetch(`https://api.warframe.market/v1/items/${slug}/statistics`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          },
        })
        if (!res.ok) { results[slug] = { price: null }; return }
        const data = await res.json()
        const live48h: any[] = data?.payload?.statistics_live?.['48hours'] ?? []
        const closed90d: any[] = data?.payload?.statistics_closed?.['90days'] ?? []
        const fromLive = processStats(live48h)
        if (fromLive.price !== null) { results[slug] = fromLive; return }
        results[slug] = processStats(closed90d)
      } catch {
        results[slug] = { price: null }
      }
    })
  )

  return NextResponse.json({ prices: results })
}
