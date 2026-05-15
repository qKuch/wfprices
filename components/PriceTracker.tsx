'use client'

import { useState, useEffect, useCallback } from 'react'

const ARCANES = [
  { name: 'Arcane Energize',     slug: 'arcane_energize',     tier: 'Legendary', motes: 30 },
  { name: 'Arcane Grace',        slug: 'arcane_grace',        tier: 'Legendary', motes: 30 },
  { name: 'Arcane Barrier',      slug: 'arcane_barrier',      tier: 'Legendary', motes: 30 },
  { name: 'Arcane Aegis',        slug: 'arcane_aegis',        tier: 'Rare',      motes: 6  },
  { name: 'Arcane Arachne',      slug: 'arcane_arachne',      tier: 'Rare',      motes: 6  },
  { name: 'Arcane Avenger',      slug: 'arcane_avenger',      tier: 'Rare',      motes: 6  },
  { name: 'Arcane Fury',         slug: 'arcane_fury',         tier: 'Rare',      motes: 6  },
  { name: 'Arcane Precision',    slug: 'arcane_precision',    tier: 'Rare',      motes: 6  },
  { name: 'Arcane Pulse',        slug: 'arcane_pulse',        tier: 'Rare',      motes: 6  },
  { name: 'Arcane Rage',         slug: 'arcane_rage',         tier: 'Rare',      motes: 6  },
  { name: 'Arcane Ultimatum',    slug: 'arcane_ultimatum',    tier: 'Rare',      motes: 6  },
  { name: 'Arcane Victory',      slug: 'arcane_victory',      tier: 'Uncommon',  motes: 4  },
  { name: 'Arcane Strike',       slug: 'arcane_strike',       tier: 'Uncommon',  motes: 4  },
  { name: 'Arcane Awakening',    slug: 'arcane_awakening',    tier: 'Uncommon',  motes: 4  },
  { name: 'Arcane Guardian',     slug: 'arcane_guardian',     tier: 'Uncommon',  motes: 4  },
  { name: 'Arcane Phantasm',     slug: 'arcane_phantasm',     tier: 'Uncommon',  motes: 4  },
  { name: 'Arcane Eruption',     slug: 'arcane_eruption',     tier: 'Uncommon',  motes: 4  },
  { name: 'Arcane Agility',      slug: 'arcane_agility',      tier: 'Uncommon',  motes: 4  },
  { name: 'Arcane Acceleration', slug: 'arcane_acceleration', tier: 'Uncommon',  motes: 4  },
  { name: 'Arcane Trickery',     slug: 'arcane_trickery',     tier: 'Uncommon',  motes: 4  },
  { name: 'Arcane Velocity',     slug: 'arcane_velocity',     tier: 'Uncommon',  motes: 4  },
  { name: 'Arcane Deflection',   slug: 'arcane_deflection',   tier: 'Uncommon',  motes: 2  },
  { name: 'Arcane Healing',      slug: 'arcane_healing',      tier: 'Uncommon',  motes: 2  },
  { name: 'Arcane Resistance',   slug: 'arcane_resistance',   tier: 'Uncommon',  motes: 2  },
  { name: 'Arcane Nullifier',    slug: 'arcane_nullifier',    tier: 'Common',    motes: 2  },
  { name: 'Arcane Warmth',       slug: 'arcane_warmth',       tier: 'Common',    motes: 2  },
  { name: 'Arcane Ice',          slug: 'arcane_ice',          tier: 'Common',    motes: 2  },
  { name: 'Arcane Momentum',     slug: 'arcane_momentum',     tier: 'Common',    motes: 2  },
  { name: 'Arcane Tempo',        slug: 'arcane_tempo',        tier: 'Common',    motes: 2  },
  { name: 'Arcane Consequence',  slug: 'arcane_consequence',  tier: 'Common',    motes: 2  },
  { name: 'Arcane Ice Storm',    slug: 'arcane_ice_storm',    tier: 'Ascension', motes: 10 },
  { name: 'Arcane Battery',      slug: 'arcane_battery',      tier: 'Ascension', motes: 10 },
  { name: 'Secondary Surge',     slug: 'secondary_surge',     tier: 'Ascension', motes: 10 },
  { name: 'Secondary Fortifier', slug: 'secondary_fortifier', tier: 'Ascension', motes: 10 },
  { name: 'Melee Afflictions',   slug: 'melee_afflictions',   tier: 'Ascension', motes: 10 },
  { name: 'Arcane Impetus',      slug: 'arcane_impetus',      tier: 'Special',   motes: 0 },
]

