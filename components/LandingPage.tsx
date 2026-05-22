'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SLUG_NAMES: Record<string, string> = {
  arcane_energize: 'Arcane Energize', arcane_grace: 'Arcane Grace', arcane_barrier: 'Arcane Barrier',
  arcane_avenger: 'Arcane Avenger', arcane_fury: 'Arcane Fury', arcane_guardian: 'Arcane Guardian',
  arcane_velocity: 'Arcane Velocity', arcane_acceleration: 'Arcane Acceleration',
  molt_augmented: 'Molt Augmented', arcane_aegis: 'Arcane Aegis',
  cascadia_empower: 'Cascadia Empower', melee_influence: 'Melee Influence',
}

interface StatItem { slug: string; price: number; change24h: number | null; volume: number }
interface Stats {
  mostExpensive: StatItem[]; topGainers: StatItem[]; topLosers: StatItem[]
  avgPrice: number; tracked: number
}

// ── Flip Calculator ──────────────────────────────────────────────────────
function FlipCalc() {
  const [buy, setBuy] = useState('')
  const [sell, setSell] = useState('')
  const [qty, setQty] = useState('1')

  const b = parseFloat(buy) || 0
  const s = parseFloat(sell) || 0
  const q = parseInt(qty) || 1
  const tax = Math.ceil(s * 0.1)
  const netPerSale = s - tax
  const totalCost = b * q
  const totalEarned = netPerSale * q
  const profit = totalEarned - totalCost
  const roi = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : null
  const breakEven = b > 0 ? Math.ceil(b / 0.9) : null
  const profitColor = profit > 0 ? '#4caf50' : profit < 0 ? '#e55' : '#888'

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #2a2a2e', background: '#0d0d0f', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }

  return (
    <div style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 14, padding: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>🔄 Flip Calculator</div>
      <div style={{ fontSize: 12, color: '#555', marginBottom: 20 }}>Calculează profitul după taxa Warframe de 10%</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>Preț cumpărare (pt)</div>
          <input type="number" min="0" value={buy} onChange={e => setBuy(e.target.value)} placeholder="0" style={inputStyle} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>Preț vânzare (pt)</div>
          <input type="number" min="0" value={sell} onChange={e => setSell(e.target.value)} placeholder="0" style={inputStyle} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>Cantitate</div>
          <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="1" style={inputStyle} />
        </div>
      </div>

      {(b > 0 || s > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
          {[
            { label: 'Taxă Warframe', value: `${tax} pt`, color: '#e55' },
            { label: 'Net per vânzare', value: `${netPerSale} pt`, color: '#fff' },
            { label: 'Cost total', value: `${totalCost} pt`, color: '#888' },
            { label: 'Câștig total', value: `${totalEarned} pt`, color: '#fff' },
            { label: 'Profit net', value: `${profit > 0 ? '+' : ''}${profit} pt`, color: profitColor },
            { label: 'ROI', value: roi ? `${parseFloat(roi) > 0 ? '+' : ''}${roi}%` : '—', color: profitColor },
            ...(breakEven ? [{ label: 'Break-even', value: `${breakEven} pt`, color: '#5a8dee' }] : []),
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#0d0d0f', borderRadius: 8, padding: '10px 14px', border: '1px solid #1e1e22' }}>
              <div style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color }}>{value}</div>
            </div>
          ))}
        </div>
      )}
      {b === 0 && s === 0 && (
        <div style={{ textAlign: 'center', padding: '1rem', color: '#333', fontSize: 13 }}>Introdu prețurile pentru a vedea calculul</div>
      )}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#444', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

