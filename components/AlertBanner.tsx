'use client'
import { useEffect, useState } from 'react'
import { getAlerts, dismissAlert, type PriceAlert } from '../lib/alerts'

export default function AlertBanner() {
  const [active, setActive] = useState<PriceAlert[]>([])

  useEffect(() => {
    const triggered = getAlerts().filter(a => a.triggeredAt && !a.dismissed)
    setActive(triggered)
  }, [])

  if (!active.length) return null

  const dismiss = (id: string) => {
    dismissAlert(id)
    setActive(prev => prev.filter(a => a.id !== id))
  }

  const dismissAll = () => {
    active.forEach(a => dismissAlert(a.id))
    setActive([])
  }

  return (
    <div style={{
      position: 'fixed', top: 56, left: 0, right: 0, zIndex: 1000,
      padding: '0 1rem', pointerEvents: 'none',
    }}>
      <div style={{
        maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 6,
        pointerEvents: 'all',
      }}>
        {active.map(alert => (
          <div key={alert.id} style={{
            background: alert.condition === 'below' ? '#0d2a0d' : '#2a1a0d',
            border: `1px solid ${alert.condition === 'below' ? '#2a5a2a' : '#5a3a0a'}`,
            borderRadius: 10, padding: '10px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            animation: 'slideIn 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>{alert.condition === 'below' ? '📉' : '📈'}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                  {alert.name}
                  <span style={{ fontWeight: 400, color: '#888', marginLeft: 6 }}>
                    {alert.condition === 'below' ? 'a scăzut sub' : 'a depășit'} {alert.threshold} pt
                  </span>
                </div>
                <div style={{ fontSize: 12, color: alert.condition === 'below' ? '#4caf50' : '#f0a050' }}>
                  Preț curent: <strong>{alert.triggeredPrice} pt</strong>
                  <span style={{ color: '#555', marginLeft: 8 }}>
                    {new Date(alert.triggeredAt!).toLocaleString('ro-RO')}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => dismiss(alert.id)} style={{
              background: 'none', border: 'none', color: '#555', fontSize: 18,
              cursor: 'pointer', padding: '2px 6px', lineHeight: 1, flexShrink: 0,
            }}>×</button>
          </div>
        ))}
        {active.length > 1 && (
          <div style={{ textAlign: 'right' }}>
            <button onClick={dismissAll} style={{
              background: 'none', border: 'none', color: '#555', fontSize: 12,
              cursor: 'pointer', textDecoration: 'underline',
            }}>Șterge toate ({active.length})</button>
          </div>
        )}
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
