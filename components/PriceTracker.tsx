'use client'
import { useState, useEffect, useCallback } from 'react'

// ── Date arcane ────────────────────────────────────────────
interface Arcane {
  name: string
  slug: string
  tier: string
  motes?: number
  syndicate?: string
  cost?: number
}

const ARCANES: Arcane[] = [
  // ── EVENT: Belly of the Beast ──────────────────────────
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
  { name: 'Secondary Enervate',  slug: 'secondary_enervate',  tier: 'Special'   },
  { name: 'Arcane Crepuscular',  slug: 'arcane_crepuscular',  tier: 'Special'   },
  { name: 'Arcane Truculence',   slug: 'arcane_truculence',   tier: 'Special'   },
  { name: 'Arcane Belicose',     slug: 'arcane_belicose',     tier: 'Special'   },
  { name: 'Arcane Camisado',     slug: 'arcane_camisado',     tier: 'Special'   },
  { name: 'Primary Crux',        slug: 'primary_crux',        tier: 'Special'   },
  { name: 'Melee Doughty',       slug: 'melee_doughty',       tier: 'Special'   },
  { name: 'Arcane Impetus',      slug: 'arcane_impetus',      tier: 'Special'   },

  // ── OSTRON (Cetus - Hok) ──────────────────────────────
  { name: 'Exodia Brave',        slug: 'exodia_brave',        tier: 'Syndicate', syndicate: 'Ostron',         cost: 10000 },
  { name: 'Exodia Force',        slug: 'exodia_force',        tier: 'Syndicate', syndicate: 'Ostron',         cost: 10000 },
  { name: 'Exodia Hunt',         slug: 'exodia_hunt',         tier: 'Syndicate', syndicate: 'Ostron',         cost: 10000 },
  { name: 'Exodia Might',        slug: 'exodia_might',        tier: 'Syndicate', syndicate: 'Ostron',         cost: 10000 },
  { name: 'Exodia Triumph',      slug: 'exodia_triumph',      tier: 'Syndicate', syndicate: 'Ostron',         cost: 10000 },
  { name: 'Exodia Valor',        slug: 'exodia_valor',        tier: 'Syndicate', syndicate: 'Ostron',         cost: 10000 },

  // ── THE QUILLS (Cetus - Onkko) ────────────────────────
  { name: 'Magus Vigor',         slug: 'magus_vigor',         tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },
  { name: 'Magus Husk',          slug: 'magus_husk',          tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },
  { name: 'Magus Cloud',         slug: 'magus_cloud',         tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },
  { name: 'Magus Cadence',       slug: 'magus_cadence',       tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },
  { name: 'Magus Replenish',     slug: 'magus_replenish',     tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },
  { name: 'Magus Elevate',       slug: 'magus_elevate',       tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },
  { name: 'Magus Nourish',       slug: 'magus_nourish',       tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },
  { name: 'Virtuos Null',        slug: 'virtuos_null',        tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },
  { name: 'Virtuos Tempo',       slug: 'virtuos_tempo',       tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },
  { name: 'Virtuos Fury',        slug: 'virtuos_fury',        tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },
  { name: 'Virtuos Strike',      slug: 'virtuos_strike',      tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },
  { name: 'Virtuos Shadow',      slug: 'virtuos_shadow',      tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },
  { name: 'Virtuos Ghost',       slug: 'virtuos_ghost',       tier: 'Syndicate', syndicate: 'The Quills',     cost: 10000 },

  // ── SOLARIS UNITED (Fortuna - Rude Zuud) ─────────────
  { name: 'Pax Charge',          slug: 'pax_charge',          tier: 'Syndicate', syndicate: 'Solaris United', cost: 10000 },
  { name: 'Pax Soar',            slug: 'pax_soar',            tier: 'Syndicate', syndicate: 'Solaris United', cost: 10000 },
  { name: 'Pax Bolt',            slug: 'pax_bolt',            tier: 'Syndicate', syndicate: 'Solaris United', cost: 10000 },
  { name: 'Pax Seeker',          slug: 'pax_seeker',          tier: 'Syndicate', syndicate: 'Solaris United', cost: 10000 },

  // ── VOX SOLARIS (Fortuna - Little Duck) ──────────────
  { name: 'Magus Accelerant',    slug: 'magus_accelerant',    tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Magus Anomaly',       slug: 'magus_anomaly',       tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Magus Destruct',      slug: 'magus_destruct',      tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Magus Drive',         slug: 'magus_drive',         tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Magus Firewall',      slug: 'magus_firewall',      tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Magus Glitch',        slug: 'magus_glitch',        tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Magus Lockdown',      slug: 'magus_lockdown',      tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Magus Melt',          slug: 'magus_melt',          tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Magus Overload',      slug: 'magus_overload',      tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Magus Repair',        slug: 'magus_repair',        tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Magus Revert',        slug: 'magus_revert',        tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Virtuos Forge',       slug: 'virtuos_forge',       tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Virtuos Surge',       slug: 'virtuos_surge',       tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },
  { name: 'Virtuos Trojan',      slug: 'virtuos_trojan',      tier: 'Syndicate', syndicate: 'Vox Solaris',    cost: 10000 },

  // ── ENTRATI (Necralisk - Father) ──────────────────────
  { name: 'Theorem Demulcent',   slug: 'theorem_demulcent',   tier: 'Syndicate', syndicate: 'Entrati',        cost: 2500  },
  { name: 'Theorem Infection',   slug: 'theorem_infection',   tier: 'Syndicate', syndicate: 'Entrati',        cost: 2500  },
  { name: 'Theorem Contagion',   slug: 'theorem_contagion',   tier: 'Syndicate', syndicate: 'Entrati',        cost: 2500  },
  { name: 'Residual Boils',      slug: 'residual_boils',      tier: 'Syndicate', syndicate: 'Entrati',        cost: 2500  },
  { name: 'Residual Malodor',    slug: 'residual_malodor',    tier: 'Syndicate', syndicate: 'Entrati',        cost: 2500  },
  { name: 'Residual Shock',      slug: 'residual_shock',      tier: 'Syndicate', syndicate: 'Entrati',        cost: 2500  },
  { name: 'Residual Viremia',    slug: 'residual_viremia',    tier: 'Syndicate', syndicate: 'Entrati',        cost: 2500  },

  // ── THE HOLDFASTS (Zariman - Cavalero) ────────────────
  { name: 'Molt Augmented',      slug: 'molt_augmented',      tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },
  { name: 'Molt Efficiency',     slug: 'molt_efficiency',     tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },
  { name: 'Molt Reconstruct',    slug: 'molt_reconstruct',    tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },
  { name: 'Molt Vigor',          slug: 'molt_vigor',          tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },
  { name: 'Cascadia Accuracy',   slug: 'cascadia_accuracy',   tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },
  { name: 'Cascadia Empower',    slug: 'cascadia_empower',    tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },
  { name: 'Cascadia Flare',      slug: 'cascadia_flare',      tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },
  { name: 'Cascadia Overcharge', slug: 'cascadia_overcharge', tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },
  { name: 'Primary Frostbite',   slug: 'primary_frostbite',   tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },
  { name: 'Fractalized Reset',   slug: 'fractalized_reset',   tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },
  { name: 'Emergence Dissipate', slug: 'emergence_dissipate', tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },
  { name: 'Emergence Renew',     slug: 'emergence_renew',     tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },
  { name: 'Emergence Savior',    slug: 'emergence_savior',    tier: 'Syndicate', syndicate: 'Holdfasts',      cost: 10000 },

  // ── CAVIA (Sanctum Anatomica - Bird 3) ───────────────
  { name: 'Melee Animosity',     slug: 'melee_animosity',     tier: 'Syndicate', syndicate: 'Cavia',          cost: 10000 },
  { name: 'Melee Exposure',      slug: 'melee_exposure',      tier: 'Syndicate', syndicate: 'Cavia',          cost: 10000 },
  { name: 'Melee Fortification', slug: 'melee_fortification', tier: 'Syndicate', syndicate: 'Cavia',          cost: 10000 },
  { name: 'Melee Influence',     slug: 'melee_influence',     tier: 'Syndicate', syndicate: 'Cavia',          cost: 10000 },
  { name: 'Melee Retaliation',   slug: 'melee_retaliation',   tier: 'Syndicate', syndicate: 'Cavia',          cost: 10000 },
  { name: 'Melee Vortex',        slug: 'melee_vortex',        tier: 'Syndicate', syndicate: 'Cavia',          cost: 10000 },
]

