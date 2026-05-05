import { NextRequest, NextResponse } from 'next/server'

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
          const res = await fetch(
            `https://api.warframe.market/v1/items/${slug}/orders`,
            {
              headers: {
                'Platform': 'pc',
                'Language': 'en',
                'Accept': 'application/json',
              },
              cache: 'no-store',
            }
          )

          if (!res.ok) {
            results[slug] = null
            return
          }

          const data = await res.json()
          const orders: any[] = data?.payload?.orders ?? []

          const sellOrders = orders.filter(
            (o) => o.order_type === 'sell' && o.mod_rank === 5
          )

          if (sellOrders.length === 0) {
            results[slug] = null
            return
          }

          const onlineOrders = sellOrders.filter(
            (o) => o.user?.status === 'ingame' || o.user?.status === 'online'
          )

          const pool = onlineOrders.length > 0 ? onlineOrders : sellOrders
          pool.sort((a: any, b: any) => a.platinum - b.platinum)
          results[slug] = pool[0].platinum
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
