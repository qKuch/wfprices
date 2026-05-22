'use client'
import { useState, useEffect } from 'react'

const ARCANE_NAMES = [
  'Arcane Energize','Arcane Grace','Arcane Barrier','Arcane Aegis','Arcane Arachne',
  'Arcane Avenger','Arcane Fury','Arcane Precision','Arcane Pulse','Arcane Rage','Arcane Ultimatum',
  'Arcane Victory','Arcane Strike','Arcane Awakening','Arcane Guardian','Arcane Phantasm',
  'Arcane Eruption','Arcane Agility','Arcane Acceleration','Arcane Trickery','Arcane Velocity',
  'Arcane Deflection','Arcane Healing','Arcane Resistance','Arcane Nullifier','Arcane Warmth',
  'Arcane Ice','Arcane Momentum','Arcane Tempo','Arcane Consequence','Arcane Ice Storm',
  'Arcane Battery','Secondary Surge','Secondary Fortifier','Melee Afflictions',
  'Secondary Enervate','Arcane Crepuscular','Arcane Truculence','Arcane Belicose',
  'Arcane Camisado','Primary Crux','Melee Doughty','Arcane Impetus',
  'Exodia Brave','Exodia Force','Exodia Hunt','Exodia Might','Exodia Triumph','Exodia Valor',
  'Magus Vigor','Magus Husk','Magus Cloud','Magus Cadence','Magus Replenish','Magus Elevate','Magus Nourish',
  'Virtuos Null','Virtuos Tempo','Virtuos Fury','Virtuos Strike','Virtuos Shadow','Virtuos Ghost',
  'Pax Charge','Pax Soar','Pax Bolt','Pax Seeker',
  'Magus Accelerant','Magus Anomaly','Magus Destruct','Magus Drive','Magus Firewall',
  'Magus Glitch','Magus Lockdown','Magus Melt','Magus Overload','Magus Repair','Magus Revert',
  'Virtuos Forge','Virtuos Surge','Virtuos Trojan',
  'Theorem Demulcent','Theorem Infection','Theorem Contagion',
  'Residual Boils','Residual Malodor','Residual Shock','Residual Viremia',
  'Molt Augmented','Molt Efficiency','Molt Reconstruct','Molt Vigor',
  'Cascadia Accuracy','Cascadia Empower','Cascadia Flare','Cascadia Overcharge',
  'Primary Frostbite','Fractalized Reset','Emergence Dissipate','Emergence Renew','Emergence Savior',
  'Melee Animosity','Melee Exposure','Melee Fortification','Melee Influence','Melee Retaliation','Melee Vortex',
].sort()

interface Transaction {
  id: string
  arcane: string
  type: 'buy' | 'sell'
  price: number
  qty: number
  rank: number
  date: string
  note: string
}

const TAX = 0.1

function calcNetSell(price: number, qty: number) {
  return Math.floor(price * (1 - TAX)) * qty
}