const EVENT_END = new Date('2026-06-01T23:59:59Z')

const TIER_ORDER: Record<string, number> = {
  Legendary: 0, Rare: 1, Uncommon: 2, Common: 3, Ascension: 4, Special: 5, Syndicate: 6,
}

const TIER_STYLE: Record<string, { bg: string; color: string }> = {
  Legendary: { bg: '#3C3489', color: '#CECBF6' },
  Rare:      { bg: '#633806', color: '#FAC775' },
  Uncommon:  { bg: '#0C447C', color: '#B5D4F4' },
  Common:    { bg: '#3a3a38', color: '#D3D1C7' },
  Ascension: { bg: '#085041', color: '#9FE1CB' },
  Special:   { bg: '#2a2a2a', color: '#ffffff' },
  Syndicate: { bg: '#1a1a1a', color: '#aaaaaa' },
}

const SYNDICATE_STYLE: Record<string, { bg: string; color: string; location: string }> = {
  'Ostron':         { bg: '#5c3d1e', color: '#f5c98a', location: 'Cetus · Hok' },
  'The Quills':     { bg: '#1a3a4a', color: '#7dd4f0', location: 'Cetus · Onkko' },
  'Solaris United': { bg: '#3d2800', color: '#ffaa33', location: 'Fortuna · Rude Zuud' },
  'Vox Solaris':    { bg: '#2d1a4a', color: '#c89af5', location: 'Fortuna · Little Duck' },
  'Entrati':        { bg: '#1a3a1a', color: '#7dcc7d', location: 'Necralisk · Father' },
  'Holdfasts':      { bg: '#1a2a4a', color: '#7da8f0', location: 'Zariman · Cavalero' },
  'Cavia':          { bg: '#3a1a1a', color: '#f07d7d', location: 'Sanctum Anatomica · Bird 3' },
}

