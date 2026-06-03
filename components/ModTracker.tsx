'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { MODS, MOD_CATEGORIES, type Mod } from '../lib/mods'

interface PriceData {
  price: number | null
  change24h?: number | null
  volume?: number
  history?: { t: string; v: number }[]
}

const RARITY_STYLE: Record<string, { bg: string; color: string }> = {
  Legendary: { bg: '#1e1a3a', color: '#b8a9f0' },
  Rare:      { bg: '#2a1a0a', color: '#f0a050' },
  Uncommon:  { bg: '#1a2a1a', color: '#80c080' },
  Common:    { bg: '#1a1a1a', color: '#888888' },
}

const CAT_STYLE: Record<string, { bg: string; color: string }> = {
  Warframe:  { bg: '#1a2a3a', color: '#5ab4ee' },
  Primary:   { bg: '#2a1a1a', color: '#ee5a5a' },
  Secondary: { bg: '#2a1a2a', color: '#cc7aee' },
  Melee:     { bg: '#2a2a1a', color: '#eec05a' },
  Companion: { bg: '#1a2a2a', color: '#5aeec0' },
  Archwing:  { bg: '#1a1a2a', color: '#5a7aee' },
  Corrupted: { bg: '#2a1a1a', color: '#ee6060' },
  Nightmare: { bg: '#1a0a1a', color: '#c060c0' },
  Aura:      { bg: '#0a1a0a', color: '#60c060' },
  Stance:    { bg: '#2a1a0a', color: '#e09040' },
}

function Sparkline({ data }: { data: { t: string; v: number }[] }) {
  if (data.length < 2) return null
  const vals = data.map(d => d.v)
  const min = Math.min(...vals), max = Math.max(...vals)
  const range = max - min || 1
  const w = 80, h = 28
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - ((v - min) / range) * h}`)
  const trend = vals[vals.length - 1] >= vals[0]
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polyline points={pts.join(' ')} fill="none" stroke={trend ? '#4caf50' : '#e55'} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  )
}

function SkeletonCard() {
  return (
    <div style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ height: 13, width: '65%', background: '#222', borderRadius: 6, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: 10, width: '35%', background: '#1e1e1e', borderRadius: 4, marginBottom: 12 }} />
      <div style={{ height: 24, width: '50%', background: '#1a1a1a', borderRadius: 6 }} />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  )
}

function ModCard({ mod, pd, loading }: { mod: Mod; pd: PriceData; loading: boolean }) {
  const [qty, setQty] = useState('')
  const qtyN = parseInt(qty) || 0
  const profit = pd.price && qtyN > 0 ? Math.round(qtyN * pd.price * 0.9) : null
  const change = pd.change24h ?? null
  const trendColor = change == null ? '#555' : change > 2 ? '#4caf50' : change < -2 ? '#e55' : '#888'
  const trendIcon = change == null ? '' : change > 2 ? '↑' : change < -2 ? '↓' : '→'
  const volColor = pd.volume != null ? (pd.volume >= 10 ? '#4caf50' : pd.volume >= 3 ? '#666' : '#e55') : '#444'
  const rs = RARITY_STYLE[mod.rarity ?? ''] ?? RARITY_STYLE['Common']
  const cs = CAT_STYLE[mod.category] ?? { bg: '#1a1a1a', color: '#888' }

  return (
    <div style={{
      background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 12,
      padding: '14px 16px', transition: 'border-color 0.15s', display: 'flex', flexDirection: 'column', gap: 6,
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#3a3a4e')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2e')}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{mod.name}</div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: cs.bg, color: cs.color }}>{mod.category}</span>
        {mod.rarity && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: rs.bg, color: rs.color }}>{mod.rarity}</span>}
        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: '#1a1a1a', color: '#555' }}>R{mod.maxRank}</span>
      </div>

      {pd.history && pd.history.length >= 2 && (
        <div style={{ marginTop: 2 }}><Sparkline data={pd.history} /></div>
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
        <div>
          <div style={{ fontSize: 11, color: '#555', marginBottom: 1 }}>Preț median (4h)</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
            {loading && pd.price == null
              ? <span style={{ fontSize: 14, color: '#444' }}>...</span>
              : pd.price != null
                ? <>{pd.price} <span style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>pt</span></>
                : <span style={{ fontSize: 14, color: '#444' }}>—</span>
            }
          </div>
        </div>
        {trendIcon && change != null && (
          <div style={{ fontSize: 12, color: trendColor, fontWeight: 600 }}>
            {trendIcon} {Math.abs(change as number)}%
          </div>
        )}
      </div>

      {pd.volume != null && (
        <div style={{ fontSize: 11, color: volColor }}>● {pd.volume} tranzacții/48h</div>
      )}

      {/* Mini flip calc */}
      {pd.price != null && (
        <div style={{ borderTop: '1px solid #222', paddingTop: 8, marginTop: 2 }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#555' }}>Qty:</span>
            <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="0"
              style={{ width: 52, padding: '3px 7px', borderRadius: 6, border: '1px solid #2a2a2e', background: '#0d0d0f', color: '#fff', fontSize: 12, outline: 'none' }} />
            {profit != null && profit > 0 && (
              <span style={{ fontSize: 12, color: '#4caf50', fontWeight: 600 }}>
                → {profit} pt <span style={{ fontSize: 10, color: '#555', fontWeight: 400 }}>(−10%)</span>
              </span>
            )}
          </div>
        </div>
      )}

      <a href={`https://warframe.market/items/${mod.slug}`} target="_blank" rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        style={{ fontSize: 11, color: '#5a8dee', textDecoration: 'none', opacity: 0.7, marginTop: 2 }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
      >↗ warframe.market</a>
    </div>
  )
}

