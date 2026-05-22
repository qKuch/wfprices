import Link from 'next/link'
export default function NotFound() {
  return (
    <div style={{ maxWidth: 400, margin: '8rem auto', textAlign: 'center', padding: '0 1rem' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <h1 style={{ color: '#fff', fontSize: 24, marginBottom: 8 }}>Pagina nu există</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>Pagina căutată nu a fost găsită.</p>
      <Link href="/" style={{ padding: '10px 24px', borderRadius: 10, background: '#5a8dee', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
        Înapoi acasă
      </Link>
    </div>
  )
}