interface PriceData {
  price: number | null
  min?: number | null
  max?: number | null
  entries?: number
  history?: { t: string; v: number }[]
  change24h?: number | null
}

// ── Filtre ─────────────────────────────────────────────────
const EVENT_FILTERS = ['Legendary', 'Rare', 'Uncommon', 'Common', 'Ascension', 'Special']
const SYNDICATE_FILTERS = ['Ostron', 'The Quills', 'Solaris United', 'Vox Solaris', 'Entrati', 'Holdfasts', 'Cavia']

function Sparkline({ data, w = 80, h = 24 }: { data: { v: number }[]; w?: number; h?: number }) {
  if (!data || data.length < 2) return <div style={{ height: h }} />
  const vals = data.map(d => d.v)
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1
  const pts = vals.map((v, i) => `${((i / (vals.length - 1)) * w).toFixed(1)},${(h - ((v - min) / range) * (h - 4) - 2).toFixed(1)}`).join(' ')
  const color = vals[vals.length - 1] >= vals[0] ? '#4caf50' : '#e55'
  return <svg width={w} height={h} style={{ display: 'block' }}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" /></svg>
}

function ChartModal({ arcane, pd, onClose }: { arcane: Arcane; pd: PriceData; onClose: () => void }) {
  const history = pd.history ?? [], W = 520, H = 180, PAD = 40
  const vals = history.map(d => d.v).filter(v => v > 0)
  const minV = vals.length ? Math.min(...vals) : 0, maxV = vals.length ? Math.max(...vals) : 1, range = maxV - minV || 1
  const toX = (i: number) => PAD + (i / Math.max(history.length - 1, 1)) * (W - PAD * 2)
  const toY = (v: number) => PAD + (H - PAD * 2) - ((v - minV) / range) * (H - PAD * 2)
  const pts = history.map((d, i) => `${toX(i).toFixed(1)},${toY(d.v).toFixed(1)}`).join(' ')
  const ts = arcane.syndicate ? SYNDICATE_STYLE[arcane.syndicate] : TIER_STYLE[arcane.tier]
  const change = pd.change24h ?? null
  const lblIdxs = history.length >= 2 ? Array.from({ length: Math.min(history.length, 6) }, (_, i) => Math.round((i / (Math.min(history.length, 6) - 1)) * (history.length - 1))) : []
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 16, padding: 24, maxWidth: 580, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{arcane.name}</div>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: ts.bg, color: ts.color, display: 'inline-block', marginTop: 4 }}>
              {arcane.syndicate ?? arcane.tier}
            </span>
            {arcane.syndicate && <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{SYNDICATE_STYLE[arcane.syndicate]?.location}</div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{pd.price} <span style={{ fontSize: 13, color: '#888' }}>pt</span></div>
            {change != null && <div style={{ fontSize: 13, color: change > 0 ? '#4caf50' : change < 0 ? '#e55' : '#888' }}>{change > 0 ? '↑' : change < 0 ? '↓' : '→'} {Math.abs(change)}% față de 24h</div>}
            <button onClick={onClose} style={{ marginTop: 8, fontSize: 11, padding: '3px 10px', borderRadius: 6, border: '1px solid #333', background: 'transparent', color: '#888', cursor: 'pointer' }}>✕ Închide</button>
          </div>
        </div>
        {history.length >= 2 ? (
          <svg width="100%" viewBox={`0 0 ${W} ${H + PAD}`} style={{ display: 'block' }}>
            {[0, 0.25, 0.5, 0.75, 1].map(f => { const y = PAD + (H - PAD * 2) * (1 - f); return <g key={f}><line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#2a2a2e" strokeWidth="1" /><text x={PAD - 6} y={y + 4} fontSize="10" fill="#555" textAnchor="end">{Math.round(minV + range * f)}</text></g> })}
            <polyline points={pts} fill="none" stroke="#5a8dee" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {history.map((d, i) => <circle key={i} cx={toX(i)} cy={toY(d.v)} r="2.5" fill="#5a8dee" opacity="0.7" />)}
            {lblIdxs.map(i => <text key={i} x={toX(i)} y={H + PAD - 4} fontSize="9" fill="#555" textAnchor="middle">{new Date(history[i].t).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}</text>)}
          </svg>
        ) : <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 13 }}>Date insuficiente</div>}
        <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 12, color: '#666' }}>
          <span>Min: <b style={{ color: '#fff' }}>{pd.min} pt</b></span>
          <span>Max: <b style={{ color: '#fff' }}>{pd.max} pt</b></span>
          <span>Puncte: <b style={{ color: '#fff' }}>{history.length}</b></span>
        </div>
      </div>
    </div>
  )
}