export default function PersonalHistory() {
  const [txs, setTxs] = useState<Transaction[]>([])
  const [form, setForm] = useState({ arcane: ARCANE_NAMES[0], type: 'buy' as 'buy'|'sell', price: '', qty: '1', rank: '5', note: '' })
  const [showForm, setShowForm] = useState(false)
  const [filterArcane, setFilterArcane] = useState('all')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try { const s = localStorage.getItem('wf_history'); if (s) setTxs(JSON.parse(s)) } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem('wf_history', JSON.stringify(txs))
  }, [txs, loaded])

  const addTx = () => {
    const price = parseFloat(form.price); if (!price || price <= 0) return
    const qty = parseInt(form.qty) || 1
    const newTx: Transaction = { id: Date.now().toString(), arcane: form.arcane, type: form.type, price, qty, rank: parseInt(form.rank)||5, date: new Date().toISOString(), note: form.note }
    setTxs(prev => [newTx, ...prev])
    setForm(f => ({ ...f, price: '', note: '' }))
    setShowForm(false)
  }

  const deleteTx = (id: string) => setTxs(prev => prev.filter(t => t.id !== id))

  const filtered = filterArcane === 'all' ? txs : txs.filter(t => t.arcane === filterArcane)
  const uniqueArcanes = Array.from(new Set(txs.map(t => t.arcane))).sort()

  // P&L globale
  const totalSpent = txs.filter(t => t.type === 'buy').reduce((s, t) => s + t.price * t.qty, 0)
  const totalEarned = txs.filter(t => t.type === 'sell').reduce((s, t) => s + calcNetSell(t.price, t.qty), 0)
  const totalTax = txs.filter(t => t.type === 'sell').reduce((s, t) => s + Math.ceil(t.price * TAX) * t.qty, 0)
  const netPL = totalEarned - totalSpent
  const plColor = netPL > 0 ? '#4caf50' : netPL < 0 ? '#e55' : '#888'

  // P&L per arcana (filtered)
  const arcaneStats: Record<string, { bought: number; sold: number; taxPaid: number }> = {}
  filtered.forEach(t => {
    if (!arcaneStats[t.arcane]) arcaneStats[t.arcane] = { bought: 0, sold: 0, taxPaid: 0 }
    if (t.type === 'buy') arcaneStats[t.arcane].bought += t.price * t.qty
    else { arcaneStats[t.arcane].sold += calcNetSell(t.price, t.qty); arcaneStats[t.arcane].taxPaid += Math.ceil(t.price * TAX) * t.qty }
  })

  const inputStyle = { padding: '7px 11px', borderRadius: 8, border: '1px solid #2a2a2e', background: '#0d0d0f', color: '#fff', fontSize: 13, outline: 'none' }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff' }}>Istoric tranzacții</h1>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#555' }}>Salvat local în browser • {txs.length} tranzacții</p>
        </div>
        <button onClick={() => setShowForm(f => !f)} style={{ padding: '8px 18px', borderRadius: 9, background: '#5a8dee', color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          {showForm ? '✕ Anulează' : '+ Adaugă tranzacție'}
        </button>
      </div>

      {/* P&L Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Total cheltuit', value: `${totalSpent} pt`, color: '#e55' },
          { label: 'Total câștigat', value: `${totalEarned} pt`, color: '#4caf50' },
          { label: 'Taxe plătite', value: `${totalTax} pt`, color: '#888' },
          { label: 'P&L net', value: `${netPL > 0 ? '+' : ''}${netPL} pt`, color: plColor },
          { label: 'Tranzacții', value: txs.length, color: '#fff' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ fontSize: 10, color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Adaugă tranzacție</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 5 }}>Arcană</div>
              <select value={form.arcane} onChange={e => setForm(f => ({ ...f, arcane: e.target.value }))}
                style={{ ...inputStyle, width: '100%' }}>
                {ARCANE_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 5 }}>Tip</div>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'buy'|'sell' }))}
                style={{ ...inputStyle, width: '100%' }}>
                <option value="buy">🛒 Cumpărare</option>
                <option value="sell">💰 Vânzare</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 5 }}>Preț (pt)</div>
              <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="0" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 5 }}>Cantitate</div>
              <input type="number" min="1" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
                placeholder="1" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 5 }}>Rank</div>
              <select value={form.rank} onChange={e => setForm(f => ({ ...f, rank: e.target.value as any }))
              } style={{ ...inputStyle, width: '100%' }}>
                {[0,1,2,3,4,5].map(r => <option key={r} value={r}>Rank {r}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 5 }}>Notă (opțional)</div>
              <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="ex: profit bun" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Preview */}
          {form.price && parseFloat(form.price) > 0 && (
            <div style={{ background: '#0d0d0f', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#888', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {form.type === 'sell' ? (
                <>
                  <span>Taxă: <b style={{ color: '#e55' }}>{Math.ceil(parseFloat(form.price) * TAX) * (parseInt(form.qty)||1)} pt</b></span>
                  <span>Net: <b style={{ color: '#4caf50' }}>{calcNetSell(parseFloat(form.price), parseInt(form.qty)||1)} pt</b></span>
                </>
              ) : (
                <span>Total: <b style={{ color: '#fff' }}>{parseFloat(form.price) * (parseInt(form.qty)||1)} pt</b></span>
              )}
            </div>
          )}

          <button onClick={addTx} style={{ padding: '8px 20px', borderRadius: 8, background: '#5a8dee', color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            Salvează
          </button>
        </div>
      )}

      {/* Filter */}
      {uniqueArcanes.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          <button onClick={() => setFilterArcane('all')} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, border: filterArcane === 'all' ? '1px solid #5a8dee' : '1px solid #333', background: filterArcane === 'all' ? '#1a2a44' : 'transparent', color: filterArcane === 'all' ? '#5a8dee' : '#888', cursor: 'pointer' }}>Toate</button>
          {uniqueArcanes.map(a => (
            <button key={a} onClick={() => setFilterArcane(a)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, border: filterArcane === a ? '1px solid #5a8dee' : '1px solid #333', background: filterArcane === a ? '#1a2a44' : 'transparent', color: filterArcane === a ? '#5a8dee' : '#888', cursor: 'pointer' }}>{a}</button>
          ))}
        </div>
      )}

      {/* Transactions list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#333' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 14 }}>Nicio tranzacție încă</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>Apasă "+ Adaugă tranzacție" pentru a începe</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(t => {
            const isS = t.type === 'sell'
            const tax = isS ? Math.ceil(t.price * TAX) * t.qty : 0
            const net = isS ? calcNetSell(t.price, t.qty) : -(t.price * t.qty)
            const netColor = isS ? '#4caf50' : '#e55'
            return (
              <div key={t.id} style={{ background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18 }}>{isS ? '💰' : '🛒'}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{t.arcane} <span style={{ fontSize: 11, color: '#555' }}>R{t.rank}</span></div>
                    <div style={{ fontSize: 11, color: '#555' }}>
                      {new Date(t.date).toLocaleDateString('ro-RO')} • {t.qty}x @ {t.price} pt
                      {isS && <span style={{ color: '#444' }}> • taxă {tax} pt</span>}
                      {t.note && <span style={{ color: '#444' }}> • {t.note}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: netColor }}>{net > 0 ? '+' : ''}{net} pt</div>
                    {isS && <div style={{ fontSize: 10, color: '#444' }}>brut: {t.price * t.qty} pt</div>}
                  </div>
                  <button onClick={() => deleteTx(t.id)} style={{ background: 'none', border: '1px solid #2a2a2e', borderRadius: 6, color: '#444', cursor: 'pointer', padding: '4px 8px', fontSize: 12 }} title="Șterge">✕</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ marginTop: 32, fontSize: 11, color: '#333', textAlign: 'center' }}>
        Datele sunt salvate local în browser • Nu sunt trimise nicăieri
      </div>
    </div>
  )
}