const EVENT_END = new Date('2026-06-01T23:59:59Z')
const TIER_ORDER: Record<string, number> = { Legendary: 0, Rare: 1, Uncommon: 2, Common: 3, Ascension: 4 }
const TIER_STYLE: Record<string, { bg: string; color: string }> = {
  Legendary: { bg: '#3C3489', color: '#CECBF6' },
  Rare:      { bg: '#633806', color: '#FAC775' },
  Uncommon:  { bg: '#0C447C', color: '#B5D4F4' },
  Common:    { bg: '#3a3a38', color: '#D3D1C7' },
  Ascension: { bg: '#085041', color: '#9FE1CB' },
  Ascension: { bg: '#ffffff', color: '#000000' },
}

interface PriceData {
  price: number | null
  min?: number | null
  max?: number | null
  entries?: number
  history?: { t: string; v: number }[]
  change24h?: number | null
}

// ── Sparkline SVG ──────────────────────────────────────────
function Sparkline({ data, w = 80, h = 28 }: { data: { v: number }[]; w?: number; h?: number }) {
  if (!data || data.length < 2) return <div style={{ height: h }} />
  const vals = data.map(d => d.v)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const last = vals[vals.length - 1]
  const first = vals[0]
  const color = last >= first ? '#4caf50' : '#e55'
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

// ── Large Chart Modal ──────────────────────────────────────
function ChartModal({ arcane, pd, onClose }: { arcane: typeof ARCANES[0]; pd: PriceData; onClose: () => void }) {
  const history = pd.history ?? []
  const W = 520, H = 180, PAD = 40

  const vals = history.map(d => d.v).filter(v => v > 0)
  const minV = vals.length ? Math.min(...vals) : 0
  const maxV = vals.length ? Math.max(...vals) : 1
  const range = maxV - minV || 1

  const toX = (i: number) => PAD + (i / Math.max(history.length - 1, 1)) * (W - PAD * 2)
  const toY = (v: number) => PAD + (H - PAD * 2) - ((v - minV) / range) * (H - PAD * 2)

  const pts = history.map((d, i) => `${toX(i).toFixed(1)},${toY(d.v).toFixed(1)}`).join(' ')
  const ts = TIER_STYLE[arcane.tier]

  // Labels
  const labelCount = Math.min(history.length, 6)
  const labelIdxs = Array.from({ length: labelCount }, (_, i) =>
    Math.round((i / (labelCount - 1)) * (history.length - 1))
  )

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div onClick={e => e.stopPropagation()} style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 16, padding: 24, maxWidth: 580, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{arcane.name}</div>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: ts.bg, color: ts.color, display: 'inline-block', marginTop: 4 }}>{arcane.tier}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{pd.price} <span style={{ fontSize: 13, color: '#888' }}>pt</span></div>
            {pd.change24h !== null && pd.change24h !== undefined && (
              <div style={{ fontSize: 13, color: pd.change24h > 0 ? '#4caf50' : pd.change24h < 0 ? '#e55' : '#888' }}>
                {pd.change24h > 0 ? '↑' : pd.change24h < 0 ? '↓' : '→'} {Math.abs(pd.change24h)}% față de 24h
              </div>
            )}
            <button onClick={onClose} style={{ marginTop: 8, fontSize: 11, padding: '3px 10px', borderRadius: 6, border: '1px solid #333', background: 'transparent', color: '#888', cursor: 'pointer' }}>✕ Închide</button>
          </div>
        </div>

        {history.length >= 2 ? (
          <svg width="100%" viewBox={`0 0 ${W} ${H + PAD}`} style={{ display: 'block' }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(f => {
              const y = PAD + (H - PAD * 2) * (1 - f)
              const v = Math.round(minV + range * f)
              return (
                <g key={f}>
                  <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#2a2a2e" strokeWidth="1" />
                  <text x={PAD - 6} y={y + 4} fontSize="10" fill="#555" textAnchor="end">{v}</text>
                </g>
              )
            })}
            {/* Chart line */}
            <polyline points={pts} fill="none" stroke="#5a8dee" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {/* Dots on data points */}
            {history.map((d, i) => (
              <circle key={i} cx={toX(i)} cy={toY(d.v)} r="2.5" fill="#5a8dee" opacity="0.7" />
            ))}
            {/* X axis labels */}
            {labelIdxs.map(i => {
              const d = history[i]
              const label = new Date(d.t).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
              return (
                <text key={i} x={toX(i)} y={H + PAD - 4} fontSize="9" fill="#555" textAnchor="middle">{label}</text>
              )
            })}
          </svg>
        ) : (
          <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 13 }}>
            Date insuficiente pentru grafic
          </div>
        )}

        <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 12, color: '#666' }}>
          <span>Min 48h: <b style={{ color: '#fff' }}>{pd.min} pt</b></span>
          <span>Max 48h: <b style={{ color: '#fff' }}>{pd.max} pt</b></span>
          <span>Puncte date: <b style={{ color: '#fff' }}>{history.length}</b></span>
        </div>
      </div>
    </div>
  )
}

