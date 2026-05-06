'use client'

import { useState, useEffect, useCallback } from 'react'

const ARCANES = [
  { name: 'Arcane Energize',     slug: 'arcane_energize',     tier: 'Legendary', motes: 30 },
  { name: 'Arcane Grace',        slug: 'arcane_grace',        tier: 'Legendary', motes: 30 },
  { name: 'Arcane Barrier',      slug: 'arcane_barrier',      tier: 'Legendary', motes: 30 },
  { name: 'Arcane Aegis',        slug: 'arcane_aegis',        tier: 'Rare',      motes: 5  },
  { name: 'Arcane Arachne',      slug: 'arcane_arachne',      tier: 'Rare',      motes: 5  },
  { name: 'Arcane Avenger',      slug: 'arcane_avenger',      tier: 'Rare',      motes: 5  },
  { name: 'Arcane Fury',         slug: 'arcane_fury',         tier: 'Rare',      motes: 5  },
  { name: 'Arcane Precision',    slug: 'arcane_precision',    tier: 'Rare',      motes: 5  },
  { name: 'Arcane Pulse',        slug: 'arcane_pulse',        tier: 'Rare',      motes: 5  },
  { name: 'Arcane Rage',         slug: 'arcane_rage',         tier: 'Rare',      motes: 5  },
  { name: 'Arcane Ultimatum',    slug: 'arcane_ultimatum',    tier: 'Rare',      motes: 5  },
  { name: 'Arcane Acceleration', slug: 'arcane_acceleration', tier: 'Uncommon',  motes: 3  },
  { name: 'Arcane Agility',      slug: 'arcane_agility',      tier: 'Uncommon',  motes: 3  },
  { name: 'Arcane Awakening',    slug: 'arcane_awakening',    tier: 'Uncommon',  motes: 3  },
  { name: 'Arcane Deflection',   slug: 'arcane_deflection',   tier: 'Uncommon',  motes: 3  },
  { name: 'Arcane Eruption',     slug: 'arcane_eruption',     tier: 'Uncommon',  motes: 3  },
  { name: 'Arcane Guardian',     slug: 'arcane_guardian',     tier: 'Uncommon',  motes: 3  },
  { name: 'Arcane Healing',      slug: 'arcane_healing',      tier: 'Uncommon',  motes: 3  },
  { name: 'Arcane Phantasm',     slug: 'arcane_phantasm',     tier: 'Uncommon',  motes: 3  },
  { name: 'Arcane Resistance',   slug: 'arcane_resistance',   tier: 'Uncommon',  motes: 3  },
  { name: 'Arcane Strike',       slug: 'arcane_strike',       tier: 'Uncommon',  motes: 3  },
  { name: 'Arcane Trickery',     slug: 'arcane_trickery',     tier: 'Uncommon',  motes: 3  },
  { name: 'Arcane Velocity',     slug: 'arcane_velocity',     tier: 'Uncommon',  motes: 3  },
  { name: 'Arcane Consequence',  slug: 'arcane_consequence',  tier: 'Common',    motes: 1  },
  { name: 'Arcane Ice',          slug: 'arcane_ice',          tier: 'Common',    motes: 1  },
  { name: 'Arcane Momentum',     slug: 'arcane_momentum',     tier: 'Common',    motes: 1  },
  { name: 'Arcane Nullifier',    slug: 'arcane_nullifier',    tier: 'Common',    motes: 1  },
  { name: 'Arcane Tempo',        slug: 'arcane_tempo',        tier: 'Common',    motes: 1  },
  { name: 'Arcane Warmth',       slug: 'arcane_warmth',       tier: 'Common',    motes: 1  },
  { name: 'Arcane Ice Storm',    slug: 'arcane_ice_storm',    tier: 'Ascension', motes: 10 },
  { name: 'Arcane Battery',      slug: 'arcane_battery',      tier: 'Ascension', motes: 10 },
  { name: 'Secondary Surge',     slug: 'secondary_surge',     tier: 'Ascension', motes: 10 },
  { name: 'Secondary Fortifier', slug: 'secondary_fortifier', tier: 'Ascension', motes: 10 },
  { name: 'Melee Afflictions',   slug: 'melee_afflictions',   tier: 'Ascension', motes: 10 },
]

const TIER_ORDER: Record<string, number> = { Legendary: 0, Rare: 1, Uncommon: 2, Common: 3, Ascension: 4 }
const TIER_STYLE: Record<string, { bg: string; color: string }> = {
  Legendary: { bg: '#3C3489', color: '#CECBF6' },
  Rare:      { bg: '#633806', color: '#FAC775' },
  Uncommon:  { bg: '#0C447C', color: '#B5D4F4' },
  Common:    { bg: '#3a3a38', color: '#D3D1C7' },
  Ascension: { bg: '#085041', color: '#9FE1CB' },
}