async function fetchBatch(slugs: string[]): Promise<Record<string, PriceData>> {
  try {
    const res = await fetch('/api/prices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slugs }) })
    if (!res.ok) return {}
    return (await res.json()).prices ?? {}
  } catch { return {} }
}

function useCountdown(target: Date) {
  const calc = () => { const d = target.getTime() - Date.now(); if (d <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }; return { days: Math.floor(d / 86400000), hours: Math.floor((d % 86400000) / 3600000), minutes: Math.floor((d % 3600000) / 60000), seconds: Math.floor((d % 60000) / 1000), expired: false } }
  const [time, setTime] = useState(calc)
  useEffect(() => { const t = setInterval(() => setTime(calc()), 1000); return () => clearInterval(t) }, [])
  return time
}

const CONCURRENCY = 6
const COPIES_FOR_R5 = 21

export default function PriceTracker() {
  const [prices, setPrices] = useState<Record<string, PriceData>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('price-desc')
  const [done, setDone] = useState(0)
  const [motesInput, setMotesInput] = useState('')
  const [selected, setSelected] = useState<Arcane | null>(null)
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

  const foundCount = Object.values(prices).filter(v => v.price !== null).length
  const progress = Math.round((done / ARCANES.length) * 100)
  const motes = parseInt(motesInput) || 0

  const allRatios = ARCANES.filter(a => a.motes).map(a => ({ slug: a.slug, ratio: (prices[a.slug]?.price ?? 0) / a.motes! })).filter(x => x.ratio > 0)
  const bestRatioSlugs = new Set(['Legendary', 'Rare', 'Uncommon', 'Common', 'Ascension'].map(tier => {
    const inTier = ARCANES.filter(a => a.tier === tier && a.motes).map(a => ({ slug: a.slug, ratio: (prices[a.slug]?.price ?? 0) / a.motes! })).filter(x => x.ratio > 0)
    return inTier.length ? inTier.sort((a, b) => b.ratio - a.ratio)[0].slug : ''
  }).filter(Boolean))
  const globalBest = allRatios.length ? [...allRatios].sort((a, b) => b.ratio - a.ratio)[0].slug : ''

  const getFilteredItems = () => {
    let filtered: Arcane[]
    if (filter === 'all') filtered = ARCANES
    else if (SYNDICATE_FILTERS.includes(filter)) filtered = ARCANES.filter(a => a.syndicate === filter)
    else filtered = ARCANES.filter(a => a.tier === filter)
    return filtered.map(a => ({ ...a, pd: prices[a.slug] ?? { price: null } }))
  }

  let items = getFilteredItems()
  const getRatio = (item: Arcane & { pd: PriceData }) => item.pd.price && item.motes ? item.pd.price / item.motes : null

  if (sort === 'price-desc') items.sort((a, b) => (b.pd.price ?? -1) - (a.pd.price ?? -1))
  else if (sort === 'price-asc') items.sort((a, b) => (a.pd.price ?? 99999) - (b.pd.price ?? 99999))
  else if (sort === 'ratio-asc') items.sort((a, b) => (getRatio(a) ?? 99999) - (getRatio(b) ?? 99999))
  else if (sort === 'ratio-desc') items.sort((a, b) => (getRatio(b) ?? -1) - (getRatio(a) ?? -1))
  else if (sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name))
  else if (sort === 'tier') items.sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
      {selected && <ChartModal arcane={selected} pd={prices[selected.slug] ?? { price: null }} onClose={() => setSelected(null)} />}

      {/* Countdown */}
      <div style={{ background: countdown.days < 3 ? '#2a1a1a' : '#16161a', border: `1px solid ${countdown.days < 3 ? '#5a2a2a' : '#2a2a2e'}`, borderRadius: 12, padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>⏱ Timp rămas — Operation: Belly of the Beast</div>
          {countdown.expired ? <div style={{ fontSize: 16, color: '#e55', fontWeight: 600 }}>Evenimentul s-a încheiat</div>
            : <div style={{ fontSize: 22, fontWeight: 700, color: countdown.days < 3 ? '#e55' : '#fff', fontVariantNumeric: 'tabular-nums' }}>{countdown.days}z {pad(countdown.hours)}h {pad(countdown.minutes)}m {pad(countdown.seconds)}s</div>}
        </div>
        <div style={{ fontSize: 11, color: '#555' }}>Se termina pe 1 iunie 2026</div>
      </div>

      {/* Calculator */}
      <div style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 12, padding: '14px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 10 }}>🧮 Calculator profit (Event arcane)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#888' }}>Volatile Motes:</span>
            <input type="number" min="0" value={motesInput} onChange={e => setMotesInput(e.target.value)} placeholder="ex: 100"
              style={{ width: 90, padding: '5px 10px', borderRadius: 8, border: '1px solid #333', background: '#0d0d0f', color: '#fff', fontSize: 13, outline: 'none' }} />
          </div>
          {motes > 0 && status === 'done' && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Legendary', 'Rare', 'Uncommon', 'Common'].map(tier => {
                const arcane = ARCANES.filter(a => a.tier === tier && a.motes).find(a => bestRatioSlugs.has(a.slug))
                if (!arcane || !arcane.motes) return null
                const price = prices[arcane.slug]?.price; if (!price) return null
                const motesPerR5 = arcane.motes * COPIES_FOR_R5
                const fullR5 = Math.floor(motes / motesPerR5)
                const rem = Math.floor((motes % motesPerR5) / arcane.motes)
                return (
                  <div key={tier} style={{ background: '#0d0d0f', border: '1px solid #2a2a2e', borderRadius: 8, padding: '6px 12px', fontSize: 12 }}>
                    <span style={{ color: '#888' }}>{tier}: </span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{fullR5 * price} pt</span>
                    <span style={{ color: '#555' }}> ({fullR5}x R5 {arcane.name.replace('Arcane ', '')})</span>
                    {rem > 0 && <span style={{ color: '#444' }}> +{rem} copii</span>}
                    {fullR5 === 0 && <span style={{ color: '#555' }}> (trebuie {motesPerR5} motes/R5)</span>}
                  </div>
                )
              })}
            </div>
          )}
          {motes === 0 && <span style={{ fontSize: 12, color: '#555' }}>Introdu numărul de motes pentru profit estimat</span>}
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#fff' }}>Arcane Prices</h1>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#555' }}>
            {status === 'loading' && `Se încarcă... ${progress}% (${done}/${ARCANES.length})`}
            {status === 'done' && updatedAt && `Actualizat: ${updatedAt.toLocaleTimeString('ro-RO')} • ${foundCount} prețuri • Click pe card pentru grafic`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ fontSize: 12, padding: '6px 10px', borderRadius: 8, border: '1px solid #333', background: '#1a1a1c', color: '#fff', cursor: 'pointer' }}>
            <option value="price-desc">Preț ↓</option>
            <option value="price-asc">Preț ↑</option>
            <option value="ratio-desc">pt/mote ↓</option>
            <option value="ratio-asc">pt/mote ↑</option>
            <option value="name">Nume A-Z</option>
            <option value="tier">Tier</option>
          </select>
          <button onClick={loadPrices} disabled={status === 'loading'} style={{ fontSize: 12, padding: '6px 16px', borderRadius: 8, border: '1px solid #333', background: '#1a1a1c', color: status === 'loading' ? '#555' : '#fff', cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
            {status === 'loading' ? '...' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {status === 'loading' && <div style={{ height: 3, background: '#222', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}><div style={{ height: '100%', width: `${progress}%`, background: '#5a8dee', transition: 'width 0.3s ease', borderRadius: 2 }} /></div>}

      {/* Filtre Event */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: '#444', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Event</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => setFilter('all')} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, border: filter === 'all' ? '1px solid #5a8dee' : '1px solid #333', background: filter === 'all' ? '#1a2a44' : 'transparent', color: filter === 'all' ? '#5a8dee' : '#888', cursor: 'pointer' }}>Toate</button>
          {EVENT_FILTERS.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, border: filter === t ? `1px solid ${TIER_STYLE[t]?.color ?? '#5a8dee'}` : '1px solid #333', background: filter === t ? '#1a2a2e' : 'transparent', color: filter === t ? (TIER_STYLE[t]?.color ?? '#5a8dee') : '#888', cursor: 'pointer' }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Filtre Sindicate */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: '#444', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Sindicate</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SYNDICATE_FILTERS.map(s => {
            const ss = SYNDICATE_STYLE[s]
            const active = filter === s
            return <button key={s} onClick={() => setFilter(s)} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, border: active ? `1px solid ${ss.color}` : '1px solid #333', background: active ? ss.bg : 'transparent', color: active ? ss.color : '#888', cursor: 'pointer' }}>{s}</button>
          })}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
        {items.map(a => {
          const isSyndicate = a.tier === 'Syndicate'
          const isSpecial = a.tier === 'Special'
          const showMotes = !isSyndicate && !isSpecial && a.motes
          const ts = isSyndicate && a.syndicate ? SYNDICATE_STYLE[a.syndicate] : TIER_STYLE[a.tier]
          const pd = (a as any).pd as PriceData
          const ratio = pd.price && a.motes ? Math.round(pd.price / a.motes) : null
          const isBestInTier = bestRatioSlugs.has(a.slug) && pd.price !== null
          const isGlobalBest = globalBest === a.slug
          const borderColor = isGlobalBest ? '#f5c518' : isBestInTier ? '#2a5a2a' : '#2a2a2e'
          const motesPerR5 = a.motes ? a.motes * COPIES_FOR_R5 : 0
          const fullR5 = motes > 0 && a.motes && pd.price ? Math.floor(motes / motesPerR5) : 0
          const rem = motes > 0 && a.motes ? Math.floor((motes % motesPerR5) / a.motes) : 0
          const change = pd.change24h ?? null
          const trendColor = change == null ? '#555' : change > 2 ? '#4caf50' : change < -2 ? '#e55' : '#888'
          const trendIcon = change == null ? '' : change > 2 ? '↑' : change < -2 ? '↓' : '→'

          return (
            <div key={a.slug}
              onClick={() => pd.price !== null && setSelected(a)}
              onMouseEnter={e => pd.price !== null && ((e.currentTarget as HTMLDivElement).style.borderColor = '#3a3a4e')}
              onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = borderColor)}
              style={{ background: '#16161a', border: `1px solid ${borderColor}`, borderRadius: 12, padding: '14px 16px', cursor: pd.price !== null ? 'pointer' : 'default', position: 'relative', transition: 'border-color 0.15s' }}
            >
              {isGlobalBest && <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 16 }}>⭐</div>}
              {isBestInTier && !isGlobalBest && <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 14 }}>🏆</div>}

              <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 4, paddingRight: 24 }}>{a.name}</div>

              {/* Badge tier sau sindicat */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                {isSyndicate && a.syndicate ? (
                  <>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: ts.bg, color: ts.color, display: 'inline-block' }}>{a.syndicate}</span>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: '#1a1a1a', color: '#555', display: 'inline-block' }}>{SYNDICATE_STYLE[a.syndicate]?.location}</span>
                  </>
                ) : (
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: ts.bg, color: ts.color, display: 'inline-block' }}>{a.tier}</span>
                )}
              </div>

              {pd.history && pd.history.length >= 2 && <div style={{ marginBottom: 6 }}><Sparkline data={pd.history} /></div>}

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 1 }}>Preț median (4h)</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                    {pd.price != null ? <>{pd.price} <span style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>pt</span></> : <span style={{ fontSize: 14, color: '#444' }}>{status === 'loading' ? '...' : '—'}</span>}
                  </div>
                </div>
                {trendIcon && change != null && <div style={{ fontSize: 12, color: trendColor, fontWeight: 600 }}>{trendIcon} {Math.abs(change as number)}%</div>}
              </div>

              {pd.min != null && pd.max != null && pd.price != null && <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{pd.min} – {pd.max} pt</div>}

              {/* Cost — doar pt arcane cu motes */}
              {showMotes && (
                <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>
                  {a.tier === 'Ascension' ? `${a.motes} Vestigial Motes` : `${a.motes} Volatile Mote${a.motes! > 1 ? 's' : ''}`}
                </div>
              )}

              {/* Cost sindicat */}
              {isSyndicate && a.cost && (
                <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>
                  {a.cost.toLocaleString()} standing
                </div>
              )}

              {ratio && showMotes && <div style={{ fontSize: 11, color: isBestInTier ? '#4caf50' : '#555', marginTop: 1, fontWeight: isBestInTier ? 600 : 400 }}>~{ratio} pt/mote</div>}

              {/* Profit din motes */}
              {showMotes && motes > 0 && pd.price != null && (
                <div style={{ marginTop: 6, padding: '4px 8px', background: fullR5 > 0 ? '#0d1a0d' : '#1a1a0d', borderRadius: 6, fontSize: 11, color: fullR5 > 0 ? '#4caf50' : '#888' }}>
                  {fullR5 > 0 ? `${fullR5 * pd.price} pt (${fullR5}x R5${rem > 0 ? ` +${rem}` : ''})` : `Trebuie ${motesPerR5} motes/R5`}
                </div>
              )}

              {pd.price != null && <div style={{ fontSize: 10, color: '#333', marginTop: 6 }}>click pentru grafic</div>}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 24, fontSize: 11, color: '#444', textAlign: 'center' }}>
        Sursa: warframe.market statistics • Media 4h la Rank 5 • ↑↓ variație față de 24h
      </div>
    </div>
  )
}