export default function ModTracker() {
  const searchParams = useSearchParams()
  const [prices, setPrices] = useState<Record<string, PriceData>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '')
  const [category, setCategory] = useState<string>('all')
  const [sort, setSort] = useState<string>('price-desc')
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/mod-prices')
      .then(r => r.json())
      .then(data => {
        const mapped: Record<string, PriceData> = {}
        Object.entries(data).forEach(([slug, d]: [string, any]) => {
          mapped[slug] = { price: d.price ?? null, change24h: d.change24h ?? null, volume: d.volume, history: d.history }
        })
        setPrices(mapped)
        setUpdatedAt(new Date())
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = [...MODS]
    // deduplicate by slug+category
    const seen = new Set<string>()
    list = list.filter(m => {
      const key = `${m.slug}-${m.category}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    if (category !== 'all') list = list.filter(m => m.category === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q))
    }
    list.sort((a, b) => {
      const pa = prices[a.slug]?.price ?? null
      const pb = prices[b.slug]?.price ?? null
      if (sort === 'price-desc') return (pb ?? -1) - (pa ?? -1)
      if (sort === 'price-asc') return (pa ?? 99999) - (pb ?? 99999)
      if (sort === 'change-desc') return ((prices[b.slug]?.change24h ?? -999)) - ((prices[a.slug]?.change24h ?? -999))
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'category') return a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
      return 0
    })
    return list
  }, [prices, category, search, sort])

  const validCount = Object.values(prices).filter(p => p.price != null).length

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>Mod Tracker</h1>
        <div style={{ fontSize: 13, color: '#555' }}>
          {loading
            ? 'Se încarcă prețurile...'
            : updatedAt
              ? `Actualizat: ${updatedAt.toLocaleTimeString('ro-RO')} · ${validCount}/${MODS.length} prețuri`
              : ''}
        </div>
      </div>

      {/* Progress bar */}
      {loading && (
        <div style={{ height: 3, background: '#222', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '60%', background: '#5a8dee', borderRadius: 2, animation: 'indeterminate 1.5s ease-in-out infinite' }} />
          <style>{`@keyframes indeterminate{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}`}</style>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Caută mod..."
          style={{ flex: '1 1 180px', padding: '8px 14px', borderRadius: 10, border: '1px solid #2a2a2e', background: '#16161a', color: '#fff', fontSize: 13, outline: 'none' }} />
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #2a2a2e', background: '#16161a', color: '#ccc', fontSize: 13, cursor: 'pointer', outline: 'none' }}>
          <option value="price-desc">Preț ↓</option>
          <option value="price-asc">Preț ↑</option>
          <option value="change-desc">Trend 24h ↓</option>
          <option value="name">Nume</option>
          <option value="category">Categorie</option>
        </select>
      </div>

      {/* Category filters */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: '#444', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Categorie</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => setCategory('all')}
            style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, border: category === 'all' ? '1px solid #5a8dee' : '1px solid #333', background: category === 'all' ? '#1a2a44' : 'transparent', color: category === 'all' ? '#5a8dee' : '#888', cursor: 'pointer' }}>
            Toate
          </button>
          {MOD_CATEGORIES.map(cat => {
            const cs = CAT_STYLE[cat] ?? { bg: '#1a1a1a', color: '#888' }
            const active = category === cat
            return (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, border: active ? `1px solid ${cs.color}` : '1px solid #333', background: active ? cs.bg : 'transparent', color: active ? cs.color : '#888', cursor: 'pointer' }}>
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Count */}
      <div style={{ fontSize: 12, color: '#444', marginBottom: 12 }}>{filtered.length} moduri</div>

      {/* Grid */}
      {loading && validCount === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#555', fontSize: 14 }}>
          Niciun mod găsit{search ? ` pentru „${search}"` : ''}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
          {filtered.map(mod => (
            <ModCard key={`${mod.slug}-${mod.category}`} mod={mod} pd={prices[mod.slug] ?? { price: null }} loading={loading} />
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, fontSize: 11, color: '#444', textAlign: 'center' }}>
        Sursa: warframe.market statistics · Media 4h la Rank maxim · ↑↓ variație față de 24h
      </div>
    </div>
  )
}
