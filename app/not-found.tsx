import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ maxWidth: 480, margin: '8rem auto', textAlign: 'center', padding: '0 1.5rem' }}>
      <div style={{ fontSize: 64, marginBottom: 8, filter: 'grayscale(0.3)' }}>🔮</div>
      <div style={{ fontSize: 12, color: '#5a8dee', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Eroare 404</div>
      <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 700, marginBottom: 12, margin: '0 0 12px' }}>Pagina nu există</h1>
      <p style={{ color: '#555', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
        Arcana pe care o cauți nu a fost găsită în acest plan al existenței.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/tracker" style={{ padding: '10px 24px', borderRadius: 10, background: '#5a8dee', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          → Tracker
        </Link>
        <Link href="/" style={{ padding: '10px 24px', borderRadius: 10, background: 'transparent', color: '#888', fontWeight: 500, fontSize: 14, textDecoration: 'none', border: '1px solid #2a2a2e' }}>
          Acasă
        </Link>
      </div>
    </div>
  )
}