// ── Price row ─────────────────────────────────────────────────────────────
function PriceRow({ item, showChange }: { item: StatItem; showChange?: boolean }) {
  const name = SLUG_NAMES[item.slug] ?? item.slug
  const c = item.change24h
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1a1a1e' }}>
      <div style={{ fontSize: 13, color: '#ccc' }}>{name}</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {showChange && c !== null && (
          <span style={{ fontSize: 12, color: c > 0 ? '#4caf50' : c < 0 ? '#e55' : '#888', fontWeight: 500 }}>
            {c > 0 ? '↑' : c < 0 ? '↓' : '→'} {Math.abs(c)}%
          </span>
        )}
        <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{item.price} pt</span>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => { setStats(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const EVENT_END = new Date('2026-06-01T23:59:59Z')
  const daysLeft = Math.max(0, Math.ceil((EVENT_END.getTime() - Date.now()) / 86400000))

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1rem 4rem' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 11, color: '#5a8dee', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Warframe Arcane Tracker</div>
        <h1 style={{ margin: '0 0 16px', fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-1px' }}>
          Prețuri live.<br /><span style={{ color: '#5a8dee' }}>Trade smart.</span>
        </h1>
        <p style={{ color: '#666', fontSize: 15, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.6 }}>
          Urmărește prețurile arcanelor de pe warframe.market, calculează profit-ul și ține evidența tranzacțiilor tale.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/tracker" style={{ padding: '10px 24px', borderRadius: 10, background: '#5a8dee', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
            Vezi prețurile →
          </Link>
          <Link href="/history" style={{ padding: '10px 24px', borderRadius: 10, background: 'transparent', color: '#888', fontWeight: 500, fontSize: 14, textDecoration: 'none', display: 'inline-block', border: '1px solid #2a2a2e' }}>
            Istoric tranzacții
          </Link>
        </div>
      </div>

      {/* Event banner */}
      {daysLeft > 0 && (
        <div style={{ background: 'linear-gradient(90deg, #1a2a44 0%, #16161a 100%)', border: '1px solid #2a3a54', borderRadius: 12, padding: '14px 20px', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#5a8dee' }}>⚡ ACTIV</span>
            <span style={{ fontSize: 13, color: '#ccc', marginLeft: 10 }}>Operation: Belly of the Beast</span>
          </div>
          <div style={{ fontSize: 13, color: '#888' }}>
            {daysLeft < 4 ? <span style={{ color: '#e55', fontWeight: 600 }}>⚠ {daysLeft} zile rămase!</span> : `${daysLeft} zile rămase`}
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 32 }}>
        <StatCard label="Arcane urmărite" value={loading ? '...' : stats?.tracked ?? 0} sub="top arcane" />
        <StatCard label="Preț mediu" value={loading ? '...' : stats ? `${stats.avgPrice} pt` : '—'} sub="media top arcane" />
        <StatCard label="Actualizare" value="4h" sub="media tranzacții recente" />
        <StatCard label="Sindicate" value="7" sub="Ostron, Quills, Fortuna..." />
      </div>

      {/* Top movers + Most expensive */}
      {!loading && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          <div style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#4caf50', marginBottom: 14 }}>↑ Top creșteri (24h)</div>
            {stats.topGainers.length ? stats.topGainers.map(item => <PriceRow key={item.slug} item={item} showChange />) : <div style={{ color: '#444', fontSize: 13 }}>Date insuficiente</div>}
          </div>
          <div style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FAC775', marginBottom: 14 }}>💰 Cele mai scumpe</div>
            {stats.mostExpensive.map(item => <PriceRow key={item.slug} item={item} />)}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#444', fontSize: 13 }}>Se încarcă statisticile...</div>
      )}

      {/* Flip Calculator */}
      <div style={{ marginBottom: 32 }}>
        <FlipCalc />
      </div>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
        {[
          { icon: '📈', title: 'Prețuri live', desc: 'Media tranzacțiilor din ultimele 4h la Rank 5, cu trending față de 24h.' },
          { icon: '🔄', title: 'Flip Calculator', desc: 'Calculează profit net după taxa de 10% Warframe și break-even price.' },
          { icon: '📋', title: 'Istoric personal', desc: 'Notează cumpărăturile și vânzările, urmărește P&L-ul total.' },
          { icon: '🏪', title: '100+ arcane', desc: 'Event, Ostron, Quills, Fortuna, Entrati, Holdfasts, Cavia.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ background: '#16161a', border: '1px solid #1e1e22', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 12, color: '#555', lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, textAlign: 'center', fontSize: 11, color: '#333' }}>
        Sursa date: warframe.market • Neafiliat cu Digital Extremes
      </div>
    </div>
  )
}
