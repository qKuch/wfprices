'use client'
import { useState, useEffect } from 'react'
import { getAlerts, saveAlert, removeAlert, type PriceAlert } from '../lib/alerts'

interface Props {
  slug: string
  name: string
  type: 'arcane' | 'mod'
  currentPrice: number | null
  onClose: () => void
}

export default function AlertModal({ slug, name, type, currentPrice, onClose }: Props) {
  const [condition, setCondition] = useState<'below' | 'above'>('below')
  const [threshold, setThreshold] = useState(currentPrice?.toString() ?? '')
  const [existing, setExisting] = useState<PriceAlert | null>(null)

  useEffect(() => {
    const found = getAlerts().find(a => a.slug === slug && !a.dismissed)
    if (found) {
      setExisting(found)
      setCondition(found.condition)
      setThreshold(found.threshold.toString())
    }
  }, [slug])

  const save = () => {
    const t = parseFloat(threshold)
    if (!t || t <= 0) return
    const alert: PriceAlert = {
      id: existing?.id ?? `${slug}_${Date.now()}`,
      slug, name, type, condition,
      threshold: t,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    }
    saveAlert(alert)
    onClose()
  }

  const remove = () => {
    if (existing) removeAlert(existing.id)
    onClose()
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#16161a', border: '1px solid #2a2a2e', borderRadius: 14,
        padding: '24px', width: '100%', maxWidth: 360,
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: '#5a8dee', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
              🔔 Alertă preț
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{name}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>

        {currentPrice && (
          <div style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>
            Preț curent: <span style={{ color: '#fff', fontWeight: 600 }}>{currentPrice} pt</span>
          </div>
        )}

        {/* Condition toggle */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Condiție</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['below', 'above'] as const).map(c => (
              <button key={c} onClick={() => setCondition(c)} style={{
                flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer',
                border: condition === c
                  ? `1px solid ${c === 'below' ? '#4caf50' : '#f0a050'}`
                  : '1px solid #2a2a2e',
                background: condition === c
                  ? c === 'below' ? '#0d2a0d' : '#2a1a0d'
                  : 'transparent',
                color: condition === c
                  ? c === 'below' ? '#4caf50' : '#f0a050'
                  : '#888',
                fontSize: 13, fontWeight: 500,
              }}>
                {c === 'below' ? '📉 Sub' : '📈 Peste'}
              </button>
            ))}
          </div>
        </div>

        {/* Threshold input */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Prag (pt)</div>
          <input
            type="number" min="1" value={threshold}
            onChange={e => setThreshold(e.target.value)}
            placeholder="ex: 45"
            autoFocus
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 8,
              border: '1px solid #2a2a2e', background: '#0d0d0f',
              color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ fontSize: 12, color: '#444', marginBottom: 16 }}>
          Vei fi anunțat data viitoare când deschizi site-ul și prețul este{' '}
          <span style={{ color: condition === 'below' ? '#4caf50' : '#f0a050' }}>
            {condition === 'below' ? 'strict sub' : 'strict peste'} {threshold || '?'} pt
          </span>.
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={save} style={{
            flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer',
            background: '#5a8dee', border: 'none', color: '#fff',
            fontSize: 13, fontWeight: 600,
          }}>
            {existing ? 'Actualizează' : 'Salvează alerta'}
          </button>
          {existing && (
            <button onClick={remove} style={{
              padding: '10px 16px', borderRadius: 8, cursor: 'pointer',
              background: 'transparent', border: '1px solid #5a2a2a',
              color: '#e55', fontSize: 13,
            }}>
              Șterge
            </button>
          )}
        </div>

        {existing?.triggeredAt && !existing.dismissed && (
          <div style={{ marginTop: 12, fontSize: 12, color: '#f0a050', textAlign: 'center' }}>
            ⚠️ Alertă declanșată la {existing.triggeredPrice} pt
          </div>
        )}
      </div>
    </div>
  )
}
