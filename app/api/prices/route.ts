import { NextRequest, NextResponse } from 'next/server'

const HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Origin': 'https://warframe.market',
  'Referer': 'https://warframe.market/',
  'Platform': 'pc',
  'Language': 'en',
}

async function getPriceFromOrders(slug: string): Promise<number | null> {
  const res = await fetch(
    `https://api.warframe.market/v1/items/${slug}/orders`,
    { headers: HEADERS, cache: 'no-store' }
  )
  if (!res.ok) return null

  const data = await res.json()
  const orders: any[] = data?.payload?.orders ?? []

  // sell orders at max rank (5), or any sell order if no rank info
  const sells = orders.filter((o) => {
    if (o.order_type !== 'sell') return false
    if (o.mod_rank === undefined || o.mod_rank === null) return true
    return o.mod_rank === 5
  })

  if (!sells.length) return null

  const online = sells.filter(
    (o) => o.user?.status === 'ingame' || o.user?.status === 'online'
  )
  const pool = online.length > 0 ? online : sells
  pool.sort((a: any, b: any) => a.platinum - b.platinum)
  return pool[0].platinum
}

async function getPriceFromStatistics(slug: string): Promise<number | null> {
  const res = await fetch(
    `https://api.warframe.market/v1/items/${slug}/statistics`,
    { headers: HEADERS, cache: 'no-store' }
  )
  if (!res.ok) return null

  const data = await res.json()
  // live stats → last 48h median
  const live: any[] = data?.payload?.statistics_live?.['48hours'] ?? []
  if (!live.length) {
    // fallback: last 90 days closed
    const closed: any[] = data?.payload?.statistics_closed?.['90days'] ?? []
    if (!closed.length) return null
    const last = closed[closed.length - 1]
    return last?.median ?? last?.avg_price ?? null
  }
  const last = live[live.length - 1]
  return last?.median ?? last?.avg_price ?? null
}

export async function POST(req: NextRequest) {
  try {
    const { slugs } = await req.json()
    if (!slugs || !Array.isArray(slugs)) {
      return NextResponse.json({ error: 'Invalid slugs' }, { status: 400 })
    }

    const results: Record<string, number | null> = {}

    await Promise.all(
      slugs.map(async (slug: string) => {
        try {
          // Try live orders first, fall back to statistics
          let price = await getPriceFromOrders(slug)
          if (price === null) {
            price = await getPriceFromStatistics(slug)
          }
          results[slug] = price
        } catch {
          results[slug] = null
        }
      })
    )

    return NextResponse.json({ prices: results })
  } catch (err: any) {
    console.error('Price fetch error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