async function fetchBatch(slugs: string[]): Promise<Record<string, PriceData>> {
  try {
    const res = await fetch('/api/prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs }),
    })
    if (!res.ok) return {}
    const data = await res.json()
    return data.prices ?? {}
  } catch { return {} }
}

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
    return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000), expired: false }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => { const t = setInterval(() => setTime(calc()), 1000); return () => clearInterval(t) }, [])
  return time
}

const CONCURRENCY = 6

export default function PriceTracker() {
  const [prices, setPrices] = useState<Record<string, PriceData>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('price-desc')
  const [done, setDone] = useState(0)
  const [motesInput, setMotesInput] = useState('')
  const [selectedArcane, setSelectedArcane] = useState<typeof ARCANES[0] | null>(null)
  const countdown = useCountdown(EVENT_END)

  const loadPrices = useCallback(async () => {
    setStatus('loading'); setDone(0); setPrices({})
    const slugs = ARCANES.map(a => a.slug)
    const result: Record<string, PriceData> = {}
    for (let i = 0; i < slugs.length; i += CONCURRENCY) {
      const batch = slugs.slice(i, i + CONCURRENCY)
      Object.assign(result, await fetchBatch(batch))
      setDone(i + batch.length); setPrices({ ...result })
      if (i + CONCURRENCY < slugs.length) await new Promise(r => setTimeout(r, 100))
    }
    setUpdatedAt(new Date()); setStatus('done')
  }, [])

  useEffect(() => { loadPrices() }, [loadPrices])

  const tiers = ['all', 'Legendary', 'Rare', 'Uncommon', 'Common', 'Ascension', 'Special']
  const foundCount = Object.values(prices).filter(v => v.price !== null).length
  const progress = Math.round((done / ARCANES.length) * 100)
  const motes = parseInt(motesInput) || 0

  const allRatios = ARCANES.map(a => ({ slug: a.slug, ratio: (prices[a.slug]?.price ?? 0) / a.motes })).filter(x => x.ratio > 0)
  const bestRatioSlugs = new Set(['Legendary','Rare','Uncommon','Common','Ascension'].map(tier => {
    const inTier = ARCANES.filter(a => a.tier === tier).map(a => ({ slug: a.slug, ratio: (prices[a.slug]?.price ?? 0) / a.motes })).filter(x => x.ratio > 0)
    return inTier.length ? inTier.sort((a, b) => b.ratio - a.ratio)[0].slug : ''
  }).filter(Boolean))
  const globalBest = allRatios.length ? allRatios.sort((a, b) => b.ratio - a.ratio)[0].slug : ''

  let items = ARCANES.filter(a => filter === 'all' || a.tier === filter).map(a => ({ ...a, pd: prices[a.slug] ?? { price: null } }))
  const getRatio = (item: typeof items[0]) => item.pd.price && item.motes ? item.pd.price / item.motes : null

  if (sort === 'price-desc') items.sort((a, b) => (b.pd.price ?? -1) - (a.pd.price ?? -1))
  else if (sort === 'price-asc') items.sort((a, b) => (a.pd.price ?? 99999) - (b.pd.price ?? 99999))
  else if (sort === 'ratio-asc') items.sort((a, b) => (getRatio(a) ?? 99999) - (getRatio(b) ?? 99999))
  else if (sort === 'ratio-desc') items.sort((a, b) => (getRatio(b) ?? -1) - (getRatio(a) ?? -1))
  else if (sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name))
  else if (sort === 'tier') items.sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Modal grafic mare */}
      {selectedArcane && (
        <ChartModal
          arcane={selectedArcane}
          pd={prices[selectedArcane.slug] ?? { price: null }}
          onClose={() => setSelectedArcane(null)}
        />
      )}

      {/* Countdown */}
      <div style={{ background: countdown.days < 3 ? '#2a1a1a' : '#16161a', border: `1px solid ${countdown.days < 3 ? '#5a2a2a' : '#2a2a2e'}`, borderRadius: 12, padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>⏱ Timp rămas — Operation: Belly of the Beast</div>
          {countdown.expired
            ? <div style={{ fontSize: 16, color: '#e55', fontWeight: 600 }}>Evenimentul s-a încheiat</div>
            : <div style={{ fontSize: 22, fontWeight: 700, color: countdown.days < 3 ? '#e55' : '#fff', fontVariantNumeric: 'tabular-nums' }}>
                {countdown.days}z {pad(countdown.hours)}h {pad(countdown.minutes)}m {pad(countdown.seconds)}s
              </div>}
        </div>
        <div style={{ fontSize: 11, color: '#555' }}>Se termina pe 1 iunie 2026</div>
      </div>

      {/* Calculator */}
      <div style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 12, padding: '14px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 10 }}>🧮 Calculator profit</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#888' }}>Volatile Motes:</span>
            <input type="number" min="0" value={motesInput} onChange={e => setMotesInput(e.target.value)} placeholder="ex: 100"
              style={{ width: 90, padding: '5px 10px', borderRadius: 8, border: '1px solid #333', background: '#0d0d0f', color: '#fff', fontSize: 13, outline: 'none' }} />
          </div>
          {motes > 0 && status === 'done' && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Legendary','Rare','Uncommon','Common'].map(tier => {
                const arcane = ARCANES.filter(a => a.tier === tier).find(a => bestRatioSlugs.has(a.slug))
                if (!arcane) return null
                const price = prices[arcane.slug]?.price
                if (!price) return null
                const COPIES_FOR_R5 = 21
                const motesPerR5 = arcane.motes * COPIES_FOR_R5
                const fullR5 = Math.floor(motes / motesPerR5)
                const remainingCopies = Math.floor((motes % motesPerR5) / arcane.motes)
                const profit = fullR5 * price
                return (
                  <div key={tier} style={{ background: '#0d0d0f', border: '1px solid #2a2a2e', borderRadius: 8, padding: '6px 12px', fontSize: 12 }}>
                    <span style={{ color: '#888' }}>{tier}: </span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{profit} pt</span>
                    <span style={{ color: '#555' }}> ({fullR5}x R5 {arcane.name.replace('Arcane ', '')})</span>
                    {remainingCopies > 0 && <span style={{ color: '#444' }}> +{remainingCopies} copii</span>}
                    {fullR5 === 0 && <span style={{ color: '#555' }}> (trebuie {motesPerR5} motes/R5)</span>}
                  </div>
                )
              })}
            </div>
          )}
          {motes === 0 && <span style={{ fontSize: 12, color: '#555' }}>Introdu numărul de motes pentru a vedea profitul estimat</span>}
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#fff' }}>Arcane Prices</h1>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#555' }}>
            {status === 'loading' && `Se încarcă... ${progress}% (${done}/${ARCANES.length})`}
            {status === 'done' && updatedAt && `Actualizat: ${updatedAt.toLocaleTimeString('ro-RO')} • ${foundCount} prețuri • Media 4h • Click pe card pentru grafic`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ fontSize: 12, padding: '6px 10px', borderRadius: 8, border: '1px solid #333', background: '#1a1a1c', color: '#fff', cursor: 'pointer' }}>
            <option value="price-desc">Preț ↓</option>
            <option value="price-asc">Preț ↑</option>
            <option value="ratio-desc">pt/mote ↓</option>
            <option value="ratio-asc">pt/mote ↑</option>
            <option value="name">Nume A-Z</option>
            <option value="tier">Tier</option>
          </select>
          <button onClick={loadPrices} disabled={status === 'loading'}
            style={{ fontSize: 12, padding: '6px 16px', borderRadius: 8, border: '1px solid #333', background: '#1a1a1c', color: status === 'loading' ? '#555' : '#fff', cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
            {status === 'loading' ? '...' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {status === 'loading' && (
        <div style={{ height: 3, background: '#222', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#5a8dee', transition: 'width 0.3s ease', borderRadius: 2 }} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {tiers.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, border: filter === t ? '1px solid #5a8dee' : '1px solid #333', background: filter === t ? '#1a2a44' : 'transparent', color: filter === t ? '#5a8dee' : '#888', cursor: 'pointer' }}>
            {t === 'all' ? 'Toate' : t}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
        {items.map(a => {
          const ts = TIER_STYLE[a.tier]
          const pd = a.pd
          const ratio = pd.price && a.motes ? Math.round(pd.price / a.motes) : null
          const isBestInTier = bestRatioSlugs.has(a.slug) && pd.price !== null
          const isGlobalBest = globalBest === a.slug
          const borderColor = isGlobalBest ? '#f5c518' : isBestInTier ? '#2a5a2a' : '#2a2a2e'
          const COPIES_FOR_R5 = 21
          const motesPerR5 = a.motes * COPIES_FOR_R5
          const fullR5 = motes > 0 && pd.price ? Math.floor(motes / motesPerR5) : 0
          const remainingCopies = motes > 0 ? Math.floor((motes % motesPerR5) / a.motes) : 0
          const profit = fullR5 * (pd.price ?? 0)

          // Trending
          const change = pd.change24h
          const trendColor = change == null ? '#555' : change > 0 ? '#4caf50' : change < 0 ? '#e55' : '#888'
          const trendIcon = change == null ? '' : change > 2 ? '↑' : change < -2 ? '↓' : '→'

          return (
            <div key={a.slug}
              onClick={() => pd.price !== null && setSelectedArcane(a)}
              style={{ background: '#16161a', border: `1px solid ${borderColor}`, borderRadius: 12, padding: '14px 16px', cursor: pd.price !== null ? 'pointer' : 'default', transition: 'border-color 0.15s', position: 'relative' }}
              onMouseEnter={e => pd.price !== null && ((e.currentTarget as HTMLDivElement).style.borderColor = '#3a3a4e')}
              onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = borderColor)}
            >
              {isGlobalBest && <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 16 }} title="Best deal overall">⭐</div>}
              {isBestInTier && !isGlobalBest && <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 14 }} title={`Best in ${a.tier}`}>🏆</div>}

              <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 6, paddingRight: 24 }}>{a.name}</div>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: ts.bg, color: ts.color, display: 'inline-block', marginBottom: 8 }}>{a.tier}</span>

              {/* Sparkline */}
              {pd.history && pd.history.length >= 2 && (
                <div style={{ marginBottom: 6 }}>
                  <Sparkline data={pd.history} w={80} h={24} />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 1 }}>Preț median (4h)</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                    {pd.price !== null && pd.price !== undefined
                      ? <>{pd.price} <span style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>pt</span></>
                      : <span style={{ fontSize: 14, color: '#444' }}>{status === 'loading' ? '...' : '—'}</span>}
                  </div>
                </div>
                {/* Trending badge */}
                {trendIcon && change !== null && (
                  <div style={{ fontSize: 12, color: trendColor, fontWeight: 600, marginBottom: 2 }}>
                    {trendIcon} {Math.abs(change as number)}%
                  </div>
                )}
              </div>

              {pd.min !== undefined && pd.max !== undefined && pd.price !== null && (
                <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{pd.min} – {pd.max} pt</div>
              )}

              <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>
                {a.tier === 'Ascension' ? `${a.motes} Vestigial Motes` : `${a.motes} Volatile Mote${a.motes > 1 ? 's' : ''}`}
              </div>
              {ratio && <div style={{ fontSize: 11, color: isBestInTier ? '#4caf50' : '#555', marginTop: 1, fontWeight: isBestInTier ? 600 : 400 }}>~{ratio} pt/mote</div>}

              {motes > 0 && pd.price !== null && (
                <div style={{ marginTop: 6, padding: '4px 8px', background: fullR5 > 0 ? '#0d1a0d' : '#1a1a0d', borderRadius: 6, fontSize: 11, color: fullR5 > 0 ? '#4caf50' : '#888' }}>
                  {fullR5 > 0
                    ? `${profit} pt (${fullR5}x R5${remainingCopies > 0 ? ` +${remainingCopies}` : ''})`
                    : `Trebuie ${motesPerR5} motes/R5`}
                </div>
              )}

              {pd.price !== null && (
                <div style={{ fontSize: 10, color: '#333', marginTop: 6 }}>click pentru grafic</div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 24, fontSize: 11, color: '#444', textAlign: 'center' }}>
        Sursa: warframe.market statistics • Media 4h la Rank 5 • ↑↓ = variație față de 24h în urmă
      </div>
    </div>
  )
}