async function fetchArcanePrice(slug: string): Promise<number | null> {
  const res = await fetch(
    `https://api.warframe.market/v1/items/${slug}/orders`,
    { headers: { 'Accept': 'application/json', 'Platform': 'pc', 'Language': 'en' } }
  )
  if (!res.ok) return null

  const data = await res.json()
  const orders: any[] = data?.payload?.orders ?? []

  // Get all sell orders regardless of rank, pick cheapest
  const sells = orders
    .filter((o: any) => o.order_type === 'sell')
    .sort((a: any, b: any) => a.platinum - b.platinum)

  if (!sells.length) return null

  // Prefer highest rank available
  const maxRank = Math.max(...sells.map((o: any) => o.mod_rank ?? 0))
  const atMaxRank = sells.filter((o: any) => (o.mod_rank ?? 0) === maxRank)

  const online = atMaxRank.filter(
    (o: any) => o.user?.status === 'ingame' || o.user?.status === 'online'
  )
  const pool = online.length > 0 ? online : atMaxRank
  pool.sort((a: any, b: any) => a.platinum - b.platinum)
  return pool[0].platinum
}

const CONCURRENCY = 5

export default function PriceTracker() {
  const [prices, setPrices] = useState<Record<string, number | null>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('price-desc')
  const [done, setDone] = useState(0)

  const loadPrices = useCallback(async () => {
    setStatus('loading')
    setDone(0)
    setPrices({})

    const result: Record<string, number | null> = {}
    const slugs = ARCANES.map(a => a.slug)

    for (let i = 0; i < slugs.length; i += CONCURRENCY) {
      const batch = slugs.slice(i, i + CONCURRENCY)
      await Promise.all(
        batch.map(async (slug) => {
          result[slug] = await fetchArcanePrice(slug)
        })
      )
      setDone(i + batch.length)
      setPrices({ ...result })
      if (i + CONCURRENCY < slugs.length) {
        await new Promise(r => setTimeout(r, 200))
      }
    }

    setUpdatedAt(new Date())
    setStatus('done')
  }, [])

  useEffect(() => { loadPrices() }, [loadPrices])

  const tiers = ['all', 'Legendary', 'Rare', 'Uncommon', 'Common', 'Ascension']
  const foundCount = Object.values(prices).filter(v => v !== null && v !== undefined).length
  const progress = Math.round((done / ARCANES.length) * 100)

  let items = ARCANES
    .filter(a => filter === 'all' || a.tier === filter)
    .map(a => ({ ...a, price: prices[a.slug] ?? null }))

  if (sort === 'price-desc') items.sort((a, b) => (b.price ?? -1) - (a.price ?? -1))
  else if (sort === 'price-asc') items.sort((a, b) => (a.price ?? 99999) - (b.price ?? 99999))
  else if (sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name))
  else if (sort === 'tier') items.sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#fff' }}>Arcane Prices</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>
            Operation: Belly of the Beast — warframe.market • Rank maxim
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#555' }}>
            {status === 'loading' && `Se încarcă... ${progress}% (${done}/${ARCANES.length})`}
            {status === 'done' && updatedAt && `Actualizat: ${updatedAt.toLocaleTimeString('ro-RO')} • ${foundCount} prețuri găsite`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ fontSize: 12, padding: '6px 10px', borderRadius: 8, border: '1px solid #333', background: '#1a1a1c', color: '#fff', cursor: 'pointer' }}
          >
            <option value="price-desc">Preț ↓</option>
            <option value="price-asc">Preț ↑</option>
            <option value="name">Nume A-Z</option>
            <option value="tier">Tier</option>
          </select>
          <button
            onClick={loadPrices}
            disabled={status === 'loading'}
            style={{ fontSize: 12, padding: '6px 16px', borderRadius: 8, border: '1px solid #333', background: '#1a1a1c', color: status === 'loading' ? '#555' : '#fff', cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
          >
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {items.map(a => {
          const ts = TIER_STYLE[a.tier]
          const ratio = a.price && a.motes ? Math.round(a.price / a.motes) : null
          return (
            <div key={a.slug} style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 6 }}>{a.name}</div>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: ts.bg, color: ts.color, display: 'inline-block', marginBottom: 10 }}>{a.tier}</span>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Min. sell (R max)</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                {a.price !== null && a.price !== undefined
                  ? <>{a.price} <span style={{ fontSize: 13, color: '#888', fontWeight: 400 }}>pt</span></>
                  : <span style={{ fontSize: 14, color: '#444' }}>{status === 'loading' ? '...' : '—'}</span>}
              </div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>
                {a.tier === 'Ascension' ? `${a.motes} Vestigial Motes` : `${a.motes} Volatile Mote${a.motes > 1 ? 's' : ''}`}
              </div>
              {ratio && <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>~{ratio} pt/mote</div>}
              <a href={`https://warframe.market/items/${a.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#5a8dee', textDecoration: 'none', marginTop: 6, display: 'inline-block' }}>
                warframe.market ↗
              </a>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 24, fontSize: 11, color: '#444', textAlign: 'center' }}>
        Sursa: warframe.market • Prețuri live la rank maxim
      </div>
    </div>
  )
}
