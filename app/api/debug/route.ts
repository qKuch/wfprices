import { NextResponse } from 'next/server'

export async function GET() {
  const slug = 'arcane_energize'
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Origin': 'https://warframe.market',
    'Referer': 'https://warframe.market/',
    'Platform': 'pc',
    'Language': 'en',
  }

  try {
    const res = await fetch(`https://api.warframe.market/v1/items/${slug}/orders`, {
      headers,
      cache: 'no-store',
    })
    const status = res.status
    const text = await res.text()
    let parsed: any = null
    try { parsed = JSON.parse(text) } catch {}

    const orders = parsed?.payload?.orders ?? []
    const sells = orders.filter((o: any) => o.order_type === 'sell' && o.mod_rank === 5)
    const sample = sells.slice(0, 3).map((o: any) => ({
      price: o.platinum,
      rank: o.mod_rank,
      status: o.user?.status,
    }))

    return NextResponse.json({
      http_status: status,
      total_orders: orders.length,
      sell_rank5: sells.length,
      sample,
      raw_preview: text.slice(0, 300),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
