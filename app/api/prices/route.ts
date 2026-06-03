export const runtime = 'edge'
import { NextRequest, NextResponse } from 'next/server'
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
async function fetchWithRetry(url: string, retries = 3, delayMs = 600): Promise<Response | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' } })
      if (res.status === 429) { await sleep(delayMs * (i + 1)); continue }
      return res
    } catch { if (i < retries - 1) await sleep(delayMs) }
  }
  return null
}
function processStats(entries: any[], rankMode: 'max' | 'min' = 'max') {
  if (!entries.length) return { price: null, min: null, max: null, entries: 0, history: [], change24h: null }
  const ranks = entries.map((e: any) => e.mod_rank ?? 0)
  const targetRank = rankMode === 'max' ? Math.max(...ranks) : Math.min(...ranks)
  const atRank = entries.filter((e: any) => (e.mod_rank ?? 0) === targetRank)
  if (!atRank.length) return { price: null, min: null, max: null, entries: 0, history: [], change24h: null }
  atRank.sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
  const history = atRank.map((e: any) => ({ t: e.datetime, v: e.median ?? e.avg_price ?? 0 })).filter((p: any) => p.v > 0)
  const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000
  const recent = atRank.filter((e: any) => new Date(e.datetime).getTime() >= fourHoursAgo)
  const pool = recent.length > 0 ? recent : atRank.slice(-3)
  const prices = pool.map((e: any) => e.median ?? e.avg_price).filter((p: any): p is number => p != null).sort((a: number, b: number) => a - b)
  if (!prices.length) return { price: null, min: null, max: null, entries: 0, history, change24h: null }
  const mid = Math.floor(prices.length / 2)
  const price = prices.length % 2 !== 0 ? prices[mid] : Math.round((prices[mid - 1] + prices[mid]) / 2)
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
  const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000
  const yesterday = atRank.filter((e: any) => { const t = new Date(e.datetime).getTime(); return t >= twoDaysAgo && t < oneDayAgo })
  let change24h: number | null = null
  if (yesterday.length) {
    const yp = yesterday.map((e: any) => e.median ?? e.avg_price).filter((p: any) => p).sort((a: number, b: number) => a - b)
    if (yp.length) { const ym = Math.floor(yp.length / 2); const yPrice = yp.length % 2 !== 0 ? yp[ym] : (yp[ym-1]+yp[ym])/2; change24h = Math.round(((price - yPrice) / yPrice) * 100) }
  }
  const volume48h = atRank.reduce((sum: number, e: any) => sum + (e.volume ?? 0), 0)
  return { price, min: prices[0], max: prices[prices.length - 1], entries: pool.length, history, change24h, volume: volume48h }
}
async function fetchSlug(slug: string, rankMode: 'max' | 'min'): Promise<any> {
  try {
    const res = await fetchWithRetry(`https://api.warframe.market/v1/items/${slug}/statistics`)
    if (!res || !res.ok) return { price: null }
    const data = await res.json()
    const live = processStats(data?.payload?.statistics_live?.['48hours'] ?? [], rankMode)
    if (live.price !== null) return live
    return processStats(data?.payload?.statistics_closed?.['90days'] ?? [], rankMode)
  } catch { return { price: null } }
}
export async function POST(req: NextRequest) {
  const { slugs, rankMode = 'max' } = await req.json()
  if (!slugs || !Array.isArray(slugs)) return NextResponse.json({ error: 'Invalid slugs' }, { status: 400 })
  const results: Record<string, any> = {}
  const BATCH = 3
  for (let i = 0; i < slugs.length; i += BATCH) {
    const batch = slugs.slice(i, i + BATCH)
    const batchResults = await Promise.all(batch.map(slug => fetchSlug(slug, rankMode as 'max' | 'min')))
    batch.forEach((slug, idx) => { results[slug] = batchResults[idx] })
    if (i + BATCH < slugs.length) await sleep(400)
  }
  return NextResponse.json({ prices: results })
}
