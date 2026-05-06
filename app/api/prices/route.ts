export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'

function getBestPrice(entries: any[]): { price: number; min: number; max: number; entries: number } | null {
  if (!entries.length) return null
  const maxRank = Math.max(...entries.map((e: any) => e.mod_rank ?? 0))
  const atMax = entries.filter((e: any) => (e.mod_rank ?? 0) === maxRank)
  if (!atMax.length) return null

  atMax.sort((a: any, b: any) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
  const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000
  let pool = atMax.filter((e: any) => new Date(e.datetime).getTime() >= fourHoursAgo)
  if (!pool.length) pool = atMax.slice(0, 3)

  const prices = pool
    .map((e: any) => e.median ?? e.avg_price)
    .filter((p: any): p is number => p !== null && p !== undefined)
    .sort((a: number, b: number) => a - b)

  if (!prices.length) return null
  const mid = Math.floor(prices.length / 2)
  const median = prices.length % 2 !== 0
    ? prices[mid]
    : Math.round((prices[mid - 1] + prices[mid]) / 2)

  return { price: median, min: prices[0], max: prices[prices.length - 1], entries: pool.length }
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
        results[slug] = getBestPrice(live48h) ?? getBestPrice(closed90d) ?? { price: null }
      } catch {
        results[slug] = { price: null }
      }
    })
  )

  return NextResponse.json({ prices: results })
}
