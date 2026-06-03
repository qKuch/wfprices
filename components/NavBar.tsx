'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const path = usePathname()
  return (
    <nav style={{ borderBottom: '1px solid #1e1e22', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: 48, position: 'sticky', top: 0, background: '#0d0d0f', zIndex: 100 }}>
      <Link href="/" style={{ fontWeight: 700, fontSize: 15, color: '#fff', textDecoration: 'none', marginRight: 24, letterSpacing: '-0.3px' }}>
        ⚡ WFPrices
      </Link>
      {([{ href: '/tracker', label: 'Arcane' }, { href: '/mods', label: 'Mods' }, { href: '/history', label: 'Istoric' }] as const).map(({ href, label }) => (
        <Link key={href} href={href} style={{ fontSize: 13, textDecoration: 'none', padding: '0 14px', height: 48, display: 'flex', alignItems: 'center', borderBottom: `2px solid ${path === href ? '#5a8dee' : 'transparent'}`, color: path === href ? '#fff' : '#888', transition: 'color 0.15s' }}>
          {label}
        </Link>
      ))}
    </nav>
  )
}
