export interface PriceAlert {
  id: string
  slug: string
  name: string
  type: 'arcane' | 'mod'
  condition: 'below' | 'above'
  threshold: number
  createdAt: string
  triggeredAt?: string
  triggeredPrice?: number
  dismissed?: boolean
}

const KEY = 'wfprices_alerts'

export function getAlerts(): PriceAlert[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch { return [] }
}

export function saveAlert(alert: PriceAlert) {
  const alerts = getAlerts().filter(a => a.id !== alert.id)
  alerts.push(alert)
  localStorage.setItem(KEY, JSON.stringify(alerts))
}

export function removeAlert(id: string) {
  const alerts = getAlerts().filter(a => a.id !== id)
  localStorage.setItem(KEY, JSON.stringify(alerts))
}

export function dismissAlert(id: string) {
  const alerts = getAlerts().map(a => a.id === id ? { ...a, dismissed: true } : a)
  localStorage.setItem(KEY, JSON.stringify(alerts))
}

export function checkAlerts(prices: Record<string, { price: number | null }>): PriceAlert[] {
  const alerts = getAlerts()
  const triggered: PriceAlert[] = []
  const updated = alerts.map(alert => {
    if (alert.dismissed) return alert
    const price = prices[alert.slug]?.price
    if (price == null) return alert
    const hit = alert.condition === 'below' ? price <= alert.threshold : price >= alert.threshold
    if (hit && !alert.triggeredAt) {
      const upd = { ...alert, triggeredAt: new Date().toISOString(), triggeredPrice: price, dismissed: false }
      triggered.push(upd)
      return upd
    }
    return alert
  })
  localStorage.setItem(KEY, JSON.stringify(updated))
  return triggered
}
